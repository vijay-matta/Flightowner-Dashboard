import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth-pages.css";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState("");
  const [error, setError] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!emailOrUsername || !password || !roleType) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7275/api/FlightOwnerLogin/login", {
        EmailorUsername: emailOrUsername, // Changed here
        Password: password,
        RoleType: Number(roleType), // Ensure it's a number
      });

      console.log("Login response:", response.data);

      // Store authentication details
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", response.data.userName);

      // Navigate to dashboard with user information
      navigate("/flight-owner/dashboard", {
        state: {
          username: response.data.userName,
          flightOwnerId: response.data.flightOwnerId,
          fullName: response.data.userName,
        },
      });
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.title || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="image-overlay">
          <h1>Welcome to SkyHub</h1>
          <p>
            Streamline your flight management with our comprehensive platform. Simplify operations, track performance, and enhance your aviation business efficiency.
          </p>
        </div>
      </div>

      <div className="login-form-section">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Login to Your Account</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="emailOrUsername" className="form-label">Email or Username</label>
                <input
                  id="emailOrUsername"
                  type="text"
                  className="form-input"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Type</label>
                <div
                  className={`custom-select ${isSelectOpen ? "open" : ""}`}
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  <div className="select-trigger">
                    {roleType ? (roleType === "1" ? "Passenger" : "Flight Owner") : "Select Role"}
                  </div>
                  {isSelectOpen && (
                    <div className="select-content">
                      <div
                        className="select-item"
                        onClick={() => {
                          setRoleType("2");
                          setIsSelectOpen(false);
                        }}
                      >
                        Flight Owner
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button">
                Login
              </button>

              <div className="register-link">
                <a href="/register">Don't have an account? Register</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
