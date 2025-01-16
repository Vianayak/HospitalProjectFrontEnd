import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.otp || formData.otp.length !== 6) {
      errors.otp = "A valid OTP is required.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Password reset successful!");
      navigate("/login"); // Navigate to the login page
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <h2>Forgot Password</h2>
      </div>
      <form className="forgot-password-form" onSubmit={handleFormSubmit}>
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
          <label>OTP</label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.otp && touchedFields.otp ? "error-input" : ""}
            placeholder="Enter OTP sent to your email"
          />
          {touchedFields.otp && formErrors.otp && (
            <span className="error">{formErrors.otp}</span>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.password && touchedFields.password ? "error-input" : ""}
            placeholder="Enter new password"
          />
          {touchedFields.password && formErrors.password && (
            <span className="error">{formErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.confirmPassword && touchedFields.confirmPassword ? "error-input" : ""}
            placeholder="Confirm new password"
          />
          {touchedFields.confirmPassword && formErrors.confirmPassword && (
            <span className="error">{formErrors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="forgot-password-button"
          disabled={!isFormValid} // Disable the button if the form is invalid
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
