<template>
  <div class="home">

    <!-- ══════════════════ NAVBAR ══════════════════ -->
    <nav class="navbar">
      <div class="nav-inner">

        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-icon">⬡</span>
          Libraria
        </router-link>

        <!-- Center links -->
        <div class="nav-links">
          <a href="#categories" class="nav-link">Categories</a>
          <a href="#books" class="nav-link">Books</a>
          <a href="#" class="nav-link">About</a>
        </div>

        <!-- Right actions -->
        <div class="nav-actions">
          <!-- Wishlist -->
          <button class="icon-btn" @click="showWishlist = !showWishlist" title="Wishlist">
            <span class="icon-btn-inner">
              {{ wishlist.length > 0 ? '♥' : '♡' }}
              <span v-if="wishlist.length > 0" class="icon-badge">{{ wishlist.length }}</span>
            </span>
          </button>

          <!-- Cart -->
          <router-link to="/cart" class="icon-btn" title="Cart">
            <span class="icon-btn-inner">
              🛒
              <span v-if="cartStore.cartCount > 0" class="icon-badge cart-badge">
                {{ cartStore.cartCount }}
              </span>
            </span>
          </router-link>

          <!-- Sign in / User -->
          <button class="signin-btn" @click="goToLogin">
            Sign in
          </button>
        </div>

      </div>
    </nav>

    <!-- ══════════════════ WISHLIST DRAWER ══════════════════ -->
    <Transition name="drawer">
      <div v-if="showWishlist" class="wishlist-drawer">
        <div class="drawer-header">
          <h3>♥ My Wishlist</h3>
          <button class="close-btn" @click="showWishlist = false">✕</button>
        </div>
        <div v-if="wishlist.length === 0" class="drawer-empty">
          No books saved yet.<br/>Click ♡ on any book to save it.
        </div>
        <div v-else class="drawer-list">
          <div v-for="book in wishlist" :key="book.id" class="drawer-item">
            <img :src="book.image || placeholderImg(book.title)" :alt="book.title" />
            <div class="drawer-item-info">
              <p class="drawer-item-title">{{ book.title }}</p>
              <p class="drawer-item-author">{{ book.author }}</p>
              <p class="drawer-item-price">{{ book.price }} TND</p>
            </div>
            <button class="drawer-add" @click="moveToCart(book)">Add to cart</button>
            <button class="drawer-remove" @click="removeFromWishlist(book.id)">✕</button>
          </div>
        </div>
      </div>
    </Transition>
    <div v-if="showWishlist" class="drawer-overlay" @click="showWishlist = false" />

    <!-- ══════════════════ HERO ══════════════════ -->
    <header class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">— Your next great read awaits —</p>
        <h1 class="hero-title">The World's<br/><em>Finest</em> Books</h1>
        <p class="hero-sub">Handpicked titles across every genre, delivered to your door.</p>
        <div class="hero-btns">
          <button class="btn-primary" @click="scrollToBooks">Browse Books</button>
          <button class="btn-ghost" @click="goToLogin">Create Account</button>
        </div>
      </div>
      <div class="hero-deco">
        <div class="deco-spine" v-for="n in 6" :key="n" :style="{ '--i': n }"></div>
      </div>
    </header>

    <!-- ══════════════════ SEARCH + FILTER ══════════════════ -->
    <section class="search-section" id="books">
      <div class="search-inner">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="search"
            placeholder="Search by title or author…"
            class="search-input"
          />
          <button v-if="search" class="search-clear" @click="search = ''">✕</button>
        </div>
        <select v-model="sortBy" class="sort-select">
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="title-asc">Title: A → Z</option>
        </select>
      </div>
    </section>

    <!-- ══════════════════ CATEGORIES ══════════════════ -->
    <section class="categories-section" id="categories">
      <div class="categories-inner">
        <button
          v-for="cat in allCategories"
          :key="cat.name"
          class="cat-pill"
          :class="{ active: selectedCategory === cat.name }"
          @click="selectedCategory = cat.name"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </button>
      </div>

      <!-- Category quote -->
      <Transition name="fade" mode="out-in">
        <div class="cat-quote" :key="selectedCategory">
          <p class="quote-text">"{{ currentQuote.text }}"</p>
          <p class="quote-author">— {{ currentQuote.author }}</p>
        </div>
      </Transition>
    </section>

    <!-- ══════════════════ BOOKS GRID ══════════════════ -->
    <main class="books-section">

      <!-- Loading -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Loading books…</p>
      </div>

      <!-- No results -->
      <div v-else-if="filteredBooks.length === 0" class="state-box">
        <p style="font-size:40px">📭</p>
        <p>No books found for "<strong>{{ search }}</strong>"</p>
        <button class="btn-primary" @click="clearFilters">Clear filters</button>
      </div>

      <!-- Grid -->
      <div v-else class="book-grid">
        <article
          v-for="book in filteredBooks"
          :key="book.id"
          class="book-card"
          @click="goToBook(book.id)"
        >
          <!-- Cover -->
          <div class="card-cover">
            <img
              :src="book.image || placeholderImg(book.title)"
              :alt="book.title"
            />
            <span v-if="book.isNew" class="badge new">New</span>
            <span v-if="book.discount" class="badge sale">-{{ book.discount }}%</span>

            <!-- Wishlist heart -->
            <button
              class="wish-btn"
              :class="{ wishlisted: isWishlisted(book.id) }"
              @click.stop="toggleWishlist(book)"
              :title="isWishlisted(book.id) ? 'Remove from wishlist' : 'Add to wishlist'"
            >
              {{ isWishlisted(book.id) ? '♥' : '♡' }}
            </button>
          </div>

          <!-- Info -->
          <div class="card-body">
            <span class="card-cat">{{ book.category }}</span>
            <h3 class="card-title">{{ book.title }}</h3>
            <p class="card-author">{{ book.author }}</p>

            <!-- Stars -->
            <div class="stars">
              <span
                v-for="s in 5" :key="s"
                :class="['star', { filled: s <= Math.round(book.rating || 0) }]"
              >★</span>
            </div>

            <div class="card-footer">
              <span class="card-price">{{ book.price }} TND</span>
              <button
                class="add-btn"
                :class="{ added: lastAdded === book.id }"
                @click.stop="addToCart(book)"
              >
                {{ lastAdded === book.id ? '✓' : '+' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <p v-if="!loading && filteredBooks.length > 0" class="results-count">
        {{ filteredBooks.length }} book{{ filteredBooks.length !== 1 ? 's' : '' }} found
      </p>
    </main>

    <!-- ══════════════════ TOAST ══════════════════ -->
    <Transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type">
        {{ toast.msg }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBooks } from '@/api/Book'
import { UseCartStore } from '@/Store/UseCartStore'

const router    = useRouter()
const cartStore = UseCartStore()

// ── State ─────────────────────────────────────────────────────────
const books            = ref([])
const loading          = ref(true)
const search           = ref('')
const sortBy           = ref('default')
const selectedCategory = ref('All')
const wishlist         = ref([])
const showWishlist     = ref(false)
const lastAdded        = ref(null)
const toast            = ref(null)

// ── Categories with icons and quotes ─────────────────────────────
const categoryData = [
  {
    name: 'All',
    icon: '📚',
    quote: { text: 'A reader lives a thousand lives before he dies.', author: 'George R.R. Martin' }
  },
  {
    name: 'Fiction',
    icon: '🌙',
    quote: { text: 'Fiction is the lie through which we tell the truth.', author: 'Albert Camus' }
  },
  {
    name: 'Sci-fi',
    icon: '🚀',
    quote: { text: 'The universe is under no obligation to make sense to you.', author: 'Neil deGrasse Tyson' }
  },
  {
    name: 'Self-help',
    icon: '🌱',
    quote: { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' }
  },
  {
    name: 'History',
    icon: '🏛️',
    quote: { text: 'The most effective way to destroy people is to deny and obliterate their own understanding of their history.', author: 'George Orwell' }
  },
  {
    name: 'Business',
    icon: '💼',
    quote: { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' }
  },
  {
    name: 'Philosophy',
    icon: '🪐',
    quote: { text: 'The unexamined life is not worth living.', author: 'Socrates' }
  },
  {
    name: 'Psychology',
    icon: '🧠',
    quote: { text: 'Everything can be taken from a man but one thing: the freedom to choose one\'s attitude.', author: 'Viktor Frankl' }
  },
]

// ── Mock books ────────────────────────────────────────────────────
const mockBooks = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig',         price: 28, category: 'Fiction',    rating: 4, isNew: true,  discount: 0,  image: '' },
  { id: 2, title: 'Atomic Habits',        author: 'James Clear',       price: 32, category: 'Self-help',  rating: 5, isNew: false, discount: 10, image: '' },
  { id: 3, title: 'Dune',                 author: 'Frank Herbert',     price: 25, category: 'Sci-fi',     rating: 5, isNew: false, discount: 0,  image: '' },
  { id: 4, title: 'Sapiens',              author: 'Yuval Noah Harari', price: 35, category: 'History',    rating: 4, isNew: false, discount: 15, image: '' },
  { id: 5, title: 'The Alchemist',        author: 'Paulo Coelho',      price: 22, category: 'Fiction',    rating: 4, isNew: false, discount: 0,  image: '' },
  { id: 6, title: 'The Lean Startup',     author: 'Eric Ries',         price: 30, category: 'Business',   rating: 4, isNew: true,  discount: 0,  image: '' },
  { id: 7, title: '1984',                 author: 'George Orwell',     price: 20, category: 'Fiction',    rating: 5, isNew: false, discount: 0,  image: '' },
  { id: 8, title: 'Thinking Fast & Slow', author: 'Daniel Kahneman',  price: 34, category: 'Psychology', rating: 4, isNew: false, discount: 0,  image: '' },
  { id: 9, title: 'Meditations',          author: 'Marcus Aurelius',   price: 18, category: 'Philosophy', rating: 5, isNew: false, discount: 0,  image: '' },
  { id:10, title: 'Deep Work',            author: 'Cal Newport',       price: 27, category: 'Self-help',  rating: 4, isNew: false, discount: 5,  image: '' },
]

// ── Computed ──────────────────────────────────────────────────────
const allCategories = computed(() => categoryData)

const currentQuote = computed(() => {
  const cat = categoryData.find(c => c.name === selectedCategory.value)
  return cat ? cat.quote : categoryData[0].quote
})

const filteredBooks = computed(() => {
  let list = [...books.value]
  if (selectedCategory.value !== 'All') {
    list = list.filter(b => b.category === selectedCategory.value)
  }
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    )
  }
  if (sortBy.value === 'price-asc')  list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'title-asc')  list.sort((a, b) => a.title.localeCompare(b.title))
  return list
})

