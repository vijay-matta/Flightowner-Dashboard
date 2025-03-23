import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlightOwnerDashboard from './components/Navbar';
import ViewFlights from './components/ViewFlights';
import DeleteFlight from './components/DeleteFlight';  // Make sure to import ViewFlights
import ViewRoutes from './components/ViewRoutes';
import EditFlight from './components/EditFlight';
import ScheduleRouteForm from './components/ScheduleRoute';
import ScheduleFlight from './components/ScheduleFlight';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import FlightOwnerBookings from './components/FlightOwnerBookings';
import CancelledBookingHistory from './components/CancelledBookingHistory';
import DeleteRoute from './components/DeleteRoute';
import EditRoute from './components/EditRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for the Flight Owner Dashboard */}
        <Route path="/flight-owner/dashboard" element={<FlightOwnerDashboard />} />
        {/* Define the route for ViewFlights */}
        <Route path="/view-flights" element={<ViewFlights />} />
        <Route path="/delete-flight/:flightId" element={<DeleteFlight />} />
        <Route path="/view-routes" element={<ViewRoutes/>} />
        <Route path="/edit-flight/:flightId" element={<EditFlight />} />
        <Route path="/schedule-routes" element={<ScheduleRouteForm />} />
        <Route path="/schedule-flights" element={<ScheduleFlight />} />
        <Route path="/login" element={<LoginPage />} />  // Define the route for LoginPage  // Make sure to import LoginPage
        <Route path="/register" element={<RegistrationPage />} /> 
        <Route path="/flight-owner-bookings" element={<FlightOwnerBookings />} />  
        <Route path="/cancelled-booking-history" element={<CancelledBookingHistory />} />
        <Route path="/delete-route/:routeId" element={<DeleteRoute />} />
        <Route path="/edit-route/:routeId" element={<EditRoute />} />
        
      </Routes>
    </Router>
  );
};

export default App;
