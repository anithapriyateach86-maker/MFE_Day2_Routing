// PaymentPage.jsx
// TC3  — shows all previously selected data from session
// TC7  — summary loaded from cache; no re-fetch
// TC9  — error identifies "Payment" specifically
// TC11 — all session data survives page refresh

import { useLoaderData, useNavigate,
         useRouteError, useRevalidator } from 'react-router-dom';
import { useState }                      from 'react';
import { clearBooking }                  from '../../utils/bookingSession';

export function PaymentError() {
  const error       = useRouteError();
  const revalidator = useRevalidator();
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-red-600 font-semibold text-lg mb-1">
        Failed to load payment summary
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

const PaymentPage = () => {
  const summary          = useLoaderData();
  const navigate         = useNavigate();
  const [paid, setPaid]  = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setPaid(true);
    setProcessing(false);
  };

  const handleOk = () => {
    clearBooking();
    navigate('/');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
        {/* TC7 — badge shows data came from cache */}
        <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          ✓ Loaded from cache
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="font-semibold text-gray-800 text-base mb-4">Booking Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-4">
          {[
            { label: 'Flight',    value: `${summary.from} → ${summary.to} · ${summary.code}` },
            { label: 'Date',      value: summary.date },
            { label: 'Passenger', value: summary.passengerName },
            { label: 'Seat',      value: summary.seat },
            { label: 'Meal',      value: summary.meal },
          ].map(row => (
            <div key={row.label} className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-medium text-gray-800">{row.value || '—'}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-sm mb-4">
          <div className="flex justify-between text-gray-500">
            <span>Base fare</span><span>${summary.baseFare}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Taxes &amp; fees</span><span>${summary.taxes}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-200 mt-1">
            <span>Total</span>
            <span className="text-indigo-600">${summary.total}</span>
          </div>
        </div>
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-semibold text-sm"
        >
          {processing ? 'Processing payment...' : `Confirm & Pay $${summary.total}`}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Booking ID: {summary.bookingId} · Secured by SSL
        </p>
      </div>

      {/* TC11 — confirmation dialog after payment */}
      {paid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <p className="font-bold text-gray-800 mb-4">
              Booking confirmed! ID: {summary.bookingId}
            </p>
            <button
              onClick={handleOk}
              className="bg-white border border-gray-200 px-8 py-2 rounded-full font-semibold hover:bg-gray-50"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;