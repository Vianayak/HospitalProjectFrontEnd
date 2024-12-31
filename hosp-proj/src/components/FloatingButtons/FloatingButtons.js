import React from "react";
import "./FloatingButtons.css";

const FloatingButtons = () => {
  return (
    <div className="floating-container">
      <button className="health-check-button">Book Health Check-Up</button>
      <button className="appointment-button">Book Appointment</button>
    </div>
  );
};

export default FloatingButtons;
