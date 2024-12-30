
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import ServiceSection from './components/ServiceSection/ServiceSection';
import HospitalSection from './components/HospitalSection/HospitalSection';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <HeroSection/>
      <ServiceSection/>
      <HospitalSection/>
    </div>
  );
}

export default App;
