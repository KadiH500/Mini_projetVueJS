<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Initialise le store depuis localStorage au démarrage
const userStore = useUserStore()
userStore.initFromStorage()
</script>

<style>
/* Reset global */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: #f0f0f0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #aaa; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #888; }
</style>
