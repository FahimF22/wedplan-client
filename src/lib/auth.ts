import "server-only";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient, ObjectId } from "mongodb";

const baseURL = (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

// Reuse one client across hot reloads / serverless invocations.
const globalForMongo = globalThis as unknown as { _authMongo?: MongoClient };
const client =
  globalForMongo._authMongo ??
  new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017", { maxPoolSize: 10 });
globalForMongo._authMongo = client;
const db = client.db(process.env.DB_NAME || "wedplan");

/**
 * If an implicit connect ever fails (network blip, cold start), the driver closes the topology but
 * keeps it attached, so every later query throws MongoTopologyClosedError on that warm instance.
 * Calling connect() again builds a fresh topology — do it before any auth work.
 */
export async function ensureDbConnected() {
  const topology = (client as unknown as { topology?: { isConnected(): boolean } }).topology;
  if (topology?.isConnected()) return;
  try {
    await client.connect();
  } catch {
    await client.connect(); // one retry
  }
}

const PUBLIC_ROLES = ["vendor", "customer"];
const PASSWORD_PATHS = ["/sign-up/email", "/change-password", "/reset-password"];
const PROTECTED_FIELDS =["role", "isBlocked", "subscriptionPlan", "subscriptionExpiresAt"];

export const auth = betterAuth({
  appName: "WedPlan",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],
  database: mongodbAdapter(db, { client, usePlural: true, transaction: false }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
    },
  },

  user: {
    additionalFields: {
      // Accepted at sign-up only; databaseHooks restrict it to vendor/customer.
      role: { type: "string", required: false, input: true },
      businessName: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      phone: { type: "string", required: false, input: false },
      location: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
  },

  // Profile changes go through the Express API (field whitelist); block Better Auth's own update routes.
  disabledPaths: ["/update-user", "/delete-user", "/change-email"],

  // Enforce the password policy on the server too (the form check alone can be bypassed).
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!PASSWORD_PATHS.includes(ctx.path)) return;
      const body = (ctx.body ?? {}) as { password?: unknown; newPassword?: unknown };
      const pw = String(body.newPassword ?? body.password ?? "");
      if (pw.length < 6 || !/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters and include an uppercase and a lowercase letter",
        });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = (user as { role?: unknown }).role;
          if (role !== undefined && role !== null && !PUBLIC_ROLES.includes(String(role))) {
            // Admin accounts can never be created through public registration.
            throw new APIError("FORBIDDEN", { message: "Invalid account role" });
          }
          return {
            data: {
              ...user,
              role: role ?? null,
              businessName: role === "vendor" ? ((user as { businessName?: string }).businessName ?? null) : null,
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
            },
          };
        },
      },
      update: {
        before: async (data) => {
          const clean = { ...data } as Record<string, unknown>;
          for (const f of PROTECTED_FIELDS) delete clean[f];
          return { data: clean };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const id = String(session.userId);
          const user = await db
            .collection("users")
            .findOne(ObjectId.isValid(id) && id.length === 24 ? { _id: new ObjectId(id) } : { _id: id as never });
          if (user?.isBlocked) {
            throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Please contact support." });
          }
          return { data: session };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",
        definePayload: ({ user }) => ({ id: user.id, email: user.email, role: user.role ?? null }),
      },
    }),
    nextCookies(), // must be last
  ],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
