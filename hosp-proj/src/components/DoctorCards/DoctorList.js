import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCards";
import "./DoctorCards.css";
import axios from "axios";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

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

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
