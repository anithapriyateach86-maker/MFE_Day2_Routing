// Header.jsx — wrapped with React.memo (TC1)
// Only re-renders when user prop or handler references actually change

import { memo }                   from 'react';
import { Plane, User, LogOut }    from 'lucide-react';
import { useAuth }                from '../../hooks/useAuth';

const Header = memo(function Header({ onLoginClick, onHomeClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onHomeClick}
        >
          <Plane className="text-blue-600" size={28} />
          <span className="text-xl font-bold text-gray-800">Airways Airlines</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onHomeClick}
            className="text-gray-600 hover:text-gray-800"
          >
            Home
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-600" />
                <span className="text-gray-700">{user.name || user.email}</span>
                {user.role === 'admin' && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-1">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
});

export default Header;