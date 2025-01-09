import React, { useEffect } from "react";
import "./UserAppointment.css";
import axios from "axios";

const UserAppointment = () => {
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
      const { data } = await axios.post("http://localhost:8081/api/book-appointment/initiate", {
        amount: 500,
        currency: "INR",
        firstName: "namasthe",
        lastName: "Telangana",
        mobile: 8919967393,
        email: "hero@gmail.com",
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
          name: "Praveen kumar",
          email: "parvez@gmail.com",
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
                <input type="text" placeholder="Enter Your Fist Name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Enter Your Last Name" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" placeholder="+91 xxxxxxxxxx" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label>DOB</label>
                <input type="date" placeholder="1996-06-21" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select>
                  <option value="" disabled selected>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </form>
          </div>

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
    </>
  );
};

export default UserAppointment;
