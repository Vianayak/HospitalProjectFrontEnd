import React, { useState, useEffect } from "react";
import "./DoctorGrid.css";

const DoctorGrid = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/doctors/doctors-list");
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data); // Update state with fetched data
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array to run only once

  return (
    <>
    <header>
    <h1>Available Doctors</h1>
  </header> 
    <div className="doctor-grid">
      {error && <p className="error-message">Error: {error}</p>}
      {doctors.length === 0 && !error ? (
        <p>Loading...</p>
      ) : (
        doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-cards">
            <div className="doctor-image">
              <img src="Assets/Images/Love.jpeg" alt={doctor.name} />
            </div>
            <h3>{doctor.name}</h3>
            <p>Specialization: {doctor.specialization}</p>
            <p>Languages: {doctor.languages.join(", ")}</p>
            <p>Location: {doctor.location}</p>
            <p>Registration Number: {doctor.regestrationNum}</p>
            <div className="doctor-buttons">
              <button>Online Consult</button>
              <button>Hospital Visit</button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default DoctorGrid;
