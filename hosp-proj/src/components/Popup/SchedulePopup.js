import React from "react";
import "./PopupStyles.css";

const SchedulePopup = ({
  date,
  setDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  isSlotBlocked,
  handleConfirmAppointment,
  handleClosePopup,
  setShowSchedulePopup,
}) => {
  const handleTimeSlotSelect = (timeSlot) => {
    if (isSlotBlocked(timeSlot)) {
      return;
    }
    setSelectedTimeSlot(timeSlot);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Get the current time in HH:MM format
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  // Function to check if a time slot should be disabled
  const isTimeSlotDisabled = (timeSlot) => {
    const [start, end] = timeSlot.split("-").map((time) => {
      const [hour, minutes] = time.split(":").map(Number);
      return hour * 60 + minutes; // Convert to minutes
    });

    // Disable if the slot is before the current time and the selected date is today
    if (date === today && end <= currentTimeInMinutes) {
      return true;
    }

    // Disable if the slot is blocked
    return isSlotBlocked(timeSlot);
  };

  return (
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
              min={today} // Disable past dates
            />
          </div>

          <div className="schedule-body">
            {/* Morning slots */}
            <h3 className="align-left">MORNING</h3>
            <div className="time-slots">
              <button
                className={`time-slot ${
                  selectedTimeSlot === "11:00-11:30" ? "active" : ""
                } ${isTimeSlotDisabled("11:00-11:30") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("11:00-11:30")}
                disabled={isTimeSlotDisabled("11:00-11:30")}
              >
                11:00-11:30
              </button>
              <button
                className={`time-slot ${
                  selectedTimeSlot === "11:30-12:00" ? "active" : ""
                } ${isTimeSlotDisabled("11:30-12:00") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("11:30-12:00")}
                disabled={isTimeSlotDisabled("11:30-12:00")}
              >
                11:30-12:00
              </button>
            </div>
            {/* Repeat similar structure for other time slots */}
            {/* Afternoon slots */}
            <h3 className="align-left">AFTERNOON</h3>
            <div className="time-slots">
              <button
                className={`time-slot ${
                  selectedTimeSlot === "12:30-13:00" ? "active" : ""
                } ${isTimeSlotDisabled("12:30-13:00") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("12:30-13:00")}
                disabled={isTimeSlotDisabled("12:30-13:00")}
              >
                12:30-13:00
              </button>
              <button
                className={`time-slot ${
                  selectedTimeSlot === "13:30-14:00" ? "active" : ""
                } ${isTimeSlotDisabled("13:30-14:00") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("13:30-14:00")}
                disabled={isTimeSlotDisabled("13:30-14:00")}
              >
                13:30-14:00
              </button>
            </div>
            {/* Evening slots */}
            <h3 className="align-left">EVENING</h3>
            <div className="time-slots">
              <button
                className={`time-slot ${
                  selectedTimeSlot === "15:00-15:30" ? "active" : ""
                } ${isTimeSlotDisabled("15:00-15:30") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("15:00-15:30")}
                disabled={isTimeSlotDisabled("15:00-15:30")}
              >
                15:00-15:30
              </button>
              <button
                className={`time-slot ${
                  selectedTimeSlot === "15:30-16:00" ? "active" : ""
                } ${isTimeSlotDisabled("15:30-16:00") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("15:30-16:00")}
                disabled={isTimeSlotDisabled("15:30-16:00")}
              >
                15:30-16:00
              </button>
            </div>
            <button
              className="continue-button"
              onClick={handleConfirmAppointment}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePopup;
