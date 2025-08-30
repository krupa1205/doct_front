import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Toggle buttons */}
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          signup
        </button>
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="logo">🍒</div>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Signup extra fields */}
          {!isLogin && (
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
              placeholder={isLogin ? "Password" : "Create password"} 
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
              {isLoading ? 'Processing...' : (isLogin ? 'Login ➜' : 'Sign Up ➜')}
            </button>
            {isLogin && (
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