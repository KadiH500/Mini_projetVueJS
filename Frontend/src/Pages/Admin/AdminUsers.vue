<template>
  <div class="admin-users">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users Management</h1>
        <p class="page-subtitle">Manage system access and roles</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      Loading users...
    </div>
    
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>#{{ user.id }}</td>
            <td><strong>{{ user.email }}</strong></td>
            <td>{{ user.username }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role === 'ROLE_ADMIN' || user.role === 'admin' ? 'Admin' : 'User' }}
              </span>
            </td>
            <td class="actions-col">
              <button 
                class="btn-ghost small flex-btn" 
                @click="toggleRole(user)"
                :disabled="user.id === currentUserId"
              >
                <AppIcon :name="user.role === 'ROLE_ADMIN' || user.role === 'admin' ? 'users' : 'users'" :size="14" />
                <span>Make {{ user.role === 'ROLE_ADMIN' || user.role === 'admin' ? 'User' : 'Admin' }}</span>
              </button>
              <button 
                class="action-btn delete" 
                @click="confirmDelete(user)" 
                title="Delete User"
                :disabled="user.id === currentUserId"
              >
                <AppIcon name="trash" :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal
      :show="showDeleteModal"
      title="Delete User"
      :message="`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`"
      confirmText="Delete User"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { adminGetUsers, adminUpdateUserRole, adminDeleteUser } from '../../api/admin'
import { useAuthStore } from '../../Store/UseAuthStore'
import ConfirmationModal from '../../components/ui/ConfirmationModal.vue'
import AppIcon from '../../components/ui/AppIcon.vue'

const users = ref([])
const loading = ref(true)
const deleting = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const authStore = useAuthStore()

const currentUserId = computed(() => authStore.user?.id)

onMounted(fetchUsers)

async function fetchUsers() {
  loading.value = true
  try {
    const res = await adminGetUsers()
    users.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch users', err)
  } finally {
    loading.value = false
  }
}

async function toggleRole(user) {
  const newRole = (user.role === 'ROLE_ADMIN' || user.role === 'admin') ? 'ROLE_USER' : 'ROLE_ADMIN'
  try {
    await adminUpdateUserRole(user.id, newRole)
    await fetchUsers()
  } catch (err) {
    console.error('Failed to update role', err)
    alert('An error occurred while updating the role.')
  }
}

function confirmDelete(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!userToDelete.value) return
  
  deleting.value = true
  try {
    await adminDeleteUser(userToDelete.value.id)
    showDeleteModal.value = false
    userToDelete.value = null
    await fetchUsers()
  } catch (err) {
    console.error('Failed to delete user', err)
    alert('An error occurred while deleting the user.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  color: #1a1208;
  margin: 0 0 8px;
}

.page-subtitle {
  color: #8c7b6a;
  font-family: sans-serif;
  margin: 0;
}

.table-container {
  background: #fff;
  border: 1px solid #e8ddc8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(26,18,8,0.04);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: sans-serif;
  font-size: 14px;
}

.data-table th, .data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #e8ddc8;
}

.data-table th {
  background: #f7efe3;
  color: #8c7b6a;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
}

.data-table tbody tr:hover {
  background: #faf6ef;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.role-badge.role_admin, .role-badge.admin {
  background: #c2a87a;
  color: #fff;
}

.role-badge.role_user, .role-badge.user {
  background: #e8ddc8;
  color: #7c5533;
}

.actions-col {
  text-align: right;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
}

.btn-ghost.small {
  padding: 6px 12px;
  font-size: 11px;
}

.flex-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn.delete { color: #b94030; }

.action-btn:hover:not(:disabled) {
  background: #e8ddc8;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loading-state {
  padding: 40px;
  text-align: center;
  font-family: sans-serif;
  color: #8c7b6a;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8ddc8;
}
</style>
