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
            <h3>Total Patient</h3>
            <h4 className="stat-number">2000+</h4>
            <p className="stat-label"> Today</p>
          </div>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <div>
          <h3>Today Patient</h3>
            <h4 className="stat-number">068</h4>
            <p className="stat-label"> Today</p>
          </div>
        </div>
        <div className="stat-box">
          <FaClock className="stat-icon" />
          <div>
          <h3>Today's Appointments</h3>
            <h4 className="stat-number">085</h4>
            <p className="stat-label"> Today</p>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default DashboardHeader;
