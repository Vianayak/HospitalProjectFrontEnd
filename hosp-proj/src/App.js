import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          {/* Default Landing Page */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <ServiceSection />
                <DoctorGrid />
                <SpecialtiesCarousel />
                <HospitalSection />
                <FloatingButtons />
              </>
            }
          />

          {/* Doctor Cards Page */}
          <Route path="/doctor-cards" element={<DoctorList />} />

          {/* User Appointment Page */}
          <Route path="/user-appointment" element={<UserAppointment />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
