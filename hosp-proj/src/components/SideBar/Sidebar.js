import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Dashboard from '../Dashboard/Dashboard';
import HealthcarePortal from '../HealthcarePortal/HealthcarePortal';

const Sidebar = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("doctorDetails");
    window.location.href = "/login";
  };

  const handleChangePassword = () => {
    window.location.href = "/change-password";
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="profile-section">
          {doctorDetails ? (
            <>
              <img
                src={`http://localhost:8081/${doctorDetails.imagePath}`} // Ensure the backend serves this path correctly
                alt="Profile"
                className="profile-image"
              />
              <h3>Dr. {doctorDetails.name}</h3>
              <p>{doctorDetails.specialization}</p>
              <p>{doctorDetails.location}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <ul className="menu">
          <li onClick={handleLogout}>
            <i className="icon">&#x274C;</i> Logout
          </li>
          <li onClick={handleChangePassword}>
            <i className="icon">&#x1F512;</i> Change Password
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
        <DashboardHeader />
        <Dashboard />
        <HealthcarePortal />
      </div>
    </div>
  );
};

export default Sidebar;
