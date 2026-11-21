"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        businessName: { type: "string", required: false },
        isBlocked: { type: "boolean", required: false },
        subscriptionPlan: { type: "string", required: false },
        subscriptionExpiresAt: { type: "date", required: false },
        phone: { type: "string", required: false },
        location: { type: "string", required: false },
        bio: { type: "string", required: false },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type Role = "admin" | "vendor" | "customer";

export const dashboardPath = (role?: string | null) =>
  role === "admin" || role === "vendor" || role === "customer" ? `/dashboard/${role}` : "/onboarding";
