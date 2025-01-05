import React, { useState } from "react";
import "./DoctorCards.css";
import "./PopupStyles.css";

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentMessage, setAppointmentMessage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  
  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setDate(event.target.value);
    setSelectedDate(selectedDate); // Update selected date when input date changes
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

  const handleSendOtp = () => {
    setShowOtpForm(true);
  };

  const handleVerifyOtp = () => {
    setShowPopup(false);
    setShowSchedulePopup(true);
  };

  // Generate 5 consecutive dates starting from `startDate`
  const generateDates = (start) => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Format date to "Day DD MMM"
  const formatDate = (date) => {
    const options = { day: "2-digit", weekday: "short", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleNextDates = () => {
    const nextStartDate = new Date(startDate);
    nextStartDate.setDate(startDate.getDate() + 5);
    setStartDate(nextStartDate);
  };

  const handlePreviousDates = () => {
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 5);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (previousStartDate >= today) {
      setStartDate(previousStartDate);
    }
  };

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedTime) {
      setAppointmentMessage(
        `Your appointment has been booked for ${formatDate(new Date(selectedDate))} at ${selectedTime}.`
      );
    } else {
      setAppointmentMessage("Please select both a date and a time slot.");
    }
  };

  return (
    <>
      <div className="content-wrapper">
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
              <div className="schedule-header">
                <button className="arrow-button" onClick={handlePreviousDates}>
                  &lt;
                </button>
                <div className="dates">
                  {generateDates(startDate).map((date, index) => (
                    <button
                      key={index}
                      className={`date ${selectedDate?.getTime() === date.getTime() ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setDate(date.toISOString().split("T")[0]); // Set the date in input field format
                      }}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
                <button className="arrow-button" onClick={handleNextDates}>
                  &gt;
                </button>
              </div>

              <div>
                <label htmlFor="date">Choose a date:</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleDateChange}
                />
                <p className="selected-date">Selected Date: {date}</p>
              </div>

              <div className="schedule-body">
  <h3>MORNING</h3>
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
  <h3>AFTERNOON</h3>
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
    <button
      className={`time-slot ${selectedTimeSlot === "14:30-15:00" ? "active" : ""}`}
      onClick={() => handleTimeSlotSelect("14:30-15:00")}
    >
      14:30-15:00
    </button>
    <button
      className={`time-slot ${selectedTimeSlot === "15:30-16:00" ? "active" : ""}`}
      onClick={() => handleTimeSlotSelect("15:30-16:00")}
    >
      15:30-16:00
    </button>
    <button
      className={`time-slot ${selectedTimeSlot === "16:30-17:00" ? "active" : ""}`}
      onClick={() => handleTimeSlotSelect("16:30-17:00")}
    >
      16:30-17:00
    </button>
  </div>
  <h3>EVENING</h3>
  <p>No slots available</p>
</div>

              <button className="continue-button" onClick={handleConfirmAppointment}>
                Confirm Appointment
              </button>

              {appointmentMessage && <p className="appointment-message">{appointmentMessage}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
