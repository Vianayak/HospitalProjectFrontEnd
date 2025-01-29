import React, { useState, useEffect } from "react";
import "./BookAvailability.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAvailability = ({ onClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
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
    if (date) setSelectedDate(date);
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(currentYear, currentMonth + increment);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleBooking = () => {
    if (!selectedDate || selectedTimes.length === 0) {
      toast.error("Please select a date and at least one time slot.");
      return;
    }
    toast.success(`Availability booked for ${selectedDate} with ${slotDuration}-minute slots.`);
    onClose();
  };

  return (
    <div className="appointment-overlay">
      <div className="appointment-popup">
        <h2 className="appointment-header">Welcome {doctorDetails ? `Dr. ${doctorDetails.name}` : "Doctor"}</h2>

        <div className="content">
          {/* Calendar Section */}
          <div className="appointment-calendar">
            <div className="appointment-calendar-header">
              <button onClick={() => handleMonthChange(-1)}>&lt;</button>
              <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}</span>
              <button onClick={() => handleMonthChange(1)}>&gt;</button>
            </div>

            <div className="appointment-grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
              {calendarDays.map((date, index) => (
                <div
                  key={index}
                  className={`day ${date === selectedDate ? "selected" : ""} ${date === new Date().toISOString().split("T")[0] ? "today" : ""} ${date === null ? "empty" : ""}`}
                  onClick={() => handleDateSelection(date)}
                >
                  {date ? new Date(date).getDate() : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Slot Duration and Time Selection */}
          <div className="appointment-details">
            <label>Slot Duration:</label>
            <select value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)}>
              <option value="15">15 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>
            
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

            <div className="appointment-actions">
              <button onClick={handleBooking} className="appointment-save">Confirm</button>
              <button onClick={onClose} className="appointment-cancel">Cancel</button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BookAvailability;
