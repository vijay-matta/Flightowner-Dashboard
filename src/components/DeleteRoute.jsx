import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteRoute.css";
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeleteRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { route } = location.state || {};

  // Add axios interceptor for adding auth token
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  if (!route) {
    return <div>No route details found.</div>;
  }

  const handleDeleteRoute = async () => {
    try {
      // Use routeId instead of flightId
      await axios.delete(
        `https://localhost:7275/api/FlightOwner/DeleteRoute/${route.routeId}`
      );
      alert("Route deleted successfully.");
      navigate("/view-routes"); // Redirect back to routes list
    } catch (err) {
      console.error("Error deleting route:", err);
      alert("Failed to delete route. Please try again.");
    }
  };

  return (
    <div>
      {/* Navbar - Same as in other components */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <Plane size={32} color="#2c3e50" />
          <Link className="nav-link" to="/flight-owner/dashboard">
            <h2>SkyHub FlightOwner Dashboard</h2>
          </Link>
        </div>
        <div className="navbar-menu">
          <ul>
            <li className="nav-item">
              <Link className="nav-link" to="/view-flights">
                View Flights
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule-flights">
                Schedule Flights
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/view-routes">
                View Routes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule-routes">
                Schedule Routes
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-actions">
          <Bell size={24} />
          <User size={24} />
          <Settings size={24} />
          <Menu size={24} />
        </div>
      </nav>

      <div className="delete-route-container">
        <h2>Delete Route Confirmation</h2>
        <div className="route-details">
          {/* Updated to use routeId */}
          <p><strong>Route ID:</strong> {route.routeId}</p>
          <p><strong>Origin:</strong> {route.origin}</p>
          <p><strong>Destination:</strong> {route.destination}</p>
          <p><strong>Distance:</strong> {route.distance} km</p>
          <p><strong>Duration:</strong> {route.duration} hours</p>
          
          {/* Display associated flights if available */}
          {route.flights && route.flights.length > 0 && (
            <div className="associated-flights">
              <h4>Associated Flights:</h4>
              <ul>
                {route.flights.map((flight, index) => (
                  <li key={index}>
                    {flight.flightNumber} - {flight.flightName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="delete-route-actions">
          <button 
            className="cancel-button" 
            onClick={() => navigate("/view-routes")}
          >
            Cancel
          </button>
          <button 
            className="delete-button" 
            onClick={handleDeleteRoute}
          >
            Confirm Delete Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoute;