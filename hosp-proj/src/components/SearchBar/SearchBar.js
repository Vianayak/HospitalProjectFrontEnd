import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ setSearchTerm }) => {
  const [query, setQuery] = useState("");

  // Handle search input and pass the value up
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setSearchTerm(searchQuery); // Pass search term to parent
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
