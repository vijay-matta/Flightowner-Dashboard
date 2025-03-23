import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./EditFlight.css";

const EditFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightId } = useParams();

  const [flightDetails, setFlightDetails] = useState({
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
    flightStatus: "Scheduled", // Default value
    numStops: "",
    layoverPlace: "",
    layoverTime: "",
    layoverPlaceArrivalTime: "",
    layoverPlaceDepartureTime: "",
    flightOwnerId: 0,
    routeId: 0,
    seats: [
      { seatType: 1, price: 0, isAvailable: true },
      { seatType: 2, price: 0, isAvailable: true }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch flight details when component mounts
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7294/api/FlightOwner/GetFlight/${flightId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        const flight = response.data;

        // Update state with fetched flight details
        setFlightDetails(prevDetails => ({
          ...prevDetails,
          flightNumber: flight.flightNumber || "",
          flightName: flight.flightName || "",
          departureDate: flight.departureDate || "",
          departureTime: flight.departureTime || "",
          arrivalDate: flight.arrivalDate || "",
          arrivalTime: flight.arrivalTime || "",
          numberOfEconomySeats: flight.numberOfEconomySeats || 0,
          numberOfBusinessSeats: flight.numberOfBusinessSeats || 0,
          economySeatPrice: flight.economySeatPrice || 0,
          businessSeatPrice: flight.businessSeatPrice || 0,
          availableSeats: flight.availableSeats || 0,
          totalSeats: flight.totalSeats || 0,
          flightStatus: flight.flightStatus || "Scheduled",
          numStops: flight.numStops || "",
          layoverPlace: flight.layoverPlace || "",
          layoverTime: flight.layoverTime || "",
          layoverPlaceArrivalTime: flight.layoverPlaceArrivalTime || "",
          layoverPlaceDepartureTime: flight.layoverPlaceDepartureTime || "",
          flightOwnerId: flight.flightOwnerId || 0,
          routeId: flight.routeId || 0,
          seats: flight.seats || [
            { seatType: 1, price: flight.economySeatPrice || 0, isAvailable: true },
            { seatType: 2, price: flight.businessSeatPrice || 0, isAvailable: true }
          ]
        }));
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError('Failed to load flight details');
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  // Add handleSeatChange method
  const handleSeatChange = (e, seatType) => {
    const { name, value, type, checked } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      seats: prev.seats.map(seat => 
        seat.seatType === seatType
          ? { 
              ...seat, 
              [name]: type === 'checkbox' ? checked : 
                      name === 'price' ? Number(value) : value 
            }
          : seat
      )
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      [name]: name.includes('Price') || 
              name.includes('Seats') || 
              name === 'flightOwnerId' || 
              name === 'routeId' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Ensure flightStatus is one of the valid options
    const validStatuses = ["Scheduled", "Cancelled", "Delayed", "Completed"];
    const updatedFlightDetails = {
      ...flightDetails,
      flightStatus: validStatuses.includes(flightDetails.flightStatus) 
        ? flightDetails.flightStatus 
        : "Scheduled"
    };

    try {
      const response = await axios.put(
        `https://localhost:7294/api/FlightOwner/UpdateFlight/${updatedFlightDetails.flightNumber}`, 
        updatedFlightDetails,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      alert(response.data.message || "Flight updated successfully");
      navigate('/view-flights');
    } catch (err) {
      console.error('Full Error Object:', err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const formattedErrors = {};

        Object.keys(serverErrors).forEach(key => {
          const cleanKey = key.split('.').pop().toLowerCase();
          formattedErrors[cleanKey] = serverErrors[key][0];
        });

        setError(formattedErrors);
      } else {
        setError(
          err.response?.data?.message || 
          err.response?.data?.title || 
          'Failed to update flight. Please check your input.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-flight-container">
      <h2>Update Flight</h2>
      
      {error && <div className="error-message">
        {typeof error === 'object' 
          ? Object.values(error).join(', ') 
          : error}
      </div>}
      
      <form onSubmit={handleSubmit}>
        {/* Flight Number */}
        <div className="form-group">
          <label htmlFor="flightNumber">Flight Number</label>
          <input
            id="flightNumber"
            type="text"
            name="flightNumber"
            value={flightDetails.flightNumber}
            onChange={handleInputChange}
            required
            disabled
          />
        </div>

        {/* Flight Name */}
        <div className="form-group">
          <label htmlFor="flightName">Flight Name</label>
          <input
            id="flightName"
            type="text"
            name="flightName"
            value={flightDetails.flightName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Departure Date */}
        <div className="form-group">
          <label htmlFor="departureDate">Departure Date</label>
          <input
            id="departureDate"
            type="datetime"
            name="departureDate"
            value={flightDetails.departureDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Departure Time */}
        <div className="form-group">
          <label htmlFor="departureTime">Departure Time</label>
          <input
            id="departureTime"
            type="time"
            name="departureTime"
            value={flightDetails.departureTime}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Arrival Date */}
        <div className="form-group">
          <label htmlFor="arrivalDate">Arrival Date</label>
          <input
            id="arrivalDate"
            type="datetime"
            name="arrivalDate"
            value={flightDetails.arrivalDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Arrival Time */}
        <div className="form-group">
          <label htmlFor="arrivalTime">Arrival Time</label>
          <input
            id="arrivalTime"
            type="time"
            name="arrivalTime"
            value={flightDetails.arrivalTime}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Economy Seats */}
        <div className="form-group">
          <label htmlFor="numberOfEconomySeats">Economy Seats</label>
          <input
            id="numberOfEconomySeats"
            type="number"
            name="numberOfEconomySeats"
            value={flightDetails.numberOfEconomySeats}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Business Seats */}
        <div className="form-group">
          <label htmlFor="numberOfBusinessSeats">Business Seats</label>
          <input
            id="numberOfBusinessSeats"
            type="number"
            name="numberOfBusinessSeats"
            value={flightDetails.numberOfBusinessSeats}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Economy Seat Price */}
        <div className="form-group">
          <label htmlFor="economySeatPrice">Economy Seat Price</label>
          <input
            id="economySeatPrice"
            type="number"
            name="economySeatPrice"
            value={flightDetails.economySeatPrice}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Business Seat Price */}
        <div className="form-group">
          <label htmlFor="businessSeatPrice">Business Seat Price</label>
          <input
            id="businessSeatPrice"
            type="number"
            name="businessSeatPrice"
            value={flightDetails.businessSeatPrice}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Available Seats */}
        <div className="form-group">
          <label htmlFor="availableSeats">Available Seats</label>
          <input
            id="availableSeats"
            type="number"
            name="availableSeats"
            value={flightDetails.availableSeats}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Total Seats */}
        <div className="form-group">
          <label htmlFor="totalSeats">Total Seats</label>
          <input
            id="totalSeats"
            type="number"
            name="totalSeats"
            value={flightDetails.totalSeats}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Flight Status */}
        <div className="form-group">
          <label htmlFor="flightStatus">Flight Status</label>
          <select
            id="flightStatus"
            name="flightStatus"
            value={flightDetails.flightStatus}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Number of Stops */}
        <div className="form-group">
          <label htmlFor="numStops">Number of Stops</label>
          <input
            id="numStops"
            type="text"
            name="numStops"
            value={flightDetails.numStops}
            onChange={handleInputChange}
          />
        </div>

        {/* Layover Place */}
        <div className="form-group">
          <label htmlFor="layoverPlace">Layover Place</label>
          <input
            id="layoverPlace"
            type="text"
            name="layoverPlace"
            value={flightDetails.layoverPlace}
            onChange={handleInputChange}
          />
        </div>

        {/* Layover Time */}
        <div className="form-group">
          <label htmlFor="layoverTime">Layover Time</label>
          <input
            id="layoverTime"
            type="text"
            name="layoverTime"
            value={flightDetails.layoverTime}
            onChange={handleInputChange}
          />
        </div>

        {/* Layover Place Arrival Time */}
        <div className="form-group">
          <label htmlFor="layoverPlaceArrivalTime">Layover Place Arrival Time</label>
          <input
            id="layoverPlaceArrivalTime"
            type="time"
            name="layoverPlaceArrivalTime"
            value={flightDetails.layoverPlaceArrivalTime}
            onChange={handleInputChange}
          />
        </div>

        {/* Layover Place Departure Time */}
        <div className="form-group">
          <label htmlFor="layoverPlaceDepartureTime">Layover Place Departure Time</label>
          <input
            id="layoverPlaceDepartureTime"
            type="time"
            name="layoverPlaceDepartureTime"
            value={flightDetails.layoverPlaceDepartureTime}
            onChange={handleInputChange}
          />
        </div>

        {/* Flight Owner ID */}
        <div className="form-group">
          <label htmlFor="flightOwnerId">Flight Owner ID</label>
          <input
            id="flightOwnerId"
            type="number"
            name="flightOwnerId"
            value={flightDetails.flightOwnerId}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        {/* Route ID */}
        <div className="form-group">
          <label htmlFor="routeId">Route ID</label>
          <input
            id="routeId"
            type="number"
            name="routeId"
            value={flightDetails.routeId}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        {/* Seat Prices and Availability (End of Form) */}
        <div className="form-group">
            <h3>Seat Details</h3>
            {/* Economy Seat Details */}
            <div className="form-group">
              <label htmlFor="economySeatPrice">Economy Seat Price:</label>
              <input
                type="number"
                id="economySeatPrice"
                name="price"
                value={flightDetails.seats[0].price}
                onChange={(e) => handleSeatChange(e, 1)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="economySeatAvailability">Economy Seat Availability:</label>
              <input
                type="checkbox"
                id="economySeatAvailability"
                name="isAvailable"
                checked={flightDetails.seats[0].isAvailable}
                onChange={(e) => handleSeatChange(e, 1)}
              />
            </div>

            {/* Business Seat Details */}
            <div className="form-group">
              <label htmlFor="businessSeatPrice">Business Seat Price:</label>
              <input
                type="number"
                id="businessSeatPrice"
                name="price"
                value={flightDetails.seats[1].price}
                onChange={(e) => handleSeatChange(e, 2)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="businessSeatAvailability">Business Seat Availability:</label>
              <input
                type="checkbox"
                id="businessSeatAvailability"
                name="isAvailable"
                checked={flightDetails.seats[1].isAvailable}
                onChange={(e) => handleSeatChange(e, 2)}
              />
            </div>
          </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Flight'}
        </button>
      </form>
    </div>
  );
};

export default EditFlight;