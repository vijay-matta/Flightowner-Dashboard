import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewRoutes.css";
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';
import { 
    Edit2, Trash2, Search, AlertCircle, 
    ChevronDown, ChevronUp 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ViewAllRoutes = () => {
  // Add axios interceptor for adding auth token
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const [flightOwnerId, setFlightOwnerId] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightOwnerId = async () => {
      try {
        // Get username from local storage
        const storedUsername = localStorage.getItem('userName');

        if (!storedUsername) {
          throw new Error('No username found. Please log in.');
        }

        // Fetch Flight Owner ID using username
        const response = await axios.get(
          `https://localhost:7294/api/UserProfile/GetFlightOwnerIdByUsername/${storedUsername}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        const fetchedFlightOwnerId = response.data;
        setFlightOwnerId(fetchedFlightOwnerId);

        // Automatically fetch routes once we have the Flight Owner ID
        await fetchRoutes(fetchedFlightOwnerId);
      } catch (err) {
        console.error("Error fetching Flight Owner ID:", err);
        setError("Failed to retrieve Flight Owner ID. Please log in again.");
        setLoading(false);
      }
    };

    fetchFlightOwnerId();
  }, []);

  // Function to fetch routes based on FlightOwnerId
  const fetchRoutes = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`https://localhost:7294/api/FlightOwner/GetAllRoutes/${id}`);
      if (Array.isArray(response.data)) {
        setRoutes(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError(err.response?.data?.title || "Error fetching routes");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the delete action
  const handleDeleteRoute = (routeId) => {
    console.log("Route ID clicked:", routeId);
    const route = routes.find((r) => r.routeId === routeId);
    
    console.log("Found Route:", route);
    
    if (route) {
        navigate(`/delete-route/:routeId`, { state: { route } });
    } else {
        console.error("Route not found for ID:", routeId);
        alert("Route details could not be found.");
    }
};

  // Function to handle the edit action
  const handleEdit = (routeId) => {
    const route = routes.find((r) => r.routeId === routeId);
    
    if (route) {
        navigate(`/edit-route/${routeId}`, { state: { route } });
    } else {
        console.error("Route not found for ID:", routeId);
        alert("Route details could not be found.");
    }
};

  // Loading State
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Routes...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
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

      <div className="view-routes-container">
        <h2>Routes Management</h2>

        {/* Display error message */}
        {error && <div className="error-message">Error: {error}</div>}

        {/* Display routes */}
        {routes.length > 0 ? (
          <table className="routes-table">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance (km)</th>
                <th>Duration (hrs)</th>
                <th>Flight Numbers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.flightId}>
                  <td>{route.routeId}</td>
                  <td>{route.origin}</td>
                  <td>{route.destination}</td>
                  <td>{route.distance}</td>
                  <td>{route.duration}</td>
                  <td>
                    {route.flights.map((flight, index) => (
                      <span key={index}>
                        {flight.flightNumber}
                        {index < route.flights.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="button-container">
                      <button 
                        onClick={() => handleEdit(route.routeId)} 
                        className="edit-button"
                      >
                        <Edit2 size={16} />Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteRoute(route.routeId)} 
                        className="delete-button"
                        >
                          <Trash2 size={16} />Delete
                          </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No routes found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllRoutes;