// SeatsPage.jsx
// TC3  — persists selected seat to session for later steps
// TC4  — loader failure shows retry without full page reload
// TC9  — error identifies "Seat Map" specifically

import { useLoaderData, useNavigate,
         useRouteError, useRevalidator } from 'react-router-dom';
import { useState }                      from 'react';
import { updateBooking }                 from '../../utils/bookingSession';

export function SeatsError() {
  const error       = useRouteError();
  const revalidator = useRevalidator();
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-red-600 font-semibold text-lg mb-1">
        Failed to load seat map
      </p>
      <p className="text-red-400 text-sm mb-4">{error?.message}</p>
      <button
        onClick={() => revalidator.revalidate()}
        className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm"
      >
        Retry
      </button>
    </div>
  );
}

const CLASS_COLORS = {
  first:    'bg-pink-100 border-pink-300 hover:bg-pink-200',
  business: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
  economy:  'bg-gray-100 border-gray-300 hover:bg-gray-200',
  taken:    'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50',
  selected: 'bg-indigo-600 border-indigo-700 text-white',
};

const SeatsPage = () => {
  const rows             = useLoaderData();
  const navigate         = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSeatClick = (seat) => {
    if (!seat.taken) setSelected(seat.id);
  };

  const handleContinue = () => {
    if (!selected) return;
    updateBooking({ seat: selected });
    navigate('/booking/meal');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Select Seat</h2>
        {selected && (
          <span className="text-indigo-600 font-semibold text-sm">
            Selected: {selected}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs text-gray-600">
        {[
          { label: 'First',    color: 'bg-pink-100 border border-pink-300'  },
          { label: 'Business', color: 'bg-blue-100 border border-blue-300'  },
          { label: 'Economy',  color: 'bg-gray-100 border border-gray-300'  },
          { label: 'Taken',    color: 'bg-gray-300 border border-gray-400'  },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Seat map */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-auto">
        <p className="text-center text-xs text-gray-400 mb-4">
          ✈ Front of Aircraft
        </p>
        {rows.map(row => (
          <div key={row.row} className="flex items-center gap-1 mb-1">
            <span className="text-xs text-gray-400 w-5 text-right mr-2">
              {row.row}
            </span>
            {row.seats.map(seat => (
              <button
                key={seat.id}
                disabled={seat.taken}
                onClick={() => handleSeatClick(seat)}
                className={`w-8 h-8 rounded text-xs font-semibold border transition-all ${
                  selected === seat.id
                    ? CLASS_COLORS.selected
                    : seat.taken
                    ? CLASS_COLORS.taken
                    : CLASS_COLORS[seat.type]
                }`}
              >
                {seat.col}
              </button>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm"
      >
        Continue to Meal Selection →
      </button>
    </div>
  );
};

export default SeatsPage;