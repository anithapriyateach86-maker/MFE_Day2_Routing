// useDebounce.js
// TC2 — delays search trigger until user stops typing (~400ms)
// TC6 — fully generic; accepts any value and any wait time
//        so it can be reused across filters, search bars,
//        booking fields, seat availability inputs, etc.

import { useState, useEffect } from 'react';

/**
 * useDebounce
 * @param {any}    value    - the value to debounce (string, number, object)
 * @param {number} delay    - wait time in milliseconds (default 400ms)
 * @returns {any}           - debounced value, updates only after delay
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 *   const debouncedPrice  = useDebounce(priceValue, 600);
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // TC2 — set a timer to update the debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // TC2 — clear the timer if value changes before delay completes
    // This ensures API call fires only after user stops typing
    return () => clearTimeout(timer);

  }, [value, delay]);

  return debouncedValue;
};