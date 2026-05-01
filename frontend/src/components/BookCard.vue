<template>
  <div class="book-card">
    <div class="book-cover">
      <img
        :src="book.image"
        :alt="book.title"
        @error="handleImageError"
      />
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-year">{{ book.year }}</p>
      <p v-if="book.editor" class="book-editor">{{ book.editor }}</p>
    </div>
    <div class="book-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  book: {
    id: number
    title: string
    year: number
    editor?: string
    image: string
  }
}>()

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/200x280?text=No+Cover'
}
</script>

<style scoped>
.book-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.book-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 0.8rem;
  text-align: center;
  flex: 1;
}

.book-title {
  color: #2563a8;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.3rem;
}

.book-year {
  color: #555;
  font-size: 0.9rem;
  margin: 0 0 0.2rem;
}

.book-editor {
  color: #888;
  font-size: 0.8rem;
  margin: 0;
}

.book-actions {
  padding: 0.6rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