// ── Actions ───────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await getBooks()
    books.value = res.data
  } catch {
    books.value = mockBooks
  } finally {
    loading.value = false
  }
})

function addToCart(book) {
  cartStore.addToCart(book)
  lastAdded.value = book.id
  setTimeout(() => lastAdded.value = null, 1500)
  showToast(`"${book.title}" added to cart!`, 'success')
}

function toggleWishlist(book) {
  const idx = wishlist.value.findIndex(b => b.id === book.id)
  if (idx === -1) {
    wishlist.value.push(book)
    showToast(`"${book.title}" saved to wishlist ♥`, 'wish')
  } else {
    wishlist.value.splice(idx, 1)
    showToast('Removed from wishlist', 'info')
  }
}

function isWishlisted(id) {
  return wishlist.value.some(b => b.id === id)
}

function removeFromWishlist(id) {
  wishlist.value = wishlist.value.filter(b => b.id !== id)
}

function moveToCart(book) {
  cartStore.addToCart(book)
  removeFromWishlist(book.id)
  showToast(`"${book.title}" moved to cart!`, 'success')
}

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'All'
  sortBy.value = 'default'
}

function goToBook(id)  { router.push(`/books/${id}`) }
function goToLogin()   { router.push('/login') }
function scrollToBooks() {
  document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })
}

