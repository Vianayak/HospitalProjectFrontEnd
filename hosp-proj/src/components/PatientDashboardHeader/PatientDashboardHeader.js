import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaCalendarAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './PatientDashboardHeader.css';

const PatientDashboardHeader = ({ selectedDate,setSelectedDate}) => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayPatients: 0,
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getPatientEmail= () => {
    const patientdata = JSON.parse(localStorage.getItem('patientDetails'));
    return patientdata ? patientdata.email : null;
  };

  useEffect(() => {
    console.log('Selected Date:', selectedDate);
    const fetchStats = async () => {
      const formattedDate = selectedDate
        ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
        : getTodayDate();
      const email = getPatientEmail();

   

      try {
        const response = await fetch(
          `http://localhost:8081/api/book-appointment/patient-stats?date=${formattedDate}&email=${email}`
        );
        const data = await response.json();
        console.log(data);
        setStats({
          totalConsultations: data.totalConsultations,
          todayConsultations: data.todayConsultations,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [selectedDate]);

  return (
    <div className="header-container">
      <h2 className="header-title">Dashboard</h2>
      <div className="stats-container">
        <div className="stat-box">
          <FaUserAlt className="stat-icon" />
          <div>
            <h3>Total Appointments</h3>
            <h4 className="stat-number">{stats.totalConsultations}</h4>
            <p className="stat-label">Today</p>
          </div>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h3>Today's Appointments</h3>
            <h4 className="stat-number">{stats.todayConsultations}</h4>
            <p className="stat-label">Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

PatientDashboardHeader.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};



export default PatientDashboardHeader;
