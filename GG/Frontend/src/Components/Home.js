import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"; // Reuse styles from Login.js for consistency
import logo from "../Styles/logo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="login-background">
      {/* Left section */}
      <div className="visual-section">
        <img
          src={logo}
          alt="Language Exchange Logo"
          style={{ maxWidth: "70%", height: "auto", marginBottom: "20px" }}
        />
      </div>

      {/* Right section */}
      <div className="login-container">
        <div className="login-content">
          <div className="text-login">Language Exchange Matchmaker</div>
          <div className="text-subtitle">
            Connect with people around the world to learn and practice new languages.
          </div>

          {/* Login Button Section */}
          <div className="col-12">
            <div className="button-header">Continuing your learning?</div>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>

          {/* Register Button Section */}
          <div className="col-12">
            <div className="button-header">Ready to get started?</div>
            <button className="btn-login" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>

          {/* Statistics or additional info */}
          <div className="home-stats">
            <p>🌍 Develop friendships with users all over the world!</p>
            <p>📚 Supporting English and Korean, with more languages to come!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
