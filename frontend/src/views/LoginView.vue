<template>
  <div class="auth-page">
    <Navbar />
    <div class="auth-wrapper">
      <div class="auth-box">
        <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Identifiant (username ou email)</label>
            <input v-model="loginForm.identifiant" type="text" placeholder="Votre identifiant" required />
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input v-model="loginForm.password" type="password" placeholder="Votre mot de passe" required />
          </div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
          <button type="button" class="btn-switch" @click="isLogin = false">
            Créer un compte
          </button>
        </form>

        <!-- Register is on separate page, but can switch here too -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input v-model="registerForm.username" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="registerForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input v-model="registerForm.password" type="password" required />
          </div>
          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
          <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </button>
          <button type="button" class="btn-switch" @click="isLogin = true">
            Déjà un compte ? Se connecter
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

const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const loginForm = ref({ identifiant: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await userStore.signIn(loginForm.value.identifiant, loginForm.value.password)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Identifiant ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await userStore.signUp(registerForm.value.username, registerForm.value.email, registerForm.value.password)
    successMsg.value = 'Compte créé ! Vous pouvez maintenant vous connecter.'
    isLogin.value = true
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  font-size: 0.85rem;
  color: #444;
  font-weight: 500;
}

.form-group input {
  border: 1px solid #ccc;
  padding: 0.55rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563a8;
}

.btn-primary {
  background: #2563a8;
  color: white;
  border: none;
  padding: 0.65rem;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  background: #1a4f8c;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-switch {
  background: #4a6fa5;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 4px;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-switch:hover {
  background: #3a5a8c;
}

.error-msg {
  background: #fee;
  color: #c00;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  border-left: 3px solid #c00;
}

.success-msg {
  background: #efe;
  color: #060;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  border-left: 3px solid #060;
}
</style>
