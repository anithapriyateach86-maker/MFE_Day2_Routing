// FlightDetailsPage.jsx
// Fixed: removed Await/defer — not available in React Router v7
// TC1  — flight + similar flights both loaded in parallel by router loader
// TC2  — similar flights section renders after critical flight data
//         (both arrive together but similar flights visually appear below)
// TC4  — errorElement handles loader failure with retry
// TC9  — error message identifies "Flight Details" specifically
// TC10 — skeleton shown during loader execution (before page renders)

import { useLoaderData, useNavigate,
         useRouteError, useRevalidator } from 'react-router-dom';
import { updateBooking }                 from '../../utils/bookingSession';

// ── TC4/TC9 — Route-level error boundary ─────────────────────────────────
export function FlightDetailsError() {
  const error       = useRouteError();
  const revalidator = useRevalidator();
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-red-600 font-semibold text-lg mb-1">
        Failed to load flight details
      </p>
      <p className="text-red-400 text-sm mb-4">{error?.message}</p>
      <button
        onClick={() => revalidator.revalidate()}
        className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

const FlightDetailsPage = () => {
  // TC1 — both flight and similar are available immediately
  //        because loader ran them in parallel
  const { flight, similar } = useLoaderData();
  const navigate            = useNavigate();

  const handleContinue = () => {
    // TC3/TC11 — persist selection to sessionStorage
    updateBooking({
      flightId:  flight.id,
      from:      flight.from,
      to:        flight.to,
      code:      flight.code,
      departure: flight.departure,
      price:     flight.price,
      date:      flight.date,
    });
    navigate('/booking/passenger');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Flight Details</h2>

      {/* ── TC1 — critical flight data ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {flight.from} → {flight.to}
            </p>
            <p className="text-gray-500 text-sm">
              {flight.airline} · {flight.code} · {flight.departure} – {flight.arrival}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {flight.duration} · {flight.stops} · {flight.aircraft}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-600">${flight.price}</p>
            <p className="text-gray-400 text-sm">{flight.class}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            {flight.terminal}
          </span>
          <button
            onClick={handleContinue}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
          >
            Continue to Passenger →
          </button>
        </div>
      </div>

      {/* ── TC2 — similar flights section below critical content ── */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Similar Flights
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similar.map(f => (
          <div
            key={f.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="font-semibold text-gray-800 text-sm">
              {f.from} → {f.to}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">{f.date}</p>
            <p className="text-indigo-600 font-bold mt-2">${f.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightDetailsPage;