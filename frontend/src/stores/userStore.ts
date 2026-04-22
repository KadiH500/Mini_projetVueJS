import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/axios'

export interface User {
  id: number
  username: string
  email: string
  role: string
  access_token: string
}

export const useUserStore = defineStore('user', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const favourites = ref<number[]>([])

  // ─── Init from localStorage ───────────────────────────────────────────────
  function initFromStorage() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('access_token')
    const savedFavs = localStorage.getItem('favourites')
    if (savedUser) user.value = JSON.parse(savedUser)
    if (savedToken) token.value = savedToken
    if (savedFavs) favourites.value = JSON.parse(savedFavs)
  }

  // ─── Computed ─────────────────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ─── Actions ──────────────────────────────────────────────────────────────
  async function signIn(identifiant: string, password: string) {
    const response = await authAPI.signIn({ identifiant, password })
    const data: User = response.data
    user.value = data
    token.value = data.access_token
    localStorage.setItem('user', JSON.stringify(data))
    localStorage.setItem('access_token', data.access_token)
    return data
  }

  async function signUp(username: string, email: string, password: string, role = 'user') {
    const response = await authAPI.signUp({ username, email, password, role })
    return response.data
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }

  // ─── Favourites ───────────────────────────────────────────────────────────
  function addFavourite(bookId: number) {
    if (!favourites.value.includes(bookId)) {
      favourites.value.push(bookId)
      localStorage.setItem('favourites', JSON.stringify(favourites.value))
    }
  }

  function removeFavourite(bookId: number) {
    favourites.value = favourites.value.filter(id => id !== bookId)
    localStorage.setItem('favourites', JSON.stringify(favourites.value))
  }

  function isFavourite(bookId: number) {
    return favourites.value.includes(bookId)
  }

  return {
    user,
    token,
    favourites,
    isLoggedIn,
    isAdmin,
    initFromStorage,
    signIn,
    signUp,
    logout,
    addFavourite,
    removeFavourite,
    isFavourite
  }
})
