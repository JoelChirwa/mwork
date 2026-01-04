import axios from 'axios';
import showToast from '../utils/toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Attach Clerk JWT automatically
API.interceptors.request.use(
  async (config) => {
    try {
      if (window.Clerk) {
        const token = await window.Clerk.session?.getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Failed to attach Clerk token', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Don't show toast for 401 errors (handled by Clerk)
    if (error.response?.status !== 401) {
      showToast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default API;

