<template>
  <div class="user-page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span>📚</span>
        <strong>Libraria</strong>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/user-dashboard" class="nav-item active" id="nav-dashboard">
          <span>🏠</span> Dashboard
        </router-link>
        <router-link to="/" class="nav-item" id="nav-browse">
          <span>📖</span> Browse Books
        </router-link>
        <router-link to="/cart" class="nav-item" id="nav-cart">
          <span>🛒</span> My Cart
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">{{ initials }}</div>
          <div class="user-meta">
            <p class="u-name">{{ authStore.userName }}</p>
            <p class="u-role">User Account</p>
          </div>
        </div>
        <button class="logout-btn" id="btn-user-logout" @click="handleLogout">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-bar">
        <div>
          <h1 class="greeting">Welcome back, <span class="highlight">{{ authStore.userName }}</span> 👋</h1>
          <p class="subtext">Here's what's available for you today.</p>
        </div>
        <div class="role-badge user-badge">👤 User</div>
      </header>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div>
            <p class="stat-val">{{ stat.value }}</p>
            <p class="stat-lbl">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <section class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/" class="action-card" id="action-browse">
            <div class="action-icon">📚</div>
            <h3>Browse Library</h3>
            <p>Explore our full collection of books across all genres.</p>
            <span class="action-arrow">→</span>
          </router-link>

          <router-link to="/cart" class="action-card" id="action-cart">
            <div class="action-icon">🛒</div>
            <h3>My Cart</h3>
            <p>Review the books you've added and manage your selections.</p>
            <span class="action-arrow">→</span>
          </router-link>

          <div class="action-card info-card" id="action-profile">
            <div class="action-icon">👤</div>
            <h3>Account Info</h3>
            <div class="profile-info">
              <div class="info-row"><span class="info-lbl">Name</span><span class="info-val">{{ authStore.user?.name || '—' }}</span></div>
              <div class="info-row"><span class="info-lbl">Email</span><span class="info-val">{{ authStore.user?.email }}</span></div>
              <div class="info-row"><span class="info-lbl">Username</span><span class="info-val">@{{ authStore.user?.username }}</span></div>
              <div class="info-row"><span class="info-lbl">Role</span><span class="info-val role-pill">User</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Access notice -->
      <div class="notice">
        <span class="notice-icon">ℹ️</span>
        <p>Your account has <strong>User</strong> level access. You can browse books and manage your cart. For admin features, contact a system administrator.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../Store/UseAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const name = authStore.userName
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const stats = [
  { icon: '📖', value: '500+', label: 'Books Available' },
  { icon: '🛒', value: '0',    label: 'Items in Cart' },
  { icon: '⭐', value: '4.8',  label: 'Avg. Rating' },
]

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; }

.user-page {
  display: flex;
  min-height: 100vh;
  background: #0f0f1e;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
}

/* ── Sidebar ─────────────────────────────────────────────────── */
.sidebar {
  width: 240px;
  background: rgba(255,255,255,0.04);
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: fixed;
  top: 0; left: 0; bottom: 0;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
  padding: 0 8px;
}
.sidebar-logo span { font-size: 24px; }

.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-item:hover, .nav-item.active {
  background: rgba(108,71,255,0.18);
  color: #c4b5fd;
}

.sidebar-footer { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-bottom: 12px;
}
.user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c47ff, #a855f7);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.user-meta { min-width: 0; }
.u-name { margin: 0; font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.u-role { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.35); }

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: none;
  border: 1px solid rgba(248,113,113,0.25);
  border-radius: 10px;
  color: #f87171;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.logout-btn:hover { background: rgba(248,113,113,0.1); border-color: #f87171; }

/* ── Main ─────────────────────────────────────────────────────── */
.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 36px 40px;
  max-width: calc(100vw - 240px);
}

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
.greeting { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 4px; }
.highlight {
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.subtext { margin: 0; color: rgba(255,255,255,0.4); font-size: 14px; }
.role-badge {
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}
.user-badge { background: rgba(108,71,255,0.2); color: #a78bfa; border: 1px solid rgba(108,71,255,0.35); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: rgba(167,139,250,0.4); }
.stat-icon { font-size: 28px; }
.stat-val { margin: 0; font-size: 24px; font-weight: 700; color: #fff; }
.stat-lbl { margin: 2px 0 0; font-size: 12px; color: rgba(255,255,255,0.4); }

/* Section */
.section-title { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.7); margin: 0 0 16px; letter-spacing: 0.5px; }

/* Actions grid */
.actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
.action-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.action-card:hover {
  border-color: rgba(167,139,250,0.45);
  background: rgba(108,71,255,0.1);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(108,71,255,0.2);
}
.action-icon { font-size: 32px; margin-bottom: 12px; }
.action-card h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #fff; }
.action-card p  { margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.5; }
.action-arrow {
  position: absolute;
  bottom: 20px; right: 20px;
  color: rgba(167,139,250,0.6);
  font-size: 18px;
  transition: transform 0.2s;
}
.action-card:hover .action-arrow { transform: translateX(4px); }
.info-card { cursor: default; }
.info-card:hover { transform: none; }

/* Profile info */
.profile-info { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.info-row { display: flex; justify-content: space-between; align-items: center; }
.info-lbl { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.info-val { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }
.role-pill {
  background: rgba(108,71,255,0.2);
  color: #a78bfa;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 11px;
}

/* Notice */
.notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.25);
  border-radius: 12px;
  padding: 16px 20px;
}
.notice-icon { font-size: 20px; flex-shrink: 0; }
.notice p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; }
.notice strong { color: rgba(251,191,36,0.9); }

/* Responsive */
@media (max-width: 900px) {
  .sidebar { display: none; }
  .main-content { margin-left: 0; max-width: 100%; padding: 24px 20px; }
  .stats-row, .actions-grid { grid-template-columns: 1fr; }
}
</style>
