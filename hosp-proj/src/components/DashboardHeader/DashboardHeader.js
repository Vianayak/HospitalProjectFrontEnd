import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './DashboardHeader.css';

const DashboardHeader = (props) => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayPatients: 0,
    
  });

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Returning the date as a string
  };

  // Function to get the doctor's registration number dynamically (assuming it's stored in localStorage)
  const getDoctorRegNum = () => {
    // You can fetch the doctor registration number from context, Redux, or localStorage
    // Example: Fetching from localStorage
    const doctorData = JSON.parse(localStorage.getItem('doctorDetails')); // Replace with your actual method
    return doctorData ? doctorData.regestrationNum : null; // Ensure you handle if doctor data is not found
  };

  useEffect(() => {
    const fetchStats = async () => {
      const selectedDate = props.selectedDate.toISOString().split('T')[0];  // Get today's date dynamically
      const doctorRegNum = getDoctorRegNum(); // Fetch doctor's registration number dynamically

      if (!doctorRegNum) {
        console.error('Doctor registration number is not available!');
        return;
      }

      try {
        // Replace this URL with your actual API endpoint
        const response = await fetch(`http://localhost:8081/api/book-appointment/stats?date=${selectedDate}&doctorRegNum=${doctorRegNum}`);
        const data = await response.json();
        setStats({
          totalAppointments: data.totalTreatedPatientsByDoctor,
          todayPatients: data.acceptedAppointments, // Ensure your API sends this field
         
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [props.statusUpdated]);

  return (
    <div className="header-container">
      <h2 className="header-title">Dashboard</h2>
      <div className="stats-container">
        <div className="stat-box">
          <FaUserAlt className="stat-icon" />
          <div>
            <h3>Total Patients</h3>
            <h4 className="stat-number">{stats.totalAppointments}</h4>
            <p className="stat-label"> Today</p>
          </div>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h3>Today's Patients</h3>
            <h4 className="stat-number">{stats.todayPatients}</h4>
            <p className="stat-label"> Today</p>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default DashboardHeader;
