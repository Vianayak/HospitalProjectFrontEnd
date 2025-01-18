import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    specialization:"",
    experience:"",
    location: "",
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
    if (!formData.location) {
      errors.location = "Location is required.";
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
  
    // Additional validations for the "doctor" role
    if (formData.role === "doctor") {
      if (!formData.specialization) {
        errors.specialization = "Specialization is required.";
      }
      if (formData.profileImage) {
        if (!/\.(jpg|jpeg|png)$/i.test(formData.profileImage.name)) {
          errors.profileImage = "Only JPG, JPEG, and PNG images are allowed.";
        }
        if (formData.profileImage.size > 2 * 1024 * 1024) { // 2MB
          errors.profileImage = "Image size must be less than 2MB.";
        }
        if (formData.experience) { 
          errors.experience = "Experience is required.";
        }
      } else {
        errors.profileImage = "Profile image is required.";
      }
    }
  
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        // Create a FormData object (use a different variable name to avoid conflict with state)
        const formDataToSend = new FormData();
        
        // Append user data fields (converted to a JSON string)
        formDataToSend.append("user", JSON.stringify({
          email: formData.email,
          role: formData.role,
          location: formData.location,
          specialization:formData.specialization,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobileNumber: formData.mobileNumber,
          experience: formData.experience
        }));
        
        // Append the profile image if it exists
        if (formData.profileImage) {
          formDataToSend.append("image", formData.profileImage);
        }
        
        // Send the POST request with FormData
        const response = await fetch("http://localhost:8082/api/user/register", {
          method: "POST",
          body: formDataToSend,  // Include the form data (user details and image)
        });
        
        if (response.ok) {
          alert("User registered successfully!");
          navigate("/login"); // Navigate to login page on successful registration
        } else {
          const errorData = await response.text();
          alert("Error registering user: " + errorData);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
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
        <h2 className="signin">Sign In</h2>
        <div className="close-icon" onClick={() => navigate("/login")}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <form className="signin-form" onSubmit={handleFormSubmit}>
        <div className="form-group1">
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

        <div className="form-group1">
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

        <div className="form-group1">
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

        <div className="form-group1">
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
        <div className="form-group1">
          <label>Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.location && touchedFields.location ? "error-input" : ""}
          >
            <option value="" disabled>
              Select Location
            </option>
       
  <option value="andhra-pradesh">Andhra Pradesh</option>
  <option value="arunachal-pradesh">Arunachal Pradesh</option>
  <option value="assam">Assam</option>
  <option value="bihar">Bihar</option>
  <option value="chhattisgarh">Chhattisgarh</option>
  <option value="goa">Goa</option>
  <option value="gujarat">Gujarat</option>
  <option value="haryana">Haryana</option>
  <option value="himachal-pradesh">Himachal Pradesh</option>
  <option value="jharkhand">Jharkhand</option>
  <option value="karnataka">Karnataka</option>
  <option value="kerala">Kerala</option>
  <option value="madhya-pradesh">Madhya Pradesh</option>
  <option value="maharashtra">Maharashtra</option>
  <option value="manipur">Manipur</option>
  <option value="meghalaya">Meghalaya</option>
  <option value="mizoram">Mizoram</option>
  <option value="nagaland">Nagaland</option>
  <option value="odisha">Odisha</option>
  <option value="punjab">Punjab</option>
  <option value="rajasthan">Rajasthan</option>
  <option value="sikkim">Sikkim</option>
  <option value="tamil-nadu">Tamil Nadu</option>
  <option value="telangana">Telangana</option>
  <option value="tripura">Tripura</option>
  <option value="uttar-pradesh">Uttar Pradesh</option>
  <option value="uttarakhand">Uttarakhand</option>
  <option value="west-bengal">West Bengal</option>
  <option value="andaman-nicobar">Andaman and Nicobar Islands</option>
  <option value="chandigarh">Chandigarh</option>
  <option value="dadra-nagar-haveli">Dadra and Nagar Haveli and Daman and Diu</option>
  <option value="delhi">Delhi</option>
  <option value="jammu-kashmir">Jammu and Kashmir</option>
  <option value="ladakh">Ladakh</option>
  <option value="lakshadweep">Lakshadweep</option>
  <option value="puducherry">Puducherry</option>


          </select>
          {touchedFields.location && formErrors.location && (
            <span className="error">{formErrors.location}</span>
          )}
        </div>
        <div className="form-group1">
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

     {/* Conditionally render fields if role is Doctor */}
{formData.role === "doctor" && (
  <>
    <div className="form-group1">
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

    <div className="form-group1">
          <label>Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={formErrors.experience && touchedFields.experience ? "error-input" : ""}
            placeholder="Enter your Experience"
          />
          {touchedFields.experience && formErrors.experience && (
            <span className="error">{formErrors.experience}</span>
          )}
        </div>
    <div className="form-group1">
      <label>Specialization</label>
      <input
        type="text"
        name="specialization"
        value={formData.specialization}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={formErrors.specialization && touchedFields.specialization ? "error-input" : ""}
        placeholder="Enter your specialization"
      />
      {touchedFields.specialization && formErrors.specialization && (
        <span className="error">{formErrors.specialization}</span>
      )}
    </div>
  </>
)}

<button
  type="submit"
  className="signin-button"
  disabled={!isFormValid} // Use only isFormValid
>
  Sign In
</button>

      </form>
    </div>
  );
};

export default SignIn; 
