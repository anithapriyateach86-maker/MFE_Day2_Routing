// FlightCard.jsx
// Updated: Book button now navigates to /booking/flight/:id
// instead of showing a browser alert

import { memo, useState, useCallback }         from 'react';
import { useNavigate }                          from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp }        from 'lucide-react';
import { useAuth }                              from '../../hooks/useAuth';
import ModuleCard                               from '../resilience/ModuleCard';
import { moduleApi }                            from '../../services/moduleApi';

const FlightCard = memo(function FlightCard({ flight, onLoginClick }) {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // ── Updated: navigate to booking flow instead of alert ──────────────────
  const handleBook = useCallback(() => {
    if (!user) {
      // Not logged in — open login modal
      if (onLoginClick) onLoginClick();
      return;
    }
    // TC1 — navigate to booking step 1 with flight id
    navigate(`/booking/flight/${flight.id}`);
  }, [user, flight.id, navigate, onLoginClick]);

  const stopColor =
    flight.status === 'Nonstop' ? 'text-green-600' : 'text-orange-500';

  const renderRecommendations = useCallback((data) => (
    <ul className="flex flex-col gap-1.5">
      {data.map(item => (
        <li key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-indigo-500">✈</span>
          {item.label}
        </li>
      ))}
    </ul>
  ), []);

  const renderPricing = useCallback((data) => (
    <ul className="flex flex-col gap-1.5">
      {data.map(item => (
        <li key={item.id} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.label}</span>
          <span className="font-semibold text-gray-800">{item.price}</span>
        </li>
      ))}
    </ul>
  ), []);

  const renderSeatAvailability = useCallback((data) => (
    <ul className="flex flex-col gap-1.5">
      {data.map(item => (
        <li key={item.label} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.label}</span>
          <span className="font-semibold text-green-600">{item.seats} Seats</span>
        </li>
      ))}
    </ul>
  ), []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden hover:shadow-md transition-shadow">

      {/* ── Main flight row ── */}
      <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-4">

        {/* Left — route + times */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-800 text-base">
            {flight.from} → {flight.to}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            · {flight.departure} – {flight.arrival}
            · <Clock size={12} className="inline" /> {flight.duration}
          </p>
        </div>

        {/* Right — price + actions */}
        <div className="flex items-center gap-3">
          <p className="text-indigo-600 font-bold text-xl">
            ${flight.price}
          </p>

          {/* Book — now navigates to /booking/flight/:id */}
          <button
            onClick={handleBook}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Book
          </button>

          {/* Details toggle */}
          <button
            onClick={handleToggle}
            className="flex items-center gap-1 border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {isExpanded
              ? <>Less <ChevronUp size={14} /></>
              : <>Details <ChevronDown size={14} /></>
            }
          </button>
        </div>
      </div>

      {/* ── Module panels: only when expanded ── */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
          <ModuleCard
            moduleName="Recommended Flights"
            fetchFn={(signal) =>
              moduleApi.fetchRecommendations(flight.id, signal)
            }
            isEnabled={isExpanded}
            timeout={3000}
            renderData={renderRecommendations}
          />
          <ModuleCard
            moduleName="Live Pricing"
            fetchFn={(signal) =>
              moduleApi.fetchPricing(flight.id, signal)
            }
            isEnabled={isExpanded}
            timeout={3500}
            renderData={renderPricing}
          />
          <ModuleCard
            moduleName="Seat Availability"
            fetchFn={(signal) =>
              moduleApi.fetchSeatAvailability(flight.id, signal)
            }
            isEnabled={isExpanded}
            timeout={3000}
            renderData={renderSeatAvailability}
          />
        </div>
      )}
    </div>
  );
});

export default FlightCard;