import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false); // Loader state

  useEffect(() => {
    setFormData({ username: "", password: "", rememberMe: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

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
        const responseData = await response.json();
        const token = responseData.token;
        localStorage.setItem("authToken", token);

        if (responseData.doctorDetails) {
          localStorage.setItem("doctorDetails", JSON.stringify(responseData.doctorDetails));
        }

        toast.success("Login successful!",{
          onClose: () => {
            navigate("/sidebar");
          },
        });
          
   
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
    }finally {
      // Stop loader after toast closes
      setTimeout(() => {
        setIsLoading(false);
      }, 4000); // Match this duration to toast's autoClose duration
    }
  };

  return (
    <div className="overlay">
      <div className="login-container">
        <ToastContainer position="top-center" autoClose={3000} />
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
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <a
            href="/forgot"
            className="forgot-password"
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
              navigate("/SignUp");
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
