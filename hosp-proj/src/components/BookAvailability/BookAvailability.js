import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookAvailability.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";


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
        const parsedDoctorDetails = JSON.parse(storedDoctorDetails);
        setDoctorDetails(parsedDoctorDetails);
      } catch (error) {
        console.error("Error parsing doctor details:", error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (doctorDetails && fetchBookedSlotsOnOpen) {
      console.log("Fetching booked slots for:", doctorDetails.regestrationNum);
      fetchBookedSlots();
    }
  }, [doctorDetails, fetchBookedSlotsOnOpen]);
  
  
  

  const docRegNum = doctorDetails?.regestrationNum || "UNKNOWN";

  const handleDateChange = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0); // Remove time part
  
    setSelectedDates((prev) =>
      prev.some((d) => d.getTime() === localDate.getTime())
        ? prev.filter((d) => d.getTime() !== localDate.getTime())
        : [...prev, localDate]
    );
  
    setSelectedDate(localDate); // ✅ Update selected date
    setSelectedTimes([]); // ✅ Clear previously selected time slots
  };
  
  
  
  
  const generateTimeSlots = (startHour, endHour, duration) => {
    let slots = [];
    let selectedDateFormatted = selectedDate ? selectedDate.toLocaleDateString("en-CA") : null; // Ensure it's only formatted when selected
  
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
  
        // ✅ Check if the slot is booked **only if a date is selected**
        let isBooked =
          selectedDateFormatted &&
          bookedSlots[selectedDateFormatted]?.some((slot) => slot.time === timeSlot);
  
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
  
    let slotData = selectedDates.flatMap((date) =>
      selectedTimes.map((time) => ({
        slot: time,
        time: time,
        date: date.toLocaleDateString("en-CA"), // Ensures YYYY-MM-DD without shifting
        docRegNum: docRegNum,
      }))
    );
  
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
    fetch(`http://localhost:8081/api/doctor-slots/get/${docRegNum}`)
      .then(response => response.json())
      .then(data => {
        const formattedSlots = {};
  
        data.forEach(slot => {
          let formattedDate = slot.date; // Directly use the API's date format (YYYY-MM-DD)
  
          if (!formattedSlots[formattedDate]) {
            formattedSlots[formattedDate] = [];
          }
  
          formattedSlots[formattedDate].push({ time: slot.time }); // Store time correctly
        });
  
        console.log("reg:", docRegNum);
        console.log("Updated Booked Slots:", formattedSlots);
        setBookedSlots(formattedSlots);
      })
      .catch(error => console.error("Error fetching booked slots:", error));
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
  selected={null} // Since we are selecting multiple dates
  onChange={handleDateChange}
  minDate={new Date()}
  inline
  highlightDates={selectedDates}
/>

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
              {Object.keys(timeRanges).map(timeRangeKey => (
                <div key={timeRangeKey}>
                  <strong>{timeRangeKey}</strong>
                  <div className="slot-grid">
                    {generateTimeSlots(
                      timeRanges[timeRangeKey][0],
                      timeRanges[timeRangeKey][1],
                      slotDuration
                    ).map(({ timeSlot, isBooked }) => (
                      <button
  key={timeSlot}
  className={`time-slot ${isBooked ? "booked" : ""} ${selectedTimes.includes(timeSlot) ? "selected" : ""}`}
  onClick={() =>
    !isBooked &&
    setSelectedTimes(prev =>
      prev.includes(timeSlot) ? prev.filter(t => t !== timeSlot) : [...prev, timeSlot]
    )
  }
  disabled={isBooked} // ✅ Ensures only booked slots for selected date are disabled
>
  {timeSlot}
</button>


                    ))}
                    
                  </div>
                  
                </div>
                
              ))}
              
            </div>

            <div className="calendar-buttons">
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
      <ToastContainer />
    </div>
    
  );
};

export default BookAvailability;
