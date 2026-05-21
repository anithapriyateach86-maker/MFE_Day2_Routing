// ExpandableContainer.jsx
// TC1 — data fetches ONLY when container is expanded
// TC2 — renders at least 3 independent data-fetching modules
// TC8 — container expand/collapse always works even if all modules fail

import { useState, useCallback, memo }  from 'react';
import { ChevronDown, ChevronUp }       from 'lucide-react';
import ModuleCard                       from './ModuleCard';
import { moduleApi }                    from '../../services/moduleApi';

/**
 * ExpandableContainer
 * @param {string} title        - container heading
 * @param {string} description  - container subtitle
 * @param {node}   primaryAction - optional button always visible (TC8)
 */
const ExpandableContainer = memo(function ExpandableContainer({
  title,
  description,
  primaryAction,
}) {
  // TC1 — isExpanded controls whether modules start loading
  const [isExpanded, setIsExpanded] = useState(false);

  // TC8 — toggle always works regardless of module states
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // ── Module render helpers ──────────────────────────────────────────────────

  const renderRecommendations = useCallback((data) => (
    <ul className="flex flex-col gap-2">
      {data.map(item => (
        <li key={item.id} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.route}</span>
          <span className="flex gap-2">
            <span className="text-indigo-600 font-semibold">{item.price}</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 rounded-full">
              {item.tag}
            </span>
          </span>
        </li>
      ))}
    </ul>
  ), []);

  const renderPricing = useCallback((data) => (
    <ul className="flex flex-col gap-2">
      {data.map(item => (
        <li key={item.id} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.label}</span>
          <span className="flex gap-2 items-center">
            <span className="text-indigo-600 font-semibold">{item.price}</span>
            <span className={`text-xs px-2 rounded-full ${
              item.available
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-500'
            }`}>
              {item.available ? 'Available' : 'Full'}
            </span>
          </span>
        </li>
      ))}
    </ul>
  ), []);

  const renderSeatAvailability = useCallback((data) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Total Seats</span>
        <span className="font-semibold">{data.total}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Available</span>
        <span className="font-semibold text-green-600">{data.available}</span>
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {data.classes.map(cls => (
          <div key={cls.name} className="flex justify-between text-xs text-gray-500">
            <span>{cls.name}</span>
            <span>{cls.seats} seats</span>
          </div>
        ))}
      </div>
    </div>
  ), []);

  const renderBookingStatus = useCallback((data) => (
    <ul className="flex flex-col gap-2">
      {data.map(item => (
        <li key={item.id} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.route}</span>
          <span className="flex gap-2 items-center">
            <span className="text-xs text-gray-400">{item.date}</span>
            <span className={`text-xs px-2 rounded-full ${
              item.status === 'Confirmed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {item.status}
            </span>
          </span>
        </li>
      ))}
    </ul>
  ), []);

  const renderWeather = useCallback((data) => (
    <ul className="flex flex-col gap-2">
      {data.map(item => (
        <li key={item.city} className="flex justify-between text-sm">
          <span className="text-gray-700">{item.city}</span>
          <span className="flex gap-2">
            <span className="font-semibold text-indigo-600">{item.temp}</span>
            <span className="text-gray-400">{item.condition}</span>
          </span>
        </li>
      ))}
    </ul>
  ), []);

  const renderAlerts = useCallback((data) => (
    <ul className="flex flex-col gap-2">
      {data.map(item => (
        <li key={item.id} className={`text-xs p-2 rounded-lg ${
          item.severity === 'high'   ? 'bg-red-50 text-red-700'    :
          item.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                       'bg-blue-50 text-blue-700'
        }`}>
          <span className="font-semibold">{item.type}: </span>
          {item.message}
        </li>
      ))}
    </ul>
  ), []);

  // ── Module definitions — TC2: at least 3, TC5: each has distinct endpoint ──
  const MODULES = [
    {
      moduleName: 'Recommendations',
      fetchFn:    moduleApi.fetchRecommendations,
      timeout:    3000,
      renderData: renderRecommendations,
    },
    {
      moduleName: 'Pricing',
      fetchFn:    moduleApi.fetchPricing,
      timeout:    3500,
      renderData: renderPricing,
    },
    {
      moduleName: 'Seat Availability',
      fetchFn:    moduleApi.fetchSeatAvailability,
      timeout:    3000,
      renderData: renderSeatAvailability,
    },
    {
      moduleName: 'Booking Status',
      fetchFn:    moduleApi.fetchBookingStatus,
      timeout:    4000,
      renderData: renderBookingStatus,
    },
    {
      moduleName: 'Weather Info',
      fetchFn:    moduleApi.fetchWeatherInfo,
      timeout:    2500,
      renderData: renderWeather,
    },
    {
      moduleName: 'Flight Alerts',
      fetchFn:    moduleApi.fetchFlightAlerts,
      timeout:    2000,
      renderData: renderAlerts,
    },
  ];

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">

      {/* ── Container Header — TC8: always functional ── */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div>
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          {description && (
            <p className="text-gray-500 text-sm mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* TC8 — primary action always visible and clickable */}
          {primaryAction && (
            <div onClick={e => e.stopPropagation()}>
              {primaryAction}
            </div>
          )}
          {/* TC1 — visual indicator of expand/collapse state */}
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-1">
            {isExpanded
              ? <ChevronUp  size={20} />
              : <ChevronDown size={20} />
            }
          </div>
        </div>
      </div>

      {/* ── Module Grid — TC1: renders only when expanded ── */}
      {isExpanded && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TC2 — 6 modules (minimum 3 required)            */}
          {/* TC3 — each ModuleCard has its own boundary      */}
          {/* TC5 — each module calls a different endpoint    */}
          {/* TC6 — each endpoint randomly fails ~40%         */}
          {/* TC7 — each ModuleCard shows its own module name */}
          {MODULES.map(mod => (
            <ModuleCard
              key={mod.moduleName}
              moduleName={mod.moduleName}
              fetchFn={mod.fetchFn}
              isEnabled={isExpanded}
              timeout={mod.timeout}
              renderData={mod.renderData}
            />
          ))}
        </div>
      )}

    </div>
  );
});

export default ExpandableContainer;