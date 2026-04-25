<template>
  <!-- ================= HERO SECTION ================= -->
  <header class="hero">

    <!-- overlay sombre pour lire texte -->
    <div class="overlay"></div>

    <!-- contenu -->
    <div class="content">

      <h1>
        The World's Finest Books
      </h1>

      <p>
        Discover your next favorite book
      </p>

      <!-- bouton scroll -->
      <button @click="$emit('scrollBooks')">
        Browse Books
      </button>

    </div>

  </header>
</template>

<script setup>
// on envoie action vers Home.vue
defineEmits(['scrollBooks'])
</script>

<style scoped>
/* ================= HERO BACKGROUND ================= */
.hero {
  position: relative;

  /* IMAGE BACKGROUND */
  background-image: url('@/assets/hero.png');
  background-size: cover;
  background-position: center;

  height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* ================= OVERLAY ================= */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

/* ================= CONTENT ================= */
.content {
  position: relative;
  color: white;
  text-align: center;
}
</style>