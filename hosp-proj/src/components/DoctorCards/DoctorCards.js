import React, { useState } from "react";
import "./DoctorCards.css";
import "./PopupStyles.css";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false); // New state for OTP form visibility

  const handleBookAppointment = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");
    setShowOtpForm(false); // Reset OTP form visibility when closing the popup
  };

  const handleSendOtp = () => {
    setShowOtpForm(true); // Show OTP form when "Send OTP" is clicked
  };

  const handleVerifyOtp = () => {
    alert(`OTP verified for: ${email}`); // You can replace this with actual OTP verification logic
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
            <p></p>
            <p className="doctor-availability">{doctor.availability}</p>
            <button className="book-appointment-button" onClick={handleBookAppointment}>
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
                <img src="Assets/Images/popupImage.webp" alt="Popup" />
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
                {!showOtpForm ? (
                  <button className="popup-button" onClick={handleSendOtp}>
                    Send Otp
                  </button>
                ) : (
                  // OTP Verification Form
                  <div>
                    <input
                      type="text"
                      className="popup-input"
                      placeholder="Enter OTP"
                    />
                    <button className="popup-button" onClick={handleVerifyOtp}>
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
