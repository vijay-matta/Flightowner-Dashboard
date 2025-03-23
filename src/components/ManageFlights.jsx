import React, { useState } from "react";
import axios from "axios";

const Flights = () => {
  const [flightOwnerId, setFlightOwnerId] = useState(""); // To store the FlightOwnerId
  const [flights, setFlights] = useState([]); // To store the list of flights
  const [error, setError] = useState(""); // To handle any errors

  const fetchFlights = async () => {
    if (!flightOwnerId) {
      setError("Please enter a valid Flight Owner ID.");
      return;
    }

    try {
      setError(""); // Clear any existing errors
      const response = await axios.get(
        `https://localhost:7294/api/FlightOwner/GetAllFlights/${flightOwnerId}`
      );
      setFlights(response.data); // Assuming the backend returns an array of flights
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights. Please check the Flight Owner ID and try again.");
    }
  };

  return (
    <div>
      <h2>Flight Details</h2>

      {/* Input for FlightOwnerId */}
      <div>
        <label htmlFor="flightOwnerId">Enter Flight Owner ID: </label>
        <input
          type="text"
          id="flightOwnerId"
          value={flightOwnerId}
          onChange={(e) => setFlightOwnerId(e.target.value)}
        />
        <button onClick={fetchFlights}>Get Flights</button>
      </div>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display flights */}
      {flights.length > 0 ? (
        <div>
          {flights.map((flight) => (
            <div key={flight.flightId} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h3>Flight: {flight.flightNumber} - {flight.flightName}</h3>
              <p><strong>Departure:</strong> {flight.departureDate} at {flight.departureTime}</p>
              <p><strong>Arrival:</strong> {flight.arrivalDate} at {flight.arrivalTime}</p>
              <p><strong>Seats:</strong> {flight.availableSeats}/{flight.totalSeats}</p>
              <p><strong>Stops:</strong> {flight.numStops}</p>
              {flight.layoverPlace && (
                <>
                  <p><strong>Layover Place:</strong> {flight.layoverPlace}</p>
                  <p><strong>Layover Time:</strong> {flight.layoverTime}</p>
                  <p><strong>Layover Arrival:</strong> {flight.layoverPlaceArrivalTime}</p>
                  <p><strong>Layover Departure:</strong> {flight.layoverPlaceDepartureTime}</p>
                </>
              )}
              <p><strong>Status:</strong> {flight.status === 0 ? "Inactive" : "Active"}</p>
              <p><strong>Route ID:</strong> {flight.routeId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No flights found for this Flight Owner ID.</p>
      )}
    </div>
  );
};

export default Flights;
