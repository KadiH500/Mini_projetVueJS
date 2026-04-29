<template>
  <div class="dashboard">
    <!-- Hero Background -->
    <div class="animated-bg"></div>

    <div class="content-overlay">
      <h1 class="page-title">Dashboard Overview</h1>
      <p class="page-subtitle">Welcome back to Libraria Admin</p>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading statistics...</p>
      </div>
      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>
      <div v-else class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <AppIcon name="book" :size="28" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Books</p>
            <h3 class="stat-value">{{ stats.totalBooks }}</h3>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <AppIcon name="users" :size="28" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Users</p>
            <h3 class="stat-value">{{ stats.totalUsers }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <AppIcon name="settings" :size="28" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Admin Users</p>
            <h3 class="stat-value">{{ stats.adminUsers }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminGetBooks, adminGetUsers } from '../../api/admin'
import AppIcon from '../../components/ui/AppIcon.vue'

const loading = ref(true)
const error = ref('')
const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  adminUsers: 0
})

onMounted(fetchStats)

async function fetchStats() {
  loading.value = true
  try {
    const [booksRes, usersRes] = await Promise.all([
      adminGetBooks(),
      adminGetUsers()
    ])
    
    const books = booksRes.data || []
    const users = usersRes.data || []
    
    stats.value.totalBooks = books.length
    stats.value.totalUsers = users.length
    stats.value.adminUsers = users.filter(u => u.role === 'admin' || u.role === 'ROLE_ADMIN').length
  } catch (err) {
    error.value = 'Failed to load dashboard statistics.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dashboard {
  position: relative;
  min-height: calc(100vh - 100px);
  overflow: hidden;
  border-radius: 24px;
  background: #1a1208;
}

.content-overlay {
  position: relative;
  z-index: 2;
  padding: 40px;
}

.page-title {
  font-size: 32px;
  color: #fff;
  margin: 0 0 8px;
  font-family: 'Georgia', serif;
}

.page-subtitle {
  color: #c2a87a;
  font-family: sans-serif;
  margin: 0 0 48px;
  font-size: 16px;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(194, 168, 122, 0.3);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-8px);
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #c2a87a;
}

.stat-card.primary {
  background: linear-gradient(135deg, #fff 0%, #faf6ef 100%);
  border-color: #c2a87a;
}

.stat-icon {
  width: 64px;
  height: 64px;
  background: #f7efe3;
  color: #c2a87a;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.primary .stat-icon {
  background: #c2a87a;
  color: #fff;
  box-shadow: 0 8px 16px rgba(194, 168, 122, 0.3);
}

.stat-label {
  margin: 0 0 4px;
  color: #8c7b6a;
  font-family: sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.stat-value {
  margin: 0;
  font-size: 44px;
  color: #1a1208;
  font-weight: 800;
  font-family: 'Georgia', serif;
}

/* Animated Background */
.animated-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: 
    linear-gradient(rgba(26, 18, 8, 0.85), rgba(26, 18, 8, 0.75)),
    url('../pic/cover.png');
  background-size: cover;
  background-position: center;
  animation: slowPan 30s ease-in-out infinite alternate;
  transform: scale(1.1);
}

@keyframes slowPan {
  from { background-position: 0% 50%; transform: scale(1.1); }
  to { background-position: 100% 50%; transform: scale(1.2); }
}

.loading-state, .error-state {
  padding: 80px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f7efe3;
  border-top-color: #c2a87a;
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state { color: #b94030; }
</style>

