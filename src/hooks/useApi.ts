"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage, type ApiResponse } from "@/lib/api";

/** Fetch an Express endpoint on mount / when `path` changes, with loading + error + reload. */
export function useApi<T, M = Record<string, unknown>>(path: string | null, opts: { auth?: boolean } = {}) {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<M | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const auth = opts.auth ?? true;
  const ctrl = useRef<AbortController | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!path) return;
      ctrl.current?.abort();
      const c = new AbortController();
      ctrl.current = c;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res: ApiResponse<T, M> = await api<T, M>(path, { auth, signal: c.signal });
        if (c.signal.aborted) return;
        setData(res.data);
        setMeta(res.meta);
        setStatus(200);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(errorMessage(err, "Failed to load data"));
        setStatus((err as { status?: number }).status ?? 0);
      } finally {
        if (!c.signal.aborted) setLoading(false);
      }
    },
    [path, auth],
  );

  useEffect(() => {
    load();
    return () => ctrl.current?.abort();
  }, [load]);

  return { data, meta, loading, error, status, reload: load, setData };
}
