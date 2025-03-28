import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plane, Bell, User, Settings, Menu } from 'lucide-react';
import "./FlightOwnerBookings.css";

// Enums for Trip Types and Booking Statuses
const TripTypeEnum = {
  OneWay: 'OneWay',
  RoundTrip: 'RoundTrip'
};

const BookingStatusEnum = {
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
  Pending: 'Pending'
};

const FlightOwnerBookings = () => {
  // State variables
  const [bookings, setBookings] = useState([]);
  const [flightOwnerId, setFlightOwnerId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bookings when component mounts
    const fetchBookings = async () => {
      try {
        // Get stored username and auth token
        const storedUsername = localStorage.getItem('userName');
        const authToken = localStorage.getItem('authToken');

        // Validate authentication
        if (!storedUsername || !authToken) {
          throw new Error('Authentication required. Please log in.');
        }

        // Fetch Flight Owner ID
        const flightOwnerIdResponse = await axios.get(
          `https://localhost:7275/api/UserProfile/GetFlightOwnerIdByUsername/${storedUsername}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );

        const fetchedFlightOwnerId = flightOwnerIdResponse.data;
        setFlightOwnerId(fetchedFlightOwnerId);

        // Fetch bookings for the flight owner
        const bookingsResponse = await axios.get(
          `https://localhost:7275/api/FlightOwner/GetBookingsByFlightOwner/${fetchedFlightOwnerId}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );

        console.log('Fetched Bookings:', bookingsResponse.data);
        setBookings(bookingsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Booking fetch error:', err);
        setError(err.response?.data || err.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to convert trip type to readable text
  const getTripTypeText = (tripType) => {
    switch (tripType) {
      case TripTypeEnum.OneWay: return 'One Way';
      case TripTypeEnum.RoundTrip: return 'Round Trip';
      default: return 'Unknown';
    }
  };

  // Helper function to convert booking status to readable text
  const getBookingStatusText = (status) => {
    switch (status) {
      case BookingStatusEnum.Confirmed: return 'Confirmed';
      case BookingStatusEnum.Cancelled: return 'Cancelled';
      case BookingStatusEnum.Pending: return 'Pending';
      default: return 'Unknown';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="login-redirect-btn"
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

  return (
    <div className="flight-owner-dashboard">
      {/* Navigation Bar */}
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
          <Settings size={24} />
          <Menu size={24} />
        </div>
      </nav>

      {/* Bookings Container */}
      <div className="flightowner-bookings-container">
        <h2>My Flight Bookings</h2>
        
        {bookings.length === 0 ? (
          <p className="no-bookings-message">No bookings found.</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Trip Type</th>
                <th>Flight Number</th>
                <th>Passenger Name</th>
                <th>Seats</th>
                <th>Total Price</th>
                <th>Booking Date</th>
                <th>Booking Status</th>
                <th>Payment Details</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{getTripTypeText(booking.tripType)}</td>
                  <td>{booking.flightNumber || 'N/A'}</td>
                  <td>{booking.passengerName || 'N/A'}</td>
                  <td>{booking.numSeats}</td>
                  <td>₹{booking.totalPrice.toLocaleString()}</td>
                  <td>{new Date(booking.bookingDateTime).toLocaleDateString()}</td>
                  <td>{getBookingStatusText(booking.bookingStatus)}</td>
                  <td>Payment ID: {booking.paymentDetails?.paymentId || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FlightOwnerBookings;



