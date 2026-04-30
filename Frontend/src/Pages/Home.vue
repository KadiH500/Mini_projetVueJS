<template>
  <div class="home">
    <a href="#books" class="skip-link">Skip to books</a>

    <!-- ══════════════════ NAVBAR ══════════════════ -->
    <nav class="navbar">
      <div class="nav-inner">

        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-icon"><AppIcon name="book" :size="22" /></span>
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
          <button
            class="icon-btn"
            @click="showWishlist = !showWishlist"
            title="Wishlist"
            :aria-expanded="showWishlist"
            aria-controls="wishlist-drawer"
            aria-label="Toggle wishlist drawer"
          >
            <span class="icon-btn-inner">
              <AppIcon name="heart" :filled="wishlist.length > 0" :size="20" />
              <span v-if="wishlist.length > 0" class="icon-badge">{{ wishlist.length }}</span>
            </span>
          </button>

          <!-- Cart -->
          <router-link to="/cart" class="icon-btn" title="Cart">
            <span class="icon-btn-inner">
              <AppIcon name="cart" :size="20" />
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
      <div v-if="showWishlist" id="wishlist-drawer" class="wishlist-drawer">
        <div class="drawer-header">
          <h3 class="drawer-title">
            <AppIcon name="heart" :filled="true" :size="16" />
            My Wishlist
          </h3>
          <button class="close-btn" @click="showWishlist = false">
            <AppIcon name="close" :size="14" />
          </button>
        </div>
        <div v-if="wishlist.length === 0" class="drawer-empty">
          No books saved yet.<br/>Use the wishlist button on a book to save it.
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
            <button class="drawer-remove" @click="removeFromWishlist(book.id)">
              <AppIcon name="close" :size="12" />
            </button>
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
          <span class="search-icon"><AppIcon name="search" :size="16" /></span>
          <input
            v-model="search"
            placeholder="Search by title or author…"
            class="search-input"
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <AppIcon name="close" :size="12" />
          </button>
        </div>
        <div class="sort-control">
          <span class="sort-label">Sort by</span>
          <button
            ref="sortTriggerRef"
            class="sort-trigger"
            type="button"
            @click="toggleSortMenu"
            :aria-expanded="sortMenuOpen"
            aria-haspopup="listbox"
            aria-label="Sort books"
          >
            <span class="sort-trigger-text">{{ currentSortLabel }}</span>
            <span class="sort-caret" :class="{ open: sortMenuOpen }" aria-hidden="true">
              <AppIcon name="chevron-down" :size="16" />
            </span>
          </button>

          <Transition name="sort-menu">
            <ul v-if="sortMenuOpen" class="sort-menu" role="listbox" aria-label="Sort options">
              <li v-for="option in sortOptions" :key="option.value">
                <button
                  type="button"
                  class="sort-option"
                  :class="{ active: sortBy === option.value }"
                  @click="selectSort(option.value)"
                >
                  <span>{{ option.label }}</span>
                  <AppIcon v-if="sortBy === option.value" name="check" :size="14" />
                </button>
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ══════════════════ CATEGORIES ══════════════════ -->
    <section class="categories-section" id="categories">
      <div class="categories-inner">
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="cat-pill"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Category Header -->
    <Transition name="fade" mode="out-in">
      <div 
        v-if="selectedCategory !== 'All' && categoryQuotes[selectedCategory]" 
        :key="selectedCategory"
        class="category-header"
      >
        <p class="category-quote">“{{ categoryQuotes[selectedCategory] }}”</p>
        <h2 class="category-title">{{ selectedCategory }}</h2>
      </div>
    </Transition>

    <!-- ══════════════════ BOOKS GRID ══════════════════ -->
    <main class="books-section">

      <!-- Loading -->
      <div v-if="loading" class="books-skeleton" aria-label="Loading books">
        <article v-for="n in 8" :key="n" class="skeleton-card">
          <div class="skeleton-cover"></div>
          <div class="skeleton-line skeleton-line-lg"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line-sm"></div>
        </article>
      </div>

      <!-- Error -->
      <div v-else-if="loadError" class="state-box">
        <div class="state-icon"><AppIcon name="alert" :size="42" /></div>
        <p>{{ loadError }}</p>
        <button class="btn-primary" @click="fetchBooks">Retry</button>
      </div>

      <!-- No results -->
      <div v-else-if="filteredBooks.length === 0" class="state-box">
        <div class="state-icon"><AppIcon name="inbox" :size="42" /></div>
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
              <AppIcon name="heart" :filled="isWishlisted(book.id)" :size="16" />
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
              >
                <AppIcon name="star" :filled="s <= Math.round(book.rating || 0)" :size="12" />
              </span>
            </div>

            <div class="card-footer">
              <span class="card-price">{{ formatPrice(book.price) }}</span>
              <button
                class="add-btn"
                :class="{ added: lastAdded === book.id }"
                @click.stop="addToCart(book)"
              >
                <AppIcon :name="lastAdded === book.id ? 'check' : 'plus'" :size="16" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <p v-if="!loading && filteredBooks.length > 0" class="results-count" aria-live="polite">
        {{ resultsCountLabel }}
      </p>
    </main>

    <!-- ══════════════════ TOAST ══════════════════ -->
    <Transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type" aria-live="polite">
        {{ toast.msg }}
      </div>
    </Transition>

    <!-- ══════════════════ HOW IT WORKS ══════════════════ -->
    <section class="how-it-works" ref="howItWorksRef">
      <div class="how-inner">
        <h2 class="how-title">How Libraria Works</h2>
        <div class="steps-grid">
          <div class="step-card" v-for="(step, i) in steps" :key="i" :class="{ 'is-visible': isHowVisible }">
            <div class="step-num-wrap">
              <span class="step-number">{{ i + 1 }}</span>
              <div v-if="i < 2" class="step-line"></div>
            </div>
            <div class="step-icon-box">
              <AppIcon :name="step.icon" :size="32" stroke-width="1.2" />
            </div>
            <h3 class="step-label">{{ step.title }}</h3>
            <p class="step-text">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════ FOOTER ══════════════════ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <router-link to="/" class="logo">
              <span class="logo-icon"><AppIcon name="book" :size="18" /></span>
              Libraria
            </router-link>
            <p class="brand-tagline">Curating stories for every reader since 2024.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Shop</h4>
              <a href="#books">All Books</a>
              <a href="#categories">Categories</a>
              <a href="#">Special Offers</a>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <a href="#">Delivery Info</a>
              <a href="#">Returns</a>
              <a href="#">Contact Us</a>
            </div>
            <div class="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Libraria. Designed with passion for books.</p>
          <div class="social-links">
            <a href="#" aria-label="Instagram"><AppIcon name="heart" :size="16" /></a>
            <a href="#" aria-label="Facebook"><AppIcon name="users" :size="16" /></a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { UseCartStore } from '@/Store/UseCartStore'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useBooksCatalog } from '@/composables/useBooksCatalog'

