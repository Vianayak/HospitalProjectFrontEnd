import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import "./BookAvailability.css";

const BookAvailability = ({ onClose, fetchBookedSlotsOnOpen }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotDuration, setSlotDuration] = useState(20);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);

  const timeRanges = {
    Morning: [10, 12],
    Afternoon: [13, 15],
    Evening: [16, 18],
  };

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      try {
        setDoctorDetails(JSON.parse(storedDoctorDetails));
      } catch (error) {
        console.error("Error parsing doctor details:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (doctorDetails && fetchBookedSlotsOnOpen) {
      fetchBookedSlots();
    }
  }, [doctorDetails, fetchBookedSlotsOnOpen]);

  const docRegNum = doctorDetails?.regestrationNum || "UNKNOWN";

  const handleDateChange = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    setSelectedDates((prev) =>
      prev.some((d) => d.getTime() === localDate.getTime())
        ? prev.filter((d) => d.getTime() !== localDate.getTime())
        : [...prev, localDate]
    );

    setSelectedDate(localDate);
    setSelectedTimes([]);
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

    let slotData = selectedDates.flatMap((date) =>
      selectedTimes.map((time) => ({
        slot: time,
        time: time,
        date: date.toLocaleDateString("en-CA"),
        docRegNum: docRegNum,
      }))
    );

    fetch("http://localhost:8081/api/doctor-slots/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slotData),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Availability booked successfully!");
        onClose();
        fetchBookedSlots();
      })
      .catch(() => toast.error("Failed to book availability."));
  };

  const fetchBookedSlots = () => {
    fetch(`http://localhost:8081/api/doctor-slots/get/${docRegNum}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedSlots = {};
        data.forEach((slot) => {
          let formattedDate = slot.date;
          if (!formattedSlots[formattedDate]) formattedSlots[formattedDate] = [];
          formattedSlots[formattedDate].push(slot.time);
        });
        setBookedSlots(formattedSlots);
      })
      .catch((error) => console.error("Error fetching booked slots:", error));
  };

  const getTimeInMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isOverlapping = (newSlot, bookedSlots) => {
    const [newStart, newEnd] = newSlot.split("-").map(getTimeInMinutes);

    return bookedSlots.some((bookedSlot) => {
      const [bookedStart, bookedEnd] = bookedSlot.split("-").map(getTimeInMinutes);
      return (
        (newStart >= bookedStart && newStart < bookedEnd) ||
        (newEnd > bookedStart && newEnd <= bookedEnd) ||
        (newStart <= bookedStart && newEnd >= bookedEnd)
      );
    });
  };

  const generateTimeSlots = (startHour, endHour, duration) => {
    let slots = [];
    let selectedDateFormatted = selectedDate ? selectedDate.toLocaleDateString("en-CA") : null;
    let bookedForDate = bookedSlots[selectedDateFormatted] || [];
  
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
  
        let isBooked = bookedForDate.includes(timeSlot);
        
        // **Check if the slot overlaps with any booked or selected time slots**
        let isBlocked = isOverlapping(timeSlot, bookedForDate) || isOverlapping(timeSlot, selectedTimes);
  
        slots.push({ timeSlot, isBooked, isBlocked });
      }
    }
    return slots;
  };
  

  return (
    <div className="appointment-overlay">
      <div className="appointment-popup">
        <h2 className="appointment-header">
          Welcome {doctorDetails ? `Dr. ${doctorDetails.name}` : "Doctor"}
        </h2>

        <div className="content">
          <div className="calendar-section">
            <label>Select a Date:</label>
            <Calendar
              onChange={handleDateChange}
              minDate={new Date()}
              tileClassName={({ date }) =>
                selectedDates.some((d) => d.getTime() === date.getTime()) ? "selected-date" : ""
              }
              value={selectedDates}
            />
          </div>

          <div className="appointment-details">
            <label>Slot Duration:</label>
            <select value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))}>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>

            <div className="appointment-time-buttons">
              {Object.entries(timeRanges).map(([timeRangeKey, [startHour, endHour]]) => (
                <div key={timeRangeKey}>
                  <strong>{timeRangeKey}</strong>
                  <div className="slot-grid">
                    {generateTimeSlots(startHour, endHour, slotDuration).map(({ timeSlot, isBooked, isBlocked }) => (
                      <button
                        key={timeSlot}
                        className={`time-slot ${isBooked ? "booked" : ""} ${isBlocked ? "blocked" : ""} ${selectedTimes.includes(timeSlot) ? "selected" : ""}`}
                        onClick={() =>
                          !isBooked && !isBlocked &&
                          setSelectedTimes((prev) =>
                            prev.includes(timeSlot) ? prev.filter((t) => t !== timeSlot) : [...prev, timeSlot]
                          )
                        }
                        disabled={isBooked || isBlocked}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="calendar-buttons">
              <button onClick={handleBooking} className="appointment-save">Confirm</button>
              <button onClick={onClose} className="appointment-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookAvailability;
