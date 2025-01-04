import React, { useState } from "react";
import "./DoctorCards.css";
import "./PopupStyles.css";
import { FaCalendarAlt } from 'react-icons/fa'; // Import calendar icon

const DoctorCard = ({ doctor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [startDate, setStartDate] = useState(new Date()); // Start date for the schedule popup
  const [selectedDate, setSelectedDate] = useState(null); // Selected date
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month for calendar
  const [showCalendar, setShowCalendar] = useState(false); // To control the visibility of the calendar


  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
    // Handle Previous Month
    const handlePreviousMonth = () => {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(currentMonth.getMonth() - 1);
      setCurrentMonth(prevMonth);
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

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev); // Toggle calendar visibility
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
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  // Handle Next Dates
  const handleNextDates = () => {
    const nextStartDate = new Date(startDate);
    nextStartDate.setDate(startDate.getDate() + 5);
    setStartDate(nextStartDate);
    
    // Update current month to the next month when moving forward
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Handle Previous Dates
  const handlePreviousDates = () => {
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 5);

    // Ensure we don't navigate to dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for accurate comparison
    if (previousStartDate >= today) {
      setStartDate(previousStartDate);
      
      // Update current month to the previous month when moving backward
      const previousMonth = new Date(currentMonth);
      previousMonth.setMonth(currentMonth.getMonth() - 1);
      setCurrentMonth(previousMonth);
    }
  };

  // Function to render the calendar for the current month
  const renderCalendar = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const weeks = [];
    let currentWeek = [];
    
    // Fill the first week with empty days
    for (let i = 0; i < firstDay.getDay(); i++) {
      currentWeek.push(null); // Empty space for days before the first of the month
    }

    // Add days of the current month
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
          <button className="arrow-button" onClick={handlePreviousMonth}>
            &lt; {/* Left arrow */}
          </button>
          <span>{currentMonth.toLocaleString("default", { month: "short", year: "numeric" })}</span>
          <button className="arrow-button" onClick={handleNextMonth}>
            &gt; {/* Right arrow */}
          </button>
     
        </div>
        <div className="calendar-body">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {week.map((day, dayIndex) => (
                <button
                  key={dayIndex}
                  className={`calendar-day ${day ? "" : "empty"} ${day && day < new Date().getDate() ? "disabled" : ""}`}
                  disabled={day && day < new Date().getDate()}
                  onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
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
            <img src="Assets/Images/Love.jpeg" alt={`${doctor.name}`} />
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-speciality">Specialization:{doctor.specialization}</p>
            <p className="doctor-experience">Experience:{doctor.experience} years of experience</p>
            <p className="doctor-languages">Languages: {doctor.languages.join(", ")}</p>
            <p className="doctor-location">Location:{doctor.location}</p>
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
                      onClick={() => setSelectedDate(date)}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
                <button className="arrow-button" onClick={handleNextDates}>
                  &gt;
                </button>
                <button className="calendar-icon" onClick={handleCalendarToggle}>
                  <FaCalendarAlt /> {/* Calendar Icon */}
                </button>
              </div>
              {/* Show calendar beside the icon when clicked */}
              {showCalendar && (
                <div className="calendar-positioned">
                  {renderCalendar()}
                </div>
              )}
              <div className="schedule-body">
                <h3>MORNING</h3>
                <div className="time-slots">
                  <button className="time-slot">11:00-11:30</button>
                  <button className="time-slot">11:30-12:00</button>
                </div>
                <h3>AFTERNOON</h3>
                <div className="time-slots">
                  <button className="time-slot">12:30-13:00</button>
                  <button className="time-slot">13:30-14:00</button>
                  <button className="time-slot">14:30-15:00</button>
                  <button className="time-slot">15:30-16:00</button>
                  <button className="time-slot">16:30-17:00</button>
                </div>
                <h3>EVENING</h3>
                <p>No slots available</p>
              </div>
              <button className="continue-button">Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;
