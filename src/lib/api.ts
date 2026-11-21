"use client";

/**
 * Browser fetch wrapper for the Express API.
 * Gets a short-lived JWT from Better Auth (/api/auth/token), keeps it in memory only,
 * sends it as a Bearer token and retries once with a fresh token on 401.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let cachedToken: { value: string; exp: number } | null = null;
let inflight: Promise<string | null> | null = null;

function decodeExp(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export async function getToken(force = false): Promise<string | null> {
  if (!force && cachedToken && cachedToken.exp - Date.now() > 30_000) return cachedToken.value;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/auth/token", { credentials: "include", cache: "no-store" });
      if (!res.ok) {
        cachedToken = null;
        return null;
      }
      const { token } = (await res.json()) as { token?: string };
      if (!token) return null;
      cachedToken = { value: token, exp: decodeExp(token) };
      return token;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function clearToken() {
  cachedToken = null;
}

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
  signal?: AbortSignal;
};

export type ApiResponse<T, M = Record<string, unknown>> = { success: boolean; message?: string; data: T; meta?: M };

export async function api<T = unknown, M = Record<string, unknown>>(
  path: string,
  { method = "GET", body, formData, auth = true, signal }: Options = {},
): Promise<ApiResponse<T, M>> {
  const send = async (token: string | null) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined && !formData) headers["Content-Type"] = "application/json";
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
      signal,
      cache: "no-store",
    });
  };

  let res: Response;
  try {
    let token = auth ? await getToken() : null;
    if (auth && !token) throw new ApiError(401, "Please sign in to continue");
    res = await send(token);
    if (res.status === 401 && auth) {
      token = await getToken(true);
      if (token) res = await send(token);
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "Could not reach the server. Check your connection and try again.");
  }

  const json = (await res.json().catch(() => null)) as (ApiResponse<T, M> & { details?: unknown }) | null;
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message || `Request failed (${res.status})`, json?.details);
  }
  return json;
}

/** Upload one image file to ImgBB through the Express API. Returns the hosted URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new ApiError(400, "Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new ApiError(400, "Image must be 5MB or smaller");
  const fd = new FormData();
  fd.append("image", file);
  const res = await api<{ url: string }>("/api/upload", { method: "POST", formData: fd });
  return res.data.url;
}

export const errorMessage = (err: unknown, fallback = "Something went wrong") =>
  err instanceof Error && err.message ? err.message : fallback;
