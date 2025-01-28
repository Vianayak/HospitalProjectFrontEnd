import React, { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";
import HealthcarePortal from "../HealthcarePortal/HealthcarePortal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({selectedDate, setSelectedDate}) => {
  const [appointments, setAppointments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [showPopup, setShowPopup] = useState(false); 

  const prevDateRef = useRef(null);


  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

  useEffect(() => {
    // Skip if selected date has not changed
    if (prevDateRef.current && prevDateRef.current === selectedDate.toISOString()) {
      return;
    }

    if (doctorDetails && selectedDate) {
      fetchAppointments(selectedDate)
        .then((appointmentsData) => {
          setAppointments(appointmentsData);
        })
        .catch((error) => console.error("Error fetching appointments:", error));
    }

    // Update previous date
    prevDateRef.current = selectedDate.toISOString();
  }, [doctorDetails, selectedDate]);


  useEffect(() => {
    if (doctorDetails && selectedDate) {
      fetchEarnings(selectedDate);
    }
  }, [doctorDetails, selectedDate]);

  

  const fetchAppointments = async (date) => {
    // Use local date instead of converting it to UTC
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const doctorRegNum = doctorDetails.regestrationNum;
    console.log(formattedDate, doctorRegNum);
  
    const apiUrl = `http://localhost:8081/api/book-appointment/appointments-for-date?date=${formattedDate}&doctorRegNum=${doctorRegNum}`;
  
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
    throw new Error("Failed to fetch appointments");
  };
  

  const fetchEarnings = async (date) => {
    try {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const doctorRegNum = doctorDetails.regestrationNum;
      const apiUrl = `http://localhost:8081/api/book-appointment/earnings?date=${formattedDate}&doctorRegNum=${doctorRegNum}`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setTotalEarnings(data.totalEarnings || 0);
        setTodayEarnings(data.todayEarnings || 0);
      } else {
        throw new Error("Failed to fetch earnings");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  // Data for the donut chart
  const chartData = {
    labels: ["Today's Earnings", "Total Earnings"],
    datasets: [
      {
        data: [todayEarnings, totalEarnings],
        backgroundColor: ["#fde047", "#2563eb"],
        hoverBackgroundColor: ["#facc15", "#1d4ed8"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="dashboard-container">
      {/* Patients Summary Section */}
      <div className="patients-summary">
        <h5>Earnings Summary</h5>
        <div className="chart-container">
          <div className="donut-chart">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        <div>
          <ul className="legend">
            <li>
              <span className="legend-color new-patients"></span> Today's Earnings
            </li>
            <li>
              <span className="legend-color old-patients"></span> Total Earnings
            </li>
          </ul>
        </div>
      </div>

      {/* Today Appointment Section */}
      <div className="today-appointment">
        <h5>Today Appointment</h5>
        <div className="appointment-header">
          <span className="header-diagnosis">Name/Diagnosis</span>
          <span className="header-time">Time</span>
         
        </div>

        {/* Show loading message if appointments are being fetched */}
        <ul className="appointment-list">
          {appointments.slice(0, 3).map((patient) => (
            <li key={patient.appointmentId}>
              <div>
                <h4>
                  {patient.firstName} {patient.lastName}
                </h4>
                <p>{patient.issue}</p>
              </div>
              <div>
                <h4>
                  {patient.time}
                  </h4>
              </div>
            </li>
          ))}
        </ul>

        {/* Conditionally render the "See All" link if more than 3 appointments */}
        {appointments.length > 3 && (
          <p className="see-all" onClick={() => setShowPopup(true)}>
            See All
          </p>
        )}
      </div>

      <HealthcarePortal setSelectedDate={setSelectedDate} />


     {/* Popup for all appointments */}
{showPopup && (
  <div className="popup-overlay1" onClick={() => setShowPopup(false)}>
    <div className="popup-container1" onClick={(e) => e.stopPropagation()}>
      <h3>All Appointments</h3>
      <ul className="popup-appointment-list1">
        {appointments.map((patient) => (
          <li key={patient.appointmentId}>
            <div className="appointment-row">
              <label>Name:</label>
              <span>{`${patient.firstName} ${patient.lastName}`}</span>
            </div>
            <div className="appointment-row">
              <label>Diagnosis:</label>
              <span>{patient.issue}</span>
            </div>
            <div className="appointment-row">
              <label>Time:</label>
              <span>{patient.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <button className="close-button1" onClick={() => setShowPopup(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
