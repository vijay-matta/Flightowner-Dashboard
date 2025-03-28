import React from 'react';
import { View, Plane, Route, Calendar, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardTiles.css';

const DashboardTiles = () => {
  // Define tiles with unique icons and links
  const tiles = [
    { icon: <View size={40} />, title: 'View Flights', link: '/view-flights', color: '#3498db' },
    { icon: <Plane size={40} />, title: 'Schedule Flights', link: '/schedule-flights', color: '#2ecc71' },
    { icon: <Route size={40} />, title: 'View Routes', link: '/view-routes', color: '#e74c3c' },
    { icon: <Calendar size={40} />, title: 'Schedule Routes', link: '/schedule-routes', color: '#f39c12' },
    { icon: <Calendar size={40} />, title: 'Booking History', link: '/flight-owner-bookings', color: '#9b59b6' },
    { icon: <AlertCircle size={40} />, title: 'Cancelled Bookings', link: '/cancelled-booking-history', color: '#e67e22' },
    { icon: <CreditCard size={40} />, title: 'Issue Refund', link: '/issue-refund', color: '#16a085' },
    { icon: <RefreshCw size={40} />, title: 'Update Flight Status', link: '/update-flight-status', color: '#8e44ad' },
    { icon: <Plane size={40} />, title: 'Manage Aircraft', link: '/manage-aircraft', color: '#d35400' },
  ];

  return (
    <div className="dashboard-tiles-container">
      <h2 className="tiles-section-title">Quick Access</h2>
      
      <div className="tiles-grid">
        {tiles.map((tile, index) => (
          <div className="tile-item" key={index}>
            <Link to={tile.link} className="tile-link">
              <div className="tile-icon" style={{ backgroundColor: `${tile.color}20` }}>
                <div className="icon-wrapper" style={{ color: tile.color }}>
                  {tile.icon}
                </div>
              </div>
              <h3 className="tile-title">{tile.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTiles;