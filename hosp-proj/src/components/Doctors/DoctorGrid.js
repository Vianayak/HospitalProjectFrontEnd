import React, { useState, useEffect } from "react";

import "./DoctorGrid.css";

const DoctorGrid = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // To store selected doctor's details
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage the modal state

  // Fetching the doctors list from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/doctors/doctors-list");
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoctors();
  }, []);

  // Open modal and set the selected doctor's details
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
                {/* Dynamically set image source from the backend */}
                <img src={`http://localhost:8081/${doctor.imagePath}`} alt={doctor.name} />
              </div>
              <h3>{doctor.name}</h3>
              <p>Specialization: {doctor.specialization}</p>
              <p>Location: {doctor.location}</p>
              <div className="doctor-buttons">
                <button onClick={() => handleViewDetails(doctor)}>View Details</button>
                <button>Hospital Visit</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Doctor Details */}
      {isModalOpen && selectedDoctor && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>×</span>
            <h2>Doctor Details</h2>
            <div className="doctor-detail">
              <div className="doctor-image">
                {/* Dynamically set image source from the backend */}
                <img src={`http://localhost:8081/${selectedDoctor.imagePath}`} alt={selectedDoctor.name} />
              </div>
              <div className="doctor-info">
                <h3>{selectedDoctor.name}</h3>
                <p>Specialization: {selectedDoctor.specialization}</p>
                <p>Languages: {selectedDoctor.languages.join(", ")}</p>
                <p>Location: {selectedDoctor.location}</p>
                <p>Registration Number: {selectedDoctor.regestrationNum}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default DoctorGrid;
