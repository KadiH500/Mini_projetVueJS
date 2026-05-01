<template>
  <div class="tasks-page">
    <Navbar />
    <div class="page-body">
      <div class="page-header">
        <h2>Tasks</h2>
        <button class="btn-add" @click="showAddModal = true">+ Nouvelle tâche</button>
      </div>

      <!-- Stats filter -->
      <div class="stats-bar">
        <input v-model.number="statsFilter.start" type="number" placeholder="Année début" />
        <input v-model.number="statsFilter.end" type="number" placeholder="Année fin" />
        <button class="btn-stats" @click="loadStats">Statistiques</button>
        <span v-if="statsResult" class="stats-result">{{ statsResult }}</span>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else class="tasks-list">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-card"
          :class="[`status-${task.statut.replace(' ', '-')}`]"
        >
          <div class="task-header">
            <span class="task-title">{{ task.title }}</span>
            <span class="task-badge" :class="badgeClass(task.statut)">{{ task.statut }}</span>
          </div>
          <div class="task-meta">Année: {{ task.year }}</div>
          <div class="task-actions">
            <button class="btn-edit-sm" @click="openEditTask(task)">Modifier</button>
            <button class="btn-del-sm" @click="deleteTask(task.id)">Supprimer</button>
          </div>
        </div>
        <div v-if="tasks.length === 0" class="empty">Aucune tâche trouvée.</div>
      </div>

      <!-- Add Modal -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal">
          <h3>Nouvelle tâche</h3>
          <form @submit.prevent="addTask" class="task-form">
            <div class="form-group">
              <label>Title (3-10 caractères)</label>
              <input v-model="addForm.title" type="text" minlength="3" maxlength="10" required />
            </div>
            <div class="form-group">
              <label>Year (2020-2030)</label>
              <input v-model.number="addForm.year" type="number" min="2020" max="2030" required />
            </div>
            <div class="form-group">
              <label>Statut</label>
              <select v-model="addForm.statut" required>
                <option value="">-- Choisir --</option>
                <option value="todo">todo</option>
                <option value="done">done</option>
                <option value="in progress">in progress</option>
              </select>
            </div>
            <div v-if="addError" class="error-msg">{{ addError }}</div>
            <div class="modal-actions">
              <button type="submit" class="btn-save">Ajouter</button>
              <button type="button" class="btn-cancel" @click="showAddModal = false">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="editModal.visible" class="modal-overlay" @click.self="editModal.visible = false">
        <div class="modal">
          <h3>Modifier la tâche</h3>
          <form @submit.prevent="saveEditTask" class="task-form">
            <div class="form-group">
              <label>Title</label>
              <input v-model="editModal.form.title" type="text" minlength="3" maxlength="10" required />
            </div>
            <div class="form-group">
              <label>Year</label>
              <input v-model.number="editModal.form.year" type="number" min="2020" max="2030" required />
            </div>
            <div class="form-group">
              <label>Statut</label>
              <select v-model="editModal.form.statut" required>
                <option value="todo">todo</option>
                <option value="done">done</option>
                <option value="in progress">in progress</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-save">Sauvegarder</button>
              <button type="button" class="btn-cancel" @click="editModal.visible = false">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { tasksAPI } from '@/api/axios'

interface Task {
  id: string
  title: string
  year: number
  statut: string
  createdAt?: Date
}

const loading = ref(true)
const tasks = ref<Task[]>([])
const showAddModal = ref(false)
const addError = ref('')
const statsFilter = ref({ start: 2024, end: 2026 })
const statsResult = ref('')

const addForm = ref({ title: '', year: 2025, statut: '' })
const editModal = reactive({
  visible: false,
  taskId: '',
  form: { title: '', year: 2025, statut: 'todo' }
})

function badgeClass(statut: string) {
  if (statut === 'done') return 'badge-done'
  if (statut === 'in progress') return 'badge-progress'
  return 'badge-todo'
}

async function fetchTasks() {
  try {
    const res = await tasksAPI.getAll()
    tasks.value = Array.isArray(res.data) ? res.data : []
  } catch {
    tasks.value = []
  } finally {
    loading.value = false
  }
}

