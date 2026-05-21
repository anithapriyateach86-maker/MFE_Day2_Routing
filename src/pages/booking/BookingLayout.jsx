// BookingLayout.jsx
// TC5 — renders BookingStepper so it appears on every booking step
// TC8 — renders RouteTransitionBar for all booking route transitions

import { Outlet, useLocation }  from 'react-router-dom';
import { useState, useEffect }  from 'react';
import BookingStepper           from '../../components/common/BookingStepper';
import RouteTransitionBar       from '../../components/common/RouteTransitionBar';

const STEP_MAP = {
  'flight':    1,
  'passenger': 2,
  'seats':     3,
  'meal':      4,
  'payment':   5,
};

const BookingLayout = () => {
  const location = useLocation();
  const [completedSteps, setCompletedSteps] = useState([]);

  const pathPart    = location.pathname.split('/').filter(Boolean).pop();
  const currentStep = STEP_MAP[pathPart] || STEP_MAP['flight'];

  // Mark previous steps as completed when advancing
  useEffect(() => {
    const stepIndex = currentStep - 1;
    setCompletedSteps(prev => {
      const all = [];
      for (let i = 0; i < stepIndex; i++) all.push(i);
      return all;
    });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TC8 — transition bar fixed at top */}
      <RouteTransitionBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* TC5 — stepper always visible across all booking steps */}
        <BookingStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Each booking step renders here */}
        <Outlet />
      </div>
    </div>
  );
};

export default BookingLayout;