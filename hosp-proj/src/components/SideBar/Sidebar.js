import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Dashboard from '../Dashboard/Dashboard';
import HealthcarePortal from '../HealthcarePortal/HealthcarePortal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [buttonDisabled, setButtonDisabled] = useState(false); // Add state to track button disabled state
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    const storedDoctorDetails = localStorage.getItem("doctorDetails");
    if (storedDoctorDetails) {
      setDoctorDetails(JSON.parse(storedDoctorDetails));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("doctorDetails");
    window.location.href = "/login";
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
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate password strength (8 characters, with uppercase, lowercase, number, special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    const token = localStorage.getItem("authToken"); // Or wherever you store the JWT token

    try {
      setIsLoading(true); // Disable button
      setButtonDisabled(true); // Disable the reset password button during processing
      // Call the /protected-endpoint to validate the token first
      const response = await fetch("http://localhost:8082/api/user/protected-endpoint", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Token is valid, proceed to change password
        const changePasswordResponse = await fetch("http://localhost:8082/api/user/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: doctorDetails.email,
            password: formData.password,
            newPassword: formData.password, // Send the new password
          }),
        });

        const data = await changePasswordResponse.json();
        if (changePasswordResponse.ok) {
          console.log("Password reset successfully:", data.message);
          toast.success("Password reset successfully", {
            onClose: () => {
              setShowPasswordForm(false);  // Close the popup after toast closes
              setButtonDisabled(false);    // Re-enable the button after toast closes
            }
          });
        } else {
          console.error("Error:", data.message);
          toast.error(data.message || "Password change failed.");
        }
      } else {
        toast.error("Invalid or expired token.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Token validation failed.");
    }
  };

  const handleStatusUpdate = () => {
    // Trigger status update
    setStatusUpdated((prev) => !prev);  // Toggle to force re-render of DashboardHeader
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="profile-section">
          {doctorDetails ? (
            <>
              <img
                src={`http://localhost:8081/${doctorDetails.imagePath}`} // Ensure the backend serves this path correctly
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
          <li onClick={handleLogout}>
            <i className="icon">&#x274C;</i> Logout
          </li>
          <li onClick={() => setShowPasswordForm(true)}>
            <i className="icon">&#x1F512;</i> Change Password
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
        <DashboardHeader selectedDate={selectedDate} statusUpdated={statusUpdated}/>
        <Dashboard selectedDate={selectedDate} />
        <HealthcarePortal selectedDate={selectedDate} setSelectedDate={setSelectedDate} onStatusUpdate={handleStatusUpdate}/>
      </div>
      {showPasswordForm && (
        <div className="popup-overlay">
          <div className="popup-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
              <div className="form-group">
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
              <div className="popup-actions">
                <button 
                  type="submit" 
                  className="forgot-password-button" 
                  disabled={buttonDisabled} // Disable button if loading
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
      {/* Toast Container */}
      <ToastContainer 
      />
    </div>
  );
};

export default Sidebar;
