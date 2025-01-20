import React from 'react';
import { FaUserAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './DashboardHeader.css';

const DashboardHeader = () => {
  return (
    <div className="header-container">
      <h2 className="header-title">Dashboard</h2>
      <div className="stats-container">
        <div className="stat-box">
          <FaUserAlt className="stat-icon" />
          <div>
            <h3 className="stat-number">2000+</h3>
            <p className="stat-label">Total Patient</p>
          </div>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h3 className="stat-number">068</h3>
            <p className="stat-label">Today Patient</p>
          </div>
        </div>
        <div className="stat-box">
          <FaClock className="stat-icon" />
          <div>
            <h3 className="stat-number">085</h3>
            <p className="stat-label">Today Appointments</p>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default DashboardHeader;
