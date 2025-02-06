import React, { useState, useEffect, useRef } from "react";
import "./MultiSelectDropdown.css";

const MultiSelectDropdown = ({ selectedItems = [], onChange }) => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]); // All data from API
  const [filteredData, setFilteredData] = useState([]); // Filtered list
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/issues/all");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter issues when typing
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue.length >= 3) {
      const filteredResults = data.filter((item) =>
        item.issueName.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredData(filteredResults);
      setIsDropdownVisible(true);
    } else {
      setFilteredData([]);
      setIsDropdownVisible(false);
    }
  };

  // Add selected value
  const handleSelect = (item) => {
    if (!selectedItems.some((selected) => selected.id === item.id)) {
      const updatedSelectedItems = [...selectedItems, item];
      onChange(updatedSelectedItems); // Update the parent component
    }
    setQuery(""); // Clear input after selection
    setIsDropdownVisible(false);
  };

  // Remove selected value
  const handleRemove = (item) => {
    const updatedSelectedItems = selectedItems.filter(
      (value) => value.id !== item.id
    );
    onChange(updatedSelectedItems); // Update the parent component
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-container" ref={inputRef}>
      <div className="input-box">
        {selectedItems.map((value, index) => (
          <span key={index} className="tag">
            {value.issueName}
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemove(value)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Type to search issues..."
          className="dropdown-input"
          onFocus={() => setIsDropdownVisible(true)}
        />
      </div>
      {isDropdownVisible && (
        <ul className="dropdown-list">
          {filteredData.map((item) => (
            <li
              key={item.id}
              className="dropdown-item"
              onClick={() => handleSelect(item)}
            >
              {item.issueName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
