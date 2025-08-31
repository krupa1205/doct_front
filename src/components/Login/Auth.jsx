import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Auth.css";

const Auth = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'doctor-signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    shortBio: '',
    price: '',
    specialtyIds: []
  });
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, registerDoctor, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch specialties for doctor registration
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch('/api/specialties');
        if (response.ok) {
          const data = await response.json();
          setSpecialties(data.data.specialties || []);
        }
      } catch (err) {
        console.error('Failed to fetch specialties:', err);
      }
    };

    if (authMode === 'doctor-signup') {
      fetchSpecialties();
    }
  }, [authMode]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSpecialtyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({
      ...formData,
      specialtyIds: selectedOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else if (authMode === 'signup') {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        });
      } else if (authMode === 'doctor-signup') {
        await registerDoctor({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          shortBio: formData.shortBio,
          priceCents: Math.round(parseFloat(formData.price) * 100), // Convert to cents
          specialtyIds: formData.specialtyIds
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page mt-10">
      {/* Toggle buttons */}
      <div className="auth-toggle">
        <button
          className={authMode === 'login' ? "active" : ""}
          onClick={() => setAuthMode('login')}
        >
          login
        </button>
        <button
          className={authMode === 'signup' ? "active" : ""}
          onClick={() => setAuthMode('signup')}
        >
          signup
        </button>
        <button
          className={authMode === 'doctor-signup' ? "active" : ""}
          onClick={() => setAuthMode('doctor-signup')}
        >
          register as doctor
        </button>
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="logo">🍒</div>
        <h2>
          {authMode === 'login' && "Welcome Back"}
          {authMode === 'signup' && "Create Account"}
          {authMode === 'doctor-signup' && "Doctor Registration"}
        </h2>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Common fields for signup and doctor signup */}
          {(authMode === 'signup' || authMode === 'doctor-signup') && (
            <>
              <div className="input-box">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="input-box">
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number (optional)" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {/* Doctor-specific fields */}
          {authMode === 'doctor-signup' && (
            <>
              <div className="input-box">
                <textarea 
                  name="shortBio"
                  placeholder="Short Bio (max 500 characters)"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="500"
                  required
                />
              </div>
              <div className="input-box">
                <input 
                  type="number" 
                  name="price"
                  placeholder="Consultation Fee (₹)"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="input-box">
                <label>Specialties (Select at least one)</label>
                <select 
                  multiple
                  name="specialtyIds"
                  value={formData.specialtyIds}
                  onChange={handleSpecialtyChange}
                  required
                  size="4"
                >
                  {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple specialties</small>
              </div>
            </>
          )}

          <div className="input-box">
            <input 
              type="email" 
              name="email"
              placeholder="you@yourmail.com" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="input-box">
            <input 
              type="password" 
              name="password"
              placeholder={
                authMode === 'login' ? "Password" : 
                authMode === 'signup' ? "Create password" : 
                "Create doctor account password"
              } 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="actions">
            <button 
              type="submit" 
              className="next-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (
                authMode === 'login' ? 'Login ➜' : 
                authMode === 'signup' ? 'Sign Up ➜' : 
                'Register as Doctor ➜'
              )}
            </button>
            {authMode === 'login' && (
              <a href="#" onClick={(e) => e.preventDefault()}>forgot password</a>
            )}
          </div>
        </form>
      </div>

      {/* Bottom wave */}
      <div className="wave"></div>
    </div>
  );
};

export default Auth;