import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:8000';
const DEFAULT_TIMEOUT = 5000;
let serverErrorShown = false;

// Axios instance configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Utility Functions
const checkServerAvailable = async () => {
  try {
    await axios.get(`${API_URL}/debug`, { timeout: 2000 });
    return true;
  } catch (error) {
    if (!serverErrorShown) {
      console.error('Laravel API server unavailable:', error.message);
      alert('Cannot connect to server. Ensure Laravel backend is running at http://localhost:8000');
      serverErrorShown = true;
    }
    return false;
  }
};

const getCsrfToken = async () => {
  try {
    if (!(await checkServerAvailable())) {
      throw new Error('Server not available');
    }
    console.log('Fetching CSRF token...');
    const response = await axios.get(`${API_URL}/sanctum/csrf-cookie`, { timeout: 3000 });
    console.log('CSRF token acquired:', response);
    return response;
  } catch (error) {
    console.error('CSRF token fetch failed:', error);
    throw error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED'
      ? new Error('Cannot connect to authentication service. Check if server is running.')
      : error;
  }
};

// Response Interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response, code, message } = error;

    if (code === 'ERR_NETWORK' || code === 'ECONNABORTED') {
      console.error('Network error:', message);
      return Promise.reject(new Error('Cannot connect to server. Check if backend is running.'));
    }

    if (response?.status === 401) {
      console.error('Session expired. Please log in again.');
    }

    if (response) {
      console.error('API Error:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
    } else {
      console.error('API Error (No Response):', message);
    }

    return Promise.reject(error);
  }
);

// API Methods
// Test Endpoints
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Test Connection Error:', error);
    throw error;
  }
};

export const sendTestData = async (data) => {
  try {
    const response = await api.post('/test', data);
    return response.data;
  } catch (error) {
    console.error('Send Test Data Error:', error);
    throw error;
  }
};

// Authentication Endpoints
export const registerUser = async (userData) => {
  try {
    console.log('Registering user:', userData);
    if (!(await checkServerAvailable())) {
      throw new Error('Server not available');
    }

    let csrfSuccess = false;
    try {
      await getCsrfToken();
      csrfSuccess = true;
    } catch (error) {
      console.warn('CSRF token retrieval failed:', error.message);
    }

    const config = !csrfSuccess ? {
      headers: {
        'X-CSRF-TOKEN': 'development-token',
        'X-Requested-With': 'XMLHttpRequest'
      }
    } : {};

    const response = await api.post('/register', userData, config);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.message === 'Server not available' || 
        error.code === 'ERR_NETWORK' || 
        error.code === 'ECONNABORTED') {
      throw new Error('Cannot connect to registration service. Ensure backend is running at http://localhost:8000');
    }

    if (error.response?.data) {
      const { errors, message } = error.response.data;
      if (errors) {
        const formattedErrors = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        throw new Error(formattedErrors);
      }
      if (message) throw new Error(message);
    }

    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

export const loginUser = async (credentials) => {
  try {
    await getCsrfToken();
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Get Current User Error:', error);
    throw error;
  }
};

// Event Endpoints
export const getEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Get Events Error:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get Event ${id} Error:`, error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    await getCsrfToken();
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Create Event Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    await getCsrfToken();
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Update Event Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

export const deleteEvent = async (id) => {
  try {
    await getCsrfToken();
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Event Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};

export const getEventsByCategory = async (category) => {
  try {
    const response = await api.get(`/events/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Get Events By Category Error:', error);
    throw error;
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Get Upcoming Events Error:', error);
    throw error;
  }
};

export const getPastEvents = async () => {
  try {
    const response = await api.get('/events/past');
    return response.data;
  } catch (error) {
    console.error('Get Past Events Error:', error);
    throw error;
  }
};

export const getEventsByOrganizer = async (organizerId) => {
  try {
    const response = await api.get(`/events/organizer/${organizerId}`);
    return response.data;
  } catch (error) {
    console.error('Get Events By Organizer Error:', error);
    throw error;
  }
};

// Payment Endpoints
export const initiatePayment = async (orderId, paymentData) => {
  try {
    await getCsrfToken();
    const response = await api.post(`/orders/${orderId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Initiate Payment Error:', error.response?.data || error.message);
    throw error;
  }
};

export const confirmPayment = async (paymentData) => {
  try {
    await getCsrfToken();
    const response = await api.post('/payments/confirm', paymentData);
    return response.data;
  } catch (error) {
    console.error('Confirm Payment Error:', error.response?.data || error.message);
    throw error;
  }
};

// Promo Code Endpoints
export const validatePromoCode = async (code) => {
  try {
    const response = await api.post('/promo-codes/validate', { code });
    return response.data;
  } catch (error) {
    console.error('Validate Promo Code Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createPromoCode = async (promoData) => {
  try {
    await getCsrfToken();
    const response = await api.post('/promo-codes', promoData);
    return response.data;
  } catch (error) {
    console.error('Create Promo Code Error:', error.response?.data || error.message);
    throw error;
  }
};

// Ticket Endpoints
export const verifyTicket = async (ticketId, location) => {
  try {
    const response = await api.post(`/tickets/${ticketId}/verify`, {
      latitude: location.lat,
      longitude: location.lng
    });
    return response.data;
  } catch (error) {
    console.error('Ticket Verification Error:', error.response?.data || error.message);
    throw error;
  }
};

// Export default axios instance
export default api;