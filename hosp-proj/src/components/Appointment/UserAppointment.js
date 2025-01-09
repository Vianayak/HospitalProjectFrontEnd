import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./UserAppointment.css";
import axios from "axios";

const UserAppointment = () => {
  const location = useLocation();
  const { date, timeSlot, email, doctorDetails } = location.state || {}; // Retrieve passed data

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: email || "",
    dob: "",
    gender: "",
  });

  const handlePayToProceed = async () => {
    try {
      const { data } = await axios.post("http://localhost:8081/api/book-appointment/initiate", {
        amount: 500,
        currency: "INR",
        firstName: "namasthe",
        lastName: "Telangana",
        mobile: 8919967393,
        email: email || "hero@gmail.com", // Use the passed email
        dob: "21/08/2025",
        gender: "male",
      });

      const amountInPaise = data.amount * 100;

      const options = {
        key: "rzp_test_K5qGcFdtNC8hvm",
        amount: amountInPaise,
        currency: data.currency,
        name: "Jaya Hospitals",
        description: "Test Transaction",
        image: "Assets/images/HeaderLogo.png",
        order_id: data.razorpayOrderId,
        handler: (response) => {
          console.log("Payment successful!", response);
          axios.post("http://localhost:8081/api/book-appointment/verify-payment", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
            .then(() => {
              alert("Payment verified successfully!");
            })
            .catch((error) => {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed.");
            });

          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: doctorDetails?.name || "Praveen kumar", // Use passed doctor details
          email: email || "parvez@gmail.com", // Use passed email
          contact: "8919967393",
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (!window.Razorpay) {
        console.error("Razorpay SDK is not loaded.");
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isTermsChecked, setIsTermsChecked] = useState(false); // New state for checkbox

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Valid 10-digit phone number is required.";
    }
    if (!formData.dob) errors.dob = "Date of Birth is required.";
    if (!formData.gender) errors.gender = "Gender is required.";

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field and update errors
    validateForm();
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true }); // Mark field as touched when focused
  };

  const handleTermsChange = () => {
    setIsTermsChecked((prev) => !prev); // Toggle checkbox state
  };

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  return (
    <>
      <header className="header">
        <h1>JAYA HOSPITALS</h1>
      </header>

      <div className="content-wrapper">
        <div className="content">
          <div className="user-details">
            <h2>APJ1.0002836055 (Vinayak Banoth)</h2>
            <p className="uhid-note">Fill Your Personal Details.</p>
            <form className="details-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter Your First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.firstName && touchedFields.firstName ? "error-input" : ""}
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
                  placeholder="Enter Your Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.lastName && touchedFields.lastName ? "error-input" : ""}
                />
                {touchedFields.lastName && formErrors.lastName && (
                  <span className="error">{formErrors.lastName}</span>
                )}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="xxxxxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.phone && touchedFields.phone ? "error-input" : ""}
                />
                {touchedFields.phone && formErrors.phone && (
                  <span className="error">{formErrors.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="form-group">
                <label>DOB</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.dob && touchedFields.dob ? "error-input" : ""}
                />
                {touchedFields.dob && formErrors.dob && (
                  <span className="error">{formErrors.dob}</span>
                )}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.gender && touchedFields.gender ? "error-input" : ""}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {touchedFields.gender && formErrors.gender && (
                  <span className="error">{formErrors.gender}</span>
                )}
              </div>
            </form>
          </div>

          <div className="appointment-details">
            <h2>Appointment Details</h2>
            <div className="appointment-info">
              <div>
                <h4>Appointment Date</h4>
                <p>{date}</p>
              </div>
              <div>
                <h4>Appointment Time</h4>
                <p>{timeSlot}</p>
              </div>
              <div>
                <h4>Doctor</h4>
                <p>{doctorDetails?.name}</p>
              </div>
              <div>
                <h4>Location</h4>
                <p>{doctorDetails?.location}</p>
              </div>
            </div>
            <div className="terms">
              <input
                type="checkbox"
                id="terms"
                checked={isTermsChecked}
                onChange={handleTermsChange} // Handle checkbox state change
              />
              <label htmlFor="terms">
                <button
                  type="button"
                  onClick={() => alert("Redirect to Terms & Conditions page")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  To The Terms & Conditions
                </button>
              </label>
            </div>
            <button
    className="confirm-btn"
    disabled={!isFormValid || !isTermsChecked}
    onClick={handlePayToProceed} // Attach click handler
  >
    Pay to Proceed
  </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAppointment;
