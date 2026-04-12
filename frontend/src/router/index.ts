import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import Register from "../views/RegisterView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;