const router    = useRouter()
const cartStore = UseCartStore()
const wishlist         = ref([])
const showWishlist     = ref(false)
const lastAdded        = ref(null)
const toast            = ref(null)
const sortMenuOpen = ref(false)
const sortTriggerRef = ref(null)
const categoryQuotes = {
  'Mystery': 'Shadows whisper, secrets hide, Truth waits just out of sight.',
  'Drama': 'Hearts collide, voices rise, Every tear tells a story inside.',
  'Fiction': 'Pages turn, worlds unfold, Every story a spark of gold.',
  'Fantasy': 'Magic stirs, dreams take flight, Beyond the stars, beyond the night.',
  'Social Fiction': 'Voices speak, truths ignite, Changing the world, one story at a time.',
  'Romance': 'Eyes meet, hearts race, Love writes what time can’t erase.',
  'Tragedy': 'Hope fades, echoes remain, Love and loss dance in pain.',
  'Kids': 'Giggles bright, stories fun, Little adventures for everyone.'
}
const {
  loading,
  loadError,
  search,
  sortBy,
  selectedCategory,
  allCategories,
  filteredBooks,
  fetchBooks,
  clearFilters,
  placeholderImg,
} = useBooksCatalog()

const currencyFormatter = new Intl.NumberFormat('fr-TN', {
  style: 'currency',
  currency: 'TND',
  maximumFractionDigits: 2,
})

const resultsCountLabel = computed(() => {
  const count = filteredBooks.value.length
  return `${count} book${count !== 1 ? 's' : ''} found`
})

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'title-asc', label: 'Title: A → Z' },
]

const currentSortLabel = computed(() => {
  const selected = sortOptions.find((option) => option.value === sortBy.value)
  return selected?.label || 'Default'
})

