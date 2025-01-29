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

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay(); // First day of the month (0=Sunday)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
    const currentDate = new Date(); // Get today's date
  
    const daysArray = []; // Start with an empty array
  
    // Fill empty slots for alignment, but don't add extra previous month's dates
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
  
    // Fill actual dates of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      daysArray.push(day.toISOString().split("T")[0]);
    }
  
    setCalendarDays(daysArray);
  };
  
  const handleDateSelection = (date) => {
    if (date && date !== "null") setSelectedDate(date);
  };
  
  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
  
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
  
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  

  const handleBooking = () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }
    toast.success(`Availability booked for ${selectedDate} with ${slotDuration}-minute slots.`);
    onClose();
  };

  return (
    <div className="book-availability-overlay">
      <div className="book-availability-popup">
        <h2>Welcome {doctorDetails ? `Dr. ${doctorDetails.name}` : "Doctor"}</h2>

        {/* Calendar */}
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="month-nav" onClick={() => handleMonthChange(-1)}>&lt;</button>
            <span>
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} - {currentYear}
            </span>
            <button className="month-nav" onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>

          <div className="calendar-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {calendarDays.map((date, index) => (
              <div 
                key={index} 
                className={`calendar-day ${date === selectedDate ? "selected" : ""}`} 
                onClick={() => handleDateSelection(date)}
              >
                {date ? new Date(date).getDate() : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Slot Duration Selection */}
        <label>Select Slot Duration:</label>
        <select onChange={(e) => setSlotDuration(e.target.value)} value={slotDuration} className="book-availability-dropdown">
          <option value="15">15 Minutes</option>
          <option value="20">20 Minutes</option>
          <option value="30">30 Minutes</option>
        </select>

        <div className="book-availability-actions">
          <button onClick={handleBooking} className="book-availability-save-btn">Confirm Availability</button>
          <button onClick={onClose} className="book-availability-cancel-btn">Cancel</button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BookAvailability;
