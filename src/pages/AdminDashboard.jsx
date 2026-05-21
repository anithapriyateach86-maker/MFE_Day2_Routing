import React from 'react';
import { Home, DollarSign, Plane, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Fly with Confidence</h1>
          <p className="text-xl mb-8 text-indigo-100">
            Experience world-class service and comfort on every journey
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 flex items-center gap-2 transition-all hover:scale-105">
              <Home size={20} />
              ADMIN DASHBOARD
            </button>
            
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 border-2 border-indigo-400 transition-all hover:scale-105">
              <DollarSign size={20} />
              SYSTEM OVERVIEW
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <Plane className="text-blue-500 mx-auto mb-3" size={48} />
            <h3 className="font-bold text-gray-800 mb-1">Flight Status</h3>
            <p className="text-sm text-gray-600">Track any flight</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="text-purple-500 mx-auto mb-3" size={48} />
            <h3 className="font-bold text-gray-800 mb-1">Online Check-in</h3>
            <p className="text-sm text-gray-600">Quick & easy</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <DollarSign className="text-blue-400 mx-auto mb-3" size={48} />
            <h3 className="font-bold text-gray-800 mb-1">Baggage Policy</h3>
            <p className="text-sm text-gray-600">Know before you go</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back!</h2>
          <p className="text-gray-600 mb-6">Your travel dashboard awaits</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-800 mb-2">Best Value</h3>
              <p className="text-sm text-gray-600">
                Competitive deals with no hidden fees. Get the best deals on flights worldwide.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-gray-800 mb-2">Global Network</h3>
              <p className="text-sm text-gray-600">
                Fly to 200+ destinations across 6 continents with our extensive route network.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-800 mb-2">5-Star Service</h3>
              <p className="text-sm text-gray-600">
                Award-winning customer service and premium in-flight experience every time.
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-gray-800 mb-2">Safety First</h3>
            <p className="text-sm text-gray-600">
              Industry-leading safety standards with modern fleet and experienced crew.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;