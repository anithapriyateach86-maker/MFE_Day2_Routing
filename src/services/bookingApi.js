// bookingApi.js
// Removed defer pattern — compatible with React Router v7
// TC1 — all loader functions designed to run in parallel via Promise.all
// TC2 — similar flights still load slower to simulate progressive feel
// TC4 — each function throws on failure so route error boundaries catch it

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ── TC1 — Critical: loads fast ────────────────────────────────────────────
export async function loadFlightDetails(flightId) {
  await delay(400);
  if (Math.random() < 0.15) throw new Error('Failed to load flight details');
  return {
    id:        flightId || 'EK007',
    from:      'DXB',
    to:        'LHR',
    airline:   'Emirates',
    code:      'EK007',
    departure: '08:30',
    arrival:   '13:00',
    duration:  '7h 30m',
    stops:     'Non-stop',
    aircraft:  'Boeing 777-300ER',
    terminal:  'Terminal T3',
    price:     499,
    class:     'Economy',
    date:      '2024-08-15',
  };
}

// ── TC2 — Slower load to simulate deferred feel ───────────────────────────
export async function loadSimilarFlights(flightId) {
  await delay(1200);
  return [
    { id: 'EK001', from: 'DXB', to: 'LHR', date: '2024-08-16', price: 459 },
    { id: 'EK002', from: 'DXB', to: 'LHR', date: '2024-08-17', price: 489 },
    { id: 'EK003', from: 'DXB', to: 'MAN', date: '2024-08-15', price: 379 },
  ];
}

// ── TC1 — Critical: passenger data ────────────────────────────────────────
export async function loadPassengerDetails(passengerId) {
  await delay(350);
  if (Math.random() < 0.15) throw new Error('Failed to load passenger details');
  return {
    id:       passengerId || 'P001',
    name:     'Ahmed Al-Rashidi',
    initials: 'AA',
    email:    'ahmed@example.com',
    passport: 'OM1234567',
    country:  'Omani',
    tier:     'GOLD MEMBER',
    miles:    24800,
  };
}

// ── TC2 — Slower load to simulate deferred feel ───────────────────────────
export async function loadLoyaltyOffers(passengerId) {
  await delay(1400);
  return [
    { id: 1, title: 'Miles Upgrade', desc: 'Upgrade to Business for 5,000 miles', cost: '5,000 miles' },
    { id: 2, title: 'Lounge Access', desc: 'Emirates lounge for 1,500 miles',      cost: '1,500 miles' },
  ];
}

// ── TC1 — Critical: seat map ──────────────────────────────────────────────
export async function loadSeatMap(flightId) {
  await delay(450);
  if (Math.random() < 0.15) throw new Error('Failed to load seat map');
  const rows = [];
  for (let r = 1; r <= 30; r++) {
    rows.push({
      row: r,
      seats: ['A','B','C','D','E','F'].map(col => ({
        id:    `${r}${col}`,
        col,
        type:  r <= 3 ? 'first' : r <= 10 ? 'business' : 'economy',
        taken: Math.random() < 0.3,
      }))
    });
  }
  return rows;
}

// ── TC1 — Critical: meal options ──────────────────────────────────────────
export async function loadMealOptions() {
  await delay(300);
  if (Math.random() < 0.15) throw new Error('Failed to load meal options');
  return [
    { id: 'veg',    label: 'Vegetarian',     icon: '🥗' },
    { id: 'nonveg', label: 'Non-Vegetarian', icon: '🍗' },
    { id: 'vegan',  label: 'Vegan',          icon: '🌱' },
    { id: 'halal',  label: 'Halal',          icon: '☪️'  },
    { id: 'kosher', label: 'Kosher',         icon: '✡️'  },
    { id: 'gluten', label: 'Gluten Free',    icon: '🌾' },
  ];
}

// ── TC1 — Critical: booking summary for payment ────────────────────────────
export async function loadBookingSummary(bookingData) {
  await delay(300);
  if (Math.random() < 0.15) throw new Error('Failed to load booking summary');
  const base  = bookingData?.price || 499;
  const taxes = Math.round(base * 0.124);
  return {
    ...bookingData,
    baseFare:  base,
    taxes,
    total:     base + taxes,
    bookingId: `BK-${Date.now().toString().slice(-11)}`,
  };
}