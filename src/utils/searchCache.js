// searchCache.js — caches search results to avoid repeated requests (TC10)

const cache = new Map();
const MAX_CACHE_SIZE = 50;

// Build a consistent string key from filter values
export function makeCacheKey(filters) {
  return JSON.stringify({
    from:     (filters.from     || '').toLowerCase().trim(),
    to:       (filters.to       || '').toLowerCase().trim(),
    date:     (filters.date     || ''),
    maxPrice: (filters.maxPrice || ''),
    airline:  (filters.airline  || '').toLowerCase().trim(),
  });
}

// Returns cached result or null
export function getFromCache(key) {
  if (!cache.has(key)) return null;
  // Move to end — most recently used
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);
  return value;
}

// Stores result; evicts oldest entry when limit reached
export function setInCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, value);
}

// Clears entire cache
export function clearCache() {
  cache.clear();
}