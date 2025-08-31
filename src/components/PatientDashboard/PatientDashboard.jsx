import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/apiService';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserBookings();
      if (response.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10B981';
      case 'PENDING':
        return '#F59E0B';
      case 'COMPLETED':
        return '#3B82F6';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'COMPLETED':
        return '🎉';
      case 'CANCELLED':
        return '❌';
      default:
        return '❓';
    }
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Please log in to access your dashboard.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👤 Patient Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
        <div className="user-info-card">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="user-details">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p className="role-badge">Patient</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'PENDING').length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'CONFIRMED').length}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎉</div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.status === 'COMPLETED').length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="bookings-section">
          <h2>📋 Your Bookings</h2>
          {isLoading ? (
            <div className="loading">Loading your bookings...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">📋</div>
              <h3>No bookings yet</h3>
              <p>Start by booking an appointment with a doctor</p>
              <button 
                className="book-appointment-btn"
                onClick={() => window.location.href = '/Doctor'}
              >
                🏥 Find a Doctor
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-status" style={{ color: getStatusColor(booking.status) }}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </div>
                    <div className="booking-date">
                      📅 {new Date(booking.appointmentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="booking-details">
                    <h4>Dr. {booking.doctor?.user?.name || 'Unknown Doctor'}</h4>
                    <p>💊 {booking.doctor?.specialty || 'General Medicine'}</p>
                    <p>💰 ₹{booking.totalAmount}</p>
                    {booking.symptoms && (
                      <p>🩺 Symptoms: {booking.symptoms}</p>
                    )}
                  </div>
                  <div className="booking-actions">
                    {booking.status === 'PENDING' && (
                      <button className="action-btn cancel-btn">
                        ❌ Cancel
                      </button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button className="action-btn reschedule-btn">
                        📅 Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
