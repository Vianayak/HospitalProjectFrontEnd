import { useNavigate } from "react-router-dom"; // Import navigation
import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ setSearchTerm, searchTerm }) => {
  const [query, setQuery] = useState(searchTerm || ""); // Use initial search term
  const navigate = useNavigate(); // Use navigation

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setSearchTerm(searchQuery);

    // Update the URL with the doctor name
    navigate(`?doctorName=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search by Doctor Name"
          value={query}
          onChange={handleSearch}
        />
        <span className="search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
