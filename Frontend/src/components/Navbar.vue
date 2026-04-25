<template>
  <!-- ================= NAVBAR ================= -->
  <nav class="navbar">

    <!-- LOGO -->
    <div class="logo">
      📚 Libraria
    </div>

    <!-- LINKS -->
    <div class="links">
      <a href="#books">Books</a>
      <a href="#">About</a>
    </div>

    <!-- ACTIONS -->
    <div class="actions">

      <!-- wishlist -->
      <button @click="$emit('toggleWishlist')">
        ♥ {{ wishlistCount }}
      </button>

      <!-- cart -->
      <button>
        🛒 {{ cartCount }}
      </button>

      <!-- login -->
      <button @click="$emit('login')">
        Sign in
      </button>

    </div>

  </nav>
</template>

<script setup>
// ================= PROPS =================
// données envoyées depuis Home.vue
defineProps({
  wishlistCount: Number,
  cartCount: Number
})

// ================= EMITS =================
// actions envoyées vers Home.vue
defineEmits(['login', 'toggleWishlist'])
</script>