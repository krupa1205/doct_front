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
    const response = await apiService.login(credentials);
    if (response.success) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await apiService.register(userData);
    if (response.success) {
      // Automatically log in after registration
      return await login({ email: userData.email, password: userData.password });
    }
    throw new Error(response.message || 'Registration failed');
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

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
