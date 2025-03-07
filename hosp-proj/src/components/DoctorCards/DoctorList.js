import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom"; // Import for reading URL params
import DoctorCards from "./DoctorCards";  
import "./DoctorCards.css";  
import axios from "axios";  
import SearchBar from "../SearchBar/SearchBar";

const DoctorList = () => {  
  const [doctors, setDoctors] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const location = useLocation(); // Read query params

  // Extract specialization from query params
  const searchParams = new URLSearchParams(location.search);
  const specializationFilter = searchParams.get("specialization");

  useEffect(() => {  
    axios  
      .get("http://localhost:8081/api/doctors/doctors-list")  
      .then((response) => {  
        setDoctors(response.data);

        // Set specialization as search term if present in URL
        if (specializationFilter) {
          setSearchTerm(specializationFilter);
        }
      })  
      .catch((error) => {  
        console.error("Error fetching doctors data:", error);  
      });  
  }, [specializationFilter]); // Re-run when specialization changes  

  // Filter doctors based on search input or selected specialization
  const filteredDoctors = doctors.filter((doctor) =>  
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())  
  );  

  return (  
    <>  
      {/* Pass the current searchTerm to SearchBar for automatic input */}
      <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />  

      <div className="doctor-list-container">  
        <div className="doctor-list">  
          {filteredDoctors.length > 0 ? (  
            filteredDoctors.map((doctor) => (  
              <DoctorCards 
                key={doctor.id} 
                doctor={doctor} 
                highlight={doctor.specialization.toLowerCase() === searchTerm.toLowerCase()} // Highlight match
              />  
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
