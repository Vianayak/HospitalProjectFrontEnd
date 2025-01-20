import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import HeroSection from "./components/HeroSection/HeroSection";
import ServiceSection from "./components/ServiceSection/ServiceSection";
import HospitalSection from "./components/HospitalSection/HospitalSection";
import DoctorGrid from "./components/Doctors/DoctorGrid";
import SpecialtiesCarousel from "./components/SpecialtiesCarousel/SpecialtiesCarousel";
import Footer from "./components/Footer/Footer";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import DoctorList from "./components/DoctorCards/DoctorList";
import UserAppointment from "./components/Appointment/UserAppointment";
import LoginForm from "./components/Login/LoginForm";
import SignUp from "./components/SignUp/SignUp";
import HealthNewsImages from "./components/health/HealthNewsImages";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Sidebar from './components/SideBar/Sidebar';


function App() {
  const healthNewsRef = useRef(null);

  const scrollToHealthNews = () => {
      if (healthNewsRef.current) {
          healthNewsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar scrollToHealthNews={scrollToHealthNews} />

        {/* Routes */}
        <Routes>
          {/* Default Landing Page */}
          <Route
                    path="/healthnewsimages"
                    element={<HealthNewsImages ref={healthNewsRef} />}
                />
          <Route path="/" element={<Navigate to="/jayahospitals" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/jayahospitals"
            element={
              <>
                <HeroSection />
                <ServiceSection />
                <DoctorGrid />
                <SpecialtiesCarousel />
                <HospitalSection />
                <FloatingButtons />
                <HealthNewsImages healthNewsRef={healthNewsRef} />
              </>
            }
          />
<Route path="/sidebar" element={<Sidebar />} />
          {/* Doctor Cards Page */}
          <Route path="/doctor-cards" element={<DoctorList />} />
          {/* User Appointment Page */}
          <Route path="/user-appointment" element={<UserAppointment />} />
          <Route path="/SignUp" element={<Overlay className="login-overlay"><SignUp /></Overlay>} />
          <Route path="/login" element={<Overlay className="login-overlay"><LoginForm /></Overlay>} />
          <Route path="/forgot" element={<Overlay className="login-overlay"><ForgotPassword /></Overlay>} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
    
  );
}
const Overlay = ({ children, className = "" }) => (
  <div className={`overlay ${className}`}>
    <div className="popup">
      {children}
    </div>
  </div>
);

export default App;
