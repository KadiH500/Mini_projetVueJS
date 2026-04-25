<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard Overview</h1>
    <p class="page-subtitle">Welcome back to Libraria Admin</p>

    <div v-if="loading" class="loading-state">
      Loading statistics...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <p class="stat-label">Total Books</p>
          <h3 class="stat-value">{{ stats.totalBooks }}</h3>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <p class="stat-label">Total Users</p>
          <h3 class="stat-value">{{ stats.totalUsers }}</h3>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🛡️</div>
        <div class="stat-info">
          <p class="stat-label">Admin Users</p>
          <h3 class="stat-value">{{ stats.adminUsers }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminGetBooks, adminGetUsers } from '../../api/admin'

const loading = ref(true)
const error = ref('')
const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  adminUsers: 0
})

onMounted(async () => {
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
})
</script>

<style scoped>
.page-title {
  font-size: 28px;
  color: #1a1208;
  margin: 0 0 8px;
}

.page-subtitle {
  color: #8c7b6a;
  font-family: sans-serif;
  margin: 0 0 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e8ddc8;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(26,18,8,0.04);
}

.stat-icon {
  width: 56px;
  height: 56px;
  background: #f7efe3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0 0 4px;
  color: #8c7b6a;
  font-family: sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  margin: 0;
  font-size: 32px;
  color: #1a1208;
}

.loading-state, .error-state {
  padding: 40px;
  text-align: center;
  font-family: sans-serif;
  color: #8c7b6a;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8ddc8;
}

.error-state {
  color: #b94030;
}
</style>
