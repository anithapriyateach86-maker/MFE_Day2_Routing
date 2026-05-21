import React from 'react';
import FlightSearchPage from '../components/flights/FlightSearchPage';

const FlightsPage = ({ onLoginClick }) => {
  return <FlightSearchPage onLoginClick={onLoginClick} />;
};

export default FlightsPage;