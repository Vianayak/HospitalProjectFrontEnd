import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="Assets/Images/NewLogo.jpeg" alt="Apollo Hospitals" className="footer-logo" />
      </div>
      <div className="footer-links">
        <div className="footer-column">
          <h4>Patient Care</h4>
          <ul>
            <li>Find A Doctor</li>
            <li>Patient Testimonials</li>
            <li>Value Added Services</li>
            <li>Pay Online</li>
          </ul>
          <h4>International Patients</h4>
          <ul>
            <li>About Apollo</li>
            <li>Apollo Hospitals</li>
          </ul>
          <h4>News & Media</h4>
          <ul>
            <li>News & Events</li>
            <li>Watch our Videos</li>
            <li>Media Contacts</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Medical Procedures</h4>
          <ul>
            <li>Bariatric Surgery</li>
            <li>Brain Surgeries</li>
            <li>CABG Heart Bypass Surgery</li>
            <li>Cardiac Pacemakers</li>
            <li>Colorectal Surgeries</li>
            <li>Electrophysiology Study</li>
            <li>Endometriosis</li>
            <li>Head and Neck Cancer</li>
            <li>Heart and Lung Transplant</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Academics & Research</h4>
          <ul>
            <li>Administration</li>
            <li>Educational & Research Foundation</li>
            <li>Nursing</li>
            <li>Physiotherapy</li>
            <li>MBA Health Care Management</li>
            <li>Emergency Medicine</li>
            <li>PG Medical Education</li>
            <li>Medvarsity</li>
            <li>Simulation Lab Courses</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Blogs</h4>
          <ul>
            <li>Health Library</li>
            <li>Covid 19 Updates</li>
            <li>COVID-19 FAQs</li>
            <li>Bio-Medical Waste Data</li>
            <li>Apollo Telemedicine</li>
            <li>Apollo Pet Scan Center</li>
          </ul>
          <h4>Hospitals</h4>
          <ul>
            <li>Hospitals in India</li>
            <li>Apollo Clinics</li>
            <li>Apollo Cradle</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact Us</h4>
          <ul>
            <li>Post A Query</li>
            <li>Consult Doctors Online</li>
            <li>Book Physical Appointment</li>
            <li>Give Your Feedback</li>
          </ul>
          <h4>Disclaimer</h4>
          <ul>
            <li>Transplant Disclaimer</li>
            <li>Recruitment Disclaimer</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
