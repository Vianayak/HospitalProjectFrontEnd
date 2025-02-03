import React from 'react';  
import './HospitalSection.css';  

const hospitals = [  
  { id: 1, name: 'Jubilee Hills', icon: '🏥' },  
  { id: 2, name: 'Secunderabad', icon: '🏥' },  
  { id: 3, name: 'Hyderguda', icon: '🏛️' },  
  { id: 4, name: 'DRDO', icon: '🏰' },  
  { id: 5, name: 'Karimnagar', icon: '🏯' },  
  { id: 6, name: 'Miryalaguda', icon: '⛪' },  
  { id: 7, name: 'Warangal', icon: '🏛️' },  
  { id: 8, name: 'OutReach Clinics', icon: '🏥' },  
];  

const HospitalsSection = () => {  
  return (  
    <div className="hospital-container">
    <h1 className="hospital-title">Hospitals in Telangana</h1>
    <p className="hospital-description">
      Jaya Hospitals is one of the best healthcare providers in India, with over 10,000 beds across 73
      hospitals, 5000+ pharmacies, 300+ clinics, 1100+ diagnostic centers, and 200+ telemedicine units.
    </p>
    <div className="hospital-grid">
      {hospitals.map((hospital) => (
        <div key={hospital.id} className="hospital-item">
          <div className="hospital-icon">{hospital.icon}</div>
          <h5 className="hospital-name">{hospital.name}</h5>
        </div>
      ))}
    </div>
  </div>
);
};

export default HospitalsSection;