import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// This is an interceptor. It runs before every request.
api.interceptors.request.use(
  (config) => {
    // Get the token from sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token'); // <-- The fix is here
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;