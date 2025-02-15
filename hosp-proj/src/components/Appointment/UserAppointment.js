import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./UserAppointment.css";
import axios from "axios";
import { FaHome } from "react-icons/fa";

const Loader = ({ loading }) => (
  <>
    {loading && (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    )}
  </>
);

const UserAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, timeSlot, email, doctorDetails, timeOfDay } = location.state || {};
  const [loading, setLoading] = useState(false);

  const [remainingChars, setRemainingChars] = useState(50);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: email || "",
    dob: "",
    gender: "",
    issue: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  



  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = "Valid 10-digit phone number is required.";
    if (!formData.dob) errors.dob = "Date of Birth is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.issue) errors.issue = "Issue is required";

    setFormErrors(errors);

    const isValid = Object.keys(errors).length === 0 && isTermsChecked;
    setIsFormValid(isValid);
  }, [formData, isTermsChecked]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateForm();
  };

  
  

  const handleTermsChange = () => {
    setIsTermsChecked((prev) => !prev);
    validateForm();
  };

  const handlePayToProceed = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8081/api/book-appointment/initiate", {
        amount: doctorDetails.consultationFee,
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
        issue: formData.issue,
      });

      const amountInPaise = data.amount * 100;

      const options = {
        key: "rzp_test_K5qGcFdtNC8hvm",
        amount: amountInPaise,
        currency: data.currency,
        name: "TechSpryn",
        description: "Test Transaction",
        image: "Assets/Images/TechSpryn_New.png",
        order_id: data.razorpayOrderId,
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          axios.post("http://localhost:8081/api/book-appointment/verify-payment", {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          }).then(() => {
            toast.success("Appointment Successfully Booked!", {
              onClose: () => {
                setLoading(false);
                navigate("/jayahospitals");
              },
            });
          }).catch((error) => {
            console.error("Error verifying payment:", error);
          });
        },
        prefill: {
          name: doctorDetails?.name || "Praveen kumar",
          email: formData.email || "parvez@gmail.com",
          contact: formData.phone,
        },
        theme: {
          color: "#00A4CCFF", // Change this to your desired accent color
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

  const getMaxDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTouchedFields((prev) => ({ ...prev, issues: true })); // Mark issues as touched when the form loads
    validateForm(); // Trigger validation to check for errors on initial render
  }, [validateForm]);
  
  const handleInputFocus = (e) => {
    const { name } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true }); // Mark field as touched when focused
  
    if (name === 'issues') {  // Specifically for issues field
      validateForm();
    }
  };
  
 

  useEffect(() => {
    if (loading) {
      document.body.classList.add("loading");
    } else {
      document.body.classList.remove("loading");
    }
  }, [loading]);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8082/api/user/user-details?email=${email}`);
      if (response.data) {
        const patient = response.data;
        setFormData({
          ...formData,
          firstName: patient.firstName,
          lastName: patient.lastName,
          phone: patient.mobileNumber,
          regNum: patient.registrationNumber,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchUserDetails();
    }
  }, [email, fetchUserDetails]);


  return (
    <>
    <Loader loading={loading} />
      <div className="loader-wrapper">
    <div className={`loader ${loading ? 'show' : ''}`}>
      <div></div>
    </div>
  </div>
  <div className="content-wrapper">
      <header className="header1">
        <Link to="/jayahospitals" className="home-icon-link">
          <FaHome className="home-icon" />
        </Link>
        <div className="header-content">
          <h1>
            {/* <img
              src="Assets/Images/whitelogos.png"
              alt="Jaya Hospitals Logo"
              className="header-logo"
            /> */}
            <img
            src="Assets/Images/TechSpryn_New.png"
            alt="TechSpryn Logo"
            className="header-logo"></img>
          </h1>
        </div>
      </header>

      
      
        <div className="content">
          <div className="user-details">
            <h2> {formData.regNum ? `${formData.regNum} (${formData.firstName} ${formData.lastName})` : "New user"}</h2>
            <h2 className="uhid-note">Fill Your Personal Details.</h2>
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
  <textarea
    name="issue"
    placeholder="Describe your issue (up to 50 characters)"
    value={formData.issue}
    onChange={(e) => {
      handleInputChange(e); // Keep existing handler logic
      setRemainingChars(50 - e.target.value.length); // Update remaining characters
    }}
    onFocus={handleInputFocus} // Track focus
    className={
      formErrors.issue && touchedFields.issue ? "error1-input" : ""
    }
    maxLength="50" // Restrict input to 50 characters
    rows="4" // Number of visible lines
  />
  <span className="remaining-chars">
    {remainingChars} characters remaining
  </span>
  <span className="error1">
    {touchedFields.issue && formErrors.issue ? formErrors.issue : ""}
  </span>
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
            </div>
            <div className="terms">
              <input
                type="checkbox"
                id="terms"
                checked={isTermsChecked}
                onChange={handleTermsChange}
              />
              <label htmlFor="terms">Agree to the Terms & Conditions</label>
            </div>
            <button
              className="confirm-btn"
              disabled={!isFormValid}
              onClick={handlePayToProceed}
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
