import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./DoctorCards.css";
import "./PopupStyles.css";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [date, setDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [blockedSlots, setBlockedSlots] = useState([]); // State to store blocked slots
  const [countdown, setCountdown] = useState(10);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const navigate = useNavigate();

  // Fetch the doctor's schedule
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/doctors/doctor-schedule?regNum=${doctor.regestrationNum}`);
        // Ensure response is an array before setting
        if (Array.isArray(response.data)) {
          setBlockedSlots(response.data); // Set the blocked slots data
        } else {
          console.warn("Expected an array, but got", response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor schedule:", error);
      }
    };

    fetchDoctorSchedule();
  }, [doctor.regestrationNum]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    if (isSlotBlocked(timeSlot)) {
      return; // Prevent selecting a blocked slot
    }
    setSelectedTimeSlot(timeSlot);
  };

  const isSlotBlocked = (slotTime) => {
    // Ensure blockedSlots is an array before checking
    if (Array.isArray(blockedSlots)) {
      return blockedSlots.some((item) => item.date === date && item.time === slotTime);
    }
    return false;
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
    console.log("Sending OTP to email:", email);

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
      startCountdown();
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const startCountdown = () => {
    setCountdown(10);
    setCanResendOtp(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResendOtp(true); // Enable resend OTP when countdown finishes
        }
        return prev - 1;
      });
    }, 1000);
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
          otp: otp,
        }
      });
      alert(response.data);
      setShowPopup(false);
      setShowSchedulePopup(true);
    } catch (error) {
      alert(error.response?.data || "Error verifying OTP");
    }
  };

  const handleConfirmAppointment = () => {
    if (date && selectedTimeSlot) {
      navigate("/user-appointment", {
        state: {
          date,
          timeSlot: selectedTimeSlot,
          email, // Pass email from DoctorCard
          doctorDetails: doctor, // Pass doctor details (name, location, etc.)
        },
      });
    } else {
      alert("Please select both a date and a time slot.");
    }
  };

  const handleResendOtp = () => {
    setCountdown(10);
    setCanResendOtp(false);
    handleSendOtp();
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
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="countdown-timer">{countdown > 0 ? `Resend in ${countdown}s` : ""}</div>
                    {canResendOtp && (
                      <a
                        href="#"
                        className="resend-link"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </a>
                    )}
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
                    className={`time-slot ${selectedTimeSlot === "11:00-11:30" ? "active" : ""} ${isSlotBlocked("11:00-11:30") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("11:00-11:30")}
                    disabled={isSlotBlocked("11:00-11:30")}
                  >
                    11:00-11:30
                  </button>
                  <button
                    className={`time-slot ${selectedTimeSlot === "11:30-12:00" ? "active" : ""} ${isSlotBlocked("11:30-12:00") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("11:30-12:00")}
                    disabled={isSlotBlocked("11:30-12:00")}
                  >
                    11:30-12:00
                  </button>
                </div>
                <h3 className="align-left">AFTERNOON</h3>
                <div className="time-slots">
                  <button
                    className={`time-slot ${selectedTimeSlot === "12:30-13:00" ? "active" : ""} ${isSlotBlocked("12:30-13:00") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("12:30-13:00")}
                    disabled={isSlotBlocked("12:30-13:00")}
                  >
                    12:30-13:00
                  </button>
                  <button
                    className={`time-slot ${selectedTimeSlot === "13:30-14:00" ? "active" : ""} ${isSlotBlocked("13:30-14:00") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("13:30-14:00")}
                    disabled={isSlotBlocked("13:30-14:00")}
                  >
                    13:30-14:00
                  </button>
                </div>
                <h3 className="align-left">EVENING</h3>
                <div className="time-slots">
                  <button
                    className={`time-slot ${selectedTimeSlot === "15:30-15:30" ? "active" : ""} ${isSlotBlocked("15:30-15:30") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("15:30-15:30")}
                    disabled={isSlotBlocked("15:30-15:30")}
                  >
                    15:30-15:30
                  </button>
                  <button
                    className={`time-slot ${selectedTimeSlot === "15:30-16:00" ? "active" : ""} ${isSlotBlocked("15:30-16:00") ? "blocked" : ""}`}
                    onClick={() => handleTimeSlotSelect("15:30-16:00")}
                    disabled={isSlotBlocked("15:30-16:00")}
                  >
                    15:30-16:00
                  </button>
                </div>
                <button className="continue-button" onClick={handleConfirmAppointment}>
                  Continue
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
