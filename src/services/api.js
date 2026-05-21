// api.js — updated to use 500-record mockFlights, cache, and cancellation support

import { mockFlights }               from '../utils/mockData';
import { makeCacheKey, getFromCache, setInCache } from '../utils/searchCache';

const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    // TC9 — reject immediately if signal is already aborted
    if (signal?.aborted) {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

export const api = {

  // ── Authentication ──────────────────────────────────────────────────────────
  login: async (email, password) => {
    await delay(1000);

    if (email === 'admin@airways.com' && password === 'admin123') {
      return { email, name: 'Admin User',     role: 'admin',     id: 'admin_001' };
    }
    if (email && password.length >= 6) {
      return { email, name: 'Passenger User', role: 'passenger', id: `user_${Date.now()}` };
    }
    throw new Error('Invalid email or password');
  },

  register: async (userData) => {
    await delay(1000);
    if (!userData.email || !userData.name) throw new Error('Missing required fields');
    return { ...userData, role: 'passenger', id: `user_${Date.now()}` };
  },

  // ── Flight Search ───────────────────────────────────────────────────────────
  // TC9 — accepts signal as last param (passed from useAsync)
  // TC10 — checks cache before filtering; stores result after
  searchFlights: async (filters = {}, signal) => {

    const cacheKey = makeCacheKey(filters);

    // TC10 — return instantly from cache if available
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    // Simulate network delay; respects cancellation
    await delay(800, signal);

    // TC9 — check again after delay in case aborted during wait
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    // TC4 — filter across full 500-record dataset
    let results = [...mockFlights];

    if (filters.from) {
      results = results.filter(f =>
        f.from.toLowerCase().includes(filters.from.toLowerCase())
      );
    }
    if (filters.to) {
      results = results.filter(f =>
        f.to.toLowerCase().includes(filters.to.toLowerCase())
      );
    }
    if (filters.maxPrice) {
      results = results.filter(f => f.price <= parseFloat(filters.maxPrice));
    }
    if (filters.airline) {
      results = results.filter(f =>
        f.aircraft.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    // TC10 — store results in cache for repeat searches
    setInCache(cacheKey, results);

    return results;
  },

  getFlightById: async (flightId) => {
    await delay(500);
    const flight = mockFlights.find(f => f.id === flightId);
    if (!flight) throw new Error('Flight not found');
    return flight;
  },

  bookFlight: async (flightId, userId) => {
    await delay(1000);
    return {
      bookingId:   `BK${Date.now()}`,
      flightId,
      userId,
      status:      'confirmed',
      bookingDate: new Date().toISOString(),
    };
  },
};