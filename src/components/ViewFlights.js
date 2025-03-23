import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Edit2, Trash2, Search, AlertCircle, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import './ViewFlights.css';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
  const [flightOwnerId, setFlightOwnerId] = useState(""); 
  const [flights, setFlights] = useState([]); 
  const [error, setError] = useState(""); 
  const [expandedFlightId, setExpandedFlightId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  


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

        // Automatically fetch flights once we have the Flight Owner ID
        await fetchFlights(fetchedFlightOwnerId);
      } catch (err) {
        console.error("Error fetching Flight Owner ID:", err);
        setError("Failed to retrieve Flight Owner ID. Please log in again.");
        setIsLoading(false);
      }
    };

    fetchFlightOwnerId();
  }, []);

  const fetchFlights = async (id) => {
    try {
      setError("");
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7294/api/FlightOwner/GetAllFlights/${id}`
      );
      setFlights(response.data);
      console.log("API Response: ", response.data); // Debugging line
    setFlights(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEditFlight = (flightId) => {
    const flight = flights.find((f) => f.flightId === flightId);
    if (flight) {
      navigate(`/edit-flight/${flight.flightNumber}`, { 
        state: { 
          flight: {
            flightNumber: flight.flightNumber,
            ...flight
          } 
        } 
      });
    } else {
      alert("Flight not found.");
    }
  };

  const handleDeleteFlight = (flightId) => {
    const flight = flights.find((f) => f.flightId === flightId);
    navigate(`/delete-flight/${flightId}`, { state: { flight } });
  };

  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Flights...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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

      {/* Main Content */}
      <div className="flight-dashboard-container">
        <div className="flight-search-header">
          <h2 className="dashboard-title">Flight Management</h2>

          {error && (
            <div className="error-banner">
              <AlertCircle size={20} className="error-icon" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flights-list">
          {flights.length > 0 ? (
            flights.map((flight) => (
              <div 
                key={flight.flightId} 
                className="flight-card"
              >
                <div 
                  className="flight-card-header"
                  onClick={() => toggleFlightDetails(flight.flightId)}
                >
                  <div className="flight-header-content">
                    <h3 className="flight-number">
                      {flight.flightNumber} - {flight.flightName}
                    </h3>
                    <div className="flight-actions">
                      <button 
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFlight(flight.flightId);
                        }}
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFlight(flight.flightId);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                      {expandedFlightId === flight.flightId ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {expandedFlightId === flight.flightId && (
                  <div className="flight-details">
                    <div className="flight-details-grid">
                      <div className="flight-detail-item">
                        <span className="detail-label">Departure</span>
                        <span className="detail-value">
                          {flight.departureDate} at {flight.departureTime}
                        </span>
                      </div>
                      <div className="flight-detail-item">
                        <span className="detail-label">Arrival</span>
                        <span className="detail-value">
                          {flight.arrivalDate} at {flight.arrivalTime}
                        </span>
                      </div>
                      <div className="flight-detail-item">
                        <span className="detail-label">Seats</span>
                        <span className="detail-value">
                          {flight.availableSeats}/{flight.totalSeats}
                        </span>
                      </div>
                      <div className="flight-detail-item">
  <span className="detail-label">Status</span>
  <span className="detail-value">{flight.status}</span>
</div>
                      {flight.layoverPlace && (
                        <div className="flight-detail-item">
                          <span className="detail-label">Layover</span>
                          <span className="detail-value">
                            {flight.layoverPlace} for {flight.layoverTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No flights available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flights;