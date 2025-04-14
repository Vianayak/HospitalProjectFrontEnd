import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboardPage.css";

const NurseDashboardPage = () => {
  const [nurseName, setNurseName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("nurseDetails"));
    if (storedDetails && storedDetails.firstName) {
      setNurseName(`${storedDetails.firstName} ${storedDetails.lastName}`);
    } else {
        sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag
        navigate("/login"); // Navigate to the path
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("nurseDetails");
    localStorage.removeItem("token");
    sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag
        navigate("/login"); // Navigate to the path
  };

  return (
    <div>
      <div className="logout-container00">
        <button className="logout-button00" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="nurse-welcome">
        <h1>Welcome, Nurse {nurseName}!</h1>
      </div>
    </div>
  );
};

export default NurseDashboardPage;
