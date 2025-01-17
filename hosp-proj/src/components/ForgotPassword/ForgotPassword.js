import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import axios from "axios";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const navigate = useNavigate();

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
    if (!formData.email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(
          formData.email
        )}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP.");
      }

      setShowOtpForm(true);
      setCanResendOtp(true);
      startCountdown();
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResendOtp(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(
          formData.email
        )}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to resend OTP.");
      }

      setCanResendOtp(false);
      startCountdown();
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/otp/verifyOtp", null, {
        params: {
          email: formData.email,
          otp: formData.otp,
        },
      });
      alert(response.data);
      setShowOtpForm(false);
      setShowPasswordForm(true);
    } catch (error) {
      alert(error.response?.data || "Error verifying OTP");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Password reset successful!");
      navigate("/login");
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
  {!showOtpForm && !showPasswordForm && (
    <div className="form-group">
      <div className="label-input-container">
      <label>Email</label>
      <input
        type="email"
        name="email"
        className="popup-input"
        placeholder="What is your email?"
        value={formData.email}
        onChange={handleInputChange}
      />
      </div>
      <div>
        <button
          type="button"
          className="popup-button"
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
      </div>
    </div>
  )}



        {showOtpForm && !showPasswordForm && (
          <div>
            <div className="form-group">
            <div className="label-input-container">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="popup-input"
                value={formData.email}
                disabled
              />
              </div>
            </div>
            <div className="form-group">
            <div className="label-input-container">
              <label>OTP</label>
              <input
                type="text"
                name="otp"
                className="popup-input"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleInputChange}
              />
              </div>
              {countdown > 0 && (
                <div className="countdown-timer">{`Resend in ${countdown}s`}</div>
              )}
              
              <button
                type="button"
                className="popup-button"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {showPasswordForm && (
          <div>
            <div className="form-group">
            <div className="label-input-container">
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
            </div>
            <div className="form-group">
            <div className="label-input-container">
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
            <button
              type="submit"
              className="forgot-password-button"
              disabled={!isFormValid}
            >
              Reset Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
