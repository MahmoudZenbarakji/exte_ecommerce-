import axios from 'axios';
import { getValidatedApiUrl, logApiConfig } from '../utils/apiConfig';

// Get validated API URL - ensures API_URL never becomes undefined
const API_URL = getValidatedApiUrl();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for production
  // Enable credentials for CORS
  withCredentials: false,
});

// Log API configuration for debugging
logApiConfig();

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('API Request - URL:', config.url)
    console.log('API Request - Token:', token ? 'Present' : 'Missing')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response - Status:', response.status, 'URL:', response.config.url)
    return response;
  },
  (error) => {
    console.log('API Error - Status:', error.response?.status, 'URL:', error.config?.url)
    console.log('API Error - Message:', error.response?.data)
    
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to appropriate login
      const currentPath = window.location.pathname;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      
      // Redirect to appropriate login page
      if (currentPath.startsWith('/dashboard')) {
        window.location.href = '/dashboard/login';
      } else {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
