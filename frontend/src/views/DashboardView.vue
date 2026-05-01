<template>
  <div class="dashboard">
    <Navbar />

    <div class="dashboard-body">
      <!-- Year Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>Start Year</label>
          <input v-model.number="yearFilter.start" type="number" placeholder="ex: 1900" />
        </div>
        <div class="filter-group">
          <label>End Year</label>
          <input v-model.number="yearFilter.end" type="number" placeholder="ex: 2025" />
        </div>
        <button class="btn-search" @click="applyFilter">Search</button>
        <button class="btn-reset" @click="resetFilter">Reset</button>
        <span class="books-count">{{ filteredBooks.length }} livre(s)</span>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des livres...</p>
      </div>
      <div v-else-if="error" class="error-msg">
        ⚠️ {{ error }}
      </div>

      <div v-else class="books-grid">
        <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="book-card"
        >
          <div class="book-cover" @click="openDetail(book)">
            <img
              :src="book.image || fallbackCover(book.title)"
              :alt="book.title"
              @error="(e) => handleImageError(e, book.title)"
              loading="lazy"
            />
            <div class="cover-overlay">
              <span>Voir détail</span>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-year">{{ book.year }}</p>
          </div>
          <div class="book-actions">
            <button
              v-if="!userStore.isFavourite(book.id)"
              class="btn-fav"
              @click="addFav(book.id)"
            >★ Ajouter aux favoris</button>
            <button
              v-else
              class="btn-unfav"
              @click="removeFav(book.id)"
            >✓ Dans les favoris</button>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredBooks.length === 0 && !error" class="no-books">
        Aucun livre trouvé pour ces critères.
      </div>

      <!-- Book Detail Modal -->
      <div v-if="selectedBook" class="modal-overlay" @click.self="selectedBook = null">
        <div class="modal-detail">
          <button class="modal-close" @click="selectedBook = null">✕</button>
          <div class="modal-content">
            <img
              :src="selectedBook.image || fallbackCover(selectedBook.title)"
              :alt="selectedBook.title"
              @error="(e) => handleImageError(e, selectedBook!.title)"
              class="modal-cover"
            />
            <div class="modal-info">
              <h2>{{ selectedBook.title }}</h2>
              <p><strong>Année :</strong> {{ selectedBook.year }}</p>
              <p v-if="selectedBook.editor"><strong>Éditeur :</strong> {{ selectedBook.editor }}</p>
              <p v-if="selectedBook.author"><strong>Auteur :</strong> {{ selectedBook.author }}</p>
              <div class="modal-actions">
                <button
                  v-if="!userStore.isFavourite(selectedBook.id)"
                  class="btn-fav"
                  @click="addFav(selectedBook.id)"
                >★ Ajouter aux favoris</button>
                <button
                  v-else
                  class="btn-unfav"
                  @click="removeFav(selectedBook.id)"
                >✓ Dans les favoris</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  author?: any
}

const userStore = useUserStore()
const loading = ref(true)
const error = ref('')
const books = ref<Book[]>([])
const selectedBook = ref<Book | null>(null)
const yearFilter = ref({ start: null as number | null, end: null as number | null })
const activeFilter = ref({ start: null as number | null, end: null as number | null })

const filteredBooks = computed(() => {
  let list = books.value
  if (activeFilter.value.start) list = list.filter(b => b.year >= activeFilter.value.start!)
  if (activeFilter.value.end)   list = list.filter(b => b.year <= activeFilter.value.end!)
  return list
})

function applyFilter() { activeFilter.value = { ...yearFilter.value } }
function resetFilter() {
  yearFilter.value = { start: null, end: null }
  activeFilter.value = { start: null, end: null }
}

// Génère une cover de fallback colorée avec le titre
function fallbackCover(title: string) {
  const colors = ['1a3a6b', '2563a8', '16213e', '0f3460', '533483', '05386b']
  const color = colors[title.charCodeAt(0) % colors.length]
  const encoded = encodeURIComponent(title.slice(0, 20))
  return `https://via.placeholder.com/200x280/${color}/ffffff?text=${encoded}`
}

function handleImageError(e: Event, title: string) {
  const img = e.target as HTMLImageElement
  img.src = fallbackCover(title)
}

