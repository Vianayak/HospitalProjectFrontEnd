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
    <div className="container">  
      <h1 className="header-section" >Hospitals in Telangana</h1>  
      <p>  
        Apollo Group constitutes the best hospital in India with over 10,000 beds across 73  
        hospitals, 5000+ pharmacies, over 300 clinics, 1100+ diagnostic centres and 200+  
        Telemedicine units.  
      </p>  
      <div className="hospital-section">  
        {hospitals.map((hospital) => (  
          <div key={hospital.id} className="hospital-card">  
            <div className="hospital-icon">{hospital.icon}</div>  
            <h5>{hospital.name}</h5>  
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  

export default HospitalsSection;