import { useState, useEffect, createContext, useContext } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to get token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const userData = apiService.getCurrentUserFromStorage();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Try to fetch fresh user data
            const response = await apiService.getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
              setIsAuthenticated(true);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        apiService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        // Automatically log in after registration
        return await login({ email: userData.email, password: userData.password });
      }
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const registerDoctor = async (doctorData) => {
    try {
      const response = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: doctorData.email,
          password: doctorData.password,
          name: doctorData.name,
          phone: doctorData.phone,
          licenseNumber: doctorData.licenseNumber,
          specialty: doctorData.specialtyIds?.[0] || 'General Medicine',
          experience: doctorData.experience,
          education: doctorData.education,
          bio: doctorData.shortBio,
          image: doctorData.image,
          consultationFee: doctorData.priceCents / 100
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Doctor registration failed');
      }

      // Store user data and token
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        setIsAuthenticated(true);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    registerDoctor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
