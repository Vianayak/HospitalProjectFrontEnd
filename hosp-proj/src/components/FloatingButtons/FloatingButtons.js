import React from "react";
import "./FloatingButtons.css";
import { useNavigate } from "react-router-dom";

const FloatingButtons = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/book-appointments-page");
  };

  return (
    <div className="floating-container">
      <button className="health-check-button">Book Health Check-Up</button>
      <button className="appointment-button" onClick={handleRedirect}>
        Book Appointment
      </button>
    </div>
  );
};

export default FloatingButtons;
