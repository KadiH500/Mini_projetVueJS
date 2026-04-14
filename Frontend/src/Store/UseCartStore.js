import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const UseCartStore = defineStore('cart', () => {
  const items = ref([])

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  function addToCart(book) {
    const existing = items.value.find(i => i.id === book.id)
    if (existing) {
      existing.qty++
    } else {
      items.value.push({ ...book, qty: 1 })
    }
  }

  return { items, cartCount, addToCart }
})