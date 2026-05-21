// App.jsx — updated to add ResiliencePage route
// All previous TCs remain intact; only navigation addition here

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AuthProvider }    from './context/AuthContext';
import { useAuth }         from './hooks/useAuth';
import Header              from './components/common/Header';
import HomePage            from './pages/HomePage';
import FlightsPage         from './pages/FlightsPage';
import ResiliencePage      from './pages/ResiliencePage';
import LoginModal          from './components/auth/LoginModal';
import RegisterModal       from './components/auth/RegisterModal';
import { ErrorBoundary }   from './components/common/ErrorBoundary';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const LoadingSpinner = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-gray-500">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm">Loading...</p>
  </div>
);

const AppContent = () => {
  const [currentPage,       setCurrentPage]       = useState('home');
  const [showLoginModal,    setShowLoginModal]     = useState(false);
  const [showRegisterModal, setShowRegisterModal]  = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin' && currentPage === 'home') {
      setCurrentPage('admin');
    }
  }, [user, currentPage]);

  const handleLoginClick    = useCallback(() => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  }, []);

  const handleRegisterClick = useCallback(() => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  }, []);

  const handleSearchClick    = useCallback(() => setCurrentPage('flights'),    []);
  const handleHomeClick      = useCallback(() => setCurrentPage('home'),       []);
  const handleResilienceClick= useCallback(() => setCurrentPage('resilience'), []);
  const handleCloseLogin     = useCallback(() => setShowLoginModal(false),     []);
  const handleCloseRegister  = useCallback(() => setShowRegisterModal(false),  []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={handleLoginClick}
        onHomeClick={handleHomeClick}
        onResilienceClick={handleResilienceClick}
      />

      <ErrorBoundary name="Application">
        <Suspense fallback={<LoadingSpinner />}>

          {currentPage === 'home' && !user && (
            <HomePage
              onSearchClick={handleSearchClick}
              onSignInClick={handleLoginClick}
            />
          )}

          {user && user.role === 'passenger' && currentPage === 'home' && (
            <HomePage
              onSearchClick={handleSearchClick}
              onSignInClick={handleLoginClick}
            />
          )}

          {currentPage === 'flights' && (
            <FlightsPage onLoginClick={handleLoginClick} />
          )}

          {/* New resilience page — accessible to all users */}
          {currentPage === 'resilience' && (
            <ResiliencePage />
          )}

          {user && user.role === 'admin' && currentPage === 'admin' && (
            <AdminDashboard />
          )}

        </Suspense>
      </ErrorBoundary>

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onSwitchToRegister={handleRegisterClick}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={handleCloseRegister}
        onSwitchToLogin={handleLoginClick}
      />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;