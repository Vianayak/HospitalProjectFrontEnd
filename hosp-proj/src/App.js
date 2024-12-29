import logo from './logo.svg';
import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <HeroSection/>
    </div>
  );
}

export default App;
