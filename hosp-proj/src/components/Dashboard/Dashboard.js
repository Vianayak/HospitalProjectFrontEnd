import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Import the Doughnut chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js modules
import './Dashboard.css'; // Import the CSS file

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Data for the donut chart
  const chartData = {
    labels: ['New Patients', 'Old Patients', 'Total Patients'],
    datasets: [
      {
        data: [40, 60, 100], // Example data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for the sections
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Hover colors
      },
    ],
  };

  // Options for the donut chart
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Custom tooltip format
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Patients Summary Section */}
      <div className="patients-summary">
        <h3>Patients Summary December 2021</h3>
        <div className="chart-container">
          <div className="donut-chart">
            {/* Render the Doughnut chart using react-chartjs-2 */}
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <ul className="legend">
            <li><span className="legend-color new-patients"></span> New Patients</li>
            <li><span className="legend-color old-patients"></span> Old Patients</li>
            <li><span className="legend-color total-patients"></span> Total Patients</li>
          </ul>
        </div>
      </div>

      {/* Today Appointment Section */}
      <div className="today-appointment">
        <h3>Today Appointment</h3>
        <ul className="appointment-list">
          <li>
            <img src="/Assets/Images/love.jpeg" alt="Patient" />
            <div>
              <h4>M.J. Mical</h4>
              <p>Health Checkup</p>
            </div>
            <span className="status ongoing">On Going</span>
          </li>
          <li>
            <img src="/Assets/Images/love.jpeg" alt="Patient" />
            <div>
              <h4>Sanath Deo</h4>
              <p>Health Checkup</p>
            </div>
            <span className="time">12:30 PM</span>
          </li>
          <li>
            <img src="/Assets/Images/love.jpeg" alt="Patient" />
            <div>
              <h4>Loeara Phanj</h4>
              <p>Report</p>
            </div>
            <span className="time">01:00 PM</span>
          </li>
          <li>
            <img src="/Assets/Images/love.jpeg" alt="Patient" />
            <div>
              <h4>Komola Haris</h4>
              <p>Common Cold</p>
            </div>
            <span className="time">01:30 PM</span>
          </li>
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