// How It Works Logic
const howItWorksRef = ref(null)
const isHowVisible = ref(false)
const steps = [
  {
    title: 'Choose Your Book',
    text: 'Browse our wide collection and pick the book you love.',
    icon: 'search-book'
  },
  {
    title: 'We Deliver It',
    text: 'We carefully pack your book and deliver it quickly to your doorstep.',
    icon: 'package'
  },
  {
    title: 'Read & Enjoy',
    text: 'Relax, dive in, and enjoy your next great story.',
    icon: 'sparkles'
  }
]

onMounted(fetchBooks)
onMounted(() => {
  document.addEventListener('click', handleOutsideSortClick)
  
  // Intersection Observer for How It Works
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isHowVisible.value = true
      observer.disconnect()
    }
  }, { threshold: 0.2 })
  
  if (howItWorksRef.value) observer.observe(howItWorksRef.value)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideSortClick)
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
    showToast(`"${book.title}" saved to wishlist`, 'wish')
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

function goToBook(id)  { router.push(`/books/${id}`) }
function goToLogin()   { router.push('/login') }
function scrollToBooks() {
  document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })
}

function showToast(msg, type = 'success') {
  toast.value = { msg, type }
  setTimeout(() => toast.value = null, 2500)
}

function formatPrice(price) {
  return currencyFormatter.format(Number(price) || 0)
}

function toggleSortMenu() {
  sortMenuOpen.value = !sortMenuOpen.value
}

function selectSort(value) {
  sortBy.value = value
  sortMenuOpen.value = false
}

function handleOutsideSortClick(event) {
  if (!sortMenuOpen.value || !sortTriggerRef.value) return
  const sortControl = sortTriggerRef.value.closest('.sort-control')
  if (sortControl && !sortControl.contains(event.target)) {
    sortMenuOpen.value = false
  }
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

.skip-link {
  position: absolute;
  left: 16px;
  top: -50px;
  z-index: 300;
  background: #fff;
  color: var(--ink);
  border: 2px solid var(--gold);
  border-radius: 8px;
  padding: 8px 12px;
  font-family: sans-serif;
  text-decoration: none;
}

.skip-link:focus {
  top: 12px;
}

/* ══ Navbar ══════════════════════════════════════════════════════════ */
.navbar {
  position: sticky; top: 0; z-index: 200;
  background: rgba(26, 18, 8, 0.95);
  backdrop-filter: blur(8px);
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
.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
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
  color: #b8a898;
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, color .2s;
  text-decoration: none; position: relative;
}
.icon-btn:hover { background: rgba(255,255,255,.08); color: var(--gold); }
.icon-btn:focus-visible,
.signin-btn:focus-visible,
.search-input:focus-visible,
.sort-trigger:focus-visible,
.sort-option:focus-visible,
.cat-pill:focus-visible,
.btn-primary:focus-visible,
.btn-ghost:focus-visible,
.add-btn:focus-visible,
.wish-btn:focus-visible,
.drawer-add:focus-visible,
.drawer-remove:focus-visible,
.search-clear:focus-visible,
.close-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
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
.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  color: var(--ink);
  margin: 0;
}
.close-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); padding: 4px 8px;
  border-radius: 4px; transition: background .2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  background-color: var(--ink);
  background-image:
    linear-gradient(rgba(26, 18, 8, 0.78), rgba(26, 18, 8, 0.72)),
    url('./pic/cover.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  box-shadow: 0 2px 12px rgba(26,18,8,.06);
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
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
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
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sort-control {
  position: relative;
  width: 220px;
  min-width: 220px;
}
.sort-label {
  position: absolute;
  left: 14px;
  top: -9px;
  background: #fff;
  color: var(--muted);
  font-family: sans-serif;
  font-size: 11px;
  padding: 0 6px;
  letter-spacing: .2px;
  text-transform: uppercase;
  z-index: 2;
}
.sort-trigger {
  width: 100%;
  padding: 12px 40px 12px 14px;
  border: 2px solid var(--sand);
  border-radius: 12px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 600;
  background: #fff;
  outline: none;
  cursor: pointer;
  color: var(--ink);
  transition: border-color .2s, box-shadow .2s, background-color .2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}
.sort-trigger:hover { border-color: #d4bc92; }
.sort-trigger:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(194, 168, 122, 0.2);
}
.sort-trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sort-caret {
  color: var(--muted);
  display: inline-flex;
  transition: transform .2s ease;
}
.sort-caret.open {
  transform: rotate(180deg);
}
.sort-menu {
  list-style: none;
  margin: 8px 0 0;
  padding: 6px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 30;
  background: #fff;
  border: 1px solid var(--sand);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(26,18,8,.12);
}
.sort-option {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ink);
  font-family: sans-serif;
  font-size: 14px;
  text-align: left;
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sort-option:hover {
  background: #f7efe3;
}
.sort-option.active {
  background: #f0e7d8;
  color: #5d4428;
  font-weight: 700;
}
.sort-menu-enter-active,
.sort-menu-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}
.sort-menu-enter-from,
.sort-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

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

