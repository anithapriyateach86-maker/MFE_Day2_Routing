// router/index.jsx
// Fixed: removed defer/Await — not available in React Router v7
// TC1  — loaders still run in parallel using Promise.all
// TC6  — all booking routes are lazy loaded with Suspense fallback
// TC7  — shouldRevalidate prevents re-fetch on back navigation
// TC8  — useNavigation().state drives the transition bar
// TC12 — shouldRevalidate: false for stable data

import { lazy, Suspense }               from 'react';
import { createBrowserRouter }          from 'react-router-dom';
import {
  loadFlightDetails, loadSimilarFlights,
  loadPassengerDetails, loadLoyaltyOffers,
  loadSeatMap, loadMealOptions,
  loadBookingSummary
}                                        from '../services/bookingApi';
import { loadBooking }                  from '../utils/bookingSession';

// TC6 — all booking pages are lazy loaded
const BookingLayout     = lazy(() => import('../pages/booking/BookingLayout'));
const FlightDetailsPage = lazy(() => import('../pages/booking/FlightDetailsPage'));
const PassengerPage     = lazy(() => import('../pages/booking/PassengerPage'));
const SeatsPage         = lazy(() => import('../pages/booking/SeatsPage'));
const MealPage          = lazy(() => import('../pages/booking/MealPage'));
const PaymentPage       = lazy(() => import('../pages/booking/PaymentPage'));

// TC6 — Suspense fallback shown while lazy chunk loads
const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm">Loading...</p>
  </div>
);

const wrap = (Component) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: App } = await import('../App');
      return { Component: App };
    },
  },
  {
    path: '/booking',
    element: wrap(BookingLayout),
    children: [
      {
        path: 'flight/:flightId',
        element: wrap(FlightDetailsPage),
        // TC1 — critical + similar flights loaded in parallel
        loader: async ({ params }) => {
          const [flight, similar] = await Promise.all([
            loadFlightDetails(params.flightId),
            loadSimilarFlights(params.flightId),
          ]);
          return { flight, similar };
        },
        // TC7/TC12 — do not re-fetch if already on same path
        shouldRevalidate: ({ currentUrl, nextUrl }) =>
          currentUrl.pathname !== nextUrl.pathname,
      },
      {
        path: 'passenger',
        element: wrap(PassengerPage),
        // TC1 — passenger + loyalty offers in parallel
        loader: async () => {
          const session = loadBooking();
          const [passenger, offers] = await Promise.all([
            loadPassengerDetails(session?.passengerId),
            loadLoyaltyOffers(session?.passengerId),
          ]);
          return { passenger, offers };
        },
        // TC12 — prevent re-execution on back navigation
        shouldRevalidate: () => false,
      },
      {
        path: 'seats',
        element: wrap(SeatsPage),
        loader: async () => {
          const session = loadBooking();
          return loadSeatMap(session?.flightId);
        },
        shouldRevalidate: () => false,
      },
      {
        path: 'meal',
        element: wrap(MealPage),
        loader: async () => loadMealOptions(),
        shouldRevalidate: () => false,
      },
      {
        path: 'payment',
        element: wrap(PaymentPage),
        // TC7 — uses cached session; no new network call
        loader: async () => {
          const session = loadBooking();
          return loadBookingSummary(session);
        },
        shouldRevalidate: () => false,
      },
    ],
  },
]);