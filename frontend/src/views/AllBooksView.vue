<template>
  <div class="all-books-page">
    <Navbar />
    <div class="page-body">
      <div class="page-header">
        <h2>Books</h2>
        <router-link v-if="userStore.isAdmin" to="/add-book" class="btn-add">Add Book</router-link>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>

      <div v-else class="table-wrapper">
        <table class="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Editor</th>
              <th>Year</th>
              <th>Author</th>
              <th>Image</th>
              <th>Summary</th>
              <th v-if="userStore.isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.editor }}</td>
              <td>{{ book.year }}</td>
              <td>{{ book.author || '—' }}</td>
              <td class="img-cell">
                <a :href="book.image" target="_blank" class="img-link">{{ truncate(book.image) }}</a>
              </td>
              <td class="summary-cell">{{ book.description || '...' }}</td>
              <td v-if="userStore.isAdmin" class="actions-cell">
                <button class="btn-icon btn-delete" @click="confirmDelete(book)" title="Supprimer">✕</button>
                <button class="btn-icon btn-edit" @click="openEdit(book)" title="Modifier">✎</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div v-if="editModal.visible" class="modal-overlay" @click.self="editModal.visible = false">
        <div class="modal">
          <h3>Modifier le livre</h3>
          <form @submit.prevent="saveEdit" class="edit-form">
            <div class="form-group">
              <label>Title</label>
              <input v-model="editModal.form.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Editor</label>
              <input v-model="editModal.form.editor" type="text" />
            </div>
            <div class="form-group">
              <label>Year</label>
              <input v-model.number="editModal.form.year" type="number" />
            </div>
            <div class="form-group">
              <label>Image URL</label>
              <input v-model="editModal.form.image" type="text" />
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn-save">Sauvegarder</button>
              <button type="button" class="btn-cancel" @click="editModal.visible = false">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirm -->
      <div v-if="deleteConfirm.visible" class="modal-overlay" @click.self="deleteConfirm.visible = false">
        <div class="modal">
          <h3>Confirmer la suppression</h3>
          <p>Supprimer <strong>{{ deleteConfirm.book?.title }}</strong> ?</p>
          <div class="modal-actions">
            <button class="btn-delete-confirm" @click="doDelete">Supprimer</button>
            <button class="btn-cancel" @click="deleteConfirm.visible = false">Annuler</button>
          </div>
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
import { booksAPI } from '@/api/axios'
import { useUserStore } from '@/stores/userStore'

interface Book {
  id: number
  title: string
  year: number
  editor: string
  image: string
  author?: string
  description?: string
}

const userStore = useUserStore()
const loading = ref(true)
const error = ref('')
const books = ref<Book[]>([])

const editModal = reactive({
  visible: false,
  bookId: 0,
  form: { title: '', editor: '', year: 0, image: '' }
})

const deleteConfirm = reactive({
  visible: false,
  book: null as Book | null
})

function truncate(str: string, max = 35) {
  if (!str) return '—'
  return str.length > max ? str.slice(0, max) + '...' : str
}

function openEdit(book: Book) {
  editModal.bookId = book.id
  editModal.form = { title: book.title, editor: book.editor, year: book.year, image: book.image }
  editModal.visible = true
}

async function saveEdit() {
  try {
    await booksAPI.update(editModal.bookId, editModal.form)
    const idx = books.value.findIndex(b => b.id === editModal.bookId)
    if (idx !== -1) books.value[idx] = { ...books.value[idx], ...editModal.form }
    editModal.visible = false
  } catch {
    alert('Erreur lors de la mise à jour')
  }
}

function confirmDelete(book: Book) {
  deleteConfirm.book = book
  deleteConfirm.visible = true
}

async function doDelete() {
  if (!deleteConfirm.book) return
  try {
    await booksAPI.softDelete(deleteConfirm.book.id)
    books.value = books.value.filter(b => b.id !== deleteConfirm.book!.id)
    deleteConfirm.visible = false
  } catch {
    alert('Erreur lors de la suppression')
  }
}

async function fetchBooks() {
  try {
    const res = await booksAPI.getAll()
    books.value = res.data?.listeBooks || res.data || []
  } catch {
    error.value = 'Impossible de charger les livres.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<style scoped>
.all-books-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
}

.page-body {
  flex: 1;
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.4rem;
  color: #222;
}

.btn-add {
  background: #2563a8;
  color: white;
  padding: 0.5rem 1.3rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-add:hover { background: #1a4f8c; }

.table-wrapper {
  background: white;
  border-radius: 4px;
  overflow-x: auto;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
}

.books-table th {
  background: #f8f8f8;
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
  color: #333;
}

.books-table td {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #eee;
  color: #444;
  vertical-align: middle;
}

.books-table tr:hover td { background: #f9fbff; }

.img-cell { max-width: 180px; }
.img-link { color: #2563a8; font-size: 0.78rem; word-break: break-all; }
.summary-cell { max-width: 160px; font-size: 0.82rem; color: #666; }

.actions-cell { display: flex; gap: 0.4rem; align-items: center; }

.btn-icon {
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-delete { background: #2563a8; color: white; }
.btn-edit { background: #4a90d9; color: white; }
.btn-icon:hover { opacity: 0.8; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: white;
  border-radius: 6px;
  padding: 2rem;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.modal h3 { margin-bottom: 1.2rem; color: #1a3a6b; }
.edit-form { display: flex; flex-direction: column; gap: 0.8rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { font-size: 0.82rem; color: #555; }
.form-group input {
  border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem;
}
.form-group input:focus { border-color: #2563a8; outline: none; }

.modal-actions { display: flex; gap: 0.8rem; margin-top: 0.5rem; }
.btn-save { background: #2563a8; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
.btn-delete-confirm { background: #c00; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
.btn-cancel { background: #888; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }

.loading { text-align: center; padding: 3rem; color: #888; }
.error-msg { background: #fee; color: #c00; padding: 1rem; border-radius: 4px; }
</style>
