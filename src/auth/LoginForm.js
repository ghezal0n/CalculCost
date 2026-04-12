import React, { useState } from "react";
import "../assets/styles/Login.css";
import "../assets/images/LogoRoxcel.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { persistAdminFlag } from "./authUtils";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Persist admin flag decoded from JWT
      persistAdminFlag(token);

      // Trigger storage event to update navbar state
      window.dispatchEvent(new Event("storage"));

      setSuccess("Login successful!");

      // Redirect to department page after successful login
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    } catch (err) {
      setError("Incorrect email or password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo"></div>
      <div className="login-title">Login</div>
      <div className="login-subtitle">Access your account</div>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className={`input-field ${error && !email ? "error" : ""}`}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <div className="password-input-container">
          <input
            className={`input-field password-input ${
              error && !password ? "error" : ""
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <div
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