function placeholderImg(title) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=200&background=2d2016&color=c2a87a&bold=true`
}

function showToast(msg, type = 'success') {
  toast.value = { msg, type }
  setTimeout(() => toast.value = null, 2500)
}
</script>

<style scoped>
/* ══ Variables ══════════════════════════════════════════════════════ */
.home {
  --ink:    #1a1208;
  --cream:  #faf6ef;
  --gold:   #c2a87a;
  --brown:  #7c5533;
  --sand:   #e8ddc8;
  --muted:  #8c7b6a;
  --accent: #b94030;
  --green:  #3a7d44;
  --r:      12px;
  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* ══ Navbar ══════════════════════════════════════════════════════════ */
.navbar {
  position: sticky; top: 0; z-index: 200;
  background: var(--ink);
  border-bottom: 2px solid #2e2010;
}
 
.nav-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 28px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.logo {
  display: flex; align-items: center; gap: 8px;
  color: var(--gold); text-decoration: none;
  font-size: 20px; font-weight: bold; letter-spacing: 1px;
}
.logo-icon { font-size: 22px; }
.nav-links { display: flex; gap: 28px; }
.nav-link {
  color: #b8a898; text-decoration: none;
  font-family: sans-serif; font-size: 14px;
  transition: color .2s;
}
.nav-link:hover { color: var(--gold); }
.nav-actions { display: flex; align-items: center; gap: 10px; }

.icon-btn {
  background: none; border: none; cursor: pointer;
  color: #b8a898; font-size: 20px;
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, color .2s;
  text-decoration: none; position: relative;
}
.icon-btn:hover { background: rgba(255,255,255,.08); color: var(--gold); }
.icon-btn-inner { position: relative; display: flex; align-items: center; justify-content: center; }
.icon-badge {
  position: absolute; top: -8px; right: -10px;
  background: var(--accent); color: #fff;
  font-size: 10px; font-family: sans-serif;
  min-width: 16px; height: 16px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
}
.cart-badge { background: var(--gold); color: var(--ink); }

.signin-btn {
  padding: 8px 20px;
  background: var(--gold); color: var(--ink);
  border: none; border-radius: 20px;
  font-family: sans-serif; font-size: 13px; font-weight: bold;
  cursor: pointer; transition: background .2s, transform .1s;
  letter-spacing: .5px;
}
.signin-btn:hover { background: #d4bc92; transform: translateY(-1px); }

/* ══ Wishlist Drawer ═════════════════════════════════════════════════ */
.wishlist-drawer {
  position: fixed; top: 64px; right: 0; bottom: 0;
  width: 340px; background: #fff; z-index: 190;
  box-shadow: -8px 0 32px rgba(0,0,0,.12);
  display: flex; flex-direction: column;
  border-left: 2px solid var(--sand);
}
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--sand);
}
.drawer-header h3 { font-size: 17px; color: var(--ink); margin: 0; }
.close-btn {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: var(--muted); padding: 4px 8px;
  border-radius: 4px; transition: background .2s;
}
.close-btn:hover { background: var(--sand); }
.drawer-empty {
  padding: 40px 20px; text-align: center;
  color: var(--muted); font-family: sans-serif; font-size: 14px;
  line-height: 1.6;
}
.drawer-list { overflow-y: auto; flex: 1; padding: 12px; }
.drawer-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px; margin-bottom: 8px;
  border: 1px solid var(--sand); background: var(--cream);
}
.drawer-item img {
  width: 44px; height: 60px; object-fit: cover; border-radius: 4px;
}
.drawer-item-info { flex: 1; min-width: 0; }
.drawer-item-title {
  font-size: 13px; font-weight: bold; color: var(--ink);
  margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.drawer-item-author { font-size: 11px; color: var(--muted); margin: 0; font-family: sans-serif; }
.drawer-item-price { font-size: 12px; color: var(--green); font-weight: bold; margin: 2px 0 0; font-family: sans-serif; }
.drawer-add {
  padding: 5px 10px; background: var(--ink); color: var(--gold);
  border: none; border-radius: 6px; font-size: 11px; font-family: sans-serif;
  cursor: pointer; white-space: nowrap;
}
.drawer-add:hover { background: var(--brown); }
.drawer-remove {
  background: none; border: none; color: var(--muted);
  cursor: pointer; font-size: 14px; padding: 4px;
  border-radius: 4px; transition: color .2s;
}
.drawer-remove:hover { color: var(--accent); }

.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.3);
  z-index: 180;
}

/* ══ Hero ═════════════════════════════════════════════════════════════ */
.hero {
  background: var(--ink);
  min-height: 420px;
  display: flex; align-items: center;
  padding: 60px 28px;
  position: relative; overflow: hidden;
  border-bottom: 3px solid #2e2010;
}
.hero-content {
  max-width: 1200px; margin: 0 auto; flex: 1;
  position: relative; z-index: 2;
}
.hero-eyebrow {
  font-family: sans-serif; font-size: 12px;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--gold); margin: 0 0 16px; opacity: .8;
}
.hero-title {
  font-size: clamp(40px, 6vw, 80px); font-weight: normal;
  color: var(--cream); line-height: 1.1;
  margin: 0 0 20px; letter-spacing: -1px;
}
.hero-title em { color: var(--gold); font-style: italic; }
.hero-sub {
  font-family: sans-serif; font-size: 16px;
  color: #b8a898; margin: 0 0 32px; max-width: 460px;
}
.hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-primary {
  padding: 14px 32px; background: var(--gold); color: var(--ink);
  border: none; border-radius: 30px;
  font-family: sans-serif; font-size: 14px; font-weight: bold;
  cursor: pointer; transition: transform .2s, background .2s;
  letter-spacing: .5px;
}
.btn-primary:hover { background: #d4bc92; transform: translateY(-2px); }
.btn-ghost {
  padding: 14px 32px; background: none; color: var(--cream);
  border: 1.5px solid #555; border-radius: 30px;
  font-family: sans-serif; font-size: 14px;
  cursor: pointer; transition: border-color .2s, color .2s;
}
.btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

/* Decorative book spines */
.hero-deco {
  position: absolute; right: 0; top: 0; bottom: 0;
  width: 200px; display: flex; align-items: stretch;
  opacity: .15; pointer-events: none;
}
.deco-spine {
  flex: 1;
  background: var(--gold);
  opacity: calc(var(--i) * 0.15);
  border-left: 1px solid rgba(255,255,255,.1);
}

/* ══ Search ══════════════════════════════════════════════════════════ */
.search-section {
  background: #fff;
  border-bottom: 1px solid var(--sand);
  position: sticky; top: 64px; z-index: 100;
}
.search-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; gap: 12px; align-items: center;
}
.search-wrap {
  flex: 1; position: relative;
}
.search-icon {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%); font-size: 16px; pointer-events: none;
}
.search-input {
  width: 100%; padding: 11px 40px 11px 42px;
  border: 2px solid var(--sand); border-radius: 30px;
  font-size: 14px; font-family: sans-serif; outline: none;
  background: var(--cream); box-sizing: border-box;
  transition: border-color .2s;
}
.search-input:focus { border-color: var(--gold); }
.search-clear {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 14px;
}
.sort-select {
  padding: 10px 14px; border: 2px solid var(--sand);
  border-radius: 8px; font-family: sans-serif; font-size: 13px;
  background: var(--cream); outline: none; cursor: pointer;
  color: var(--ink);
}
.sort-select:focus { border-color: var(--gold); }

/* ══ Categories ══════════════════════════════════════════════════════ */
.categories-section {
  max-width: 1200px; margin: 0 auto;
  padding: 32px 28px 0;
}
.categories-inner {
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;
}
.cat-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 20px;
  border: 1.5px solid var(--sand); background: #fff;
  font-family: sans-serif; font-size: 13px; color: var(--muted);
  cursor: pointer; transition: all .2s;
}
.cat-pill:hover { border-color: var(--gold); color: var(--brown); }
.cat-pill.active {
  background: var(--ink); border-color: var(--ink);
  color: var(--gold);
}
.cat-icon { font-size: 15px; }

/* Quote */
.cat-quote {
  background: var(--ink); color: var(--cream);
  border-radius: var(--r); padding: 24px 32px;
  margin-bottom: 32px; border-left: 4px solid var(--gold);
}
.quote-text {
  font-size: 17px; font-style: italic; margin: 0 0 8px;
  line-height: 1.5; color: #e8ddc8;
}
.quote-author {
  font-family: sans-serif; font-size: 13px;
  color: var(--gold); margin: 0; letter-spacing: 1px;
}

/* ══ Books section ═══════════════════════════════════════════════════ */
.books-section {
  max-width: 1200px; margin: 0 auto;
  padding: 0 28px 80px;
}

/* ══ States ══════════════════════════════════════════════════════════ */
.state-box {
  text-align: center; padding: 80px 20px;
  color: var(--muted); font-family: sans-serif;
}
.spinner {
  width: 36px; height: 36px; margin: 0 auto 16px;
  border: 3px solid var(--sand); border-top-color: var(--gold);
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ Book Grid ═══════════════════════════════════════════════════════ */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 24px;
}

/* ══ Book Card ═══════════════════════════════════════════════════════ */
.book-card {
  background: #fff; border-radius: var(--r);
  border: 1px solid var(--sand); overflow: hidden;
  cursor: pointer; transition: transform .25s, box-shadow .25s;
  display: flex; flex-direction: column;
}
.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(26,18,8,.12);
}

.card-cover {
  position: relative; aspect-ratio: 3/4;
  background: var(--sand); overflow: hidden;
}
.card-cover img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .4s;
}
.book-card:hover .card-cover img { transform: scale(1.05); }

.badge {
  position: absolute; top: 10px; left: 10px;
  padding: 3px 9px; border-radius: 4px;
  font-family: sans-serif; font-size: 10px; font-weight: bold;
  letter-spacing: .5px;
}
.badge.new  { background: var(--ink); color: var(--gold); }
.badge.sale { background: var(--accent); color: #fff; top: 36px; }

.wish-btn {
  position: absolute; top: 8px; right: 8px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,.9); border: none;
  font-size: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s, background .2s; color: var(--muted);
}
.wish-btn:hover { transform: scale(1.2); }
.wish-btn.wishlisted { color: #e0445a; background: #fff; }

.card-body {
  padding: 14px; display: flex; flex-direction: column; gap: 5px; flex: 1;
}
.card-cat {
  font-family: sans-serif; font-size: 10px;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--gold); font-weight: bold;
}
.card-title {
  font-size: 14px; font-weight: bold; line-height: 1.3;
  color: var(--ink); margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.card-author {
  font-family: sans-serif; font-size: 12px; color: var(--muted); margin: 0;
}
.stars { display: flex; gap: 2px; }
.star  { font-size: 12px; color: #ddd; }
.star.filled { color: #e9a825; }

.card-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: auto; padding-top: 10px;
}
.card-price { font-size: 16px; font-weight: bold; color: var(--ink); }
.add-btn {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--ink); color: var(--gold);
  border: none; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, transform .1s;
}
.add-btn:hover  { background: var(--brown); }
.add-btn.added  { background: var(--green); color: #fff; font-size: 14px; }
.add-btn:active { transform: scale(.9); }

.results-count {
  margin-top: 32px; text-align: center;
  font-family: sans-serif; font-size: 13px; color: var(--muted);
}

/* ══ Toast ═══════════════════════════════════════════════════════════ */
.toast {
  position: fixed; bottom: 32px; left: 50%;
  transform: translateX(-50%);
  padding: 13px 26px; border-radius: 30px;
  font-family: sans-serif; font-size: 14px;
  z-index: 999; white-space: nowrap;
  background: var(--ink); color: var(--gold);
  border: 1px solid var(--gold);
}
.toast.wish   { background: #4a1b2e; color: #f4a0b8; border-color: #e0445a; }
.toast.info   { background: #1a2a3a; color: #90bde0; border-color: #4a8fc0; }

/* ══ Transitions ═════════════════════════════════════════════════════ */
.fade-enter-active, .fade-leave-active { transition: opacity .3s, transform .3s; }
.fade-enter-from  { opacity: 0; transform: translateY(6px); }
.fade-leave-to    { opacity: 0; transform: translateY(-6px); }

.drawer-enter-active, .drawer-leave-active { transition: transform .3s ease; }
.drawer-enter-from, .drawer-leave-to       { transform: translateX(100%); }

.toast-enter-active, .toast-leave-active { transition: opacity .3s, transform .3s; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to   { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ══ Responsive ══════════════════════════════════════════════════════ */
@media (max-width: 700px) {
  .nav-links       { display: none; }
  .hero            { padding: 40px 20px; }
  .hero-title      { font-size: 38px; }
  .search-inner    { flex-direction: column; }
  .sort-select     { width: 100%; }
  .wishlist-drawer { width: 100%; }
  .categories-section,
  .books-section   { padding-left: 16px; padding-right: 16px; }
}
</style>