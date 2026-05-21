// useFlightSearch.js
// TC1 — all search logic (filters, API call, loading, error, results)
//        extracted into this reusable hook; UI component has zero business logic
// TC7 — internally composes useDebounce + useAsync instead of
//        implementing debounce or async handling from scratch
// TC8 — UI component only calls this hook; rendering is fully separated

import { useState, useEffect, useCallback } from 'react';
import { useAsync }     from './useAsync';
import { useDebounce }  from './useDebounce';
import { api }          from '../services/api';

const DEFAULT_FILTERS = {
  from:     'NYC',
  to:       '',
  date:     '2025-01-10',
  maxPrice: '',
  airline:  '',
};

/**
 * useFlightSearch
 * Centralizes all flight search interaction logic.
 * Returns only state values and stable handlers for the UI to consume.
 */
export const useFlightSearch = () => {

  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [allFlights,  setAllFlights]  = useState([]);
  const [visibleCount,setVisibleCount]= useState(20);
  const [searchMeta,  setSearchMeta]  = useState({ from: 'NYC', to: '', date: '' });

  const { execute, loading, error, reset } = useAsync(api.searchFlights);

  // TC7 — composing useDebounce inside this hook rather than
  //        putting debounce logic directly in the UI component
  // TC6 — useDebounce is generic; here applied to the full filters object
  //        with 400ms delay so search fires after user stops typing
  const debouncedFilters = useDebounce(filters, 400);

  // ── Auto-search whenever debouncedFilters change ─────────────────────────
  // TC2 — search triggers automatically after 400ms pause, not on every keystroke
  useEffect(() => {
    runSearch(debouncedFilters);
  }, [debouncedFilters]);

  // ── Core search runner ────────────────────────────────────────────────────
  const runSearch = useCallback(async (currentFilters) => {
    try {
      const results = await execute(currentFilters);
      setAllFlights(results || []);
      setVisibleCount(20);
      setSearchMeta({
        from: currentFilters.from,
        to:   currentFilters.to,
        date: currentFilters.date,
      });
    } catch {
      // error already stored in useAsync state
    }
  }, [execute]);

  // ── Filter change handler — stable reference for child components ─────────
  // TC8 — UI component calls this; no filter logic lives in the component
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // ── TC9 — Reset filters to default and auto-trigger new search ────────────
  // No manual Search button click required after reset
  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    // debouncedFilters will update to DEFAULT_FILTERS after 400ms
    // and useEffect will auto-trigger runSearch
  }, []);

  // ── Load more for infinite scroll ────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 20, allFlights.length));
  }, [allFlights.length]);

  // ── Retry: re-run search with current filters ─────────────────────────────
  // TC5 — retry re-executes with previously entered values; no re-input needed
  const handleRetry = useCallback(() => {
    reset();
    runSearch(filters);
  }, [filters, reset, runSearch]);

  // ── Derived values ────────────────────────────────────────────────────────
  const visibleFlights = allFlights.slice(0, visibleCount);
  const hasMore        = visibleCount < allFlights.length;

  // ── Active filter tags for display ───────────────────────────────────────
  const activeFilters = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => ({ key: k, label: `${k}: ${v}` }));

  return {
    // state
    filters,
    allFlights,
    visibleFlights,
    hasMore,
    searchMeta,
    activeFilters,
    loading,
    error,
    // handlers
    handleFilterChange,
    handleResetFilters,
    handleLoadMore,
    handleRetry,
  };
};