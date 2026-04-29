import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, addToCart as apiAddToCart, updateCartQuantity, removeFromCart, clearCart as apiClearCart } from '../api/cart'

export const UseCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const cartTotal = computed(() =>
    items.value.reduce((sum, item) => sum + (Number(item.book.price) * item.quantity), 0)
  )

  async function fetchCart() {
    loading.value = true
    try {
      const res = await getCart()
      items.value = res.data || []
    } catch (err) {
      console.error('Failed to fetch cart', err)
    } finally {
      loading.value = false
    }
  }

  async function addToCart(book) {
    try {
      await apiAddToCart(book.id)
      await fetchCart()
    } catch (err) {
      console.error('Failed to add to cart', err)
    }
  }

  async function updateQuantity(itemId, quantity) {
    if (quantity <= 0) return removeItem(itemId)
    try {
      await updateCartQuantity(itemId, quantity)
      await fetchCart()
    } catch (err) {
      console.error('Failed to update quantity', err)
    }
  }

  async function removeItem(itemId) {
    try {
      await removeFromCart(itemId)
      await fetchCart()
    } catch (err) {
      console.error('Failed to remove item', err)
    }
  }

  async function clearCart() {
    try {
      await apiClearCart()
      items.value = []
    } catch (err) {
      console.error('Failed to clear cart', err)
    }
  }

  return { items, loading, cartCount, cartTotal, fetchCart, addToCart, updateQuantity, removeItem, clearCart }
})