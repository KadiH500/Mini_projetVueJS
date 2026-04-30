<template>
  <div class="user-page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <AppIcon name="book" :size="24" />
        <strong>Libraria</strong>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/user-dashboard" class="nav-item active">
          <AppIcon name="home" :size="20" /> Dashboard
        </router-link>
        <router-link to="/" class="nav-item">
          <AppIcon name="book" :size="20" /> Browse Books
        </router-link>
        <router-link to="/cart" class="nav-item">
          <AppIcon name="cart" :size="20" /> My Cart
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar">{{ initials }}</div>
          <div class="user-details">
            <p class="name">{{ authStore.userName }}</p>
            <p class="role">Reader</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <AppIcon name="logout" :size="18" /> Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-container">
        <!-- Header -->
        <header class="header-section fade-in">
          <div class="welcome-text">
            <h1 class="title">Welcome back, <span class="accent">{{ authStore.userName }}</span> </h1>
            <p class="subtitle">Your literary journey continues here.</p>
          </div>
          <div class="user-badge">
            <AppIcon name="user" :size="16" />
            Member Account
          </div>
        </header>

        <!-- Stats Row -->
        <div class="stats-grid">
          <div 
            v-for="(stat, index) in stats" 
            :key="stat.label" 
            class="stat-card fade-in" 
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="stat-icon-wrap"><AppIcon :name="stat.icon" :size="24" /></div>
            <div class="stat-content">
              <p class="stat-value">{{ stat.value }}</p>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <section class="actions-section fade-in" style="animation-delay: 0.3s">
          <h2 class="section-heading">Quick Actions</h2>
          <div class="actions-grid">
            <router-link to="/" class="action-card">
              <div class="action-icon"><AppIcon name="book" :size="24" /></div>
              <div class="action-info">
                <h3>Browse Library</h3>
                <p>Discover your next favorite book from our curated collection.</p>
              </div>
              <span class="arrow">→</span>
            </router-link>

            <router-link to="/cart" class="action-card">
              <div class="action-icon"><AppIcon name="cart" :size="24" /></div>
              <div class="action-info">
                <h3>My Cart</h3>
                <p>View and manage the books you've selected for checkout.</p>
              </div>
              <span class="arrow">→</span>
            </router-link>

            <div class="action-card profile-card">
              <div class="action-icon"><AppIcon name="user" :size="24" /></div>
              <div class="action-info">
                <h3>Account Details</h3>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">Email</span>
                    <span class="value">{{ authStore.user?.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Username</span>
                    <span class="value">@{{ authStore.user?.username }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Notice -->
        <div class="notice-card fade-in" style="animation-delay: 0.5s">
          <div class="notice-icon"><AppIcon name="sparkles" :size="20" /></div>
          <div class="notice-text">
            <p><strong>Exclusive Access:</strong> As a registered reader, you have access to personalized recommendations and priority cart management.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../Store/UseAuthStore'
import { UseCartStore } from '../Store/UseCartStore'
import { adminGetBooks } from '../api/admin'
import AppIcon from '../components/ui/AppIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = UseCartStore()

const totalBooks = ref(0)
const loadingStats = ref(true)

const initials = computed(() => {
  const name = authStore.userName || 'User'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const stats = computed(() => [
  { icon: 'book', value: loadingStats.value ? '...' : totalBooks.value, label: 'Books Available' },
  { icon: 'cart', value: cartStore.cartCount,     label: 'Books in Cart' },
  { icon: 'star', value: '4.9',   label: 'Reader Rating' },
])

onMounted(async () => {
  loadingStats.value = true
  try {
    const [booksRes] = await Promise.all([
      adminGetBooks(),
      cartStore.fetchCart()
    ])
    totalBooks.value = booksRes.data?.length || 0
  } catch (err) {
    console.error('Failed to load dashboard data', err)
  } finally {
    loadingStats.value = false
  }
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.user-page {
  display: flex;
  min-height: 100vh;
  background: #faf6ef; /* Cream background from Home.vue */
  color: #1a1208; /* Ink from Home.vue */
  font-family: 'Inter', sans-serif;
}

/* ── Sidebar ─────────────────────────────────────────────────── */
.sidebar {
  width: 280px;
  background: #1a1208;
  color: #c2a87a; /* Gold */
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  box-shadow: 4px 0 24px rgba(26, 18, 8, 0.15);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 48px;
  padding: 0 12px;
  color: #c2a87a;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  color: #8c7b6a;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: rgba(194, 168, 122, 0.1);
  color: #d4bc92;
  transform: translateX(4px);
}

.nav-item.active {
  background: #c2a87a;
  color: #1a1208;
  font-weight: 600;
}

.sidebar-footer {
  border-top: 1px solid rgba(140, 123, 106, 0.2);
  padding-top: 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #c2a87a;
  color: #1a1208;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.user-details .name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.user-details .role {
  margin: 0;
  font-size: 12px;
  color: #8c7b6a;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(185, 64, 48, 0.3);
  border-radius: 12px;
  color: #f87171;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(185, 64, 48, 0.1);
  border-color: #f87171;
}

/* ── Main Content ─────────────────────────────────────────────── */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 48px;
}

.content-container {
  max-width: 1100px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
}

.title {
  font-family: 'Georgia', serif;
  font-size: 32px;
  color: #1a1208;
  margin: 0 0 8px;
}

.accent {
  color: #7c5533;
  font-style: italic;
}

.subtitle {
  color: #8c7b6a;
  font-size: 16px;
}

.user-badge {
  background: #fff;
  border: 1.5px solid #e8ddc8;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(26, 18, 8, 0.05);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  background: #fff;
  border: 1.5px solid #e8ddc8;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #c2a87a;
  box-shadow: 0 12px 24px rgba(26, 18, 8, 0.08);
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  background: #faf6ef;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1208;
}

.stat-label {
  margin: 0;
  font-size: 13px;
  color: #8c7b6a;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Actions */
.section-heading {
  font-size: 18px;
  font-weight: 700;
  color: #1a1208;
  margin-bottom: 24px;
  padding-left: 4px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.action-card {
  background: #fff;
  border: 1.5px solid #e8ddc8;
  border-radius: 24px;
  padding: 32px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.action-card:hover {
  background: #1a1208;
  border-color: #1a1208;
  color: #c2a87a;
}

.action-icon {
  font-size: 40px;
  margin-bottom: 20px;
}

.action-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Georgia', serif;
}

.action-card p {
  margin: 0;
  font-size: 14px;
  color: #8c7b6a;
  line-height: 1.6;
}

.action-card:hover p {
  color: rgba(194, 168, 122, 0.7);
}

.arrow {
  position: absolute;
  bottom: 24px;
  right: 24px;
  font-size: 20px;
  opacity: 0;
  transition: all 0.3s;
}

.action-card:hover .arrow {
  opacity: 1;
  transform: translateX(8px);
}

.profile-card { cursor: default; }
.profile-card:hover { background: #fff; border-color: #e8ddc8; color: inherit; }

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8c7b6a;
  font-weight: 600;
  margin-bottom: 2px;
}

.info-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #1a1208;
}

/* Notice */
.notice-card {
  background: #f7efe3;
  border: 1px dashed #c2a87a;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.notice-icon {
  font-size: 24px;
}

.notice-text p {
  margin: 0;
  font-size: 14px;
  color: #7c5533;
  line-height: 1.6;
}

/* Animations */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid, .actions-grid { grid-template-columns: 1fr; }
  .sidebar { width: 80px; padding: 20px 10px; }
  .sidebar-logo strong, .nav-item span:not(.nav-icon), .user-details, .logout-btn span:not(:first-child) { display: none; }
  .main-content { margin-left: 80px; padding: 32px; }
}

@media (max-width: 640px) {
  .header-section { flex-direction: column; gap: 20px; }
  .main-content { padding: 24px; }
}
</style>
