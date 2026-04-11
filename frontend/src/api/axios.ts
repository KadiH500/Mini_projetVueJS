import axios from "axios";
import { useUserStore } from "../stores/userStore";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 JWT INTERCEPTOR ICI
api.interceptors.request.use((config) => {
  const store = useUserStore();

  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }

  return config;
});

export default api;