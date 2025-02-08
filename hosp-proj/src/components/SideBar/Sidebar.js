import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Dashboard from '../Dashboard/Dashboard';
import HealthcarePortal from '../HealthcarePortal/HealthcarePortal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import BookAvailability from '../BookAvailability/BookAvailability';

import Calendar from "react-calendar";

import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showBookAvailability, setShowBookAvailability] = useState(false);

  const [meetings, setMeetings] = useState([]);
  const [showMeetingsPopup, setShowMeetingsPopup] = useState(false);
  const handleAvailability = () => {
    setShowBookAvailability(true);
  };
  
  
  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    specialChar: /[@$!%*?&]/.test(formData.password),
  };
  const handleDateChange = (date) => {
    console.log("Selected date before formatting:", date);  // Log selected date
    setSelectedDate(date);
    
    // Format the date to 'yyyy-MM-dd'
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Format the adjusted date to 'yyyy-MM-dd'
  const formattedDate = localDate.toISOString().split('T')[0];
  console.log("Formatted date for API call:", formattedDate); // Log formatted date
  
    const email = doctorDetails.email;
  
    // Make the API call with formatted date and email
    axios.get(`http://localhost:8081/api/meet/getMeetingList?date=${formattedDate}&email=${email}`)
  .then((response) => {
    if (response.data) {
      setMeetings(response.data); // Append the response data
    }
  })
  .catch((error) => {
    console.error('Error fetching meetings:', error);
  });

  };
  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (sidebarOpen && !event.target.closest(".sidebar") && !event.target.closest(".burger-menu")) {
            setSidebarOpen(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
}, [sidebarOpen]);


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("doctorDetails");

    sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag
        navigate("/login"); // Navigate to the path
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!Object.values(passwordCriteria).every(Boolean)) {
      toast.error("Please meet all password criteria.");
      return;
    }
    const token = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      setButtonDisabled(true);
      const response = await fetch("http://localhost:8082/api/user/protected-endpoint", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const changePasswordResponse = await fetch("http://localhost:8082/api/user/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: doctorDetails.email,
            password: formData.password,
            newPassword: formData.password,
          }),
        });
        const data = await changePasswordResponse.json();
        if (changePasswordResponse.ok) {
          toast.success("Password reset successfully", {
            onClose: () => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("doctorDetails");
  
              sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag
              navigate("/login"); // Navigate to login page
            },
          });
        } else {
          toast.error(data.message || "Password change failed.");
        }
      } else {
        toast.error("Invalid or expired token.");
      }
    } catch (error) {
      toast.error("Token validation failed.");
    } finally {
      setIsLoading(false);
    }
  };
 
  const toggleMenu = () => {
    setSidebarOpen((prev) => !prev);
    console.log("Sidebar state:", !sidebarOpen);
};
  return (
    <div className="layout">
    

    {/* Sidebar */}
    <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="profile-section">
          {doctorDetails ? (
            <>
              <img
                src={`http://localhost:8081/${doctorDetails.imagePath}`}
                alt="Profile"
                className="profile-image"
              />
              <h3>Dr. {doctorDetails.name}</h3>
              <p>{doctorDetails.specialization}</p>
              <p>{doctorDetails.location}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <ul className="menu">
        <li onClick={() => setShowMeetingsPopup(true)}>
            <i className="icon">&#x1F4DD;</i> Meetings
          </li>
  <li onClick={handleAvailability}>
    <i className="icon">&#x1F4CB;</i> Book Availability
  </li>
  <li onClick={handleLogout}>
    <i className="icon">&#x274C;</i> Logout
  </li>
  <li onClick={() => setShowPasswordForm(true)}>
    <i className="icon">&#x1F512;</i> Change Password
  </li>
</ul>
{showBookAvailability && (
  <BookAvailability 
    onClose={() => setShowBookAvailability(false)} 
    fetchBookedSlotsOnOpen={true} 
  />
)}
      </div>
      <div className="dashboard-content">
        <DashboardHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        <Dashboard selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        {/* <HealthcarePortal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onStatusUpdate={handleStatusUpdate}
        /> */}
      </div>
      {showPasswordForm && (
        <div className="popup-overlay">
          <div className="popup-container3">
            <h2 className="change-password1">Change Password</h2>  
            <form onSubmit={handleSubmit}>
              <div className="form-group3">
                <div className="input-row">
                  <div className="input-container">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="popup-input"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-container">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="popup-input"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <ul className="password-criteria">
                <li style={{ color: passwordCriteria.length ? 'green' : 'red' }}>At least 8 characters</li>
                <li style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>At least one uppercase letter</li>
                <li style={{ color: passwordCriteria.lowercase ? 'green' : 'red' }}>At least one lowercase letter</li>
                <li style={{ color: passwordCriteria.number ? 'green' : 'red' }}>At least one number</li>
                <li style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>At least one special character (@$!%*?&)</li>
              </ul>
              <div className="popup-actions">
                <button
                  type="submit"
                  className="forgot-password-button center-button"
                  disabled={buttonDisabled}
                >
                  {isLoading ? 'Processing...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} {showMeetingsPopup && (
        <div className="popup-overlay2">
          <div className="popup-container2">
            <h2>Upcoming Meetings</h2>
            <div className="meetings-content">
              {/* Left side: Calendar */}
              <div className="calendar-section">
              <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                />
              </div>

              {/* Right side: Meetings List */}
              <div className="meetings-list">
              {meetings.length > 0 ? (
                  meetings.map((meeting) => (
                    <div key={meeting.id} className="meeting-item">
                      <p><strong>Doctor:</strong> {meeting.name}</p>
                      <p><strong>Time:</strong> {meeting.time}</p>
                      <a href={meeting.patientUrl} target="_blank" rel="noopener noreferrer">
                        <button className="meet-button">Join Meeting</button>
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No meetings scheduled for this date.</p>
                )}
              </div>
            </div>
            <button className="close-button1" onClick={() => setShowMeetingsPopup(false)}>Close</button>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};
export default Sidebar;
