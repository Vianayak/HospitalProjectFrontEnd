import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import axios from 'axios';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [countdown, setCountdown] = useState(0); // Initially no timer
  const [canResendOtp, setCanResendOtp] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required.";
    }
    if (showOtpForm) {
      if (!formData.otp || formData.otp.length !== 6) {
        errors.otp = "A valid OTP is required.";
      }
    }
    if (showPasswordForm) {
      if (!formData.password) {
        errors.password = "Password is required.";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP.");
      }

      setShowOtpForm(true);
      setCanResendOtp(true); // Allow the user to resend OTP immediately after the first send
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const startCountdown = () => {
    setCountdown(30); // Start countdown at 30 seconds
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResendOtp(true); // Enable resend button
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to resend OTP.");
      }

      setCanResendOtp(false); // Disable resend button during countdown
      startCountdown(); // Start the countdown timer
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/otp/verifyOtp", null, {
        params: {
          email: email,
          otp: otp,
        },
      });
      alert(response.data);
      setShowOtpForm(false); // Hide OTP input after verification
      setEmail(""); // Clear email field
      setShowPasswordForm(true); // Show password fields after OTP verification
    } catch (error) {
      alert(error.response?.data || "Error verifying OTP");
    }
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
            className="popup-input"
            placeholder="What is your email?"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!showOtpForm ? (
            <button className="popup-button" onClick={handleSendOtp}>
              Send Otp
            </button>
          ) : (
            <div>
              <input
                type="text"
                className="popup-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {countdown > 0 && (
                <div className="countdown-timer">{`Resend in ${countdown}s`}</div>
              )}
              {canResendOtp && (
                <div className="resend-otp-container">
                  <a
                    href="#"
                    className="resend-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResendOtp();
                    }}
                  >
                    Resend OTP
                  </a>
                </div>
              )}
              <button className="popup-button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          )}
        </div>

        {showPasswordForm && (
          <div>
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
          </div>
        )}

        {showPasswordForm && (
          <button
            type="submit"
            className="forgot-password-button"
            disabled={!isFormValid}
          >
            Reset Password
          </button>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
