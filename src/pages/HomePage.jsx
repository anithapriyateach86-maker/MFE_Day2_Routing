import React from 'react';
import HeroSection from '../components/common/HeroSection';
import FeatureCards from '../components/common/FeatureCards';

const HomePage = ({ onSearchClick, onSignInClick }) => {
  return (
    <>
      <HeroSection
        onSearchClick={onSearchClick}
        onSignInClick={onSignInClick}
      />
      <FeatureCards />
    </>
  );
};

export default HomePage;