import axios from 'axios';

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
      localStorage.removeItem('notty_token');
      localStorage.removeItem('notty_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
