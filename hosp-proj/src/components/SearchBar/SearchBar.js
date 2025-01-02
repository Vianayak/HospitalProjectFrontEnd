import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const data = {
    doctors: [
      { name: "Dr. Saujanya Myneni", specialization: "Obstetrics and Gynecology", location: "LB Nagar" },
      { name: "Dr. Reena Lankala", specialization: " Pediatrician", location: "LB Nagar" },
      { name: "Dr. Koteswaramma Ganta", specialization: "Obstetrics and Gynecology", location: "LB Nagar" },
      { name: "Dr. Dr. Satyanarayana Kavali", specialization: "Pediatrician", location: "LB Nagar" },
      { name: "Dr. Saroja Banothu", specialization: "Obstetrics and Gynecology", location: "LB Nagar" },
      { name: "Dr. Suresh Kumar Panda", specialization: "Pediatric Intensive Care", location: "LB Nagar" },
      { name: "Dr. Anitha Reddy", specialization: "Dermatology", location: "LB Nagar" },
      { name: "Dr. Vijay Kumar", specialization: "Orthopedics", location: "LB Nagar" },
      { name: "Dr. Lavanya Sharma", specialization: "Psychiatry", location: "LB Nagar" },
    
    ],
    specialties: [
      { name: "Pediatric Neurology" },
      { name: "Pediatric Gastroenterology & Liver Disease" },
      { name: "General Pediatrics" },
      { name: "Pediatric Hematology & Oncology & BMT" },
      { name: "Pediatric Cardiology & Cardiac Surgery" }
  
    ],
    blogs: [
      { title: "Importance of Regular Pediatric Checkups", category: "Pediatrics" },
      { title: "Tips for a Healthy Pregnancy", category: "Obstetrics" },
    ],
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);

    if (!searchQuery) {
      setResults([]);
      return;
    }

    const filteredResults = [
      ...data.doctors.filter((item) => item.name.toLowerCase().includes(searchQuery)),
      ...data.specialties.filter((item) => item.name.toLowerCase().includes(searchQuery)),
      ...data.blogs.filter((item) => item.title.toLowerCase().includes(searchQuery)),
    ];

    setResults(filteredResults);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search Doctor's, Speciality, Blog"
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
            results.map((result, index) => (
              <div key={index} className="result-card">
                {result.name && <h3>{result.name}</h3>}
                {result.specialization && <p>{result.specialization}</p>}
                {result.location && <p>Location: {result.location}</p>}
                {result.title && <h3>{result.title}</h3>}
                {result.category && <p>Category: {result.category}</p>}
              </div>
            ))
          ) : (
            <p>No results found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
