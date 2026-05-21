import React from 'react';
import { Plane, User } from 'lucide-react';

const HeroSection = ({ onSearchClick, onSignInClick }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-600 text-white py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Fly with Confidence</h1>
        <p className="text-xl mb-8 text-indigo-100">
          Experience world-class service and comfort on every journey
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onSearchClick}
            className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 flex items-center gap-2 shadow-lg transition-all hover:scale-105"
          >
            <Plane size={20} />
            SEARCH FLIGHTS
          </button>
          
          <button
            onClick={onSignInClick}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 border-2 border-indigo-400 transition-all hover:scale-105"
          >
            <User size={20} />
            SIGN IN / REGISTER
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;