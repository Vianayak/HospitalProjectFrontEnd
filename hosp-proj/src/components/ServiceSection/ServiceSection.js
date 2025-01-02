import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faCalendarCheck,
  faClipboardCheck,
  faUserMd,
  faPills,
  faHospital,
  faFileMedical,
} from "@fortawesome/free-solid-svg-icons";
import "./ServiceSection.css";

const services = [
  { id: 1, icon: faCalendarCheck, title: "Book Appointment", path: "/doctor-cards" },
  { id: 2, icon: faClipboardCheck, title: "Book Health Check-Up", path: "#" },
  { id: 3, icon: faUserMd, title: "Consult Online", path: "#" },
  { id: 4, icon: faPills, title: "Buy Medicine", path: "#" },
  { id: 5, icon: faHospital, title: "Find Hospital", path: "#" },
  { id: 6, icon: faFileMedical, title: "View Health Record", path: "#" },
];

const ServiceSection = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleServiceClick = (path) => {
    if (path !== "#") {
      navigate(path); // Navigate to the specified path
    }
  };

  return (
    <div className="container">
      <div className="service-section">
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${service.active ? "active" : ""}`}
            onClick={() => handleServiceClick(service.path)} // Handle click
          >
            <div className="icon">
              <FontAwesomeIcon icon={service.icon} />
            </div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
