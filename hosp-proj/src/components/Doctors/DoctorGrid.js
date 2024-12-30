import React from "react";
import "./DoctorGrid.css";

const doctors = [
  {
    name: "Dr. Saujanya Myneni",
    specialization: "Consultant - Obstetrics and Gynecology",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Reena Lankala",
    specialization: "Consultant Pediatrician, LB Nagar (Hyderabad)",
    languages: "Telugu, Hindi, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Koteswaramma Ganta",
    specialization: "Consultant - Obstetrics and Gynecology",
    languages: "Telugu, Hindi, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Satyanarayana Kavali",
    specialization: "Consultant - Pediatrician, LB Nagar (Hyderabad)",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Saroja Banothu",
    specialization: "Consultant - Obstetrics and Gynecology",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Suresh Kumar Panda",
    specialization: "Consultant - Pediatric Intensive Care",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Anitha Reddy",
    specialization: "Consultant - Dermatology",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Vijay Kumar",
    specialization: "Consultant - Orthopedics",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
  {
    name: "Dr. Lavanya Sharma",
    specialization: "Consultant - Psychiatry",
    languages: "Telugu, English",
    location: "LB Nagar",
  },
];

const DoctorGrid = () => {
  return (
    <div className="doctor-grid">
      {doctors.map((doctor, index) => (
        <div key={index} className="doctor-card">
          <div className="doctor-image">
            <img src="Assets/Images/Love.jpeg" alt={doctor.name} />
          </div>
          <h3>{doctor.name}</h3>
          <p>{doctor.specialization}</p>
          <p>Languages: {doctor.languages}</p>
          <p>Location: {doctor.location}</p>
          <div className="doctor-buttons">
            <button>Online Consult</button>
            <button>Hospital Visit</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorGrid;
