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
  availableSlots,
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
        <button className="popup-close" onClick={() => setShowSchedulePopup(false)}>&times;</button>
        <div className="schedule-content">
          <h3>Schedule Your Appointment Timing</h3>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <div className="time-slots">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <button
                  key={slot}
                  className={`time-slot ${selectedTimeSlot === slot ? "active" : ""} ${isSlotBlocked(slot) ? "blocked" : ""}`}
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={isSlotBlocked(slot)}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p>No slots available for the selected date.</p>
            )}
          </div>

          <button className="continue-button" onClick={handleConfirmAppointment}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePopup;
