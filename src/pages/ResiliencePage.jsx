// ResiliencePage.jsx
// Houses multiple ExpandableContainers to demonstrate
// isolated recovery across independent parent sections

import ExpandableContainer from '../components/resilience/ExpandableContainer';
import { Shield }          from 'lucide-react';

const ResiliencePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
            <Shield className="text-indigo-600" />
            Resilience Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Expand each section to load its modules independently.
            Modules may randomly fail — use the Retry option to recover each one.
          </p>
        </div>

        {/* Container 1 — Flight Information */}
        <ExpandableContainer
          title="Flight Information"
          description="Live recommendations, pricing, and seat availability"
          primaryAction={
            <button className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700">
              Search Flights
            </button>
          }
        />

        {/* Container 2 — Booking & Alerts */}
        <ExpandableContainer
          title="Booking & Alerts"
          description="Current booking status, weather, and flight alerts"
          primaryAction={
            <button className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-orange-600">
              Manage Bookings
            </button>
          }
        />

        {/* Container 3 — Travel Insights */}
        <ExpandableContainer
          title="Travel Insights"
          description="Personalized travel data and recommendations"
          primaryAction={
            <button className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700">
              View All
            </button>
          }
        />

      </div>
    </div>
  );
};

export default ResiliencePage;