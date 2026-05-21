// PassengerPage.jsx
// Fixed: removed Await/defer — not available in React Router v7
// TC1  — passenger + loyalty offers fetched in parallel by loader
// TC2  — offers render below critical passenger card
// TC3  — flight selection persisted in session
// TC9  — error identifies "Passenger Details" specifically
// TC12 — shouldRevalidate: false prevents re-fetch on back navigation

import { useLoaderData, useNavigate,
         useRouteError, useRevalidator } from 'react-router-dom';
import { loadBooking, updateBooking }    from '../../utils/bookingSession';

export function PassengerError() {
  const error       = useRouteError();
  const revalidator = useRevalidator();
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      {/* TC9 — context specific error message */}
      <p className="text-red-600 font-semibold text-lg mb-1">
        Failed to load passenger details
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

const PassengerPage = () => {
  const { passenger, offers } = useLoaderData();
  const navigate              = useNavigate();
  const session               = loadBooking();

  const handleContinue = () => {
    updateBooking({
      passengerId:   passenger.id,
      passengerName: passenger.name,
    });
    navigate('/booking/seats');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Details</h2>

      {/* TC1 — critical passenger info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700 text-lg">
              {passenger.initials}
            </div>
            <div>
              <p className="font-bold text-gray-800">{passenger.name}</p>
              <p className="text-gray-500 text-sm">{passenger.email}</p>
              <p className="text-gray-400 text-xs">
                Passport: {passenger.passport} · {passenger.country}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-500 font-bold text-sm">{passenger.tier}</p>
            <p className="text-gray-700 font-semibold">
              {passenger.miles.toLocaleString()} miles
            </p>
          </div>
        </div>

        {/* TC3 — shows flight from previous step session */}
        {session?.code && (
          <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600 mb-4">
            Flight: {session.from} → {session.to} · {session.code} · {session.departure}
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm"
        >
          Continue to Seat Selection →
        </button>
      </div>

      {/* TC2 — loyalty offers below critical content */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Loyalty Offers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map(offer => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="font-semibold text-gray-800 text-sm">{offer.title}</p>
            <p className="text-gray-500 text-xs mt-1">{offer.desc}</p>
            <p className="text-orange-500 font-bold text-sm mt-2">{offer.cost}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerPage;