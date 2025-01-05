import React, { useEffect } from "react";
import "./UserAppointment.css";
import axios from "axios";

const UserAppointment = () => {
  // Dynamically load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay SDK loaded.");
      script.onerror = () => console.error("Razorpay SDK failed to load.");
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    try {
      // Step 1: Create order via backend
      const { data } = await axios.post("http://localhost:8081/api/book-appointment/initiate", {
        amount: 500, // INR in paise (500 INR = 50000 paise)
        currency: "INR",
        firstName:"vinfghjk",
	      lastName:"bano",
        mobile:902637398,
	      email:"vina@gmail.com",
	      dob:"21/08/2024",
	      gender:"male",
      });
  
      // Ensure the amount is in paise (multiplying INR by 100 if necessary)
      const amountInPaise = data.amount * 100;
  
      // Step 2: Open Razorpay Checkout
      const options = {
        key: "rzp_test_2ThA8oBdItjHWx", // Replace with your Razorpay key
        amount: amountInPaise, // Amount in paise
        currency: data.currency,
        name: "Jaya Hospitals",
        description: "Test Transaction",
        image: "Assets/images/HeaderLogo.png", // Replace with correct logo path
        order_id: data.razorpayOrderId, // Order ID from backend
        handler: (response) => {
          // Step 3: Handle payment success
          console.log("Payment successful!", response);
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Praveen kumar",
          email: "parvez@gmail.com",
          contact: "8919967393",
        },
        theme: {
          color: "#3399cc", // Customize the button color
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
  

  return (
    <div className="content-wrapper">
      <div className="content">
        {/* User Details Section */}
        <div className="user-details">
          <h2>APJ1.0002836055 (Vinayak Banoth)</h2>
          <p className="uhid-note">Any change in UHID can be done at the hospital/clinic.</p>
          <form className="details-form">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value="Vinayak" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value="Banoth" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value="8919967393" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>DOB</label>
              <input type="date" value="1996-06-21" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="gender" value="Male" /> Male
                </label>
                <label>
                  <input type="radio" name="gender" value="Female" /> Female
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Appointment Details Section */}
        <div className="appointment-details">
          <h2>Appointment Details</h2>
          <div className="appointment-info">
            <div>
              <h4>Appointment Date</h4>
              <p>21, Jan 2025</p>
            </div>
            <div>
              <h4>Appointment Time</h4>
              <p>11:00 - 11:30 AM</p>
            </div>
            <div>
              <h4>Doctor</h4>
              <p>Dr. Madhuri Khilari</p>
            </div>
            <div>
              <h4>Location</h4>
              <p>Apollo Health City, Jubilee Hills</p>
            </div>
          </div>
          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I Agree <a href="#">To The Terms & Conditions</a>.
            </label>
          </div>
          <button className="confirm-btn" onClick={handlePayment}>
            Pay to Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAppointment;
