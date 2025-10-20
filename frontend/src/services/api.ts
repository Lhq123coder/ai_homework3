import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Trips API
export const tripsApi = {
  getAll: async () => {
    const response = await api.get('/trips');
    return response.data.trips;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data.trip;
  },
  create: async (data: any) => {
    const response = await api.post('/trips', data);
    return response.data.trip;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data.trip;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
};

// AI API
export const aiApi = {
  generateItinerary: async (data: {
    destination: string;
    days: number;
    budget: number;
    travelers: number;
    preferences: string;
  }) => {
    const response = await api.post('/ai/generate-itinerary', data);
    return response.data.itinerary;
  },
  analyzeExpenses: async (data: { expenses: any[]; budget: number }) => {
    const response = await api.post('/ai/analyze-expenses', data);
    return response.data.analysis;
  },
};

export default api;

