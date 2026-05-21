// mockData.js — expanded to 500 flight records for large dataset performance (TC4)

const AIRPORTS = [
  'NYC', 'LHR', 'DXB', 'SIN', 'HKG', 'SYD', 'LAX', 'CDG', 'FRA', 'NRT',
  'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MIA', 'BOS', 'LAS', 'PHX'
];

const AIRLINES = [
  'Airbus A320', 'Boeing 737', 'Airbus A380', 'Boeing 777',
  'Airbus A350', 'Boeing 787', 'Embraer E190', 'Bombardier CRJ900'
];

const CLASSES = ['Economy', 'Business', 'First Class'];

const CREWS = [
  'John Smith', 'Emily Davis', 'Michael Chen', 'Sarah Johnson', 'Raj Patel'
];

function pad(n) {
  return String(n).padStart(2, '0');
}

function fmtTime(h, m) {
  const hh = h % 24;
  const ampm = hh < 12 ? 'AM' : 'PM';
  return `${pad(hh % 12 || 12)}:${pad(m)} ${ampm}`;
}

// Deterministic seeded random — keeps dataset consistent across renders
function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateFlights(count = 500) {
  const rand = seededRand(42);
  const flights = [];

  for (let i = 0; i < count; i++) {
    const idx = i + 1;

    const srcIdx = Math.floor(rand() * AIRPORTS.length);
    let dstIdx = Math.floor(rand() * AIRPORTS.length);
    if (dstIdx === srcIdx) dstIdx = (srcIdx + 1) % AIRPORTS.length;

    const depH  = Math.floor(rand() * 24);
    const depM  = Math.floor(rand() * 60);
    const dur   = Math.floor(rand() * 600) + 60;
    const arrH  = Math.floor((depH * 60 + depM + dur) / 60);
    const arrM  = (depM + dur) % 60;

    const stopsNum = Math.floor(rand() * 3);
    const price    = Math.round((100 + rand() * 900) * 100) / 100;
    const dateDay  = Math.floor(rand() * 28) + 1;

    flights.push({
      id:        `AA${String(idx * 8).padStart(3, '0')}`,
      from:      AIRPORTS[srcIdx],
      to:        AIRPORTS[dstIdx],
      aircraft:  AIRLINES[Math.floor(rand() * AIRLINES.length)],
      class:     CLASSES[Math.floor(rand() * CLASSES.length)],
      crew:      CREWS[Math.floor(rand() * CREWS.length)],
      departure: fmtTime(depH, depM),
      arrival:   fmtTime(arrH, arrM),
      duration:  `${Math.floor(dur / 60)}h ${dur % 60}m`,
      status:    stopsNum === 0 ? 'Nonstop'
               : stopsNum === 1 ? '+1 Stop'
               : `+${stopsNum} Stops`,
      price,
      distance:  Math.floor(rand() * 8700) + 300,
      date:      `01/${pad(dateDay)}/2025`,
    });
  }

  return flights;
}

export const mockFlights = generateFlights(500);

export const airports = [
  { code: 'NYC', name: 'New York City',       city: 'New York'   },
  { code: 'LHR', name: 'London Heathrow',     city: 'London'     },
  { code: 'LAX', name: 'Los Angeles',         city: 'Los Angeles'},
  { code: 'DXB', name: 'Dubai International', city: 'Dubai'      },
  { code: 'SIN', name: 'Singapore Changi',    city: 'Singapore'  },
  { code: 'HKG', name: 'Hong Kong Intl',      city: 'Hong Kong'  },
  { code: 'SYD', name: 'Sydney Airport',      city: 'Sydney'     },
  { code: 'CDG', name: 'Charles de Gaulle',   city: 'Paris'      },
  { code: 'FRA', name: 'Frankfurt Airport',   city: 'Frankfurt'  },
  { code: 'NRT', name: 'Narita International',city: 'Tokyo'      },
];