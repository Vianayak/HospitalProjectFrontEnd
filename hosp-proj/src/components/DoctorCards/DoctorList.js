import React from "react";
import DoctorCard from "./DoctorCards";
import "./DoctorCards.css";

const doctors = [
  {
    name: "Dr. A. Kumar",
    speciality: "Cardiologist",
    experience: 15,
    location: "Apollo Hospitals, Chennai",
    availability:"MON-SAT(10AM-5PM)",
    image: "Assets/Images/Love.jpeg", // Replace with actual image URL
  },
  {
    name: "Dr. B. Sharma",
    speciality: "Orthopedic Surgeon",
    experience: 10,
    location: "Apollo Hospitals, Delhi",
    availability:"MON-SAT(10AM-5PM)",
    image: "Assets/Images/Love.jpeg", // Replace with actual image URL
  },
  {
    name: "Dr. C. Rao",
    speciality: "Dermatologist",
    experience: 8,
    location: "Apollo Hospitals, Bangalore",
    availability:"MON-SAT(10AM-5PM)",
    image: "Assets/Images/Love.jpeg", // Replace with actual image URL
  },
  {
    name: "Dr. D. Singh",
    speciality: "Pediatrician",
    experience: 12,
    location: "Apollo Hospitals, Hyderabad",
    availability:"MON-SAT(10AM-5PM)",
    image: "Assets/Images/Love.jpeg", // Replace with actual image URL
  },
];

const DoctorList = () => {
  return (
    <div className="doctor-list">
      {doctors.map((doctor, index) => (
        <DoctorCard key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
