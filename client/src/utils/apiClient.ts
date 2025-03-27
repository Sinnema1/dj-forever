// client/src/utils/apiClient.ts

import axios, { AxiosHeaders } from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api', // Adjust as needed
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach the auth token from localStorage to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('id_token');
    if (token) {
      // Convert existing headers into an AxiosHeaders instance
      config.headers = AxiosHeaders.from(config.headers);
      // Set the Authorization header
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
