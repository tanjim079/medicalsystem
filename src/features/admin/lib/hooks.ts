import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest, errorMessage } from "./adminApi";

/**
 * Pagination that snaps back to page 1 whenever `resetKey` (e.g. the active filters) changes,
 * using React's "adjust state while rendering" pattern instead of an effect.
 */
export function usePage(resetKey: string) {
  const [state, setState] = useState({ key: resetKey, page: 1 });
  const page = state.key === resetKey ? state.page : 1;
  const setPage = useCallback((p: number) => setState({ key: resetKey, page: p }), [resetKey]);
  return [page, setPage] as const;
}

/** Fetches a JSON resource; `reload()` refetches. Local edits go through `setData`. */
export function useApiResource<T>(path: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState(0);
  const [loadedToken, setLoadedToken] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    apiRequest<T>(path)
      .then((d) => { if (!cancelled) { setData(d ?? initial); setError(null); } })
      .catch((err) => { if (!cancelled) setError(errorMessage(err, "Failed to load data")); })
      .finally(() => { if (!cancelled) setLoadedToken(token); });
    return () => { cancelled = true; };
    // `initial` is a fallback value only; refetch is driven by path/token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, token]);

  const reload = useCallback(() => setToken((t) => t + 1), []);
  return { data, setData, error, loading: loadedToken !== token, reload };
}

/** A string state stored in the URL query (shareable, back-button friendly). */
export function useQueryState(name: string, fallback = "") {
  const [params, setParams] = useSearchParams();
  const value = params.get(name) ?? fallback;
  const setValue = useCallback((next: string) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      if (!next || next === fallback) p.delete(name);
      else p.set(name, next);
      return p;
    }, { replace: true });
  }, [name, fallback, setParams]);
  return [value, setValue] as const;
}
