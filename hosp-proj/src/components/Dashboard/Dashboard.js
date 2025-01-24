import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  const doctorDetails = JSON.parse(localStorage.getItem("doctorDetails"));

  useEffect(() => {
    if (doctorDetails) {
      const today = new Date();
      fetchAppointments(today)
        .then((appointmentsData) => {
          setAppointments(appointmentsData);
        })
        .catch((error) => console.error("Error fetching appointments:", error))
    }
  }, [doctorDetails]);

  const fetchAppointments = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const doctorRegNum = doctorDetails.regestrationNum;
    const apiUrl = `http://localhost:8081/api/book-appointment/appointments-with-issues-accepted?date=2025-02-05&doctorRegNum=${doctorRegNum}`;

    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error("Failed to fetch appointments");
  };

  // Data for the donut chart
  const chartData = {
    labels: ["New Patients", "Old Patients", "Total Patients"],
    datasets: [
      {
        data: [40, 60, 100], // Example data
        backgroundColor: ["#c4b5fd", "#fde047", "#2563eb"],
        hoverBackgroundColor: ["#a78bfa", "#facc15", "#1d4ed8"],
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
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="dashboard-container">
      {/* Patients Summary Section */}
      <div className="patients-summary">
        <h5>Patients Summary December 2021</h5>
        <div className="chart-container">
          <div className="donut-chart">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        <div>
          <ul className="legend">
            <li>
              <span className="legend-color new-patients"></span> New Patients
            </li>
            <li>
              <span className="legend-color old-patients"></span> Old Patients
            </li>
            <li>
              <span className="legend-color total-patients"></span> Total Patients
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

      {/* Next Patient Details Section */}
      <div className="next-patient-details">
        <h3>Next Patient Details</h3>
        <div className="patient-info">
          <img src="/Assets/Images/love.jpeg" alt="Patient" />
          <div>
            <h4>Sanath Deo</h4>
            <p>Health Checkup</p>
          </div>
        </div>
        <ul className="details-list">
          <li><strong>D.O.B:</strong> 15 January 1989</li>
          <li><strong>Sex:</strong> Male</li>
          <li><strong>Weight:</strong> 59 Kg</li>
          <li><strong>Last Appointment:</strong> 15 Dec - 2021</li>
          <li><strong>Height:</strong> 172 cm</li>
          <li><strong>Reg. Date:</strong> 10 Dec 2021</li>
        </ul>
        <div className="tags">
          <span className="tag asthma">Asthma</span>
          <span className="tag hypertension">Hypertension</span>
          <span className="tag fever">Fever</span>
        </div>
        <div className="actions">
          <button className="action-btn">📞 Call</button>
          <button className="action-btn">📄 Document</button>
          <button className="action-btn">💬 Chat</button>
        </div>
        <p className="last-prescriptions">Last Prescriptions</p>
      </div>
    </div>
  );
};

export default Dashboard;
