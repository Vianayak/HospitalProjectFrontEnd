import React from 'react';
import './SearchBar.css';

function SearchBar() {
    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder="Search Doctor's, Speciality, Blog"
            />
            <button className="search-button">
                <img
                    src="/Assets/Images/search.png" // Replace with your icon path
                    alt="Search"
                />
            </button>
        </div>
    );
}

export default SearchBar;
