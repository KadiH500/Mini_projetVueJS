<template>
  <div class="home">
    <AppNavbar />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="grain"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">✦ Nouvelle collection disponible</div>
        <h1 class="hero-title">
          Découvrez des livres<br>
          <em>pour tous les goûts</em>
        </h1>
        <p class="hero-sub">
          Une bibliothèque intimement aux derniers best-sellers.<br>
          Trouvez votre prochaine lecture ici.
        </p>
        <div class="hero-actions">
          <router-link to="/books" class="btn-primary">
            Explorer le catalogue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </router-link>
          <router-link to="/favourites" class="btn-ghost">Mes favoris</router-link>
        </div>
      </div>
      <div class="hero-visual">
        <div class="book-stack">
          <div class="stacked-book b3">
            <div class="book-spine" style="background: #2C3E50"></div>
          </div>
          <div class="stacked-book b2">
            <div class="book-spine" style="background: #8B3A2A"></div>
          </div>
          <div class="stacked-book b1">
            <div class="book-cover">
              <div class="book-cover-inner">
                <span class="book-cover-title">1984</span>
                <span class="book-cover-author">George Orwell</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat"><span class="stat-n">2,400+</span><span class="stat-l">Livres disponibles</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-n">380+</span><span class="stat-l">Auteurs</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-n">12k+</span><span class="stat-l">Lecteurs actifs</span></div>
    </div>

    <!-- Popular Books -->
    <section class="popular">
      <div class="section-header">
        <div class="section-label">✦ Sélection</div>
        <h2 class="section-title">Livres populaires</h2>
        <router-link to="/books" class="see-all">Voir tout →</router-link>
      </div>

      <div class="books-grid">
        <div
          v-for="(book, i) in popularBooks"
          :key="book.id"
          class="book-card"
          :style="{ animationDelay: i * 0.1 + 's' }"
        >
          <div class="book-card-cover">
            <img :src="book.image" :alt="book.title" @error="handleImgError" />
            <div class="book-card-overlay">
              <button class="quick-fav" @click="toggleFav(book)" :class="{ active: book.isFav }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
          </div>
          <div class="book-card-info">
            <span class="book-author">{{ book.author }}</span>
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-summary">{{ book.summary }}</p>
            <div class="book-card-footer">
              <span class="book-year">{{ book.year }}</span>
              <router-link :to="`/books/${book.id}`" class="see-more-btn">Voir plus</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
      <div class="cta-content">
        <div class="cta-icon">📖</div>
        <h2>Besoin d'aide ?</h2>
        <p>Contactez-nous pour toute question ou assistance</p>
        <button class="btn-primary">Contactez-nous</button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <span class="footer-brand">Book<em>shop</em></span>
      <span class="footer-copy">© 2025 — Tous droits réservés</span>
    </footer>
  </div>
</template>

<script>
import AppNavbar from './AppNavbar.vue';

