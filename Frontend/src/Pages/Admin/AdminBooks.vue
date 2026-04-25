<template>
  <div class="admin-books">
    <div class="page-header">
      <div>
        <h1 class="page-title">Books Management</h1>
        <p class="page-subtitle">Manage your library catalog</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        + Add New Book
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      Loading books...
    </div>
    
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Year</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>
              <img :src="book.image || 'https://via.placeholder.com/40x60?text=Book'" class="book-thumb" alt="cover" />
            </td>
            <td><strong>{{ book.title }}</strong></td>
            <td><span class="category-badge">{{ book.category }}</span></td>
            <td>{{ book.price }} TND</td>
            <td>{{ book.year }}</td>
            <td class="actions-col">
              <button class="action-btn edit" @click="openEditModal(book)" title="Edit">✎</button>
              <button class="action-btn delete" @click="deleteBook(book.id)" title="Delete">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <input v-model="form.category" type="text" required />
            </div>
            <div class="form-group">
              <label>Price</label>
              <input v-model="form.price" type="number" step="0.01" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Year</label>
              <input v-model="form.year" type="number" required />
            </div>
            <div class="form-group">
              <label>Editor</label>
              <input v-model="form.editor" type="text" required />
            </div>
          </div>
          <div class="form-group">
            <label>Image URL</label>
            <input v-model="form.image" type="url" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-ghost" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Book' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { adminGetBooks, adminCreateBook, adminUpdateBook, adminDeleteBook } from '../../api/admin'

const books = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const form = reactive({
  id: null,
  title: '',
  category: '',
  price: 0,
  year: new Date().getFullYear(),
  editor: '',
  image: ''
})

onMounted(fetchBooks)

async function fetchBooks() {
  loading.value = true
  try {
    const res = await adminGetBooks()
    books.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch books', err)
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

function openEditModal(book) {
  isEditing.value = true
  form.id = book.id
  form.title = book.title
  form.category = book.category
  form.price = book.price
  form.year = book.year
  form.editor = book.editor
  form.image = book.image
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  form.id = null
  form.title = ''
  form.category = ''
  form.price = 0
  form.year = new Date().getFullYear()
  form.editor = ''
  form.image = ''
}

async function submitForm() {
  saving.value = true
  try {
    const payload = {
      title: form.title,
      category: form.category,
      price: Number(form.price),
      year: Number(form.year),
      editor: form.editor,
      image: form.image
    }

    if (isEditing.value) {
      await adminUpdateBook(form.id, payload)
    } else {
      await adminCreateBook(payload)
    }
    closeModal()
    await fetchBooks()
  } catch (err) {
    console.error('Failed to save book', err)
    alert('An error occurred while saving the book.')
  } finally {
    saving.value = false
  }
}

async function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) return
  try {
    await adminDeleteBook(id)
    await fetchBooks()
  } catch (err) {
    console.error('Failed to delete book', err)
    alert('An error occurred while deleting the book.')
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

.btn-primary {
  padding: 10px 20px;
  background: #c2a87a;
  color: #1a1208;
  border: none;
  border-radius: 8px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #d4bc92;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-ghost {
  padding: 10px 20px;
  background: transparent;
  color: #8c7b6a;
  border: 1px solid #8c7b6a;
  border-radius: 8px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: #f7efe3;
  color: #1a1208;
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

.book-thumb {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e8ddc8;
}

.category-badge {
  background: #e8ddc8;
  color: #7c5533;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.actions-col {
  text-align: right;
  width: 120px;
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

.action-btn.edit { color: #3a7d44; }
.action-btn.delete { color: #b94030; }

.action-btn:hover {
  background: #e8ddc8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 18, 8, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e8ddc8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #faf6ef;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1a1208;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #8c7b6a;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #8c7b6a;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e8ddc8;
  border-radius: 6px;
  font-family: sans-serif;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #c2a87a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
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
