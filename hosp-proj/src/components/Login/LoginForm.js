import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [role, setRole] = useState("");

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

    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    setIsLoading(true);

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
        const userRole = responseData.role;

        localStorage.setItem("authToken", token);

        if (userRole.toLowerCase() !== role.toLowerCase()) {
          toast.error("Role mismatch. Please select the correct role.");
          setIsLoading(false);
          return;
        }

        // Store role-specific details and navigate
        sessionStorage.setItem("validNavigation", "true");

        if (userRole.toLowerCase() === "doctor") {
          if (responseData.doctorDetails) {
            localStorage.setItem(
              "doctorDetails",
              JSON.stringify(responseData.doctorDetails)
            );
          }

          toast.success("Login successful!", {
            onClose: () => navigate("/doctors-dashboard-page"),
          });

        } else if (userRole.toLowerCase() === "patient") {
          if (responseData.patientDetails) {
            localStorage.setItem(
              "patientDetails",
              JSON.stringify(responseData.patientDetails)
            );
          }

          toast.success("Login successful!", {
            onClose: () => navigate("/patient-dashboard-page"),
          });

        } else if (userRole.toLowerCase() === "nurse") {
          if (responseData.nurseDetails) {
            localStorage.setItem(
              "nurseDetails",
              JSON.stringify(responseData.nurseDetails)
            );
          }

          toast.success("Login successful!", {
            onClose: () => navigate("/nurse-dashboard-page"),
          });
        }

      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    sessionStorage.setItem("validNavigation", "true");
    navigate("/forgot-password-page");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    sessionStorage.setItem("validNavigation", "true");
    navigate("/SignUp");
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <div className="overlay">
      <div className="login-container">
        <ToastContainer autoClose={3000} />

        <div className="login-header">
          <i
            className="fas fa-arrow-left back-arrow"
            onClick={() => {
              if (!isLoading) {
                navigate("/techSpryn");
              }
            }}
          ></i>
          <img
            src="/Assets/Images/TechSpryn_New.png"
            alt="Logo"
            className="logo"
          />

          {/* Role dropdown */}
          <div className="role-dropdown">
            <label htmlFor="role">Select Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="nurse">Nurse</option>
            </select>
          </div>
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
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fa fa-lock"></i> Password
            </label>
            <input
              type={type}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <span
              className="flex justify-around items-center password-icon"
              onClick={handleToggle}
            >
              <Icon class="absolute mr-10" icon={icon} size={25} />
            </span>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label>Remember me</label>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <a
            href="/forgot-password-page"
            className={`forgot-password ${isLoading ? "disabled-link" : ""}`}
            onClick={(e) => {
              if (isLoading) e.preventDefault();
              else handleForgotPassword(e);
            }}
          >
            Forgot Password?
          </a>

          {role.toLowerCase() === "doctor" && (
            <a
              href="/SignUp"
              className={`SignUp ${isLoading ? "disabled-link" : ""}`}
              onClick={(e) => {
                if (isLoading) e.preventDefault();
                else handleSignUp(e);
              }}
            >
              Sign Up
            </a>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
