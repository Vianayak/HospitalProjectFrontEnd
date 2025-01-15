import React from "react";
import "./LoginForm.css";

function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/Assets/Images/whitelogos.png" alt="Logo" className="logo" />
        <h2>LOG IN</h2>
      </div>
      <form>
        <div className="input-group">
          <label>
            <i className="fa fa-user"></i> Username
          </label>
          <input type="text" required />
        </div>
        <div className="input-group">
          <label>
            <i className="fa fa-lock"></i> Password
          </label>
          <input type="password" required />
        </div>
        <div className="remember-me">
          <input type="checkbox" />
          <label>Remember me</label>
        </div>
        <button type="submit" className="login-button">Login</button>
        <a href="#" className="forgot-password">Forgot Password?</a>
      </form>
    </div>
  );
}

export default LoginForm;