export default {
  name: 'HomeView',
  components: { AppNavbar },
  data() {
    return {
      popularBooks: [
        {
          id: 12,
          title: "L'Étranger",
          author: 'Albert Camus',
          year: 1942,
          image: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
          summary: 'Un résumé captivant pour un livre incontournable.',
          isFav: false,
        },
        {
          id: 13,
          title: 'Le Procès',
          author: 'Franz Kafka',
          year: 1925,
          image: 'https://covers.openlibrary.org/b/id/7222161-L.jpg',
          summary: 'Découvrez pourquoi ce livre se lire est un best-seller.',
          isFav: false,
        },
        {
          id: 14,
          title: 'La Formule de Dieu',
          author: 'J.R. Dos Santos',
          year: 2006,
          image: 'https://covers.openlibrary.org/b/id/8231991-L.jpg',
          summary: 'Un récit qui restera gravé dans votre mémoire.',
          isFav: false,
        },
      ],
    };
  },
  methods: {
    toggleFav(book) {
      book.isFav = !book.isFav;
      // TODO: call API to add/remove from favourites
    },
    handleImgError(e) {
      e.target.src = 'https://via.placeholder.com/200x300/EDE7D9/8A8078?text=📚';
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

.home { background: #F5F0E8; min-height: 100vh; }

/* ---- HERO ---- */
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 68px 24px 0;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  gap: 60px;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.hero-orb {
  position: absolute; border-radius: 50%;
  filter: blur(100px); opacity: 0.4;
}
.orb-1 { width: 600px; height: 600px; background: #E8C97A; top: -100px; right: -150px; }
.orb-2 { width: 400px; height: 400px; background: #8B3A2A; opacity: 0.12; bottom: 0; left: -100px; }
.grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4;
}

.hero-content {
  position: relative; z-index: 1;
  flex: 1;
  animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(201,168,76,0.15);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 20px;
  padding: 6px 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 12px; font-weight: 500;
  color: #C9A84C; letter-spacing: 0.04em;
  margin-bottom: 24px;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 500; line-height: 1.1;
  color: #1A1410; letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.hero-title em { color: #C9A84C; font-style: italic; font-weight: 300; }
.hero-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 16px; font-weight: 300;
  color: #8A8078; line-height: 1.7;
  margin-bottom: 36px; max-width: 440px;
}
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #1A1410; color: #F5F0E8;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-size: 14px; font-weight: 500;
  padding: 13px 24px; border-radius: 30px;
  border: none; cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(26,20,16,0.2);
}
.btn-primary:hover { background: #3D3530; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,20,16,0.25); }
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  display: inline-flex; align-items: center;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-size: 14px; color: #3D3530;
  padding: 13px 24px; border-radius: 30px;
  border: 1px solid rgba(26,20,16,0.2);
  transition: border-color 0.2s, background 0.2s;
}
.btn-ghost:hover { border-color: #C9A84C; background: rgba(201,168,76,0.08); color: #C9A84C; }

/* Hero book visual */
.hero-visual {
  position: relative; z-index: 1; flex-shrink: 0;
  animation: fadeUp 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both;
}
.book-stack { position: relative; width: 200px; height: 280px; }
.stacked-book { position: absolute; border-radius: 4px 8px 8px 4px; box-shadow: -4px 4px 20px rgba(26,20,16,0.25); }
.b3 { width: 160px; height: 240px; bottom: 0; left: 40px; transform: rotate(6deg); opacity: 0.5; }
.b2 { width: 170px; height: 250px; bottom: 10px; left: 20px; transform: rotate(3deg); opacity: 0.7; }
.b1 { width: 180px; height: 260px; bottom: 20px; left: 0; }
.book-cover {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #2C1810 0%, #4A2E1A 50%, #1A0E06 100%);
  border-radius: 4px 8px 8px 4px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.book-cover::before {
  content: '';
  position: absolute; inset: 8px;
  border: 1px solid rgba(201,168,76,0.4);
  border-radius: 2px;
}
.book-cover::after {
  content: '';
  position: absolute; left: 16px; top: 0; bottom: 0; width: 3px;
  background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
  opacity: 0.5;
}
.book-cover-inner { text-align: center; z-index: 1; }
.book-cover-title {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; font-weight: 600;
  color: #C9A84C; letter-spacing: 0.05em;
}
.book-cover-author {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: 11px; font-weight: 300;
  color: rgba(245,240,232,0.6);
  letter-spacing: 0.08em; margin-top: 4px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---- STATS BAR ---- */
.stats-bar {
  display: flex; align-items: center; justify-content: center;
  gap: 0; padding: 28px 24px;
  background: #1A1410;
  flex-wrap: wrap;
}
.stat { display: flex; flex-direction: column; align-items: center; padding: 0 48px; gap: 4px; }
.stat-n {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 500; color: #C9A84C;
}
.stat-l { font-family: 'Outfit', sans-serif; font-size: 12px; color: rgba(245,240,232,0.5); letter-spacing: 0.05em; }
.stat-divider { width: 1px; height: 40px; background: rgba(245,240,232,0.1); }

/* ---- POPULAR ---- */
.popular {
  max-width: 1200px; margin: 0 auto;
  padding: 80px 24px;
}
.section-header {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 40px; flex-wrap: wrap;
}
.section-label { font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; color: #C9A84C; letter-spacing: 0.1em; }
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; font-weight: 500; color: #1A1410;
  letter-spacing: -0.02em; flex: 1;
}
.see-all { font-family: 'Outfit', sans-serif; font-size: 13px; color: #8A8078; text-decoration: none; transition: color 0.2s; }
.see-all:hover { color: #C9A84C; }

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.book-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(26,20,16,0.06);
  box-shadow: 0 4px 20px rgba(26,20,16,0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
.book-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(26,20,16,0.14); }

.book-card-cover {
  position: relative; height: 260px; overflow: hidden;
  background: #EDE7D9;
}
.book-card-cover img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s;
}
.book-card:hover .book-card-cover img { transform: scale(1.05); }

.book-card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,20,16,0.3), transparent);
  opacity: 0; transition: opacity 0.3s;
  display: flex; align-items: flex-start; justify-content: flex-end;
  padding: 12px;
}
.book-card:hover .book-card-overlay { opacity: 1; }

.quick-fav {
  background: rgba(245,240,232,0.9); border: none; border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s, transform 0.2s;
  color: #8A8078;
}
.quick-fav:hover, .quick-fav.active { background: #C9A84C; color: white; transform: scale(1.1); }
.quick-fav.active svg { fill: white; }

.book-card-info { padding: 20px; }
.book-author { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500; color: #C9A84C; letter-spacing: 0.06em; text-transform: uppercase; }
.book-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 500; color: #1A1410;
  margin: 6px 0 8px; line-height: 1.2; letter-spacing: -0.01em;
}
.book-summary { font-family: 'Outfit', sans-serif; font-size: 13px; color: #8A8078; line-height: 1.5; font-weight: 300; margin-bottom: 16px; }
.book-card-footer { display: flex; align-items: center; justify-content: space-between; }
.book-year { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #8A8078; font-style: italic; }
.see-more-btn {
  text-decoration: none;
  font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500;
  color: #1A1410;
  background: #F5F0E8; padding: 6px 14px; border-radius: 20px;
  transition: background 0.2s, color 0.2s;
}
.see-more-btn:hover { background: #1A1410; color: #F5F0E8; }

/* ---- CTA ---- */
.cta-banner {
  background: #1A1410;
  padding: 80px 24px;
  text-align: center;
}
.cta-content { max-width: 500px; margin: 0 auto; }
.cta-icon { font-size: 40px; margin-bottom: 16px; }
.cta-content h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; font-weight: 500; color: #F5F0E8;
  margin-bottom: 10px;
}
.cta-content p { font-family: 'Outfit', sans-serif; font-size: 15px; color: rgba(245,240,232,0.5); margin-bottom: 28px; }

/* ---- FOOTER ---- */
.footer {
  background: #0F0C09; padding: 24px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
}
.footer-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 500; color: #F5F0E8;
}
.footer-brand em { color: #C9A84C; font-style: italic; }
.footer-copy { font-family: 'Outfit', sans-serif; font-size: 12px; color: rgba(245,240,232,0.3); }

@media (max-width: 768px) {
  .hero { flex-direction: column; padding-top: 90px; text-align: center; gap: 40px; }
  .hero-sub { margin: 0 auto 36px; }
  .hero-actions { justify-content: center; }
  .hero-visual { display: none; }
  .stat { padding: 0 24px; }
  .stat-divider { height: 30px; }
}
</style>