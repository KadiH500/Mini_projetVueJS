import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null);
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'ROLE_ADMIN');
  const isUser = computed(() => isAuthenticated.value && !isAdmin.value);
  const userName = computed(() => user.value?.name || user.value?.username || 'User');

  function setAuthData(newToken, newUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    // Keep backward compatibility with old keys
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    userName,
    setAuthData,
    logout
  };
});
