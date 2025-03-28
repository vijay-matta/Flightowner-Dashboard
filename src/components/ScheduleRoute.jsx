import React, { useState } from "react";
import axios from "axios";
import "./ScheduleRoute.css";
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';


const ScheduleRouteForm = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    distance: "",
    duration: "",
    flightOwnerId: "",
    flightId: "",
    numStops: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    try {
      // Send POST request to create new route
      const response = await axios.post(
        "https://localhost:7275/api/FlightOwner/ScheduleRoute", 
        formData
      );

      // If route is created successfully
      setSuccessMessage("Route created successfully!");
      setFormData({
        origin: "",
        destination: "",
        distance: "",
        duration: "",
        flightOwnerId: "",
        
        numStops: "",
      });
    } catch (err) {
      // If there's an error
      setError("Failed to create route. Please try again.");
    }
  };

  return (
    <div>
        {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <Plane size={32} color="#2c3e50" />
          <Link className="nav-link" to="/flight-owner/dashboard"><h2>SkyHub FlightOwner Dashboard</h2></Link>
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
    <div className="schedule-route-form">
      <h2>Schedule a New Route</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="origin">Origin:</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="distance">Distance (km):</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        <div>
          <label htmlFor="duration">Duration (HH:MM:SS):</label>
          <input
            type="time"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="flightOwnerId">Flight Owner ID:</label>
          <input
            type="number"
            id="flightOwnerId"
            name="flightOwnerId"
            value={formData.flightOwnerId}
            onChange={handleInputChange}
            required
          />
        </div>

       
        <div>
          <label htmlFor="numStops">Number of Stops:</label>
          <input
            type="text"
            id="numStops"
            name="numStops"
            value={formData.numStops}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Schedule Route</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
    </div>
  );
};

export default ScheduleRouteForm;
