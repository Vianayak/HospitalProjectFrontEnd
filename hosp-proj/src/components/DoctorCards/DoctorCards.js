import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios'; // Import axios
import "./DoctorCards.css";
import "./PopupStyles.css";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");  // Added state for OTP
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [date, setDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookAppointment = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");
    setShowOtpForm(false);
  };

  const handleSendOtp = async () => {
    console.log("Sending OTP to email:", email);  // Debugging log
  
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP.");
      }
  
      const data = await response.text();
      console.log("OTP sent response:", data);
      setShowOtpForm(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/otp/verifyOtp', null, {
        params: {
          email: email,
          otp: otp, // OTP entered by the user
        }
      });
      alert(response.data); // Success message from backend
      setShowPopup(false);
      setShowSchedulePopup(true);
    } catch (error) {
      alert(error.response?.data || "Error verifying OTP");
    }
  };

  const handleConfirmAppointment = () => {
    if (date && selectedTimeSlot) {
      navigate(`/user-appointment`, {
        state: { date, timeSlot: selectedTimeSlot },
      });
    } else {
      alert("Please select both a date and a time slot.");
    }
  };

  return (
    <>
      <div className="content-wrapper1">
        <div className="doctor-card">
          <div className="doctor-image">
            <img src="Assets/Images/Love.jpeg" alt={`${doctor.name}`} />
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-speciality">Specialization: {doctor.specialization}</p>
            <p className="doctor-experience">Experience: {doctor.experience} years of experience</p>
            <p className="doctor-languages">Languages: {doctor.languages.join(", ")}</p>
            <p className="doctor-location">Location: {doctor.location}</p>
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
                  <div>
                    <input
                      type="text"
                      className="popup-input"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)} // Update OTP state
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

      {showSchedulePopup && (
        <div className="popup-overlay">
          <div className="popup-container schedule-popup">
            <button
              className="popup-close"
              onClick={() => setShowSchedulePopup(false)}
            >
              &times;
            </button>
            <div className="schedule-content">
              <h3>Schedule Your Appointment Timing</h3>
              <div className="date-picker-container">
                <label htmlFor="date">Choose a date:</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                  className="date-input"
                />
              </div>

              <div className="schedule-body">
                <h3 className="align-left">MORNING</h3>
                <div className="time-slots">
                  <button
                    className={`time-slot ${selectedTimeSlot === "11:00-11:30" ? "active" : ""}`}
                    onClick={() => handleTimeSlotSelect("11:00-11:30")}
                  >
                    11:00-11:30
                  </button>
                  <button
                    className={`time-slot ${selectedTimeSlot === "11:30-12:00" ? "active" : ""}`}
                    onClick={() => handleTimeSlotSelect("11:30-12:00")}
                  >
                    11:30-12:00
                  </button>
                </div>
                <h3 className="align-left">AFTERNOON</h3>
                <div className="time-slots">
                  <button
                    className={`time-slot ${selectedTimeSlot === "12:30-13:00" ? "active" : ""}`}
                    onClick={() => handleTimeSlotSelect("12:30-13:00")}
                  >
                    12:30-13:00
                  </button>
                  <button
                    className={`time-slot ${selectedTimeSlot === "13:30-14:00" ? "active" : ""}`}
                    onClick={() => handleTimeSlotSelect("13:30-14:00")}
                  >
                    13:30-14:00
                  </button>
                </div>
                <h3 className="align-left">EVENING</h3>
                <p>No slots available</p>
              </div>
              <button className="continue-button" onClick={handleConfirmAppointment}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
