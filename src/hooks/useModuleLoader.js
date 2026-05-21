// useModuleLoader.js
// TC1 — data fetching starts ONLY when isEnabled is true (parent expanded)
// TC4 — configurable timeout cancels operation and shows error if exceeded
// TC8 — AbortController cancels all pending requests when parent collapses

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useModuleLoader
 * @param {function} fetchFn    - the API function to call
 * @param {boolean}  isEnabled  - true only when parent container is expanded
 * @param {number}   timeout    - ms before auto-cancel (default 3000ms)
 */
export const useModuleLoader = (fetchFn, isEnabled, timeout = 3000) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // TC8 — holds AbortController ref so collapse can cancel in-flight request
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    // TC8 — cancel any existing request before starting new one
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    // TC4 — timeout timer; aborts the request if it exceeds configured duration
    const timeoutId = setTimeout(() => {
      controller.abort();
      setError('Request timed out. Please retry.');
      setLoading(false);
    }, timeout);

    try {
      const result = await fetchFn(controller.signal);

      // If aborted during fetch, stop silently
      if (controller.signal.aborted) return;

      clearTimeout(timeoutId);
      setData(result);
      setLoading(false);

    } catch (err) {
      clearTimeout(timeoutId);

      // TC8 — aborted due to collapse; do not show error
      if (err.name === 'AbortError' || controller.signal.aborted) {
        setLoading(false);
        return;
      }

      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  }, [fetchFn, timeout]);

  // TC1 — only trigger load when parent expands (isEnabled becomes true)
  useEffect(() => {
    if (isEnabled) {
      load();
    } else {
      // TC8 — cancel pending requests when parent collapses
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      setLoading(false);
      setData(null);
      setError(null);
    }
  }, [isEnabled]);

  return { data, loading, error, retry: load };
};