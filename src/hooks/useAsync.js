// useAsync.js — updated with retry (TC8) and request cancellation (TC9)

import { useState, useRef, useCallback } from 'react';

export const useAsync = (asyncFunction) => {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [data, setData]         = useState(null);

  // TC9 — holds reference to the current AbortController
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...params) => {
    // TC9 — cancel any previous in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    // TC8 — retry logic: attempt up to 2 times before showing error
    const MAX_ATTEMPTS = 2;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      try {
        // Pass signal so async function can respect cancellation
        const result = await asyncFunction(...params, controller.signal);

        // If request was cancelled, stop silently
        if (controller.signal.aborted) {
          setLoading(false);
          return;
        }

        setData(result);
        setLoading(false);
        return result;

      } catch (err) {
        // TC9 — if aborted, do not show error, just stop
        if (err.name === 'AbortError' || controller.signal.aborted) {
          setLoading(false);
          return;
        }

        attempt++;

        // TC8 — if all attempts exhausted, show error
        if (attempt >= MAX_ATTEMPTS) {
          const errorMessage = err.message || 'An error occurred';
          setError(errorMessage);
          setLoading(false);
          throw err;
        }

        // TC8 — wait briefly before retrying
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    // Cancel any in-flight request on reset
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
};