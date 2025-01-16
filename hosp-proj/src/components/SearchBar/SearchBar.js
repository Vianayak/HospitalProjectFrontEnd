import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.trim()) {
      axios
        .get(`http://localhost:8081/api/doctors/doctors-list`, {
          params: { query },
        })
        .then((response) => {
          setResults(response.data);
          setIsDropdownVisible(true); // Show dropdown when results are available
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setResults([]);
      setIsDropdownVisible(false); // Hide dropdown when query is empty
    }
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search Doctors by Name or Specialization"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>
      {isDropdownVisible && (
        <div className="search-results-dropdown">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                className="result-card-button"
                onClick={() => alert(`You clicked on ${result.name}`)}
              >
                <h6>{result.name}</h6>
                <p>{result.specialization}</p>
                <p>Location: {result.location}</p>
              </button>
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
