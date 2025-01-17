import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./DoctorCards.css";
import OtpPopup from "../Popup/OtpPopup";
import SchedulePopup from "../Popup/SchedulePopup";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [date, setDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [countdown, setCountdown] = useState(30); // Initialize countdown state
  const [canResendOtp, setCanResendOtp] = useState(true); // To manage OTP resend functionality
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/doctors/doctor-schedule?regNum=${doctor.regestrationNum}`
        );
        if (Array.isArray(response.data)) {
          setBlockedSlots(response.data);
        } else {
          console.warn("Expected an array, but got", response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor schedule:", error);
      }
    };

    fetchDoctorSchedule();
  }, [doctor.regestrationNum]);

  const isSlotBlocked = (slotTime) => {
    return blockedSlots.some(item => item.date === date && item.time === slotTime);
  };

  const handleBookAppointment = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");  // Clear email when closing the popup
  };

  const handleSendOtp = async () => {
    if (!email) return;
    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP.");
      }
      setCanResendOtp(false); // Disable resend button until countdown is finished
      startCountdown();
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const startCountdown = () => {
    setCountdown(30); // Reset countdown to 30 seconds
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResendOtp(true); // Enable resend button after countdown finishes
        }
        return prev - 1;
      });
    }, 1000); // Countdown in seconds
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return; // Do not send OTP if the button is disabled
    await handleSendOtp();
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      const response = await axios.post("http://localhost:8081/api/otp/verifyOtp", null, {
        params: { email, otp }
      });
      setShowPopup(false);
      setShowSchedulePopup(true);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleConfirmAppointment = () => {
    if (date && selectedTimeSlot) {
      const timeOfDay = getTimeOfDay(selectedTimeSlot);
      navigate("/user-appointment", {
        state: { date, timeSlot: selectedTimeSlot, email, doctorDetails: doctor, timeOfDay }
      });
    } else {
      alert("Please select a date and time slot.");
    }
  };

  const getTimeOfDay = (timeSlot) => {
    const morningSlots = ["11:00-11:30", "11:30-12:00"];
    const afternoonSlots = ["12:30-13:00", "13:30-14:00"];
    const eveningSlots = ["15:00-15:30", "15:30-16:00"];
    if (morningSlots.includes(timeSlot)) return "MORNING";
    if (afternoonSlots.includes(timeSlot)) return "AFTERNOON";
    if (eveningSlots.includes(timeSlot)) return "EVENING";
    return "unknown";
  };

  return (
    <>
      <div className="content-wrapper1">
        <div className="doctor-card">
          <div className="doctor-image">
            <img src={`http://localhost:8081/${doctor.imagePath}`} alt={doctor.name} />
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-speciality">Specialization: {doctor.specialization}</p>
            <p className="doctor-experience">Experience: {doctor.experience} years</p>
            <p className="doctor-languages">Languages: {doctor.languages.join(", ")}</p>
            <p className="doctor-location">Location: {doctor.location}</p>
            <p className="doctor-availability">Availability: {doctor.availability}</p>
            <button className="book-appointment-button" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <OtpPopup
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          handleSendOtp={handleSendOtp}
          handleResendOtp={handleResendOtp}
          handleVerifyOtp={handleVerifyOtp}
          handleClosePopup={handleClosePopup}
          countdown={countdown} // Pass countdown state to show timer in OtpPopup
        />
      )}

      {showSchedulePopup && (
        <SchedulePopup
          date={date}
          setDate={setDate}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          isSlotBlocked={isSlotBlocked}
          handleConfirmAppointment={handleConfirmAppointment}
          handleClosePopup={handleClosePopup}
          setShowSchedulePopup={setShowSchedulePopup}
        />
      )}
    </>
  );
};

export default DoctorCard;
