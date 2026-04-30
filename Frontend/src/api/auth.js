import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

/**
 * creation mta user jdid
 * @param {{ name: string, email: string, username: string, password: string, role: string }} data
 */
export const register = (data) => api.post('/auth/signup', data);

/**
 * login mta user existant
 * @param {{ identifiant: string, password: string }} data
 */
export const login = (data) => api.post('/auth/signin', data);

export default api;
