import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";
import HealthcarePortal from "../HealthcarePortal/HealthcarePortal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [showPopup, setShowPopup] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(new Date());


  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

  useEffect(() => {
    if (doctorDetails && selectedDate) {
      fetchAppointments(selectedDate)
        .then((appointmentsData) => {
          setAppointments(appointmentsData);
        })
        .catch((error) => console.error("Error fetching appointments:", error));
    }
  }, [doctorDetails, selectedDate]);

  useEffect(() => {
    if (doctorDetails && selectedDate) {
      fetchEarnings(selectedDate);
    }
  }, [doctorDetails, selectedDate]);

  const fetchAppointments = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const doctorRegNum = doctorDetails.regestrationNum;
    const apiUrl = `http://localhost:8081/api/book-appointment/appointments-with-issues-accepted?date=${formattedDate}&doctorRegNum=${doctorRegNum}`;

    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error("Failed to fetch appointments");
  };

  const fetchEarnings = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
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
                <p>{patient.issues.join(", ")}</p>
              </div>
              <span
                className={patient.status === "On Going" ? "status ongoing" : "time"}
              >
                {patient.time}
              </span>
              <span
                className={patient.paymentstatus === "Paid" ? "status Paid" : "Not Paid"}
              >
                {patient.paymentstatus}
              </span>
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
              <span>{patient.issues.join(", ")}</span>
            </div>
            <div className="appointment-row">
              <label>Time:</label>
              <span>{patient.time}</span>
            </div>
            <div className="appointment-row">
              <label>Payment Status:</label>
              <span>{patient.paymentstatus}</span>
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
