import React, { useState } from "react";
import "./DoctorCards.css";
import "./PopupStyles.css";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");

  const handleBookAppointment = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");
  };

  const handleSendOtp = () => {
    alert(`Email submitted: ${email}`);
  };

  return (
    <>
    <div className="content-wrapper">
      <div className="doctor-card">
        <div className="doctor-image">
          <img src={doctor.image} alt={`${doctor.name}`} />
        </div>
        <div className="doctor-details">
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-speciality">{doctor.speciality}</p>
          <p className="doctor-experience">
              {doctor.experience} years of experience
            </p>
            <p className="doctor-location">{doctor.location}</p>
            <p className="doctor-availability">{doctor.availability}</p>
          <button
            className="book-appointment-button"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="popup-close" onClick={handleClosePopup}>
              &times;
            </button>
            <div className="popup-content">
              <div className="popup-image">
                <img
                  src="Assets/Images/popupImage.webp" // Replace with your image
                  alt="Popup"
                />
              </div>
              <div className="popup-form">
                <h2>JAYA Hospitals</h2>
                <input
                  type="email"
                  className="popup-input"
                  placeholder="What is your email?"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="popup-button" onClick={handleSendOtp}>
                  Send Otp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
