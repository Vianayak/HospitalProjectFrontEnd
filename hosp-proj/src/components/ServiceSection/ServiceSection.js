import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faClipboardCheck,
  faUserMd,
  faPills,
  faHospital,
  faFileMedical,
} from '@fortawesome/free-solid-svg-icons';
import './ServiceSection.css';

const services = [
  { id: 1, icon: faCalendarCheck, title: 'Book Appointment', active: false },
  { id: 2, icon: faClipboardCheck, title: 'Book Health Check-Up', active: false },
  { id: 3, icon: faUserMd, title: 'Consult Online', active: false },
  { id: 4, icon: faPills, title: 'Buy Medicine', active: false },
  { id: 5, icon: faHospital, title: 'Find Hospital', active: false },
  { id: 6, icon: faFileMedical, title: 'View Health Record', active: false },
];

const ServiceSection = () => {
  return (
    <div className="service-section">
      {services.map((service) => (
        <div
          key={service.id}
          className={`service-card ${service.active ? 'active' : ''}`}
        >
          <div className="icon">
            <FontAwesomeIcon icon={service.icon} />
          </div>
          <h3>{service.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default ServiceSection;
