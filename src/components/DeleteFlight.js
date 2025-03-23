import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteFlight.css";
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeleteFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state || {};

  if (!flight) {
    return <div>No flight details found.</div>;
  }

  const handleCancelFlight = async () => {
    try {
      await axios.put(
        `https://localhost:7294/api/FlightOwner/CancelFlight/${flight.flightNumber}`
      );
      alert("Flight status updated to Cancelled.");
      navigate("/view-flights"); // Redirect back
    } catch (err) {
      console.error("Error cancelling flight:", err);
      alert("Failed to cancel flight. Please try again.");
    }
  };

  const handleDeleteFlight = async () => {
    try {
      await axios.delete(
        `https://localhost:7294/api/FlightOwner/DeleteFlight/${flight.flightNumber}`
      );
      alert("Flight deleted successfully.");
      navigate("/view-flights"); // Redirect back
    } catch (err) {
      console.error("Error deleting flight:", err);
      alert("Failed to delete flight. Please try again.");
    }
  };

  return (
    <div>
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
    <div className="delete-flight-container">
      <h2>Delete Flight Confirmation</h2>
      <div className="flight-details">
        <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
        <p><strong>Flight Name:</strong> {flight.flightName}</p>
        <p><strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}</p>
        <p><strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}</p>
      </div>
      <div className="delete-flight-actions">
        
        <button className="delete-button" onClick={handleDeleteFlight}>
          Delete Flight
        </button>
      </div>
    </div>
    </div>
  );
};

export default DeleteFlight;
