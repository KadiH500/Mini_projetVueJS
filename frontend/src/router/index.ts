import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  { path: "/", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/dashboard", component: DashboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 ROUTE PROTECTION
router.beforeEach((to, from, next) => {
  const store = useUserStore();

  // pages publiques
  const publicPages = ["/", "/register"];

  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !store.token) {
    next("/");
  } else {
    next();
  }
});

export default router;