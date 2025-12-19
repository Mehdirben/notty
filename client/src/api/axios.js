import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable for API URL, fallback to /api for local development
// If VITE_API_URL is set (production), append /api to it
const baseApiUrl = import.meta.env.VITE_API_URL;
const API_URL = baseApiUrl ? `${baseApiUrl.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notty_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isExpired = error.response?.data?.expired;
      const message = error.response?.data?.message || 'Session expired';

      // Clear auth data
      localStorage.removeItem('notty_token');
      localStorage.removeItem('notty_user');

      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        // Show toast and redirect after a short delay so user can see the message
        toast.error(isExpired ? 'Session expired. Please log in again.' : message);
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
