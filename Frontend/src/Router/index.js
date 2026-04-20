import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/Home.vue'
import Cart from '../Pages/Cart.vue'
import Login from '../Pages/Login.vue'
import BookDetails from '../Pages/BookDetails.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/login', component: Login },
  { path: '/books/:id', component: BookDetails },
]

export default createRouter({
  history: createWebHistory(),
  routes
})