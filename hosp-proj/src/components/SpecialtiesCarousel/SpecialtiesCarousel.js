import React from "react";
import "./SpecialtiesCarousel.css";

const specialties = [
  {
    name: "Pediatric Neurology",
    image: "/assets/images/neurology.png", // Update this with your actual image path
  },
  {
    name: "Pediatric Gastroenterology & Liver Disease",
    image: "/assets/images/gastroenterology.png",
  },
  {
    name: "General Pediatrics",
    image: "/assets/images/general-pediatrics.png",
  },
  {
    name: "Pediatric Hematology & Oncology & BMT",
    image: "/assets/images/hematology.png",
  },
  {
    name: "Pediatric Cardiology & Cardiac Surgery",
    image: "/assets/images/cardiology.png",
  },
];

const SpecialtiesCarousel = () => {
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {specialties.map((specialty, index) => (
          <div className="carousel-card" key={index}>
            <img src={specialty.image} alt={specialty.name} />
            <p>{specialty.name}</p>
          </div>
        ))}
        {/* Duplicate for infinite loop */}
        {specialties.map((specialty, index) => (
          <div className="carousel-card" key={index + specialties.length}>
            <img src={specialty.image} alt={specialty.name} />
            <p>{specialty.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtiesCarousel;
