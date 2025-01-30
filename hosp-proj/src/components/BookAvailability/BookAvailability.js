import React, { useState, useEffect } from "react";
import "./BookAvailability.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAvailability = ({ onClose }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [slotDuration, setSlotDuration] = useState(20);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});

  const timeRanges = {
    Morning: [10, 12], // 9 AM - 12 PM
    Afternoon: [13, 15], // 1 PM - 3 PM
    Evening: [16, 18], // 4 PM - 6 PM
  };

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      try {
        const parsedDoctorDetails = JSON.parse(storedDoctorDetails);
        setDoctorDetails(parsedDoctorDetails);
      } catch (error) {
        console.error("Error parsing doctor details:", error);
      }
    }
    generateCalendar(currentMonth, currentYear);
    fetchBookedSlots();
  }, [currentMonth, currentYear]);

  const docRegNum = doctorDetails?.regestrationNum || "UNKNOWN";

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
      toast.error("You cannot select past dates.");
      return;
    }

    setSelectedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(currentYear, currentMonth + increment);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const generateTimeSlots = (startHour, endHour, duration, date) => {  
    let slots = [];  
  
    for (let hour = startHour; hour < endHour; hour++) {  
      for (let minutes = 0; minutes < 60; minutes += duration) {  
        let formattedStart = `${hour}:${String(minutes).padStart(2, "0")}`;  
        let endHourCalc = hour;  
        let endMin = minutes + duration;  
  
        if (endMin >= 60) {  
          endMin -= 60;  
          endHourCalc += 1;  
        }  
  
        let formattedEnd = `${endHourCalc}:${String(endMin).padStart(2, "0")}`;  
        let timeSlot = `${formattedStart}-${formattedEnd}`;  
        let isBooked = bookedSlots[date]?.some(slot => slot.time === timeSlot);  
  
        slots.push({ timeSlot, isBooked });  
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

    let slotData = [];

    selectedDates.forEach((date) => {
      selectedTimes.forEach((time) => {
        slotData.push({
          slot: time,
          time: time,
          date: date,
          docRegNum: docRegNum,
        });
      });
    });

    fetch("http://localhost:8081/api/doctor-slots/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slotData),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Availability booked successfully!");
        onClose();
        fetchBookedSlots();
      })
      .catch(() => {
        toast.error("Failed to book availability.");
      });
  };

  const fetchBookedSlots = () => {  
  fetch("http://localhost:8081/api/doctor-slots/getBookedSlots")  
    .then((response) => response.json())  
    .then((data) => {  
      const formattedSlots = {};  
      data.forEach(slot => {  
        const { date, time } = slot; // Assuming each slot has a date and time property  
        if (!formattedSlots[date]) {  
          formattedSlots[date] = [];  
        }  
        formattedSlots[date].push({ time });  
      });  
      setBookedSlots(formattedSlots);  
    })  
    .catch((error) => console.error("Error fetching booked slots:", error));  
};

  return (
    <div className="appointment-overlay">
      <div className="appointment-popup">
        <h2 className="appointment-header">
          Welcome {doctorDetails ? `Dr. ${doctorDetails.name}` : "Doctor"}
        </h2>

        <div className="content">
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
              {calendarDays.map((date, index) => (
                <div
                  key={index}
                  className={`day ${selectedDates.includes(date) ? "selected" : ""}`}
                  onClick={() => handleDateSelection(date)}
                >
                  {date ? new Date(date).getDate() : ""}
                </div>
              ))}
            </div>
          </div>

          <div className="appointment-details">
            <label>Slot Duration:</label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
            >
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>

            <div className="appointment-time-buttons">
              {Object.keys(timeRanges).map((timeRangeKey) => (
                <div key={timeRangeKey}>
                  <strong>{timeRangeKey}</strong>
                  <div className="slot-grid">
                    {generateTimeSlots(
                      timeRanges[timeRangeKey][0],
                      timeRanges[timeRangeKey][1],
                      slotDuration,
                      selectedDates[0]
                    ).map(({ timeSlot, isBooked }) => (
                      <button
                        key={timeSlot}
                        className={`time-slot ${isBooked ? "booked" : ""} ${
                          selectedTimes.includes(timeSlot) ? "selected" : ""
                        }`}
                        onClick={() =>
                          !isBooked &&
                          setSelectedTimes((prev) =>
                            prev.includes(timeSlot)
                              ? prev.filter((t) => t !== timeSlot)
                              : [...prev, timeSlot]
                          )
                        }
                        disabled={isBooked}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleBooking} className="appointment-save">
              Confirm
            </button>
            <button onClick={onClose} className="appointment-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAvailability;