/* ══ Category Header ══════════════════════════════════════════════════ */
.category-header {
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 0 28px;
  text-align: center;
}

.category-quote {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
  font-size: 1.15rem;
  color: var(--muted);
  margin-bottom: 8px;
  opacity: 0.85;
}

.category-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.5px;
  margin: 0;
  text-transform: capitalize;
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
.state-icon {
  margin: 0 auto 12px;
  width: fit-content;
}
.spinner {
  width: 36px; height: 36px; margin: 0 auto 16px;
  border: 3px solid var(--sand); border-top-color: var(--gold);
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ Loading Skeleton ════════════════════════════════════════════════ */
.books-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 24px;
}

.skeleton-card {
  border-radius: var(--r);
  border: 1px solid var(--sand);
  background: #fff;
  padding: 12px;
}

.skeleton-cover {
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #f0e7d8 25%, #f7efe3 50%, #f0e7d8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line {
  height: 10px;
  border-radius: 999px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #f0e7d8 25%, #f7efe3 50%, #f0e7d8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line-lg { width: 85%; }
.skeleton-line-sm { width: 45%; margin-bottom: 0; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

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
  box-shadow: 0 6px 18px rgba(26,18,8,.06);
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
  cursor: pointer;
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
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, transform .1s;
}
.add-btn:hover  { background: var(--brown); }
.add-btn.added  { background: var(--green); color: #fff; }
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


/* ══ How It Works ═════════════════════════════════════════════════════ */
.how-it-works {
  background: #fdfaf5;
  border-top: 1px solid var(--sand);
  padding: 60px 28px;
}
.how-inner {
  max-width: 1000px;
  margin: 0 auto;
}
.how-title {
  text-align: center;
  font-size: 24px;
  color: var(--ink);
  margin-bottom: 40px;
  font-weight: 700;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.step-card {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.step-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.step-card:nth-child(2) { transition-delay: 0.2s; }
.step-card:nth-child(3) { transition-delay: 0.4s; }

.step-num-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}
.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--gold);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  background: #fff;
  z-index: 2;
}
.step-line {
  position: absolute;
  left: calc(50% + 14px);
  right: calc(-50% + 14px);
  height: 1px;
  background: var(--sand);
  z-index: 1;
}

.step-icon-box {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brown);
  box-shadow: 0 4px 12px rgba(124, 85, 51, 0.08);
}

.step-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}
.step-text {
  font-family: sans-serif;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  max-width: 240px;
  margin: 0 auto;
}

/* ══ Footer ═══════════════════════════════════════════════════════════ */
.footer {
  background: var(--ink);
  color: #b8a898;
  padding: 60px 28px 30px;
  border-top: 2px solid #2e2010;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 30px;
}
.footer-brand {
  max-width: 300px;
}
.brand-tagline {
  font-size: 13px;
  margin-top: 12px;
  line-height: 1.6;
  opacity: 0.7;
}
.footer-links {
  display: flex;
  gap: 60px;
}
.footer-col h4 {
  color: var(--gold);
  font-size: 14px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer-col a {
  color: inherit;
  text-decoration: none;
  font-family: sans-serif;
  font-size: 13px;
  transition: color 0.2s;
}
.footer-col a:hover {
  color: var(--gold);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  font-size: 12px;
  opacity: 0.6;
}
.social-links {
  display: flex;
  gap: 16px;
}
.social-links a {
  color: inherit;
}
.social-links a:hover {
  color: var(--gold);
}

@media (max-width: 850px) {
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .step-line { display: none; }
  .footer-top {
    flex-direction: column;
    gap: 40px;
  }
  .footer-links {
    flex-wrap: wrap;
    gap: 32px;
  }
}

/* ══ Responsive ══════════════════════════════════════════════════════ */
@media (max-width: 700px) {
  .nav-links       { display: none; }
  .hero            { padding: 40px 20px; }
  .hero-title      { font-size: 38px; }
  .search-inner    { flex-direction: column; }
  .sort-control    { width: 100%; min-width: 0; }
  .wishlist-drawer { width: 100%; }
  .categories-section,
  .books-section   { padding-left: 16px; padding-right: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>