import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Dashboard from '../Dashboard/Dashboard';
import HealthcarePortal from '../HealthcarePortal/HealthcarePortal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {

  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    specialChar: /[@$!%*?&]/.test(formData.password),
  };

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
  }, []);

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
              setShowPasswordForm(false);
              setButtonDisabled(false);
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

  const handleStatusUpdate = () => {
    setStatusUpdated((prev) => !prev);
  };

  return (
    <div className="layout">
      <div className="sidebar">
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
  <li onClick={() => (window.location.href = "http://localhost:3000/jayahospital")}>
    <i className="icon">&#x1F4CB;</i> Book Availablity
  </li>
  <li onClick={handleLogout}>
    <i className="icon">&#x274C;</i> Logout
  </li>
  <li onClick={() => setShowPasswordForm(true)}>
    <i className="icon">&#x1F512;</i> Change Password
  </li>
</ul>

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
      )}
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
