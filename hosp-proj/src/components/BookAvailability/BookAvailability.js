import React, { useState, useEffect } from "react";
import "./BookAvailability.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAvailability = ({ onClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [slotDuration, setSlotDuration] = useState("20");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      try {
        const parsedDoctorDetails = JSON.parse(storedDoctorDetails);
        setDoctorDetails(parsedDoctorDetails);
        console.log("Doctor Details from LocalStorage:", parsedDoctorDetails);
      } catch (error) {
        console.error("Error parsing doctor details from localStorage:", error);
      }
    } else {
      console.warn("No doctor details found in localStorage");
    }
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);
  

  let docRegNum = doctorDetails?.regestrationNum || "UNKNOWN";

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

  const generateTimeSlots = (timeRange, duration) => {
    let slots = [];
    let [startHour, endHour] = timeRange; 
  
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += duration) {
        let start = `${hour}:${String(minutes).padStart(2, "0")}`;
  
        let endHourCalc = hour;
        let endMin = minutes + duration;
  
        if (endMin >= 60) {
          endMin -= 60;
          endHourCalc += 1;
        }
  
        let end = `${endHourCalc}:${String(endMin).padStart(2, "0")}`;
        slots.push(`${start}-${end}`);
      }
    }
  
    return slots;
  };
  
  
  
  const handleBooking = () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date.");
      return;
    }
    if (selectedTimes.length === 0) {
      toast.error("Please select at least one time slot.");
      return;
    }
    
    // Ensure slotDuration is valid
    const slotDur = Number(slotDuration);
    if (isNaN(slotDur) || slotDur <= 0) {
      toast.error("Invalid slot duration. Please select a valid option.");
      return;
    }
  
    // Time ranges mapping
    const timeRanges = {
      Morning: [9, 12], // 9 AM - 12 PM
      Afternoon: [14, 17], // 2 PM - 5 PM
      Evening: [19, 22], // 7 PM - 10 PM
    };
  
    let slotData = [];
  
    selectedDates.forEach((date) => {
      selectedTimes.forEach((time) => {
        let slots = generateTimeSlots(timeRanges[time], slotDur);
        slots.forEach((slot) => {
          slotData.push({
            slot: time.toUpperCase(),
            time: slot,
            date: date,
            docRegNum: docRegNum,
          });
        });
      });
    });
  
    console.log("Final Slots Data:", slotData);
  
    fetch("http://localhost:8081/api/doctor-slots/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slotData),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Availability booked successfully!");
        console.log("Response:", data);
        onClose();
      })
      .catch((error) => {
        console.error("Error saving availability:", error);
        toast.error("Failed to book availability.");
      });
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
