import React from "react";
import "./FloatingButtons.css";
import { useNavigate } from "react-router-dom";

const FloatingButtons = ({ toggleChatbot }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/book-appointments-page");
  };

  return (
    <div className="floating-container">
      <button className="chat-bot-button"onClick={toggleChatbot}>ChatBot</button>
      <button className="appointment-button" onClick={handleRedirect}>
        Book Appointment
      </button>
    </div>
  );
};

export default FloatingButtons;
