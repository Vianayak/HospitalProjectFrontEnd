
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import ServiceSection from './components/ServiceSection/ServiceSection';
import HospitalSection from './components/HospitalSection/HospitalSection';
import DoctorGrid from './components/Doctors/DoctorGrid';
import SpecialtiesCarousel from './components/SpecialtiesCarousel/SpecialtiesCarousel';
import Footer from './components/Footer/Footer';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection/>
      <ServiceSection/>
      <DoctorGrid/>
      <SpecialtiesCarousel/>
      <HospitalSection/>
      <Footer/>
    </div>
  );
}

export default App;
