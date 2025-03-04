import React, { useEffect, useState } from "react";  
import DoctorCards from "./DoctorCards"; // Ensure this is the correct path  
import "./DoctorCards.css";  
import axios from "axios";  

const DoctorList = () => {  
  const [doctors, setDoctors] = useState([]); // State to store the list of doctors  
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term  

  useEffect(() => {  
    // Fetching data from the backend  
    axios  
      .get("http://localhost:8081/api/doctors/doctors-list")  
      .then((response) => {  
        setDoctors(response.data); // Update state with fetched data  
      })  
      .catch((error) => {  
        console.error("Error fetching doctors data:", error);  
      });  
  }, []);  

  // Filtered doctors based on the search term  
  const filteredDoctors = doctors.filter(  
    (doctor) =>  
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())  
  );  

  return (  
    <div className="doctor-list-container">  
      {/* Search Bar */}  
      <input  
        type="text"  
        placeholder="Search by name or specialization..."  
        value={searchTerm}  
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term  
        className="search-bar"  
      />  

      {/* Render Filtered Doctors */}  
      <div className="doctor-list">  
        {filteredDoctors.length > 0 ? (  
          filteredDoctors.map((doctor) => (  
            <DoctorCards key={doctor.id} doctor={doctor} />  
          ))  
        ) : (  
          <p>No doctors found.</p>  
        )}  
      </div>  
    </div>  
  );  
};  

export default DoctorList;  