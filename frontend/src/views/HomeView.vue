<template>
  <div class="home">
    <Navbar />

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>Découvrez des livres pour tous les goûts</h1>
        <p>Une bibliothèque interminable aux derniers best-sellers. Trouvez votre prochaine lecture ici.</p>
        <router-link v-if="userStore.isLoggedIn" to="/dashboard" class="btn-hero">
          Explorer le catalogue
        </router-link>
        <router-link v-else to="/login" class="btn-hero">
          Commencer maintenant
        </router-link>
      </div>
    </section>

    <!-- Popular Books -->
    <section class="popular-section">
      <h2>Livres populaires</h2>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>
      <div v-else-if="popularBooks.length > 0" class="popular-grid">
        <div v-for="book in popularBooks" :key="book.id" class="popular-card">
          <img
            :src="book.image || fallbackCover(book.title)"
            :alt="book.title"
            @error="(e) => handleImageError(e, book.title)"
          />
          <h4>{{ book.title }}</h4>
          <p class="book-editor">{{ book.editor }}</p>
          <p class="book-desc">{{ truncate(book.description) }}</p>
          <router-link to="/dashboard" class="btn-voir">Voir plus</router-link>
        </div>
      </div>
      <div v-else class="no-books">
        <p>Connectez-vous pour accéder au catalogue complet.</p>
        <router-link to="/login" class="btn-hero" style="margin-top:1rem;display:inline-block">Se connecter</router-link>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { booksAPI } from '@/api/axios'
import { useUserStore } from '@/stores/userStore'

interface Book { id: number; title: string; year: number; editor: string; image: string; description?: string }

const userStore = useUserStore()
const loading = ref(true)
const popularBooks = ref<Book[]>([])

function fallbackCover(title: string) {
  const colors = ['1a3a6b','2563a8','16213e','0f3460','533483']
  const color = colors[title.charCodeAt(0) % colors.length]
  return `https://via.placeholder.com/160x220/${color}/ffffff?text=${encodeURIComponent(title.slice(0,15))}`
}
function handleImageError(e: Event, title: string) {
  (e.target as HTMLImageElement).src = fallbackCover(title)
}
function truncate(str?: string, n = 80) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '...' : str
}

onMounted(async () => {
  try {
    const res = await booksAPI.getAll()
    const all: Book[] = res.data?.listeBooks || res.data || []
    popularBooks.value = all.slice(0, 3)
  } catch { popularBooks.value = [] }
  finally { loading.value = false }
})
</script>

<style scoped>
.home { min-height: 100vh; display: flex; flex-direction: column; background: #f0f0f0; }

.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white; padding: 5rem 2rem; text-align: center;
}
.hero-content h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 1rem; max-width: 600px; margin-left: auto; margin-right: auto; }
.hero-content p { color: rgba(255,255,255,0.75); font-size: 1rem; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.btn-hero {
  background: #2563a8; color: white; padding: 0.75rem 2rem;
  border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block; transition: background 0.2s;
}
.btn-hero:hover { background: #1a4f8c; }

.popular-section { padding: 3rem 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }
.popular-section h2 { text-align: center; color: #333; margin-bottom: 2rem; font-size: 1.3rem; letter-spacing: 1px; }

.popular-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

.popular-card {
  background: white; border-radius: 6px; padding: 1.2rem;
  text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  transition: box-shadow 0.2s;
}
.popular-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.16); }
.popular-card img { width: 140px; height: 190px; object-fit: cover; border-radius: 3px; }
.popular-card h4 { font-size: 0.95rem; color: #222; margin: 0.3rem 0 0; font-weight: 700; }
.book-editor { font-size: 0.82rem; color: #888; margin: 0; }
.book-desc { font-size: 0.8rem; color: #666; margin: 0; }
.btn-voir { background: #2563a8; color: white; padding: 0.4rem 1.2rem; border-radius: 4px; text-decoration: none; font-size: 0.82rem; margin-top: 0.4rem; }
.btn-voir:hover { background: #1a4f8c; }

.loading { text-align: center; padding: 3rem; }
.spinner { width: 36px; height: 36px; border: 4px solid #ddd; border-top-color: #2563a8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.no-books { text-align: center; padding: 2rem; color: #888; }

@media (max-width: 640px) { .popular-grid { grid-template-columns: 1fr; } }
</style>
