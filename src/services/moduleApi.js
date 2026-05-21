// moduleApi.js
// TC5 — each module calls a distinct endpoint
// TC6 — random failures ~40% to demonstrate recovery behavior

const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
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

// TC6 — ~40% random failure per call
const maybeFail = (moduleName) => {
  if (Math.random() < 0.4) {
    throw new Error(`${moduleName} failed to load`);
  }
};

export const moduleApi = {

  // ── TC5 — Endpoint 1: Recommended Flights ─────────────────────────────────
  fetchRecommendations: async (flightId, signal) => {
    await delay(600 + Math.random() * 600, signal);
    maybeFail('Recommendations');
    return [
      { id: 1, code: 'MBA202', label: 'Flight MBA202' },
      { id: 2, code: 'TK101',  label: 'Flight TK101'  },
      { id: 3, code: 'EK505',  label: 'Flight EK505'  },
    ];
  },

  // ── TC5 — Endpoint 2: Live Pricing ────────────────────────────────────────
  fetchPricing: async (flightId, signal) => {
    await delay(500 + Math.random() * 700, signal);
    maybeFail('Pricing');
    return [
      { id: 1, label: 'Economy',  price: '$299'   },
      { id: 2, label: 'Business', price: '$799'   },
      { id: 3, label: 'First',    price: '$1,499' },
    ];
  },

  // ── TC5 — Endpoint 3: Seat Availability ───────────────────────────────────
  fetchSeatAvailability: async (flightId, signal) => {
    await delay(700 + Math.random() * 500, signal);
    maybeFail('Seat Availability');
    return [
      { label: 'Economy',  seats: Math.floor(Math.random() * 50) + 10 },
      { label: 'Business', seats: Math.floor(Math.random() * 10) + 1  },
      { label: 'First',    seats: Math.floor(Math.random() * 4)  + 1  },
    ];
  },

  // ── TC5 — Endpoint 4: Booking Status ──────────────────────────────────────
  fetchBookingStatus: async (signal) => {
    await delay(500 + Math.random() * 900, signal);
    maybeFail('Booking Status');
    return [
      { id: 'BK001', route: 'NYC → LHR', status: 'Confirmed', date: 'Jan 10' },
      { id: 'BK002', route: 'LAX → DXB', status: 'Pending',   date: 'Jan 15' },
      { id: 'BK003', route: 'SIN → NRT', status: 'Confirmed', date: 'Jan 22' },
    ];
  },

  // ── TC5 — Endpoint 5: Weather Info ────────────────────────────────────────
  fetchWeatherInfo: async (signal) => {
    await delay(400 + Math.random() * 500, signal);
    maybeFail('Weather Info');
    return [
      { city: 'New York',  temp: '12°C', condition: 'Cloudy'  },
      { city: 'London',    temp: '8°C',  condition: 'Rainy'   },
      { city: 'Dubai',     temp: '32°C', condition: 'Sunny'   },
      { city: 'Singapore', temp: '28°C', condition: 'Humid'   },
    ];
  },

  // ── TC5 — Endpoint 6: Flight Alerts ───────────────────────────────────────
  fetchFlightAlerts: async (signal) => {
    await delay(300 + Math.random() * 600, signal);
    maybeFail('Flight Alerts');
    return [
      { id: 1, type: 'Delay',      message: 'AA008 delayed by 45 mins',    severity: 'medium' },
      { id: 2, type: 'Gate Change',message: 'AA016 moved to Gate B12',     severity: 'low'    },
      { id: 3, type: 'Cancelled',  message: 'AA024 cancelled due to weather',severity: 'high' },
    ];
  },
};