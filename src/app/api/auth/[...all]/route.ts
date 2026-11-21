import { toNextJsHandler } from "better-auth/next-js";
import { auth, ensureDbConnected } from "@/lib/auth";

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
  await ensureDbConnected();
  return handler.GET(request);
}

export async function POST(request: Request) {
  await ensureDbConnected();
  return handler.POST(request);
}
