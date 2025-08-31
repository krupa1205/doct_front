import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

const Auth = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'doctor-login', 'doctor-signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    shortBio: '',
    price: '',
    specialtyIds: [],
    licenseNumber: '',
    experience: '',
    education: '',
    image: ''
  });
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({
          ...formData,
          image: e.target.result // Store as base64 for now
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecialtyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
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
      } else if (authMode === 'doctor-login') {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else if (authMode === 'signup') {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: 'USER' // Explicitly set as patient
        });
      } else if (authMode === 'doctor-signup') {
        // Validate required fields for doctor registration
        if (!formData.image) {
          throw new Error('Please upload a profile image');
        }
        if (formData.specialtyIds.length === 0) {
          throw new Error('Please select at least one specialty');
        }

        await registerDoctor({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          shortBio: formData.shortBio,
          priceCents: Math.round(parseFloat(formData.price) * 100), // Convert to cents
          specialtyIds: formData.specialtyIds,
          licenseNumber: formData.licenseNumber,
          experience: parseInt(formData.experience) || 0,
          education: formData.education,
          image: formData.image
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      shortBio: '',
      price: '',
      specialtyIds: [],
      licenseNumber: '',
      experience: '',
      education: '',
      image: ''
    });
    setImagePreview('');
    setError('');
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    resetForm();
  };

  const isDoctorMode = authMode === 'doctor-login' || authMode === 'doctor-signup';
  const isSignupMode = authMode === 'signup' || authMode === 'doctor-signup';

  return (
    <div className="auth-page mt-20">
      {/* Animated background */}
      <div className="mesh-bg">
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
      </div>

      <div className={`auth-card ${authMode === 'doctor-signup' ? 'doctor-mode' : ''}`}>
        {/* Logo and title */}
        <div className="logo">
          <h1>
            {authMode === 'login' ? '🔐' : 
             authMode === 'doctor-login' ? '👨‍⚕️' :
             authMode === 'signup' ? '👤' : '🏥'}
            <span>MedTech</span>
          </h1>
        </div>

        {/* Toggle buttons */}
        <div className="auth-toggle">
          <button 
            className={authMode === 'login' ? "active" : ""}
            onClick={() => handleModeChange('login')}
          >
            🔐 Patient Login
          </button>
          <button 
            className={authMode === 'doctor-login' ? "active" : ""}
            onClick={() => handleModeChange('doctor-login')}
          >
            👨‍⚕️ Doctor Login
          </button>
          <button 
            className={authMode === 'signup' ? "active" : ""}
            onClick={() => handleModeChange('signup')}
          >
            👤 Patient Signup
          </button>
          <button 
            className={authMode === 'doctor-signup' ? "active" : ""}
            onClick={() => handleModeChange('doctor-signup')}
          >
            🏥 Register as Doctor
          </button>
        </div>

        {/* Form title */}
        <h2>
          {authMode === 'login' ? 'Welcome Back, Patient!' : 
           authMode === 'doctor-login' ? 'Welcome Back, Doctor!' :
           authMode === 'signup' ? 'Join as Patient' : 
           'Join as Medical Professional'}
        </h2>

        {/* Error display */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Patient/Doctor name and phone fields */}
          {isSignupMode && (
            <>
              <div className="input-row">
                <div className="input-box">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="input-box">
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Doctor-specific fields */}
          {authMode === 'doctor-signup' && (
            <div className="doctor-fields">
              {/* Profile Image Upload */}
              <div className="image-upload-section">
                <label className="image-upload-label">
                  <div className="image-upload-area">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <i className="fas fa-camera"></i>
                        <span>Upload Profile Image</span>
                        <small>Required for doctor verification</small>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="image-input"
                  />
                </label>
              </div>

              <div className="input-row">
                <div className="input-box">
                  <input 
                    type="text" 
                    name="licenseNumber"
                    placeholder="Medical License Number" 
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <input 
                    type="number" 
                    name="experience"
                    placeholder="Years of Experience" 
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    required
                  />
                </div>
              </div>
              
              <div className="input-box">
                <input 
                  type="text" 
                  name="education"
                  placeholder="Medical Education/Degree (e.g., MBBS, MD, etc.)" 
                  value={formData.education}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-box">
                <textarea 
                  name="shortBio"
                  placeholder="Professional Bio - Tell patients about your expertise and approach (max 200 characters)"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="200"
                  required
                />
                <small className="char-count">{formData.shortBio.length}/200</small>
              </div>
              
              <div className="input-row">
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
                <div className="input-box specialty-select">
                  <label>Medical Specialties *</label>
                  <select 
                    name="specialtyIds"
                    value={formData.specialtyIds}
                    onChange={handleSpecialtyChange}
                    required
                    multiple
                    size="4"
                  >
                    <option value="" disabled>Select your specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty.id} value={specialty.name}>
                        {specialty.name}
                      </option>
                    ))}
                  </select>
                  <small>Hold Ctrl/Cmd to select multiple specialties</small>
                  {formData.specialtyIds.length > 0 && (
                    <div className="selected-specialties">
                      <strong>Selected:</strong> {formData.specialtyIds.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                authMode === 'doctor-login' ? "Doctor Password" :
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
              {isLoading ? '⏳ Processing...' : (
                authMode === 'login' ? '🔐 Patient Login ➜' : 
                authMode === 'doctor-login' ? '👨‍⚕️ Doctor Login ➜' :
                authMode === 'signup' ? '👤 Create Patient Account ➜' : 
                '🏥 Create Doctor Account ➜'
              )}
            </button>
            {(authMode === 'login' || authMode === 'doctor-login') && (
              <a href="#" onClick={(e) => e.preventDefault()}>🔑 Forgot password?</a>
            )}
          </div>
        </form>

        {/* Session info */}
        <div className="session-info">
          <p>🔒 Your session will remain active for 7 days</p>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="wave"></div>
    </div>
  );
};

export default Auth;