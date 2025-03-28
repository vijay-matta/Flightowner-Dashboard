import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "./EditRoute.css";

const EditRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [routeData, setRouteData] = useState({
        origin: '',
        destination: '',
        distance: 0,
        duration: '',
        flightOwnerId: 0, // Added to the form
        numStops: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch route details when component mounts
    useEffect(() => {
        const fetchRouteDetails = async () => {
            try {
                const routeId = location.state?.route?.routeId;

                if (!routeId) {
                    throw new Error("Route ID is required");
                }

                // Fetch full route details
                const response = await axios.get(
                    `https://localhost:7275/api/FlightOwner/GetRouteDetails/${routeId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );

                const route = response.data;

                // Update state with fetched route details
                setRouteData({
                    origin: route.origin || '',
                    destination: route.destination || '',
                    distance: route.distance || 0,
                    duration: route.duration || '',
                    flightOwnerId: route.flightOwnerId || 0, // Include flightOwnerId
                    numStops: route.numStops || ''
                });
            } catch (err) {
                console.error('Error fetching route details:', err);
                setError('Failed to load route details');
            }
        };

        // If route data is passed through navigation state, use that first
        if (location.state?.route) {
            const { route } = location.state;
            setRouteData({
                origin: route.origin || '',
                destination: route.destination || '',
                distance: route.distance || 0,
                duration: route.duration || '',
                flightOwnerId: route.flightOwnerId || 0, // Include flightOwnerId
                numStops: route.numStops || ''
            });
        } else {
            // If no route data in navigation state, fetch from API
            fetchRouteDetails();
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRouteData(prev => ({
            ...prev,
            [name]: name === 'distance' || name === 'flightOwnerId' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const routeId = location.state?.route?.routeId;

            if (!routeId) {
                throw new Error("Route ID is required");
            }

            const response = await axios.put(
                `https://localhost:7275/api/FlightOwner/UpdateRoute/${routeId}`, 
                routeData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            alert(response.data.message);
            navigate('/view-routes');
        } catch (err) {
            console.error('Full Error Object:', err);
            console.error('Error Response:', err.response?.data);
            
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
                    'Failed to update route. Please check your input.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="update-route-container">
            <h2>Update Route</h2>
            
            {error && <div className="error-message">
                {typeof error === 'object' 
                    ? Object.values(error).join(', ') 
                    : error}
            </div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="origin">Origin</label>
                    <input
                        id="origin"
                        type="text"
                        name="origin"
                        value={routeData.origin}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter origin city"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <input
                        id="destination"
                        type="text"
                        name="destination"
                        value={routeData.destination}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter destination city"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="distance">Distance (km)</label>
                    <input
                        id="distance"
                        type="number"
                        name="distance"
                        value={routeData.distance}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="Enter route distance"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                        id="duration"
                        type="text"
                        name="duration"
                        value={routeData.duration}
                        onChange={handleInputChange}
                        placeholder="HH:MM:SS"
                        required
                        pattern="^([0-9]{2}):([0-9]{2}):([0-9]{2})$"
                        title="Duration must be in HH:MM:SS format"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="flightOwnerId">Flight Owner ID</label>
                    <input
                        id="flightOwnerId"
                        type="number"
                        name="flightOwnerId"
                        value={routeData.flightOwnerId}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="Enter Flight Owner ID"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="numStops">Number of Stops</label>
                    <input
                        id="numStops"
                        type="text"
                        name="numStops"
                        value={routeData.numStops}
                        onChange={handleInputChange}
                        placeholder="Enter number of stops"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Route'}
                </button>
            </form>
        </div>
    );
};

export default EditRoute;