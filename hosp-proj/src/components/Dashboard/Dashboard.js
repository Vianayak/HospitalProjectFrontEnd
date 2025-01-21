import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Import the Doughnut chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js modules
import './Dashboard.css'; // Import the CSS file

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Data for the donut chart
  const chartData = {
    labels: ["New Patients", "Old Patients", "Total Patients"],
    datasets: [
      {
        data: [40, 60, 100], // Example data
        backgroundColor: ["#c4b5fd", "#fde047", "#2563eb"], // Colors for chart sections
        hoverBackgroundColor: ["#a78bfa", "#facc15", "#1d4ed8"], // Hover colors
      },
    ],
  };
  const patients = [
    {
      id: 1,
      name: "M.J. Mical",
      diagnosis: "Health Checkup",
      status: "On Going",
      time: null, // No time for ongoing status
      image: "/Assets/Images/love.jpeg",
    },
    {
      id: 2,
      name: "Sanath Deo",
      diagnosis: "Health Checkup",
      status: "12:30 PM",
      time: "12:30 PM",
      image: "/Assets/Images/love.jpeg",
    },
    {
      id: 3,
      name: "Loeara Phanj",
      diagnosis: "Report",
      status: "01:00 PM",
      time: "01:00 PM",
      image: "/Assets/Images/love.jpeg",
    },
    {
      id: 4,
      name: "Komola Haris",
      diagnosis: "Common Cold",
      status: "01:30 PM",
      time: "01:30 PM",
      image: "/Assets/Images/love.jpeg",
    },
  ];
  // Options for the donut chart
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the built-in legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    cutout: "70%", // Adjusts the donut's thickness
  };

  return (
    <div className="dashboard-container">
      {/* Patients Summary Section */}
      <div className="patients-summary">
      <h5>Patients Summary December 2021</h5>

      <div className="chart-container">
        <div className="donut-chart">
          {/* Render the Doughnut chart */}
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

      {/* Table-like header */}
      <div className="appointment-header">
        <span className="header-patient">Patient</span>
        <span className="header-diagnosis">Name/Diagnosis</span>
        <span className="header-time">Time</span>
      </div>

      <ul className="appointment-list">
        {patients.map((patient) => (
          <li key={patient.id}>
            <img src={patient.image} alt={`${patient.name}`} />
            <div>
              <h4>{patient.name}</h4>
              <p>{patient.diagnosis}</p>
            </div>
            <span
              className={patient.status === "On Going" ? "status ongoing" : "time"}
            >
              {patient.status}
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
