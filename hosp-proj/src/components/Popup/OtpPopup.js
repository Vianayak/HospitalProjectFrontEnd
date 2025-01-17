import React, { useState } from "react";
import "./PopupStyles.css";

const OtpPopup = ({ email, setEmail, otp, setOtp, handleSendOtp, handleResendOtp, handleVerifyOtp, handleClosePopup }) => {
  const [canResendOtp, setCanResendOtp] = useState(true); // Show resend link initially
  const [countdown, setCountdown] = useState(0);
  const [showOtpForm, setShowOtpForm] = useState(false); // Local state for showing OTP form

  const startCountdown = () => {
    setCountdown(30);
    setCanResendOtp(false); // Disable resend link during countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResendOtp(true); // Enable resend link after countdown
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtpWrapper = () => {
    handleSendOtp();
    setShowOtpForm(true); // Show OTP form after sending the OTP
    startCountdown(); // Start countdown after sending the OTP
  };

  const onResendOtp = () => {
    handleResendOtp();
    startCountdown(); // Restart countdown on resend
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={handleClosePopup}>
          &times;
        </button>
        <div className="popup-content">
          <div className="popup-image">
            <img src="Assets/Images/popupImage.webp" alt="Popup" />
          </div>
          <div className="popup-form">
            <header className="header">
              <h4>
                <img
                  src="Assets/Images/whitelogos.png"
                  alt="Jaya Hospitals Logo"
                  className="header-logo"
                />
                JAYA HOSPITALS
              </h4>
            </header>
            <input
              type="email"
              className="popup-input"
              placeholder="What is your email?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!showOtpForm ? (
              <button className="popup-button" onClick={handleSendOtpWrapper}>
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
                  <div className="countdown-timer">{`Didnt get OTP?Resend in ${countdown}s`}</div>
                )}
                {canResendOtp && (
                  <div className="resend-otp-container">
                    <a
                      href="#"
                      className="resend-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onResendOtp();
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
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
