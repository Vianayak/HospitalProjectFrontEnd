import React from "react";
import "./Preloader.css"; // Import CSS for styling

const Preloader = () => {
  return (
    <div className="preloader">
      <img src="/Assets/Images/TechSpryn_New.png" alt="Logo" className="preloader-logo" />
      <p className="loading-text">Loading, please wait...</p>
    </div>
  );
};

export default Preloader;
