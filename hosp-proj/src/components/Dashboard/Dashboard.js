import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ selectedDate }) => {
  const [appointments, setAppointments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);

  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

  useEffect(() => {
    if (doctorDetails && selectedDate) {
      const today = new Date();
      fetchAppointments(selectedDate)
        .then((appointmentsData) => {
          setAppointments(appointmentsData);
        })
        .catch((error) => console.error("Error fetching appointments:", error))
    }
  }, [doctorDetails]);

  useEffect(() => {
    if (doctorDetails && selectedDate) {
      const today = new Date();
      fetchEarnings(selectedDate);
    }
  }, [doctorDetails]);

  const fetchAppointments = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
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
<<<<<<< HEAD
        data: [40, 60, 100], // Example data
        backgroundColor: ["#c4b5fd", "#fde047", "#5A3ECA"],
        hoverBackgroundColor: ["#a78bfa", "#facc15", "#1d4ed8"],
=======
        data: [todayEarnings, totalEarnings],
        backgroundColor: ["#fde047", "#2563eb"],
        hoverBackgroundColor: ["#facc15", "#1d4ed8"],
>>>>>>> 3b04b84a6613dd6337e38ca1e085c5f2457f535a
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
            {appointments.map((patient) => (
              <li key={patient.appointmentId}>
                <div>
                  <h4>{patient.firstName} {patient.lastName}</h4>
                  <p>{patient.issues.join(", ")}</p>
                </div>
                <span className={patient.status === "On Going" ? "status ongoing" : "time"}>
                  {patient.time}
                </span>
              </li>
            ))}
          </ul>
        <p className="see-all">See All</p>
      </div>

    </div>
  );
};

export default Dashboard;
