// BookingStepper.jsx
// TC5 — shows all 5 steps, allows navigation only to completed steps
//        future unvisited steps are visually disabled and non-clickable

import { useNavigate } from 'react-router-dom';
import { Check }       from 'lucide-react';

const STEPS = [
  { label: 'Flight',    path: 'flight' },
  { label: 'Passenger', path: 'passenger' },
  { label: 'Seats',     path: 'seats' },
  { label: 'Meal',      path: 'meal' },
  { label: 'Payment',   path: 'payment' },
];

const BookingStepper = ({ currentStep, completedSteps = [] }) => {
  const navigate = useNavigate();

  const handleStepClick = (index, path) => {
    // TC5 — only allow navigation to completed steps
    if (completedSteps.includes(index)) {
      navigate(`/booking/${path}`);
    }
    // future steps are blocked — no navigation
  };

  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-4">
      {STEPS.map((step, index) => {
        const stepNum     = index + 1;
        const isCurrent   = currentStep === stepNum;
        const isCompleted = completedSteps.includes(index);
        const isFuture    = !isCurrent && !isCompleted;

        return (
          <div key={step.label} className="flex items-center">

            {/* Step circle */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(index, step.path)}
                disabled={isFuture}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700'
                    : isCurrent
                    ? 'bg-indigo-600 text-white cursor-default ring-4 ring-indigo-100'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </button>
              <span className={`text-xs mt-1 font-medium ${
                isCurrent   ? 'text-indigo-600' :
                isCompleted ? 'text-gray-700'   : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mb-5 mx-1 ${
                isCompleted ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            )}

          </div>
        );
      })}
    </div>
  );
};

export default BookingStepper;