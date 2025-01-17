import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OtpPopup from "../Popup/OtpPopup";
import SchedulePopup from "../Popup/SchedulePopup";
import "./DoctorGrid.css";
import axios from 'axios';

const DoctorGrid = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctordetails,setDoctorDetails] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [blockedSlots, setBlockedSlots] = useState([]);

  const navigate = useNavigate();

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
  const handleClosePopup = () => { setShowPopup(false); };

  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const handleConfirmAppointment = () => { if (date && selectedTimeSlot) {
    const timeOfDay = getTimeOfDay(selectedTimeSlot);
    navigate("/user-appointment", {
      state: { date, timeSlot: selectedTimeSlot, email, doctorDetails: doctordetails, timeOfDay }
    });
  } else {
    alert("Please select a date and time slot.");
  } };


  const getTimeOfDay = (timeSlot) => {
    const morningSlots = ["11:00-11:30", "11:30-12:00"];
    const afternoonSlots = ["12:30-13:00", "13:30-14:00"];
    const eveningSlots = ["15:00-15:30", "15:30-16:00"];
    if (morningSlots.includes(timeSlot)) return "MORNING";
    if (afternoonSlots.includes(timeSlot)) return "AFTERNOON";
    if (eveningSlots.includes(timeSlot)) return "EVENING";
    return "unknown";
  };

  const handleCloseSchedulePopup = () => { setShowSchedulePopup(false); };

  // Fetching the doctors list from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/doctors/doctors-list");
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoctors();
  }, []);

  // Open modal and set the selected doctor's details
  const handleViewDetails = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleBookAppointment = async (doctor) => {
    setDoctorDetails(doctor);
    setShowPopup(true);
    console.log(doctor);

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

  const isSlotBlocked = (slotTime) => {
    return blockedSlots.some(item => item.date === date && item.time === slotTime);
  };

  return (
    <>
      <header>
        <h1>Available Doctors</h1>
      </header>
      <div className="doctor-grid">
        {error && <p className="error-message">Error: {error}</p>}
        {doctors.length === 0 && !error ? (
          <p>Loading...</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-cards">
              <div className="doctor-image">
                {/* Dynamically set image source from the backend */}
                <img src={`http://localhost:8081/${doctor.imagePath}`} alt={doctor.name} />
              </div>
              <h3>{doctor.name}</h3>
              <p>Specialization: {doctor.specialization}</p>
              <p>Location: {doctor.location}</p>
              <div className="doctor-buttons">
                <button onClick={() => handleViewDetails(doctor)}>View Details</button>
                <button onClick={() => handleBookAppointment(doctor)}>
              Book Appointment
            </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Doctor Details */}
      {isModalOpen && selectedDoctor && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>×</span>
            <h2>Doctor Details</h2>
            <div className="doctor-detail">
              <div className="doctor-image">
                {/* Dynamically set image source from the backend */}
                <img src={`http://localhost:8081/${selectedDoctor.imagePath}`} alt={selectedDoctor.name} />
              </div>
              <div className="doctor-info">
                <h3>{selectedDoctor.name}</h3>
                <p>Specialization: {selectedDoctor.specialization}</p>
                <p>Languages: {selectedDoctor.languages.join(", ")}</p>
                <p>Location: {selectedDoctor.location}</p>
                <p>Registration Number: {selectedDoctor.regestrationNum}</p>
              </div>
            </div>
          </div>
        </div>
      )}
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


export default DoctorGrid;
