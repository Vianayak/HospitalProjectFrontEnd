import React, { useEffect, useState } from "react";  
import DoctorCards from "./DoctorCards"; // Ensure this is the correct path  
import "./DoctorCards.css";  
import axios from "axios";  
import SearchBar from "../SearchBar/SearchBar";

const DoctorList = () => {  
  const [doctors, setDoctors] = useState([]); // Store list of doctors  
  const [searchTerm, setSearchTerm] = useState(""); // Search term state  

  useEffect(() => {  
    axios  
      .get("http://localhost:8081/api/doctors/doctors-list")  
      .then((response) => {  
        setDoctors(response.data);  
      })  
      .catch((error) => {  
        console.error("Error fetching doctors data:", error);  
      });  
  }, []);  

  // Filtered doctors based on search term  
  const filteredDoctors = doctors.filter((doctor) =>  
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())  
  );  

  return (  
    <>  
      {/* Pass setSearchTerm to SearchBar */}
      <SearchBar setSearchTerm={setSearchTerm} />  

      <div className="doctor-list-container">  
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
    </>  
  );  
};  

export default DoctorList;
