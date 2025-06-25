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
 * Logs in a user using Laravel Sanctum.
 * It first gets a CSRF cookie and then attempts to log in.
 * @param {object} credentials - The user's email and password.
 * @returns {Promise<object>} The user data from the backend.
 */
export const login = async (credentials) => {
  // Step 1: This is crucial. Get the CSRF cookie from Sanctum.
  await authApi.get('/sanctum/csrf-cookie');
  
  // Step 2: Now that the cookie is set, perform the login request.
  const response = await authApi.post('/api/login', credentials);
  
  return response.data;
};

/**
 * Fetches the currently authenticated user.
 */
export const getUser = async () => {
  // Use the main 'api' instance because this route is at /api/user
  return api.get('/user');
};

/**
 * Logs out the user.
 */
export const logout = async () => {
    // Use the special 'authApi' instance to post to /logout at the root path
    await authApi.post('/logout');
};

// Add your register function here if needed
