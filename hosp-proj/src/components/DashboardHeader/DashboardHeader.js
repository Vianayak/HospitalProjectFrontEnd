import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaCalendarAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './DashboardHeader.css';

const DashboardHeader = ({ selectedDate,setSelectedDate}) => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayPatients: 0,
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDoctorRegNum = () => {
    const doctorData = JSON.parse(localStorage.getItem('doctorDetails'));
    return doctorData ? doctorData.regestrationNum : null;
  };

  useEffect(() => {
    console.log('Selected Date:', selectedDate);
    const fetchStats = async () => {
      const formattedDate = selectedDate
        ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
        : getTodayDate();
      const doctorRegNum = getDoctorRegNum();

      if (!doctorRegNum) {
        console.error('Doctor registration number is not available!');
        return;
      }

      try {
        const response = await fetch(
          `https://blond-beautifully-dis-singing.trycloudflare.com/api/book-appointment/stats?date=${formattedDate}&doctorRegNum=${doctorRegNum}`
        );
        const data = await response.json();
        console.log(data);
        setStats({
          totalAppointments: data.totalAppointments,
          todayPatients: data.todayAppointments,
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
            <h3>Total Patients</h3>
            <h4 className="stat-number">{stats.totalAppointments}</h4>
            <p className="stat-label">Today</p>
          </div>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h3>Today's Patients</h3>
            <h4 className="stat-number">{stats.todayPatients}</h4>
            <p className="stat-label">Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};



export default DashboardHeader;
