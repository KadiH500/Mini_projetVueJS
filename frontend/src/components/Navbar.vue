<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="brand-icon">✕</span>
      <span class="brand-name">Book Shop</span>
    </div>
    <ul class="navbar-links">
      <li><router-link to="/">Accueil</router-link></li>
      <template v-if="userStore.isLoggedIn">
        <li><router-link to="/dashboard">All-Books</router-link></li>
        <li v-if="userStore.isAdmin"><router-link to="/add-book">Add</router-link></li>
        <li><router-link to="/favourites" class="fav-link">Favourites</router-link></li>
        <li><router-link to="/tasks">Tasks</router-link></li>
        <li><a href="#" @click.prevent="handleLogout" class="logout-link">Logout</a></li>
      </template>
      <template v-else>
        <li><router-link to="/login">Login</router-link></li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a3a6b 0%, #2563a8 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 56px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.brand-icon {
  font-size: 1.4rem;
  font-weight: 900;
}

.navbar-links {
  display: flex;
  list-style: none;
  gap: 1.8rem;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: rgba(255,255,255,0.88);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: #ffffff;
}

.fav-link.router-link-active {
  color: #ff6b6b !important;
}

.logout-link {
  color: rgba(255,255,255,0.75) !important;
}

.logout-link:hover {
  color: #ff6b6b !important;
}
</style>
