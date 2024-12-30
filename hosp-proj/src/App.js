
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import ServiceSection from './components/ServiceSection/ServiceSection';
import HospitalSection from './components/HospitalSection/HospitalSection';
import DoctorGrid from './components/Doctors/DoctorGrid';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <HeroSection/>
      <ServiceSection/>
      <DoctorGrid/>
      <HospitalSection/>
    </div>
  );
}

export default App;
