

import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ setSearchTerm, searchTerm }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (searchTerm) {
      setQuery(searchTerm); // Set the initial search term from the URL
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setSearchTerm(searchQuery); // Pass search term to parent component
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search by Doctor or Specialization"
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