function openDetail(book: Book) { selectedBook.value = book }
function addFav(id: number) { userStore.addFavourite(id) }
function removeFav(id: number) { userStore.removeFavourite(id) }

async function fetchBooks() {
  try {
    const res = await booksAPI.getAll()
    books.value = res.data?.listeBooks || res.data || []
  } catch (e: any) {
    if (e.code === 'ERR_NETWORK') {
      error.value = 'Impossible de contacter le backend. Vérifiez que NestJS tourne sur le port 3000.'
    } else {
      error.value = e.response?.data?.message || 'Erreur de chargement des livres.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<style scoped>
.dashboard { min-height: 100vh; display: flex; flex-direction: column; background: #e8e8e8; }

.dashboard-body {
  flex: 1; padding: 1.5rem 2rem;
  max-width: 1300px; margin: 0 auto; width: 100%;
}

/* Filter Bar */
.filter-bar {
  display: flex; align-items: flex-end; gap: 1rem; flex-wrap: wrap;
  background: white; padding: 1rem 1.5rem; border-radius: 6px;
  margin-bottom: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.filter-group { display: flex; flex-direction: column; gap: 0.3rem; }
.filter-group label { font-size: 0.78rem; color: #555; font-weight: 500; }
.filter-group input {
  border: 1px solid #ccc; padding: 0.45rem 0.7rem;
  border-radius: 4px; font-size: 0.9rem; width: 130px; outline: none;
}
.filter-group input:focus { border-color: #2563a8; }
.btn-search {
  background: #2563a8; color: white; border: none;
  padding: 0.5rem 1.4rem; border-radius: 4px; cursor: pointer; font-size: 0.88rem;
  align-self: flex-end;
}
.btn-search:hover { background: #1a4f8c; }
.btn-reset {
  background: #888; color: white; border: none;
  padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.88rem;
  align-self: flex-end;
}
.books-count { align-self: flex-end; font-size: 0.82rem; color: #888; margin-left: auto; }

/* Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.2rem;
}

.book-card {
  background: white; border-radius: 6px; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }

.book-cover {
  width: 100%; height: 210px; overflow: hidden;
  background: #e0e0e0; position: relative; cursor: pointer;
}
.book-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.book-card:hover .book-cover img { transform: scale(1.04); }

.cover-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.45); color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px;
  opacity: 0; transition: opacity 0.2s;
}
.book-cover:hover .cover-overlay { opacity: 1; }

.book-info { padding: 0.75rem; text-align: center; flex: 1; }
.book-title { color: #2563a8; font-size: 0.88rem; font-weight: 600; margin: 0 0 0.25rem; line-height: 1.3; }
.book-year { color: #666; font-size: 0.82rem; margin: 0; }

.book-actions { padding: 0.6rem; display: flex; justify-content: center; }

.btn-fav {
  background: #fff7e6; color: #c07800; border: 1px solid #f0a500;
  padding: 0.35rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.76rem;
  transition: all 0.2s; font-weight: 500;
}
.btn-fav:hover { background: #f0a500; color: white; }

.btn-unfav {
  background: #e6f4ea; color: #2a9d2a; border: 1px solid #2a9d2a;
  padding: 0.35rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.76rem; font-weight: 500;
}

/* Loading */
.loading { text-align: center; padding: 4rem; color: #888; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #ddd;
  border-top-color: #2563a8; border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.no-books { text-align: center; padding: 3rem; color: #888; }
.error-msg { background: #fee; color: #c00; padding: 1rem 1.5rem; border-radius: 6px; margin: 1rem 0; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-detail {
  background: white; border-radius: 10px; padding: 2rem;
  width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
  position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: #eee; border: none; border-radius: 50%;
  width: 32px; height: 32px; cursor: pointer; font-size: 1rem;
}
.modal-content { display: flex; gap: 1.5rem; align-items: flex-start; }
.modal-cover { width: 130px; height: 180px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.modal-info { flex: 1; }
.modal-info h2 { font-size: 1.2rem; color: #1a3a6b; margin-bottom: 0.8rem; }
.modal-info p { font-size: 0.88rem; color: #555; margin-bottom: 0.4rem; }
.modal-actions { margin-top: 1rem; }

@media (max-width: 500px) {
  .modal-content { flex-direction: column; }
  .modal-cover { width: 100%; height: 200px; }
}
</style>
