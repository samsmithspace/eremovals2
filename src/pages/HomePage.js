import React from 'react';
import HeroSection from '../features/marketing/components/HeroSection';
import Testimonials from '../features/marketing/components/Testimonials';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Testimonials />
    </div>
  );
};

export default HomePage;