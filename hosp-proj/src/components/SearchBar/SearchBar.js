import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For selected doctor to display in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility

  // Fetching doctor data dynamically from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/doctors/doctors-list");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);

    if (!searchQuery) {
      setResults([]);
      return;
    }

    // Filter doctors based on search query
    const filteredResults = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery)
    );
    setResults(filteredResults);
  };

  // Open modal and set the selected doctor
  const handleResultClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true); // Open modal when a result is clicked
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search Doctor's"
          value={query}
          onChange={handleSearch}
        />
        <span className="search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>
      {query && (
        <div className="search-results-dropdown">
          {results.length > 0 ? (
            results.map((doctor) => (
              <div
                key={doctor.id}
                className="result-card"
                onClick={() => handleResultClick(doctor)} // On click, open modal with doctor details
              >
                <h6>{doctor.name}</h6>
                <p>{doctor.specialization}</p>
                <p>{doctor.location}</p>
              </div>
            ))
          ) : (
            <p>No results found for "{query}"</p>
          )}
        </div>
      )}

      {/* Modal for Doctor Details */}
      {isModalOpen && selectedDoctor && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>×</span>
            <h2>Doctor Details</h2>
            <div className="doctor-detail">
              <div className="doctor-image">
              <img src={`http://localhost:8081/${selectedDoctor.imagePath}`} alt={selectedDoctor.name} />
              </div>
              <div className="doctor-info">
                <h3>{selectedDoctor.name}</h3>
                <p>Specialization: {selectedDoctor.specialization}</p>
                <p>Languages: {selectedDoctor.languages.join(", ")}</p>
                <p>Location: {selectedDoctor.location}</p>
                <p>Registration Number: {selectedDoctor.regestrationNum}</p>
                <div className="doctor-buttons">
                  <button>Online Consult</button>
                  <button>Hospital Visit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
