import axios from 'axios';
import { useAuthStore } from '../Store/UseAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Admin API for Books
export const adminGetBooks = () => api.get('/books/all');
export const adminCreateBook = (data) => api.post('/books/new', data);
export const adminUpdateBook = (id, data) => api.put(`/books/edit/${id}`, data);
export const adminDeleteBook = (id) => api.delete(`/books/remove/${id}`);
export const adminStats = () => api.get('/books/stats');

// Admin API for Users
export const adminGetUsers = () => api.get('/users');
export const adminUpdateUserRole = (id, role) => api.put(`/users/${id}`, { role });
export const adminDeleteUser = (id) => api.delete(`/users/${id}`);

export default api;
