import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserAppointment.css";
import axios from "axios";

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader"></div>
  </div>
);

const UserAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook
  const { date, timeSlot, email, doctorDetails,timeOfDay } = location.state || {}; // Retrieve passed data
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: email || "",
    dob: "",
    gender: "",
    issue:"",
    issues: [],
  });

  const handlePayToProceed = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8081/api/book-appointment/initiate", {
        amount: 500, 
        currency: "INR", 
        firstName: formData.firstName, 
        lastName: formData.lastName, 
        mobile: formData.phone, 
        email: formData.email, 
        dob: formData.dob, 
        gender: formData.gender,
        doctorRegNum: doctorDetails.regestrationNum,
        scheduledDate: date,
        scheduledTime: timeSlot,
        slot: timeOfDay,
        issueIds: formData.issues.map((issue) => issue.id),
      });

      const amountInPaise = data.amount * 100;

      console.log("Received Data:", data);

      const options = {
        key: "rzp_test_K5qGcFdtNC8hvm",
        amount: amountInPaise,
        currency: data.currency,
        name: "Jaya Hospitals",
        description: "Test Transaction",
        image: "Assets/images/HeaderLogo.png",
        order_id: data.razorpayOrderId,
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      
          // Make sure these values are logged correctly
          console.log("Payment ID:", razorpay_payment_id);
          console.log("Order ID:", razorpay_order_id);
          console.log("Signature:", razorpay_signature);
      
          // Send the data to the backend for verification
          axios.post("http://localhost:8081/api/book-appointment/verify-payment", {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          })
          .then(() => {
            toast.success("Appointment Successfully Booked!",{
            onClose: () => {
              // Navigate to the login page after the toast closes
              setLoading(false);
              navigate("/jayahospitals");
            },
          });
            
          })
          .catch((error) => {
            console.error("Error verifying payment:", error);
            
          });
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
      
    }
  };

  const [issueSuggestions, setIssueSuggestions] = useState([]);
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
    if (!formData.issue) errors.issue = "Please select or enter an issue.";

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field and update errors
    validateForm();
  };

  const handleIssueChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, issue: value });
  
    if (value.length >= 3) {
      try {
        const { data } = await axios.get(`http://localhost:8081/api/issues/search?keyword=${value}`);
        setIssueSuggestions(data || []);
        console.log("Fetched Suggestions:", data); // Debugging line
      } catch (error) {
        console.error("Error fetching issue suggestions:", error);
      }
    } else {
      setIssueSuggestions([]);
    }
  };
  
  
  const handleIssueSelect = (id, issueName) => {
    setFormData((prevFormData) => {
      const { issues } = prevFormData;
  
      // Check if the issue is already selected
      const isAlreadySelected = issues.some((issue) => issue.id === id);
      if (isAlreadySelected) {
        toast.info("Issue already selected.");
        return prevFormData;
      }
  
      // Prevent adding more than three issues
      if (issues.length >= 3) {
        toast.error("You can select a maximum of 3 issues.");
        return prevFormData;
      }
  
      return {
        ...prevFormData,
        issues: [...issues, { id, name: issueName }], // Add the new issue
        issue: "", // Clear input field
      };
    });
    setIssueSuggestions([]); // Close the dropdown
  };
  
  

  
  const handleIssueRemove = (id) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      issues: prevFormData.issues.filter((issue) => issue.id !== id), // Remove the issue
    }));
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


  const getMaxDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
    <header className="header">
  <h1>
    <img
      src="Assets/Images/whitelogos.png" // Replace with the correct path to your image
      alt="Jaya Hospitals Logo"
      className="header-logo"
    />
    JAYA HOSPITALS
  </h1>
</header>


      <div className="content-wrapper">
      {loading && <div className="blurred-background"></div>}
      <div className="loader-wrapper">
    <div className={`loader ${loading ? 'show' : ''}`}>
      <div></div>
    </div>
  </div>
        <div className="content">
          <div className="user-details">
            <h2>APJ1.0002836055 (Vinayak Banoth)</h2>
            <p className="uhid-note">Fill Your Personal Details.</p>
            <form className="details-form">
            <div className="form-group2">
  <label>First Name</label>
  <input
    type="text"
    name="firstName"
    placeholder="Enter Your First Name"
    value={formData.firstName}
    onChange={handleInputChange}
    onFocus={handleInputFocus} // Track focus
    className={formErrors.firstName && touchedFields.firstName ? "error1-input" : ""}
  />
  <span className="error1">
    {touchedFields.firstName && formErrors.firstName ? formErrors.firstName : ""}
  </span>
</div>

              <div className="form-group2">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Your Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.lastName && touchedFields.lastName ? "error1-input" : ""}
                />
                <span className="error1">
                {touchedFields.lastName && formErrors.lastName ?
                  formErrors.lastName : ""}</span>
                
              </div>
              <div className="form-group2">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="xxxxxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.phone && touchedFields.phone ? "error1-input" : ""}
                />
                {touchedFields.phone && formErrors.phone && (
                  <span className="error1">{formErrors.phone}</span>
                )}
              </div>
              <div className="form-group2">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="form-group2">
  <label>DOB</label>
  <input
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleInputChange}
    onFocus={handleInputFocus} // Track focus
    max={getMaxDate()} // Set max date to today
    className={formErrors.dob && touchedFields.dob ? "error1-input" : ""}
  />
  {touchedFields.dob && formErrors.dob && (
    <span className="error1">{formErrors.dob}</span>
  )}
</div>
              <div className="form-group2">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus} // Track focus
                  className={formErrors.gender && touchedFields.gender ? "error1-input" : ""}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {touchedFields.gender && formErrors.gender && (
                  <span className="error1">{formErrors.gender}</span>
                )}
              </div>
              <div className="form-group2">
  <label>Issue</label>
  <input
    type="text"
    name="issue"
    placeholder={
      formData.issues.length > 0
        ? formData.issues.map((issue) => issue.name).join(", ") // Show selected issues
        : "Enter your issue"
    }
    value={formData.issue || ""} // Input value is temporary, only for suggestions
    onChange={handleIssueChange} // Handle user input
    onFocus={handleInputFocus} // Track focus
    className={formErrors.issue && touchedFields.issue ? "error1-input" : ""}
  />
  {touchedFields.issue && formErrors.issue && (
    <span className="error1">{formErrors.issue}</span>
  )}

  {/* Issue suggestions dropdown */}
  {issueSuggestions.length > 0 && (
    <ul className="suggestion-dropdown">
      {issueSuggestions.map((suggestion) => (
        <li
          key={suggestion.id}
          onClick={() => handleIssueSelect(suggestion.id, suggestion.name)}
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  )}

  {/* Display selected issues below input */}
  {formData.issues.length > 0 && (
    <div className="selected-issues">
      {formData.issues.map((issue) => (
        <div key={issue.id} className="issue-tag">
          {issue.name}
          <button
            type="button"
            onClick={() => handleIssueRemove(issue.id)} // Remove issue
            className="remove-issue-btn"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
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
        <ToastContainer />
      </div>
    </>
  );
};

export default UserAppointment;
