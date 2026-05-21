// FlightSearchPage.jsx
// TC1  — no search logic here; everything delegated to useFlightSearch hook
// TC2  — debounce happens inside useFlightSearch via useDebounce;
//         this component just binds inputs to handleFilterChange
// TC7  — useFlightSearch composes useDebounce + useAsync internally
// TC8  — this component contains ONLY rendering logic and event binding
// TC9  — reset calls handleResetFilters which auto-triggers new search
//         no manual Search button click needed after clearing filters

import { useRef, useEffect, useCallback }  from 'react';
import { useAuth }                          from '../../hooks/useAuth';
import { useFlightSearch }                  from '../../hooks/useFlightSearch';
import FlightCard                           from './FlightCard';
import { ErrorBoundary }                    from '../common/ErrorBoundary';
import AsyncFeedback                        from '../common/AsyncFeedback';
import {
  Search, MapPin, Calendar,
  DollarSign, Plane, Filter
} from 'lucide-react';

const FlightSearchPage = ({ onLoginClick }) => {

  // TC1 / TC8 — all business logic lives in useFlightSearch
  //             this component only destructures and renders
  const {
    filters,
    allFlights,
    visibleFlights,
    hasMore,
    searchMeta,
    activeFilters,
    loading,
    error,
    handleFilterChange,
    handleResetFilters,
    handleLoadMore,
    handleRetry,
  } = useFlightSearch();

  const { user } = useAuth();

  // TC11 — sentinel ref for IntersectionObserver (infinite scroll)
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);



  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Plane className="text-indigo-600" />
          Search Flights
        </h1>

        {/* ── Filter Panel ── */}
        <ErrorBoundary name="Filter Panel">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Filter size={24} className="text-indigo-600" />
              Flight Filters
            </h2>

            {/* TC2 — inputs call handleFilterChange which updates filters state;
                useDebounce inside useFlightSearch delays the API call by 400ms */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1 text-indigo-600" />
                  From (Source)
                </label>
                <input
                  type="text"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  placeholder="e.g., NYC, LAX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1 text-indigo-600" />
                  To (Destination)
                </label>
                <input
                  type="text"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  placeholder="e.g., LHR, DXB"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1 text-indigo-600" />
                  Travel Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1 text-indigo-600" />
                  Max Price (USD)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="e.g., 500"
                  min="0"
                  step="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Plane size={16} className="inline mr-1 text-indigo-600" />
                  Airline / Aircraft
                </label>
                <input
                  type="text"
                  name="airline"
                  value={filters.airline}
                  onChange={handleFilterChange}
                  placeholder="e.g., Boeing, Airbus"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-end gap-2">
                {/* TC2 — Search button still available for manual trigger */}
                <button
                  onClick={() => handleFilterChange({ target: { name: '_force', value: Date.now() } })}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Search'}
                </button>

                {/* TC9 — Clear resets all filters and auto-triggers new search */}
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Active filter tags */}
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active:</span>
                {activeFilters.map(f => (
                  <span
                    key={f.key}
                    className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                  >
                    {f.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* ── Search Summary ── */}
        <ErrorBoundary name="Search Summary">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Search</h3>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xl font-bold text-gray-800">{searchMeta.from}</span>
              <span className="text-gray-400 text-2xl">→</span>
              <span className="text-xl font-bold text-gray-800">{searchMeta.to || 'All'}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">Date:</span> {searchMeta.date}
            </div>
          </div>
        </ErrorBoundary>

        {/* ── Results with AsyncFeedback ── */}
        <ErrorBoundary name="Results List">

          {/* TC3/TC4/TC5 — AsyncFeedback handles loading, error, success uniformly */}
          <AsyncFeedback
            loading={loading}
            error={error}
            loadingLabel="Searching flights..."
            onRetry={handleRetry}
            retryLabel="Retry Search"
          >
            {allFlights.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Available Flights ({allFlights.length})
                  </h2>
                  <span className="text-sm text-gray-500">
                    Showing {visibleFlights.length} of {allFlights.length} flights
                  </span>
                </div>

                {visibleFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} onLoginClick={onLoginClick} />                ))}

                <div ref={sentinelRef} className="py-6 text-center text-gray-400 text-sm">
                  {hasMore ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      Loading more flights...
                    </span>
                  ) : (
                    <span>✓ All {allFlights.length} flights loaded</span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Search size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No flights found.</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </AsyncFeedback>

        </ErrorBoundary>

      </div>
    </div>
  );
};

export default FlightSearchPage;