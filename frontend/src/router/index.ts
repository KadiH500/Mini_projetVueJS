import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AllBooksView from '@/views/AllBooksView.vue'
import AddBookView from '@/views/AddBookView.vue'
import FavouritesView from '@/views/FavouritesView.vue'
import TasksView from '@/views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/all-books',
      name: 'all-books',
      component: AllBooksView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-book',
      name: 'add-book',
      component: AddBookView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: FavouritesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guards
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const userData = localStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.guestOnly && token) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
