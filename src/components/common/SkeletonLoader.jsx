// SkeletonLoader.jsx
// TC10 — renders skeleton placeholders while deferred data sections load
//         shape and size match the actual content they replace

const Pulse = ({ className }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

// Skeleton for Similar Flights section (FlightDetailsPage deferred)
export const SimilarFlightsSkeleton = () => (
  <div className="mt-6">
    <Pulse className="h-3 w-32 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-3 w-16" />
          <Pulse className="h-5 w-12" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for Loyalty Offers section (PassengerPage deferred)
export const LoyaltyOffersSkeleton = () => (
  <div className="mt-6">
    <Pulse className="h-3 w-28 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1,2].map(i => (
        <div key={i} className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-3 w-40" />
          <Pulse className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);