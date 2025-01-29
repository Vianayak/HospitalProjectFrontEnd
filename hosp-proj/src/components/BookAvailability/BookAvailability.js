import React, { useState, useEffect } from "react";
import "./BookAvailability.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAvailability = ({ onClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [slotDuration, setSlotDuration] = useState("15");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: firstDay }, () => null);

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      daysArray.push(day.toISOString().split("T")[0]);
    }
    setCalendarDays(daysArray);
  };

  const handleDateSelection = (date) => {
    if (!date) return;

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      // Disable past date selection
      toast.error("You cannot select past dates.");
      return;
    }

    setSelectedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date) // Remove if already selected
        : [...prevDates, date] // Add if not selected
    );
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(currentYear, currentMonth + increment);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleBooking = () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date.");
      return;
    }
    toast.success(
      `Availability booked for ${selectedDates.join(", ")} with ${slotDuration}-minute slots.`
    );
    onClose();
  };

  return (
    <div className="appointment-overlay">
      <div className="appointment-popup">
        <h2 className="appointment-header">
          Welcome {doctorDetails ? `Dr. ${doctorDetails.name}` : "Doctor"}
        </h2>

        <div className="content">
          {/* Calendar Section */}
          <div className="appointment-calendar">
            <div className="appointment-calendar-header">
              <button onClick={() => handleMonthChange(-1)}>&lt;</button>
              <span>
                {new Date(currentYear, currentMonth).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {currentYear}
              </span>
              <button onClick={() => handleMonthChange(1)}>&gt;</button>
            </div>

            <div className="appointment-grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}
              {calendarDays.map((date, index) => {
                const isPastDate =
                  date && date < new Date().toISOString().split("T")[0];

                return (
                  <div
                    key={index}
                    className={`day ${
                      isPastDate
                        ? "disabled" // Apply disabled style for past dates
                        : selectedDates.includes(date)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => !isPastDate && handleDateSelection(date)} // Disable click for past dates
                  >
                    {date ? new Date(date).getDate() : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slot Duration Section */}
          <div className="appointment-details">
          <label>Slot Duration:</label>
          <div className="appointment-time-buttons">
              {["Morning", "Afternoon", "Evening"].map(time => (
                <button
                  key={time}
                  className={selectedTimes.includes(time) ? "selected" : ""}
                  onClick={() => setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time])}
                >
                  {time}
                </button>
              ))}
            </div>
          
            <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>
            
            
            <div className="appointment-actions">
              <button onClick={handleBooking} className="appointment-save">Confirm</button>
              <button onClick={onClose} className="appointment-cancel">Cancel</button>
            </div>
         </div>

         </div>
       </div>
       </div>
  );
};

export default BookAvailability;
