<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">
          <AppIcon name="book" :size="20" />
        </div>
        <h2 class="logo-text">Admin Panel</h2>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact-active-class="active">
          <AppIcon name="home" :size="18" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/books" class="nav-item" active-class="active">
          <AppIcon name="book" :size="18" />
          <span>Books Management</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <AppIcon name="users" :size="18" />
          <span>Users Management</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-role">{{ authStore.user?.role }}</span>
          <span class="user-email">{{ authStore.user?.email }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <AppIcon name="logout" :size="16" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../Store/UseAuthStore'
import { useRouter } from 'vue-router'
import AppIcon from '../../components/ui/AppIcon.vue'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #faf6ef; /* cream */
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #1a1208; /* ink */
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 2px solid #e8ddc8; /* sand */
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e8ddc8;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  background: #c2a87a; /* gold */
  color: #fff;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-family: sans-serif;
  font-weight: bold;
}

.logo-text {
  margin: 0;
  font-size: 18px;
  color: #1a1208;
  font-weight: bold;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 12px 16px;
  text-decoration: none;
  color: #8c7b6a; /* muted */
  font-family: sans-serif;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-item:hover {
  background: #f7efe3;
  color: #7c5533; /* brown */
}

.nav-item.active {
  background: #e8ddc8;
  color: #1a1208;
  font-weight: bold;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e8ddc8;
}

.user-info {
  margin-bottom: 16px;
}

.user-role {
  display: inline-block;
  background: #1a1208;
  color: #c2a87a;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-family: sans-serif;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.user-email {
  display: block;
  font-size: 13px;
  font-family: sans-serif;
  color: #8c7b6a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1.5px solid #8c7b6a;
  color: #8c7b6a;
  border-radius: 6px;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover {
  border-color: #b94030; /* accent red */
  color: #b94030;
}

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 2px solid #e8ddc8;
  }
}
</style>
