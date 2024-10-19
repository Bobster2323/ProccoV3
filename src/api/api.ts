import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (username: string, password: string, role: string) => {
  return api.post('/register', { username, password, role });
};

export const login = (username: string, password: string) => {
  return api.post('/login', { username, password });
};

export const submitServiceRequest = (serviceRequest: any) => {
  return api.post('/service-request', serviceRequest);
};

export const getServiceRequests = () => {
  return api.get('/service-requests');
};

export default api;
