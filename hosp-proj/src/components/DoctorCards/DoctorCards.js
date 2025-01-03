import React, { useState } from "react";
import "./DoctorCards.css";
import "./PopupStyles.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [startDate, setStartDate] = useState(new Date()); // Start date for the schedule popup
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month for calendar
  const [showCalendar, setShowCalendar] = useState(false); // To control the visibility of the calendar
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Selected time slot
  const [confirmedMessage, setConfirmedMessage] = useState(""); // Confirmation message

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

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev); // Toggle calendar visibility
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Hide calendar after selecting a date
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot); // Store the selected time slot
  };

  const handleConfirmAppointment = () => {
    setConfirmedMessage(`Your appointment is confirmed for ${selectedDate.toDateString()} at ${selectedTimeSlot}.`);
    setTimeout(() => setConfirmedMessage(""), 5000); // Clear message after 5 seconds
    setSelectedTimeSlot(null); // Reset time slot selection
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>&lt;</button>
          <span>{currentMonth.toLocaleString("default", { month: "short", year: "numeric" })}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>&gt;</button>
        </div>
        <div className="calendar-body">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">  
              {week.map((day, dayIndex) => (
                <button
                  key={dayIndex}
                  className={`calendar-day ${day ? "" : "empty"}`}
                  onClick={() =>
                    day && handleDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                  }
                >
                  {day || ""}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
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
            <p className="doctor-experience">{doctor.experience} years of experience</p>
            <p className="doctor-location">{doctor.location}</p>
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
              <input
                type="email"
                className="popup-input"
                placeholder="What is your email?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!showOtpForm ? (
                <button className="popup-button" onClick={handleSendOtp}>
                  Send OTP
                </button>
              ) : (
                <>
                  <input type="text" className="popup-input" placeholder="Enter OTP" />
                  <button className="popup-button" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showSchedulePopup && (
        <div className="popup-overlay">
          <div className="popup-container schedule-popup">
            <button className="popup-close" onClick={() => setShowSchedulePopup(false)}>
              &times;
            </button>
            <div className="schedule-header">
              <button className="calendar-icon" onClick={handleCalendarToggle}>
                <FaCalendarAlt />
              </button>
              {showCalendar && renderCalendar()}
            </div>
            <div className="schedule-body">
              <h3>Time Slots for {selectedDate.toDateString()}</h3>
              <div className="time-slots">
                {["10:00-10:30", "11:00-11:30", "12:00-12:30"].map((slot) => (
                  <button key={slot} className={`time-slot ${selectedTimeSlot === slot ? "active" : ""}`} onClick={() => handleTimeSlotClick(slot)}>
                    {slot}
                  </button>
                ))}
              </div>
              {selectedTimeSlot && (
                <button className="confirm-button" onClick={handleConfirmAppointment}>
                  OK
                </button>
              )}
              {confirmedMessage && <p className="confirmation-message">{confirmedMessage}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
