import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    profileImage: null, // Image file state
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate(); // Initialize navigate

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required.";
    }
    if (!formData.role) {
      errors.role = "Role is required.";
    }
    if (!formData.firstName) {
      errors.firstName = "First name is required.";
    }
    if (!formData.lastName) {
      errors.lastName = "Last name is required.";
    }
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Valid mobile number is required.";
    }
    if (formData.profileImage) {
      if (!/\.(jpg|jpeg|png)$/i.test(formData.profileImage.name)) {
        errors.profileImage = "Only JPG, JPEG, and PNG images are allowed.";
      }
      if (formData.profileImage.size > 2 * 1024 * 1024) { // 2MB
        errors.profileImage = "Image size must be less than 2MB.";
      }
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && formData.profileImage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profileImage: e.target.files[0],
    }));
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Form submitted successfully!");
      navigate("/login"); // Navigate to the login page
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="signin-container">
      <div className="signin-header">
        <div className="login-header">
          <img src="/Assets/Images/whitelogos.png" alt="Logo" className="logo" />
          <span>JAYA HOSPITALS</span>
        </div>
        <h2>Sign In</h2>
        <div className="close-icon" onClick={() => navigate("/login")}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <form className="signin-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.firstName && touchedFields.firstName ? "error-input" : ""}
            placeholder="Enter your first name"
          />
          {touchedFields.firstName && formErrors.firstName && (
            <span className="error">{formErrors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.lastName && touchedFields.lastName ? "error-input" : ""}
            placeholder="Enter your last name"
          />
          {touchedFields.lastName && formErrors.lastName && (
            <span className="error">{formErrors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.email && touchedFields.email ? "error-input" : ""}
            placeholder="Enter your email"
          />
          {touchedFields.email && formErrors.email && (
            <span className="error">{formErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.mobileNumber && touchedFields.mobileNumber ? "error-input" : ""}
            placeholder="Enter your mobile number"
          />
          {touchedFields.mobileNumber && formErrors.mobileNumber && (
            <span className="error">{formErrors.mobileNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.role && touchedFields.role ? "error-input" : ""}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          {touchedFields.role && formErrors.role && (
            <span className="error">{formErrors.role}</span>
          )}
        </div>

        <div className="form-group">
          <label>Upload Profile Image</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleImageUpload}
          />
          {touchedFields.profileImage && formErrors.profileImage && (
            <span className="error">{formErrors.profileImage}</span>
          )}
        </div>

        <button
          type="submit"
          className="signin-button"
          disabled={!isFormValid} // Disable the button if the form is invalid or no image is uploaded
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn; 
