import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/Home.vue'
import Cart from '../Pages/Cart.vue'
import Login from '../Pages/Login.vue'
import BookDetails from '../Pages/BookDetails.vue'
import UserDashboard from '../Pages/UserDashboard.vue'
import { useAuthStore } from '../Store/UseAuthStore'

// Admin Views
import AdminLayout from '../Pages/Admin/AdminLayout.vue'
import AdminDashboard from '../Pages/Admin/AdminDashboard.vue'
import AdminBooks from '../Pages/Admin/AdminBooks.vue'
import AdminUsers from '../Pages/Admin/AdminUsers.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    redirect: '/login'
  },
  { path: '/books/:id', component: BookDetails },
  {
    path: '/user-dashboard',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', component: AdminDashboard },
      { path: 'books', component: AdminBooks },
      { path: 'users', component: AdminUsers },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Redirect authenticated users away from login/register
  if (to.meta.guestOnly) {
    if (authStore.isAuthenticated) {
      return next(authStore.isAdmin ? '/admin' : '/user-dashboard')
    }
    return next()
  }

  // Admin-only routes
  if (to.matched.some(r => r.meta.requiresAdmin)) {
    if (!authStore.isAuthenticated) return next('/login')
    if (!authStore.isAdmin) return next('/user-dashboard')
    return next()
  }

  // Auth-required routes (user dashboard)
  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) return next('/login')
    return next()
  }

  next()
})

export default router