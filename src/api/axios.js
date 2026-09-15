import axios from 'axios';

// In production (Cloudflare Pages), use Render backend URL
// In development, use Vite proxy (/api → localhost:5000)
const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://ayasofya-backend.onrender.com') + '/api'
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('ayasofya_admin_token');
    const customerToken = localStorage.getItem('ayasofya_customer_token');
    const token = adminToken || customerToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdmin = error.config?.url?.includes('/admin');
      if (isAdmin) {
        localStorage.removeItem('ayasofya_admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Admin API
export const adminApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayasofya_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ayasofya_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
