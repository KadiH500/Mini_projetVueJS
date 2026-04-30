import axios from 'axios';
import { useAuthStore } from '../Store/UseAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});


api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const getCart = () => api.get('/cart');
export const addToCart = (bookId, quantity = 1) => api.post('/cart/add', { bookId, quantity });
export const updateCartQuantity = (id, quantity) => api.patch(`/cart/${id}`, { quantity });
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart/clear');

export default api;
