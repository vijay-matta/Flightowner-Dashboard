import React from 'react';

const HomePage = () => {
  return (
    <div className="container mt-4">
      <h2>Welcome to the Flight Owner Dashboard!</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Flights</h5>
              <p className="card-text">View and manage your flights.</p>
              <a href="/manage-flights" className="btn btn-primary">Go</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">View Routes</h5>
              <p className="card-text">See all your routes.</p>
              <a href="/view-routes" className="btn btn-primary">Go</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Schedule Flight</h5>
              <p className="card-text">Schedule a new flight.</p>
              <a href="/schedule-flight" className="btn btn-primary">Go</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
