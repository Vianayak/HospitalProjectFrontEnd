import React, { useState, useEffect } from 'react';
import './Sidebar.css'; // CSS file for styling
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Dashboard from '../Dashboard/Dashboard';
import HealthcarePortal from '../HealthcarePortal/HealthcarePortal';

const Sidebar = () => {

  const [data, setData] = useState(null);
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("authToken");
    console.log(token);

    try {
      const response = await fetch("http://localhost:8082/api/user/protected-endpoint", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const fetchedData = await response.json();
        setData(fetchedData);
      } else {
        console.error("Unauthorized or other error");
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);
  
  return (
    <div className="layout">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src="/Assets/Images/love.jpeg" // Replace with actual image URL
            alt="Profile"
            className="profile-image"
          />
          <h3>Dr. Marttin Deo</h3>
          <p>MBBS, FCPS - MD (Medicine), MCPS</p>
        </div>
        <ul className="menu">
          <li>
            <i className="icon">&#x1F5D2;</i> Dashboard
          </li>
          <li>
            <i className="icon">&#x1F4DD;</i> Appointment
          </li>
          <li>
            <i className="icon">&#x1F4D1;</i> Appointment Page
          </li>
          <li>
            <i className="icon">&#x1F4B8;</i> Payment
          </li>
          <li>
            <i className="icon">&#x1F464;</i> Profile
          </li>
          <li>
            <i className="icon">&#9881;</i> Settings
          </li>
          <li>
            <i className="icon">&#x274C;</i> Logout
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
        <DashboardHeader />
        <Dashboard/>
        
        <HealthcarePortal/>
        {data ? (
          <div>
            <h3>Protected Data:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
