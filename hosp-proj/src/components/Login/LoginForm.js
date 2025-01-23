import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  // Form state initialized with empty fields
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // Reset form when the component mounts
  useEffect(() => {
    setFormData({ username: "", password: "", rememberMe: false });
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8082/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const token = await response.text(); // Assuming the backend sends the token as a plain string
        localStorage.setItem("authToken", token); // Store the token
        alert("Login successful!");
        setFormData({ username: "", password: "", rememberMe: false }); // Reset form
        navigate("/sidebar"); // Redirect to the dashboard
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  

  return (
    <div className="overlay">
      <div className="login-container">
        <div className="login-header">
          <img src="/Assets/Images/whitelogos.png" alt="Logo" className="logo" />
          <span>JAYA HOSPITALS</span>
          <h2>LOG IN</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              <i className="fa fa-user"></i> Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label>
              <i className="fa fa-lock"></i> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label>Remember me</label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <a href="/forgot" className="forgot-password"
           onClick={(e) => {
            e.preventDefault();
            navigate("/forgot");
          }}
          >
            Forgot Password?
          </a>
        <a
          href="/SignUp"
          className="SignUp"
          onClick={(e) => {
            e.preventDefault();
            navigate("/SignUp"); // Navigate to Sign Up page
          }}
        >
          Sign Up
        </a>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
