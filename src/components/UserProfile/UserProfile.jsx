import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/apiService';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await apiService.updateProfile(formData);
      if (response.success) {
        updateUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'DOCTOR':
        return '👨‍⚕️';
      case 'ADMIN':
        return '👨‍💼';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'DOCTOR':
        return '#10B981'; // Green
      case 'ADMIN':
        return '#F59E0B'; // Yellow
      default:
        return '#3B82F6'; // Blue
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'DOCTOR':
        return 'Doctor';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Patient';
    }
  };

  const getDashboardUrl = (role) => {
    switch (role) {
      case 'DOCTOR':
        return 'http://localhost:5174'; // Doctor dashboard
      case 'ADMIN':
        return '/admin'; // Admin dashboard (if implemented)
      default:
        return '/dashboard'; // Patient dashboard
    }
  };

  const getDashboardLabel = (role) => {
    switch (role) {
      case 'DOCTOR':
        return '🏥 Doctor Dashboard';
      case 'ADMIN':
        return '⚙️ Admin Dashboard';
      default:
        return '📊 Patient Dashboard';
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div 
        className="user-avatar" 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{ backgroundColor: getRoleColor(user.role) }}
        title={`${user.name} (${getRoleLabel(user.role)})`}
      >
        <span className="role-icon">{getRoleIcon(user.role)}</span>
        <span className="user-name">{user.name}</span>
        <span className="role-badge">{getRoleLabel(user.role)}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-header">
              <div 
                className="profile-avatar"
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {getRoleIcon(user.role)}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p className="user-role">{getRoleLabel(user.role)}</p>
                <p className="user-email">{user.email}</p>
                <p className="session-info">🔒 Session active for 7 days</p>
              </div>
            </div>
          </div>

          <div className="dropdown-actions">
            {/* Dashboard Button */}
            <button 
              className="action-btn dashboard-btn"
              onClick={() => {
                const url = getDashboardUrl(user.role);
                if (url.startsWith('http')) {
                  window.open(url, '_blank');
                } else {
                  window.location.href = url;
                }
                setIsDropdownOpen(false);
              }}
            >
              {getDashboardLabel(user.role)}
            </button>

            {/* Edit Profile Button */}
            <button 
              className="action-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
            </button>
            
            {/* Logout Button */}
            <button 
              className="action-btn logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>

          {isEditing && (
            <div className="edit-form">
              <h4>✏️ Edit Profile</h4>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <button className="save-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
