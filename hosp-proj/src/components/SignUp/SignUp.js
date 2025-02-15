import React, { useState , useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    specialization: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    experience: "",
    profileImage: null,
    consultationfee:"",
  });

  const [currentStep, setCurrentStep] = useState(1); // Step for fields
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidImage, setIsValidImage] = useState(false); // Initially invalid


  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required.";
    }
   if(!formData.consultationfee){
    errors.consultationfee= "Enter Consultation Fee.";
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
      if (!formData.specialization) {
        errors.specialization = "Specialization is required.";
      }
      if (formData.profileImage) {
        if (!/\.(jpg|jpeg|png)$/i.test(formData.profileImage.name)) {
          errors.profileImage = "Only JPG, JPEG, and PNG images are allowed.";
        }
        if (formData.profileImage.size > 2 * 1024 * 1024) {
          errors.profileImage = "Image size must be less than 2MB.";
        }
      } else {
        errors.profileImage = "Profile image is required.";
      }
      if (!formData.experience) {
        errors.experience = "Experience is required.";
      }
    

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB in bytes
      const isValidType = file.type.startsWith('image/');
      
      if (isValidSize && isValidType) {
        setIsValidImage(true); // Image meets criteria
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          profileImage: null,
        }));
        setFormData((prevData) => ({
          ...prevData,
          profileImage: file,
        }));
      } else {
        setIsValidImage(false); // Invalid image
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          profileImage: "Image should be under 2MB and of image type",
        }));
      }
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      try {
        // Create a FormData object (use a different variable name to avoid conflict with state)
        const formDataToSend = new FormData();
        
        // Append user data fields (converted to a JSON string)
        formDataToSend.append("user", JSON.stringify({
          email: formData.email,
          specialization:formData.specialization,
          firstName: formData.firstName,
          lastName: formData.lastName,
          consultationFee:formData.consultationfee,
          mobileNumber: formData.mobileNumber,
          experience: formData.experience,
          role:"doctor"
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
          setIsLoading(true);
        
          // Show the toast with an onClose callback
          toast.success("User registered successfully!", {
            onClose: () => {
              // Navigate to the login page after the toast closes
              setIsLoading(false);
              sessionStorage.setItem("validNavigation", "true");

              // Navigate to user appointment page
              navigate("/login");
            },
          });
        } else {
          const errorData = await response.text();
          setIsLoading(false);
          toast.error("Error registering user: " + errorData);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Error: " + error.message);
      }
    }
  };

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  return (
    <div className="signin-container">
  {/* Blurred background */}
      {isLoading && <div className="blurred-background"></div>}
      <div className="loader-wrapper">
    <div className={`loader ${isLoading ? 'show' : ''}`}>
      <div></div>
    </div>
  </div>
      <div className="back-icon1" onClick={() =>{ 
         sessionStorage.setItem("validNavigation", "true");

// Navigate to user appointment page
         navigate("/login");}}>
      {currentStep === 1 && (
    <i className="fas fa-arrow-left"></i>  // Only show left arrow on Step 1
  )}
      </div>
      <div className="signin-header">
        <div className="login-header">
          <img src="/Assets/Images/TechSpryn_New.png" alt="Logo" className="logo" />
        </div>
        <h2>Sign In</h2>
      </div>
      <form className="signin-form" onSubmit={handleFormSubmit}>
        {currentStep === 1 && (
          <>
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
                placeholder="Enter your Mobile Number"
              />
              {touchedFields.mobileNumber && formErrors.mobileNumber && (
            <span className="error">{formErrors.mobileNumber}</span>
          )}
            </div>
          </>
        )}

      

        {currentStep === 2 && (
          <>
         <div className="form-group1">
  <label>Upload Profile Image</label>
  <input
    type="file"
    name="profileImage"
    onChange={handleImageUpload}
    onFocus={handleInputFocus}
    className={
      formErrors.profileImage && touchedFields.profileImage ? "error-input" : ""
    }
  />
  <div
    className={`image-note ${
      isValidImage ? "valid" : "invalid"
    }`}
    style={{ color: isValidImage ? "green" : "red" }}
  >
    {!isValidImage && "Image should be under 2MB and of image type png,jpg,jpeg"}
  </div>
  {touchedFields.profileImage && formErrors.profileImage && (
    <span className="error">{formErrors.profileImage}</span>
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
              <label>Consultation Fee</label>
              <input
                type="text"
                name="consultationfee"
                value={formData.consultationfee}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={formErrors.consultationfee && touchedFields.consultationfee ? "error-input" : ""}
                placeholder="Enter Consultation Fee"
              />
              {touchedFields.consultationfee && formErrors.consultationfee && (
            <span className="error">{formErrors.consultationfee}</span>
          )}
            </div>
          </>
        )}

        {/* Pagination Arrows */}
        <div className="pagination-arrows">

        {currentStep > 1 && (
          <button type="button" onClick={handlePreviousStep} className="prev">
            &#8592; Back
          </button>
          )}

          {/* Show Next button only if we are not on the last step */}
          {currentStep === 1 && (
            <button type="button" onClick={handleNextStep} disabled={currentStep === 2  && !isFormValid} className="next">
              Next &#8594;
            </button>
            
          )}

           
        </div>



        {currentStep === 2  && (
    <button type="submit" className="signin-button" disabled={!isFormValid}>
      {isLoading ? "Submitting..." : "Submit"}
    </button>

)}

       
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
