import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import axios from "axios";

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader"></div>
  </div>
);

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
  const [countdown, setCountdown] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    // Validate email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required.";
    }

    // Validate OTP
    if (showOtpForm && (!formData.otp || formData.otp.length !== 6)) {
      errors.otp = "A valid OTP is required.";
    }

    // Validate password and confirm password
    if (showPasswordForm) {
      if (!formData.password) {
        errors.password = "Password is required.";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        errors.password = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(formData.email)}`,
        { method: "POST" }
      );

      if(response.ok){
        toast.success("OTP Sent Successfully!", {
          onOpen: () => setLoading(true),
          onClose: () => {
            setLoading(false);
            setShowOtpForm(true);
            setCanResendOtp(true);
            startCountdown();
          },
        });
      }else{
        setLoading(false);
        const errorText = await response.text();
        toast.error(errorText || "Failed to send OTP.");
      }
      
    } catch (error) {
      setLoading(false);
      console.error("Error sending OTP:", error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  const startCountdown = () => {
    setCountdown(30);
    setCanResendOtp(false);
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
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/otp/sendOtp?email=${encodeURIComponent(formData.email)}`,
        { method: "POST" }
      );

      if (!response.ok) {
        setLoading(false);
        const errorText = await response.text();
        toast.error(errorText || "Failed to resend OTP.");
      }
      toast.success("OTP Sent Successfully!", {
        onClose: () => {
          // Navigate to the login page after the toast closes
          setLoading(false);
          setCanResendOtp(false);
      startCountdown();
        },
      });
      
    } catch (error) {
      setLoading(false);
      console.error("Error resending OTP:", error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8081/api/otp/verifyOtp", null, {
        params: {
          email: formData.email,
          otp: formData.otp,
        },
      });
      toast.success("OTP Verified Successfully!", {
        onClose: () => {
          // Navigate to the login page after the toast closes
          setLoading(false);
          setShowOtpForm(false);
      setShowPasswordForm(true);
        },
      });
      
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data || "Error verifying OTP");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form synchronously before submitting
    const isValid=validateForm(); // Ensure validation happens before submission
  
    // Immediately check if the form is valid
    if (!isValid) {
      Object.values(formErrors).forEach((error) => {
        toast.error(error);
      });
      return; // Prevent submission if the form is not valid
    }
  
    setLoading(true);
    try {
      // Your password reset logic here...
      toast.success("Password Reset Successfully", {
        onClose: () => {
          setLoading(false);
          navigate("/login");
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error("Error resetting password:", error);
    }
  };
  

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className={`forgot-password-container ${loading ? "blurred" : ""}`}>
      {loading && <div className="blurred-background"></div>}
      <div className="loader-wrapper">
    <div className={`loader ${loading ? 'show' : ''}`}>
      <div></div>
    </div>
  </div>
      <div className="back-icon1" onClick={() => navigate("/login")}>
        <i className="fas fa-arrow-left"></i>
      </div>
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
                style={{ marginLeft: "90px" }}
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
                <div className="countdown-timer">{`Didn't receive OTP? Resend in ${countdown}s`}</div>
              )}
              {canResendOtp && (
                <div className="resend-link">
                  <a href="#" onClick={handleResendOtp}>
                    Resend OTP
                  </a>
                </div>
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
            >
              Reset Password
            </button>
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
