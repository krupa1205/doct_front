// API service for all backend operations
const API_BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  return response;
};

class ApiService {
  // Auth methods
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/profile`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // Doctor methods
  async getAllDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${API_BASE_URL}/doctors?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctors');
      }

      return data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  async searchDoctors(filters) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.specialty && filters.specialty !== 'All Specialties') {
        queryParams.append('specialty', filters.specialty);
      }
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await fetch(`${API_BASE_URL}/doctors/search?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search doctors');
      }

      return data;
    } catch (error) {
      console.error('Error searching doctors:', error);
      throw error;
    }
  }

  async getDoctorById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor');
      }

      return data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  async getDoctorAvailability(doctorId, date = null) {
    try {
      const url = date 
        ? `${API_BASE_URL}/doctors/${doctorId}/availability?date=${date}`
        : `${API_BASE_URL}/doctors/${doctorId}/availability`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch availability');
      }

      return data;
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      throw error;
    }
  }

  // Booking methods
  async createBooking(bookingData) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/bookings/my-bookings?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async getDoctorBookings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.date) queryParams.append('date', filters.date);

      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/bookings/doctor-bookings?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor bookings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching doctor bookings:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      return data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }

  // Specialty methods
  async getAllSpecialties() {
    try {
      const response = await fetch(`${API_BASE_URL}/specialties`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch specialties');
      }

      return data;
    } catch (error) {
      console.error('Error fetching specialties:', error);
      throw error;
    }
  }

  // Dashboard stats
  async getUserStats() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async getDoctorStats() {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/doctors/dashboard/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      throw error;
    }
  }

  // Utility methods
  isAuthenticated() {
    return !!getAuthToken();
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new ApiService();