async function addTask() {
  addError.value = ''
  try {
    await tasksAPI.add({ title: addForm.value.title, year: addForm.value.year, statut: addForm.value.statut })
    showAddModal.value = false
    addForm.value = { title: '', year: 2025, statut: '' }
    await fetchTasks()
  } catch (e: any) {
    addError.value = e.response?.data?.message?.join(', ') || 'Données invalides'
  }
}

function openEditTask(task: Task) {
  editModal.taskId = task.id
  editModal.form = { title: task.title, year: task.year, statut: task.statut }
  editModal.visible = true
}

async function saveEditTask() {
  try {
    await tasksAPI.update(editModal.taskId, editModal.form)
    editModal.visible = false
    await fetchTasks()
  } catch {
    alert('Erreur lors de la mise à jour')
  }
}

async function deleteTask(id: string) {
  if (!confirm('Supprimer cette tâche ?')) return
  try {
    await tasksAPI.delete(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch {
    alert('Erreur lors de la suppression')
  }
}

async function loadStats() {
  try {
    const res = await tasksAPI.stats(statsFilter.value.start, statsFilter.value.end)
    const data = res.data?.selectedTasks || []
    statsResult.value = `${data.length} tâche(s) entre ${statsFilter.value.start} et ${statsFilter.value.end}`
  } catch {
    statsResult.value = 'Erreur de chargement'
  }
}

onMounted(fetchTasks)
</script>

<style scoped>
.tasks-page { min-height: 100vh; display: flex; flex-direction: column; background: #e8e8e8; }
.page-body { flex: 1; padding: 2rem; max-width: 900px; margin: 0 auto; width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.page-header h2 { font-size: 1.4rem; color: #222; }

.btn-add {
  background: #2563a8; color: white; border: none;
  padding: 0.5rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.88rem; font-weight: 600;
}
.btn-add:hover { background: #1a4f8c; }

.stats-bar {
  display: flex; align-items: center; gap: 0.8rem;
  background: white; padding: 0.8rem 1rem; border-radius: 4px; margin-bottom: 1.5rem;
}
.stats-bar input {
  border: 1px solid #ccc; padding: 0.4rem 0.6rem; border-radius: 4px; width: 120px; font-size: 0.88rem;
}
.btn-stats {
  background: #4a90d9; color: white; border: none;
  padding: 0.4rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;
}
.stats-result { font-size: 0.85rem; color: #555; }

.tasks-list { display: flex; flex-direction: column; gap: 0.8rem; }

.task-card {
  background: white; border-radius: 4px; padding: 1rem 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08); border-left: 4px solid #ccc;
  display: flex; flex-direction: column; gap: 0.4rem;
}
.task-card.status-done { border-left-color: #2a9d2a; }
.task-card.status-in-progress { border-left-color: #f0a500; }
.task-card.status-todo { border-left-color: #2563a8; }

.task-header { display: flex; justify-content: space-between; align-items: center; }
.task-title { font-weight: 600; color: #222; }
.task-badge { font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 10px; }
.badge-done { background: #e6f9e6; color: #2a9d2a; }
.badge-progress { background: #fff8e6; color: #c07800; }
.badge-todo { background: #e8f0fb; color: #2563a8; }

.task-meta { font-size: 0.82rem; color: #888; }
.task-actions { display: flex; gap: 0.5rem; }

.btn-edit-sm {
  background: #4a90d9; color: white; border: none;
  padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.78rem;
}
.btn-del-sm {
  background: transparent; color: #c00; border: 1px solid #c00;
  padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.78rem;
}
.btn-del-sm:hover { background: #fee; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal {
  background: white; border-radius: 6px; padding: 2rem; width: 400px;
  max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.modal h3 { margin-bottom: 1.2rem; color: #1a3a6b; }
.task-form { display: flex; flex-direction: column; gap: 0.8rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { font-size: 0.82rem; color: #555; }
.form-group input, .form-group select {
  border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem;
}
.modal-actions { display: flex; gap: 0.8rem; margin-top: 0.5rem; }
.btn-save { background: #2563a8; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
.btn-cancel { background: #888; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
.error-msg { background: #fee; color: #c00; padding: 0.5rem; border-radius: 4px; font-size: 0.83rem; }
.loading, .empty { text-align: center; padding: 2rem; color: #888; }
</style>
