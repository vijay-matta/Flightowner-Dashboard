import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Bell, User, Settings, Menu } from 'lucide-react';
import DashboardTiles from './DashboardTiles'; // Import our new grid component
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const FlightOwnerDashboard = () => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showLoginSuccessCard, setShowLoginSuccessCard] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Debug logging
    console.log('Location state:', location.state);

    // Check if we're coming from login page and have user info
    const loginState = location.state;
    if (loginState && (loginState.firstName || loginState.flightOwnerId)) {
      console.log('Setting user info:', loginState);
      setUserInfo(loginState);
      setShowLoginSuccessCard(true);

      // Set timer to hide the login success card after 5 seconds
      const timer = setTimeout(() => {
        setShowLoginSuccessCard(false);
      }, 5000);

      // Cleanup the timer if component unmounts
      return () => clearTimeout(timer);
    } else {
      console.log('No login state found');
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  return (
    <div className="dashboard-container">
      {/* Login Success Modal */}
      {showLoginSuccessCard && (
        <div className="login-success-modal">
          <div 
            className="login-success-content"
            style={{
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            <h2>Login Successful!</h2>
            {userInfo?.username && <p>Welcome, {userInfo.username}</p>}
            {userInfo?.flightOwnerId && <p>Your unique Flight Owner ID is: {userInfo.flightOwnerId}</p>}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <Plane size={32} color="#2c3e50" />
          <Link className="nav-link" to="/flight-owner/dashboard"><h2>SkyHub FlightOwner Dashboard</h2></Link>
        </div>
        <div className="navbar-menu">
          <ul>
            <li className="nav-item">
              <Link className="nav-link" to="/view-flights">View Flights</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule-flights">Schedule Flights</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/view-routes">View Routes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule-routes">Schedule Routes</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-actions">
          <Bell size={24} />
          <User size={24} />
          <div className="settings-container">
            <Settings 
              size={24} 
              onClick={toggleLogoutDropdown} 
              className="cursor-pointer"
            />
            {showLogoutDropdown && (
              <div className="logout-dropdown">
                <button 
                  className="btn btn-danger logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <Menu size={24} />
        </div>
      </nav>

      {/* Banner Image */}
      {/*<div className="banner-image">
        <img src="https://th.bing.com/th/id/OIP.A2ofr2IOaJvIWlkus5_R4QHaFF?w=259&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Flight Owner Banner" />
      </div>
      */}

      {/* Our new Dashboard Tiles Grid */}
      <DashboardTiles />

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p>&copy; 2024 Flight Owner Dashboard. All rights reserved.</p>
          <p>Contact us: support@flightowner.com | Follow us: <a href="https://www.instagram.com/flightowner">Instagram</a></p>
        </div>
      </footer>
    </div>
  );
};

export default FlightOwnerDashboard;