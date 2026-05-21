import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAsync } from '../../hooks/useAsync';
import { api } from '../../services/api';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { execute, loading, error } = useAsync(api.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = await execute(email, password);
      login(userData);
      onClose();
      
      // Reset form
      setEmail('');
      setPassword('');
    } catch (err) {
      // Error handled by useAsync
      console.error('Login failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p><strong>Admin:</strong> admin@airways.com / admin123</p>
          <p><strong>User:</strong> user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;