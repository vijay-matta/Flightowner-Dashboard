import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CancelledBookingHistory.css';
import { Link } from 'react-router-dom';
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';

// Mapping of cancellation reason enum to readable text
const CancellationReasonMap = {
  1: 'Booking Cancelled',
  2: 'Payment Failed',
  3: 'Flight Cancelled'
};

const CancelledBookingHistory = () => {
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [flightOwnerId, setFlightOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get readable cancellation reason
  const getCancellationReason = (reasonCode) => {
    // If it's already a string, return it
    if (typeof reasonCode === 'string') return reasonCode;
    
    // If it's a number, map it to readable text
    return CancellationReasonMap[reasonCode] || 'Unknown Reason';
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    const fetchCancelledBookings = async () => {
      try {
        if (!storedUsername) {
          throw new Error('No username found in storage');
        }
  
        // Fetch Flight Owner ID
        const flightOwnerIdResponse = await axios.get(
          `https://localhost:7275/api/UserProfile/GetFlightOwnerIdByUsername/${storedUsername}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        // Extract FlightOwnerId
        const fetchedFlightOwnerId = flightOwnerIdResponse.data;
        
        if (!fetchedFlightOwnerId) {
          throw new Error('Could not retrieve Flight Owner ID');
        }

        // Set Flight Owner ID in state
        setFlightOwnerId(fetchedFlightOwnerId);

        // Fetch cancelled bookings using the Flight Owner ID
        const cancelledBookingsResponse = await axios.get(
          `https://localhost:7275/api/FlightOwner/cancelled-bookings/${fetchedFlightOwnerId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Accept': 'application/json'
            }
          }
        );

        // Set cancelled bookings in state
        setCancelledBookings(cancelledBookingsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cancelled bookings:', err);
        
        // More detailed error handling
        if (err.response) {
          setError(
            err.response.data?.Message || 
            err.response.data || 
            'Failed to fetch cancelled bookings'
          );
        } else if (err.request) {
          setError('No response received from server');
        } else {
          setError(err.message);
        }
        
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchCancelledBookings();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cancelled bookings...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Render no bookings state
  if (cancelledBookings.length === 0) {
    return (
      <div className="no-bookings-container">
        <h2>Cancelled Booking History</h2>
        <p>No cancelled bookings found.</p>
      </div>
    );
  }

  // Render bookings
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
    
    <div className="cancelled-bookings-container">
      <h2>Cancelled Booking History</h2>
      <table className="cancelled-bookings-table">
        <thead>
          <tr>
            <th>Cancellation ID</th>
            <th>Flight Name</th>
            <th>Passenger Name</th>
            <th>Cancellation Date & Time</th>
            <th>Cancellation Reason</th>
          </tr>
        </thead>
        <tbody>
          {cancelledBookings.map((booking) => (
            <tr key={booking.cancellationId}>
              <td>{booking.cancellationId}</td>
              <td>{booking.flightName}</td>
              <td>{booking.passengerName}</td>
              <td>{formatDate(booking.cancellationDateTime)}</td>
              <td>
                {getCancellationReason(booking.cancellationReason)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default CancelledBookingHistory;