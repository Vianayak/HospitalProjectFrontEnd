import React from 'react';
import './HeroSection.css'; // Import your CSS file

const HeroSection = () => {
  return (
    <div id="carouselExampleControls" className="carousel slide custom-carousel" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src="/Assets/Images/CarouselImage1.jpg" alt="First slide" />
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="/Assets/Images/CarouselImage2.jpg" alt="Second slide" />
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="/Assets/Images/CarouselImage3.jpg" alt="Third slide" />
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="/Assets/Images/CarouselImage4.jpg" alt="Fourth slide" />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeroSection;