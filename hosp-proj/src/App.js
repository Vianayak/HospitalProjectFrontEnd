
import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import ServiceSection from './components/ServiceSection/ServiceSection';
import HospitalsSection from './components/HospitalSection/HospitalSection';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <HeroSection/>
      <ServiceSection/>
      <HospitalsSection/>
    </div>
  );
}

export default App;
