import React, { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PatientDashboard.css";
import HealthcarePortal from "../HealthcarePortal/HealthcarePortal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PatientDashboard = ({selectedDate, setSelectedDate}) => {
  const [appointments, setAppointments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [todayPayments, setTodayPayments] = useState(0);
  const [showPopup, setShowPopup] = useState(false); 

  const prevDateRef = useRef(null);


  const PatientDetails = JSON.parse(localStorage.getItem("patientDetails"));

  useEffect(() => {
    // Skip if selected date has not changed
    if (prevDateRef.current && prevDateRef.current === selectedDate.toISOString()) {
      return;
    }

    if (PatientDetails && selectedDate) {
      fetchAppointments(selectedDate)
        .then((appointmentsData) => {
          setAppointments(appointmentsData);
        })
        .catch((error) => console.error("Error fetching appointments:", error));
    }

    // Update previous date
    prevDateRef.current = selectedDate.toISOString();
  }, [PatientDetails, selectedDate]);


  useEffect(() => {
    if (PatientDetails && selectedDate) {
      fetchPayments(selectedDate);
    }
  }, [PatientDetails, selectedDate]);

  

  const fetchAppointments = async (date) => {
    // Use local date instead of converting it to UTC
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const email = PatientDetails.email;
    console.log(formattedDate, email);
  
    const apiUrl = `http://localhost:8081/api/book-appointment/doctors-for-date?email=${email}&date=${formattedDate}`;
    
  
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
    throw new Error("Failed to fetch appointments");
  };
  

  const fetchPayments = async (date) => {
    try {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const email = PatientDetails.email;
      const apiUrl = `http://localhost:8081/api/book-appointment/payments?date=${formattedDate}&email=${email}`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setTotalPayments(data.totalPayments || 0);
        setTodayPayments(data.todayPayments || 0);
      } else {
        throw new Error("Failed to fetch earnings");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  // Data for the donut chart
  const chartData = {
    labels: ["Today's Payments", "Total Payments"],
    datasets: [
      {
        data: [todayPayments, totalPayments],
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
        <h5>Payment Summary</h5>
        <div className="chart-container">
          <div className="donut-chart">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        <div>
          <ul className="legend">
            <li>
              <span className="legend-color new-patients"></span> Today's Payments
            </li>
            <li>
              <span className="legend-color old-patients"></span> Total Payments
            </li>
          </ul>
        </div>
      </div>

      {/* Today Appointment Section */}
      <div className="today-appointment">
        <h5>Today Doctors</h5>
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
                  {patient.name}
                </h4>
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
              <span>{`${patient.name}`}</span>
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

export default PatientDashboard;
