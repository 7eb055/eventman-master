import axios from 'axios';
import api from './api'; // Your pre-configured axios instance

// Create a new, separate instance for auth routes that are NOT prefixed with /api
const authApi = axios.create({
  baseURL: 'http://localhost:8000', // Root URL of the backend
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Handles the login API call and stores the auth token in localStorage.
 * Using localStorage instead of cookies prevents the "431 Header too large"
 * error with the Vite development server.
 *
 * @param {object} credentials - The user's email and password.
 * @returns {Promise<object>} The user data from the backend.
 */
export const login = async (credentials) => {
  // Ensure your backend API URL is correct
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed due to a server error.');
  }

  const data = await response.json();

  // Store token and user data in localStorage
  if (data.token && data.user) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  } else {
    throw new Error('Token or user data not found in login response.');
  }

  return data; // Return the full data object, including user and token
};

/**
 * Fetches the currently authenticated user.
 */
export const getUser = async () => {
  // Use the main 'api' instance because this route is at /api/user
  return api.get('/user');
};

/**
 * Handles user logout by clearing data from localStorage.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optionally, you can also call a backend endpoint to invalidate the token on the server
};

/**
 * Retrieves the stored auth token from localStorage.
 * @returns {string|null} The auth token.
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Retrieves the stored user data from localStorage.
 * @returns {object|null} The parsed user object.
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};
