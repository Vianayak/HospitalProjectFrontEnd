import React, { useState } from "react";
import "./HomeServices.css";

const HomeServices = () => {
  const [activeTab, setActiveTab] = useState("nurse");

  return (
    <div className="home-services-container">
      <div className="tabs">
        <button 
          className={activeTab === "nurse" ? "active" : ""}
          onClick={() => setActiveTab("nurse")}
        >
          Nurse
        </button>
        <button 
          className={activeTab === "patient" ? "active" : ""}
          onClick={() => setActiveTab("patient")}
        >
          Patient
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "nurse" ? (
          <div className="login-form">
            <h2>Nurse Login</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button className="login-btn">Login</button>
            <p className="signup-link">
              New user? <a href="/signup">Sign Up</a>
            </p>
          </div>
        ) : (
          <div className="login-form">
            <h2>Patient Section</h2>
            <p>Coming Soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeServices;
