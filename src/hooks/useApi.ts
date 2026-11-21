"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";

type State<T, M> = {
  key: string | null; // the path this result belongs to
  data: T | null;
  meta: M | undefined;
  error: string | null;
  status: number | null;
};

/**
 * Fetch an Express endpoint whenever `path` changes, with loading / error / reload.
 * State is only set from the request callbacks, never synchronously inside the effect.
 */
export function useApi<T, M = Record<string, unknown>>(path: string | null, opts: { auth?: boolean } = {}) {
  const auth = opts.auth ?? true;
  const [state, setState] = useState<State<T, M>>({ key: null, data: null, meta: undefined, error: null, status: null });
  const [refreshing, setRefreshing] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    api<T, M>(path, { auth, signal: ctrl.signal })
      .then((res) => {
        if (ctrl.signal.aborted) return;
        setState({ key: path, data: res.data, meta: res.meta, error: null, status: 200 });
      })
      .catch((err) => {
        if (ctrl.signal.aborted || (err as Error).name === "AbortError") return;
        setState((s) => ({
          ...s,
          key: path,
          data: s.key === path ? s.data : null,
          error: errorMessage(err, "Failed to load data"),
          status: (err as { status?: number }).status ?? 0,
        }));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setRefreshing(false);
      });
    return () => ctrl.abort();
  }, [path, auth, nonce]);

  /** Re-fetch. `silent` keeps the current data on screen instead of showing the loader. */
  const reload = useCallback((silent = false) => {
    if (!silent) setRefreshing(true);
    setNonce((n) => n + 1);
  }, []);

  const setData = useCallback((updater: T | null | ((prev: T | null) => T | null)) => {
    setState((s) => ({
      ...s,
      data: typeof updater === "function" ? (updater as (p: T | null) => T | null)(s.data) : updater,
    }));
  }, []);

  const current = state.key === path;
  return {
    data: current ? state.data : null,
    meta: current ? state.meta : undefined,
    error: current ? state.error : null,
    status: current ? state.status : null,
    loading: Boolean(path) && (!current || refreshing),
    reload,
    setData,
  };
}
