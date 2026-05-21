// MealPage.jsx
// TC3  — persists meal selection to session
// TC4  — loader failure with retry
// TC9  — error identifies "Meal Options" specifically

import { useLoaderData, useNavigate,
         useRouteError, useRevalidator } from 'react-router-dom';
import { useState }                      from 'react';
import { updateBooking }                 from '../../utils/bookingSession';

export function MealError() {
  const error       = useRouteError();
  const revalidator = useRevalidator();
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-red-600 font-semibold text-lg mb-1">
        Failed to load meal options
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

const MealPage = () => {
  const meals              = useLoaderData();
  const navigate           = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    updateBooking({ meal: selected });
    navigate('/booking/payment');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Meal</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {meals.map(meal => (
          <button
            key={meal.id}
            onClick={() => setSelected(meal.label)}
            className={`bg-white border-2 rounded-xl p-5 text-center transition-all ${
              selected === meal.label
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <p className="text-3xl mb-2">{meal.icon}</p>
            <p className="font-semibold text-gray-800 text-sm">{meal.label}</p>
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm"
      >
        Continue to Payment →
      </button>
    </div>
  );
};

export default MealPage;