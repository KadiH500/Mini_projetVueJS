<template>
  <div class="add-book-page">
    <Navbar />
    <div class="page-body">
      <div class="form-card">
        <h2>Ajouter un livre</h2>

        <form @submit.prevent="handleSubmit" class="book-form">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" placeholder="Titre du livre" required />
          </div>

          <div class="form-group">
            <label>Image</label>
            <input v-model="form.image" type="text" placeholder="URL de l'image" required />
          </div>

          <div class="form-group">
            <label>Editor</label>
            <input v-model="form.editor" type="text" placeholder="Éditeur" required />
          </div>

          <div class="form-group">
            <label>Year</label>
            <input v-model.number="form.year" type="number" placeholder="Année" min="1800" max="2100" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Description du livre"></textarea>
          </div>

          <div class="form-group">
            <label>Author</label>
            <select v-model="form.author" required>
              <option value="" disabled>-- Sélectionner un auteur --</option>
              <option
                v-for="author in authors"
                :key="author.id"
                :value="author.id"
              >{{ author.prenom }} {{ author.nom }}</option>
            </select>
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Ajout en cours...' : 'Ajouter Livre' }}
            </button>
            <button type="button" class="btn-cancel" @click="router.push('/all-books')">Annuler</button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { booksAPI, authorsAPI } from '@/api/axios'

interface Author {
  id: number
  prenom: string
  nom: string
}

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const authors = ref<Author[]>([])

const form = ref({
  title: '',
  image: '',
  editor: '',
  year: new Date().getFullYear(),
  description: '',
  author: '' as number | ''
})

async function fetchAuthors() {
  try {
    const res = await authorsAPI.getAll()
    authors.value = res.data || []
  } catch {
    authors.value = []
  }
}

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await booksAPI.add({
      title: form.value.title,
      image: form.value.image,
      editor: form.value.editor,
      year: form.value.year,
      description: form.value.description,
      author: form.value.author
    })
    successMsg.value = 'Livre ajouté avec succès !'
    // Reset form
    form.value = { title: '', image: '', editor: '', year: new Date().getFullYear(), description: '', author: '' }
    setTimeout(() => router.push('/all-books'), 1500)
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Erreur lors de l\'ajout du livre. (Token admin requis)'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAuthors)
</script>

<style scoped>
.add-book-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e8e8e8;
}

.page-body {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.form-card {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 4px;
  width: 100%;
  max-width: 680px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-card h2 {
  margin-bottom: 1.5rem;
  color: #1a3a6b;
  font-size: 1.3rem;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  font-size: 0.82rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #ccc;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563a8;
}

.form-group textarea {
  resize: vertical;
}

.form-group select {
  background: white;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-submit {
  background: #2563a8;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #1a4f8c; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-cancel {
  background: #888;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.error-msg {
  background: #fee;
  color: #c00;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
.success-msg {
  background: #efe;
  color: #060;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
