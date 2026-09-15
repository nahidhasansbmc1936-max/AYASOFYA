import axios from 'axios';

// Production: use Render backend via VITE_API_URL (set in Cloudflare Pages env vars)
// Development: use Vite proxy (/api → localhost:5000)
const BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://ayasofya-backend.onrender.com').replace(/\/$/, '') + '/api'
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
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

// Handle 401 — redirect admin to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAdmin = url.includes('/admin') || !!localStorage.getItem('ayasofya_admin_token');
      if (isAdmin) {
        localStorage.removeItem('ayasofya_admin_token');
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Dedicated admin axios instance — same BASE_URL, reads admin token only
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
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
