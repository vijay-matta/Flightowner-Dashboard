import React, { useState, useEffect  } from "react";
import axios from "axios";
import "./ScheduleFlight.css";
import { Link } from 'react-router-dom';
import { View, Plane, Route, Calendar, Bell, User, Settings, Menu } from 'lucide-react';

const ScheduleFlight = () => {
    const FlightStatusEnum = {
        Scheduled: 0,  // First in enum = 0
        Cancelled: 1,  // Second in enum = 1
        Delayed: 2     // Third in enum = 2
      };
  const [formData, setFormData] = useState({
    flightNumber: "",
    flightName: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    numberOfEconomySeats: 0,
    numberOfBusinessSeats: 0,
    economySeatPrice: 0,
    businessSeatPrice: 0,
    availableSeats: 0,
    totalSeats: 0,
    numStops: 0,
    layoverPlace: "",
    layoverTime: "",
    layoverPlaceArrivalTime: "",
    layoverPlaceDepartureTime: "",
    flightOwnerId: "",
    routeId: "",
    flightStatus: 0,
    seats: [
        { seatType: "", price: 0, isAvailable: true },
        { seatType: "", price: 0, isAvailable: true },
      ]
  });

  


  useEffect(() => {
    // Convert values to integers in case they're strings
    const economySeats = Number(formData.numberOfEconomySeats);
    const businessSeats = Number(formData.numberOfBusinessSeats);
  
    // Ensure both values are valid numbers
    if (!isNaN(economySeats) && !isNaN(businessSeats)) {
      const total = economySeats + businessSeats;
      
      // Update the formData state correctly
      setFormData((prev) => ({
        ...prev,
        availableSeats: total,
        totalSeats: total,
      }));
    } else {
      console.error('Invalid input values for seats');
    }
  }, [formData.numberOfEconomySeats, formData.numberOfBusinessSeats]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeatChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSeats = [...prev.seats];
      updatedSeats[index][field] = value;
      return { ...prev, seats: updatedSeats };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    //const trimmedFlightStatus = formData.flightStatus.trim();

    if (![0, 1, 2].includes(formData.flightStatus)) {
        alert('Please select a valid flight status!');
        return;
      }


    const calculatedSeats = {
      availableSeats: formData.numberOfEconomySeats + formData.numberOfBusinessSeats,
      totalSeats: formData.numberOfEconomySeats + formData.numberOfBusinessSeats,
      seats: [
        ...Array.from({ length: formData.numberOfEconomySeats }, (_, i) => ({
          seatType: 1,
          price: formData.economySeatPrice,
          isAvailable: true,
        })),
        ...Array.from({ length: formData.numberOfBusinessSeats }, (_, i) => ({
          seatType: 2,
          price: formData.businessSeatPrice,
          isAvailable: true,
        })),
      ],
    };

    
  
    
  
    try {
        const payload = { ...formData,flightStatus: Number(formData.flightStatus), ...calculatedSeats };
      const response = await axios.post("https://localhost:7275/api/FlightOwner/ScheduleFlight", payload);
      alert("Flight scheduled successfully!");
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error:", error);
      alert(JSON.stringify(error.response?.data || "An error occurred while scheduling the flight.", null, 2));
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
    <div className="schedule-flight-container">
      <h2>Schedule a Flight</h2>
      <form onSubmit={handleSubmit} className="schedule-flight-form">
        <div className="form-group">
          <label>Flight Number:</label>
          <input
            type="text"
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Flight Name:</label>
          <input
            type="text"
            name="flightName"
            value={formData.flightName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Departure Time:</label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Arrival Date:</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Arrival Time:</label>
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Economy Seats:</label>
          <input
            type="number"
            name="numberOfEconomySeats"
            value={formData.numberOfEconomySeats}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Economy Seat Price:</label>
          <input
            type="number"
            name="economySeatPrice"
            value={formData.economySeatPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Business Seats:</label>
          <input
            type="number"
            name="numberOfBusinessSeats"
            value={formData.numberOfBusinessSeats}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Business Seat Price:</label>
          <input
            type="number"
            name="businessSeatPrice"
            value={formData.businessSeatPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Available Seats:</label>
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            readOnly
          />
        </div>
        <div>
          <label>Total Seats:</label>
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Number of Stops:</label>
          <input
            type="number"
            name="numStops"
            value={formData.numStops}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Layover Place:</label>
          <input
            type="text"
            name="layoverPlace"
            value={formData.layoverPlace}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Layover Time:</label>
          <input
            type="time"
            name="layoverTime"
            value={formData.layoverTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Layover Place Arrival Time:</label>
          <input
            type="time"
            name="layoverPlaceArrivalTime"
            value={formData.layoverPlaceArrivalTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Layover Place Departure Time:</label>
          <input
            type="time"
            name="layoverPlaceDepartureTime"
            value={formData.layoverPlaceDepartureTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Flight Owner ID:</label>
          <input
            type="text"
            name="flightOwnerId"
            value={formData.flightOwnerId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Route ID:</label>
          <input
            type="text"
            name="routeId"
            value={formData.routeId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
        <label>Flight Status:</label>
        <select
  name="flightStatus"
  value={formData.flightStatus}
  onChange={handleChange}
  required
>
  <option value={0}>Scheduled</option>
  <option value={1}>Cancelled</option>
  <option value={2}>Delayed</option>
</select>
      </div>
        <h3>Seats:</h3>
{formData.seats.map((seat, index) => (
  <div key={index} style={{ marginBottom: "10px" }}>
    <label>Seat Type:</label>
    <input
      type="text"
      value={seat.seatType}
      onChange={(e) => handleSeatChange(index, "seatType", e.target.value)}
      required
    />
    <label> Price:</label>
    <input
      type="number"
      value={seat.price}
      onChange={(e) => handleSeatChange(index, "price", Number(e.target.value))}
      required
    />
    <label> Is Available:</label>
    <input
      type="checkbox"
      checked={seat.isAvailable}
      onChange={(e) => handleSeatChange(index, "isAvailable", e.target.checked)}
    />
  </div>
))}

        <button type="submit" className="submit-button">Schedule Flight</button>
      </form>
    </div>
    </div>
  );
};

export default ScheduleFlight;