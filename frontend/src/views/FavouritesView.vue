<template>
  <div class="favs-page">
    <Navbar />
    <div class="favs-body">
      <h2>Mes Favoris</h2>

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="favouriteBooks.length === 0" class="empty">
        Vous n'avez pas encore de livres favoris.
        <router-link to="/dashboard">Explorer les livres</router-link>
      </div>
      <div v-else class="books-grid">
        <div
          v-for="book in favouriteBooks"
          :key="book.id"
          class="book-card"
        >
          <div class="book-cover">
            <img :src="book.image" :alt="book.title" @error="handleImageError" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-year">{{ book.year }}</p>
          </div>
          <div class="book-actions">
            <button class="btn-remove" @click="removeFav(book.id)">
              Remove From Favourites
            </button>
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
}

const userStore = useUserStore()
const loading = ref(true)
const allBooks = ref<Book[]>([])

const favouriteBooks = computed(() =>
  allBooks.value.filter(b => userStore.isFavourite(b.id))
)

function removeFav(id: number) {
  userStore.removeFavourite(id)
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/200x270?text=No+Cover'
}

async function fetchBooks() {
  try {
    const res = await booksAPI.getAll()
    allBooks.value = res.data?.listeBooks || res.data || []
  } catch {
    allBooks.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<style scoped>
.favs-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e8e8e8;
}

.favs-body {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.favs-body h2 {
  font-size: 1.4rem;
  color: #222;
  margin-bottom: 1.5rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.2rem;
}

.book-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
}

.book-cover { width: 100%; height: 200px; overflow: hidden; background: #f0f0f0; }
.book-cover img { width: 100%; height: 100%; object-fit: cover; }

.book-info { padding: 0.8rem; text-align: center; flex: 1; }
.book-title { color: #2563a8; font-size: 0.9rem; font-weight: 600; margin: 0 0 0.3rem; }
.book-year { color: #555; font-size: 0.85rem; margin: 0; }

.book-actions {
  padding: 0.6rem;
  display: flex;
  justify-content: center;
}

.btn-remove {
  background: transparent;
  color: #888;
  border: 1px solid #aaa;
  padding: 0.35rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.2s;
}
.btn-remove:hover { background: #fee; color: #c00; border-color: #c00; }

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #888;
}
.empty a { color: #2563a8; margin-left: 0.5rem; }
</style>
