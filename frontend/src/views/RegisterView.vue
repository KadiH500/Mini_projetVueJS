<template>
  <div class="auth-page">
    <Navbar />
    <div class="auth-wrapper">
      <div class="auth-box">
        <h2>Créer un compte</h2>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input v-model="form.username" type="text" placeholder="Votre username" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="Votre email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="Votre mot de passe" required />
          </div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Inscription...' : 'Register' }}
          </button>
          <button type="button" class="btn-switch" @click="router.push('/login')">
            Switch to Login
          </button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const form = ref({ username: '', email: '', password: '' })

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await userStore.signUp(form.value.username, form.value.email, form.value.password)
    successMsg.value = 'Compte créé avec succès !'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #2c2c3e;
}
.auth-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}
.auth-box {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 6px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.auth-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1a3a6b;
  font-size: 1.4rem;
}
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group label { font-size: 0.85rem; color: #444; font-weight: 500; }
.form-group input {
  border: 1px solid #ccc; padding: 0.55rem 0.8rem;
  border-radius: 4px; font-size: 0.9rem; outline: none;
}
.form-group input:focus { border-color: #2563a8; }
.btn-primary {
  background: #2563a8; color: white; border: none;
  padding: 0.65rem; border-radius: 4px; font-size: 0.95rem;
  cursor: pointer; font-weight: 600;
}
.btn-primary:hover:not(:disabled) { background: #1a4f8c; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-switch {
  background: #4a6fa5; color: white; border: none;
  padding: 0.6rem; border-radius: 4px; font-size: 0.88rem; cursor: pointer;
}
.error-msg { background: #fee; color: #c00; padding: 0.5rem 0.8rem; border-radius: 4px; font-size: 0.85rem; }
.success-msg { background: #efe; color: #060; padding: 0.5rem 0.8rem; border-radius: 4px; font-size: 0.85rem; }
</style>
