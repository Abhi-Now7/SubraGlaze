import axios from 'axios';

const api = axios.create({
  // Use a relative path so Vite's dev proxy forwards /api to the backend.
  // No hardcoded localhost:5000, so the frontend server fully handles routing.
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
