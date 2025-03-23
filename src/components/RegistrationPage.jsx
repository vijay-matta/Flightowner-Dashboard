import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleType: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    companyName: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      roleType: value
    }));
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!validateForm()) return;
  
    try {
      const registrationData = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        roleType: formData.roleType === '1' ? 1 : 2, // Passenger = 1, FlightOwner = 2
        
        // Explicitly map gender to enum values
        gender: (() => {
          switch(formData.gender) {
            case '1': return 1; // Male
            case '2': return 2; // Female
            case '3': return 3; // Other
            default: throw new Error('Invalid gender selection');
          }
        })(),
  
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: parseInt(formData.phoneNumber), // Convert to long
        ...(formData.roleType === '1' && { // Passenger
          dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }),
        ...(formData.roleType === '2' && { // Flight Owner
          companyName: formData.companyName,
          streetAddress: null,
          city: null,
          state: null,
          postalCode: null,
          country: null
        })
      };
  
      console.log('Sending registration data:', registrationData);
  
      const response = await axios.post('https://localhost:7294/api/Login/register', registrationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          message: 'Account created successfully! Please log in.'
        } 
      });
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      console.error('Error response headers:', err.response?.headers);
      
      const errorMessage = 
        err.response?.data?.errors ? 
          Object.values(err.response.data.errors).flat().join(', ') :
        typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.message 
          || 'Registration failed. Please try again.';
      
      setError(errorMessage);
    }
  };




  const renderAdditionalFields = () => {
    if (formData.roleType === '1') { // Passenger
      return (
        <div className="additional-fields">
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Street Address</label>
              <input 
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={100} // Optional: add max length
                placeholder="Enter your street address"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={50}
                placeholder="Enter your city"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input 
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={50}
                placeholder="Enter your state"
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="form-control"
                required
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Enter postal code"
              />
            </div>
            <div className="form-group">
  <label>Country</label>
  <input
    type="text"
    name="country"
    value={formData.country}
    onChange={handleChange}
    className="form-control"
    placeholder="Enter your country"
    required
  />
</div>
          </div>
        </div>
      );
    } else if (formData.roleType === '2') { // Flight Owner
      return (
        <div className="additional-fields">
          <div className="form-group">
            <label>Company Name</label>
            <input 
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-control"
              required
              maxLength={100}
              placeholder="Enter company name"
            />
          </div>
          
        </div>
      );
    }
    return null;
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">Create an Account</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input 
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
           <label>Phone Number</label>
           <input 
                 type="tel"
                 name="phoneNumber"
                 value={formData.phoneNumber}
                 onChange={handleChange}
                 pattern="[0-9]+"
                 className="form-control"
                 required
                 />
           </div>

<div className="form-group">
  <label>Gender</label>
  <select
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="form-control"
    required
  >
    <option value="">Select Gender</option>
    <option value="1">Male</option>
    <option value="2">Female</option>
    <option value="3">Other</option>
  </select>
</div>

          <div className="form-group">
            <label>Role Type</label>
            <select 
              name="roleType"
              value={formData.roleType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Role</option>
              <option value="1">Passenger</option>
              <option value="2">Flight Owner</option>
            </select>
          </div>

          {formData.roleType && (
            <>
              <div className="separator"></div>
              {renderAdditionalFields()}
            </>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="submit-button">
            Register
          </button>

          <div className="login-link">
            <a href="/login">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;