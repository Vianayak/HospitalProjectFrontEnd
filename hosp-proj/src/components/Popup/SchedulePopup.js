import React from "react";
import "./PopupStyles.css";

const SchedulePopup = ({
  date,
  setDate, // Receiving the setDate function as a prop
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
    setDate(e.target.value); // Update the date state in the parent component
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
              value={date} // This value is coming from the parent component's state
              onChange={handleDateChange} // This updates the state when the user selects a date
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
                className={`time-slot ${selectedTimeSlot === "15:00-15:30" ? "active" : ""} ${isSlotBlocked("15:00-15:30") ? "blocked" : ""}`}
                onClick={() => handleTimeSlotSelect("15:00-15:30")}
                disabled={isSlotBlocked("15:00-15:30")}
              >
                15:00-15:30
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
  );
};

export default SchedulePopup;
