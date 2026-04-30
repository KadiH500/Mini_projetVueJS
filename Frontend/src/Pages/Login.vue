<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="bg-orb orb1"></div>
      <div class="bg-orb orb2"></div>
      <div class="bg-orb orb3"></div>
    </div>

    <div class="auth-card">
      <!-- Logo -->
      <div class="auth-logo">
        <span class="logo-icon"><AppIcon name="book" :size="32" /></span>
        <h1>Libraria</h1>
        <p>Your digital library portal</p>
      </div>

      <!-- Tabs -->
      <div class="auth-tabs">
        <button
          id="tab-login"
          class="tab-btn"
          :class="{ active: activeTab === 'login' }"
          @click="switchTab('login')"
        >Sign In</button>
        <button
          id="tab-register"
          class="tab-btn"
          :class="{ active: activeTab === 'register' }"
          @click="switchTab('register')"
        >Register</button>
        <div class="tab-indicator" :class="activeTab"></div>
      </div>

      <!-- LOGIN FORM -->
      <Transition name="form-slide" mode="out-in">
        <form v-if="activeTab === 'login'" key="login" @submit.prevent="handleLogin" class="auth-form" novalidate>
          <div class="form-group" :class="{ error: loginErrors.identifiant }">
            <label for="login-identifiant">Email or Username</label>
            <div class="input-wrap">
              <span class="input-icon"><AppIcon name="user" :size="18" /></span>
              <input
                id="login-identifiant"
                v-model="loginForm.identifiant"
                type="text"
                placeholder="Enter your email or username"
                @blur="validateLoginField('identifiant')"
              />
            </div>
            <p v-if="loginErrors.identifiant" class="field-error">{{ loginErrors.identifiant }}</p>
          </div>

          <div class="form-group" :class="{ error: loginErrors.password }">
            <label for="login-password">Password</label>
            <div class="input-wrap">
              <span class="input-icon"><AppIcon name="lock" :size="18" /></span>
              <input
                id="login-password"
                v-model="loginForm.password"
                :type="showLoginPwd ? 'text' : 'password'"
                placeholder="Enter your password"
                @blur="validateLoginField('password')"
              />
              <button type="button" class="eye-btn" @click="showLoginPwd = !showLoginPwd">
                <AppIcon :name="showLoginPwd ? 'eye-off' : 'eye'" :size="16" />
              </button>
            </div>
            <p v-if="loginErrors.password" class="field-error">{{ loginErrors.password }}</p>
          </div>

          <p v-if="loginServerError" class="server-error"><AppIcon name="alert" :size="16" /> {{ loginServerError }}</p>

          <button id="btn-login" type="submit" class="btn-primary" :disabled="loginLoading">
            <span v-if="loginLoading" class="spinner"></span>
            {{ loginLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="switch-hint">
            Don't have an account?
            <button type="button" class="link-btn" @click="switchTab('register')">Create one →</button>
          </p>
        </form>

        <!-- REGISTER FORM -->
        <form v-else key="register" @submit.prevent="handleRegister" class="auth-form" novalidate>
          <div class="form-row">
            <div class="form-group" :class="{ error: regErrors.name }">
              <label for="reg-name">Full Name</label>
              <div class="input-wrap">
                <span class="input-icon"><AppIcon name="sparkles" :size="18" /></span>
                <input id="reg-name" v-model="regForm.name" type="text" placeholder="John Doe" @blur="validateRegField('name')" />
              </div>
              <p v-if="regErrors.name" class="field-error">{{ regErrors.name }}</p>
            </div>
            <div class="form-group" :class="{ error: regErrors.username }">
              <label for="reg-username">Username</label>
              <div class="input-wrap">
                <span class="input-icon"><AppIcon name="user" :size="18" /></span>
                <input id="reg-username" v-model="regForm.username" type="text" placeholder="johndoe" @blur="validateRegField('username')" />
              </div>
              <p v-if="regErrors.username" class="field-error">{{ regErrors.username }}</p>
            </div>
          </div>

          <div class="form-group" :class="{ error: regErrors.email }">
            <label for="reg-email">Email Address</label>
            <div class="input-wrap">
              <span class="input-icon"><AppIcon name="mail" :size="18" /></span>
              <input id="reg-email" v-model="regForm.email" type="email" placeholder="john@example.com" @blur="validateRegField('email')" />
            </div>
            <p v-if="regErrors.email" class="field-error">{{ regErrors.email }}</p>
          </div>

          <div class="form-group" :class="{ error: regErrors.password }">
            <label for="reg-password">Password</label>
            <div class="input-wrap">
              <span class="input-icon"><AppIcon name="lock" :size="18" /></span>
              <input
                id="reg-password"
                v-model="regForm.password"
                :type="showRegPwd ? 'text' : 'password'"
                placeholder="Min 8 chars, 1 number"
                @blur="validateRegField('password')"
                @input="updateStrength"
              />
              <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd">
                <AppIcon :name="showRegPwd ? 'eye-off' : 'eye'" :size="16" />
              </button>
            </div>
            <div class="strength-bar">
              <div class="strength-fill" :class="strengthClass" :style="{ width: strengthWidth }"></div>
            </div>
            <p class="strength-label" :class="strengthClass">{{ strengthLabel }}</p>
            <p v-if="regErrors.password" class="field-error">{{ regErrors.password }}</p>
          </div>

          <div class="form-group" :class="{ error: regErrors.confirm }">
            <label for="reg-confirm">Confirm Password</label>
            <div class="input-wrap">
              <span class="input-icon"><AppIcon name="lock" :size="18" /></span>
              <input
                id="reg-confirm"
                v-model="regForm.confirm"
                :type="showConfirmPwd ? 'text' : 'password'"
                placeholder="Re-enter password"
                @blur="validateRegField('confirm')"
              />
              <button type="button" class="eye-btn" @click="showConfirmPwd = !showConfirmPwd">
                <AppIcon :name="showConfirmPwd ? 'eye-off' : 'eye'" :size="16" />
              </button>
            </div>
            <p v-if="regErrors.confirm" class="field-error">{{ regErrors.confirm }}</p>
          </div>

          <div class="form-group" :class="{ error: regErrors.role }">
            <label for="reg-role">Account Role</label>
            <div class="input-wrap select-wrap">
              <span class="input-icon">🛡️</span>
              <select id="reg-role" v-model="regForm.role" @blur="validateRegField('role')">
                <option value="" disabled>Select a role...</option>
                <option value="user">👤 User — Browse the library</option>
                <option value="admin">🔑 Admin — Full access</option>
              </select>
            </div>
            <p v-if="regErrors.role" class="field-error">{{ regErrors.role }}</p>
          </div>

          <p v-if="regServerError" class="server-error">⚠️ {{ regServerError }}</p>
          <p v-if="regSuccess" class="server-success">✅ {{ regSuccess }}</p>

          <button id="btn-register" type="submit" class="btn-primary" :disabled="regLoading">
            <span v-if="regLoading" class="spinner"></span>
            {{ regLoading ? 'Creating account...' : 'Create Account' }}
          </button>

          <p class="switch-hint">
            Already have an account?
            <button type="button" class="link-btn" @click="switchTab('login')">Sign in →</button>
          </p>
        </form>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../Store/UseAuthStore'
import { login, register } from '../api/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('login')

// ── Show/hide password toggles ────────────────────────────────────
const showLoginPwd   = ref(false)
const showRegPwd     = ref(false)
const showConfirmPwd = ref(false)

// ── Login state ───────────────────────────────────────────────────
const loginForm = reactive({ identifiant: '', password: '' })
const loginErrors = reactive({ identifiant: '', password: '' })
const loginLoading = ref(false)
const loginServerError = ref('')

// ── Register state ────────────────────────────────────────────────
const regForm = reactive({ name: '', username: '', email: '', password: '', confirm: '', role: '' })
const regErrors = reactive({ name: '', username: '', email: '', password: '', confirm: '', role: '' })
const regLoading = ref(false)
const regServerError = ref('')
const regSuccess = ref('')

// ── Password strength ─────────────────────────────────────────────
const strengthScore = ref(0)
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthClasses = ['', 'weak', 'fair', 'good', 'strong']
const strengthWidths  = ['0%', '25%', '50%', '75%', '100%']
const strengthLabel = ref('')
const strengthClass = ref('')
const strengthWidth = ref('0%')

function updateStrength() {
  const p = regForm.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  strengthScore.value = score
  strengthLabel.value = strengthLabels[score] || ''
  strengthClass.value = strengthClasses[score] || ''
  strengthWidth.value = strengthWidths[score] || '0%'
}

// ── Validation helpers ────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLoginField(field) {
  if (field === 'identifiant') {
    loginErrors.identifiant = loginForm.identifiant.trim() ? '' : 'Email or username is required.'
  }
  if (field === 'password') {
    loginErrors.password = loginForm.password ? '' : 'Password is required.'
  }
}

function validateRegField(field) {
  if (field === 'name')     regErrors.name     = regForm.name.trim()     ? '' : 'Full name is required.'
  if (field === 'username') regErrors.username = regForm.username.trim() ? '' : 'Username is required.'
  if (field === 'email')    regErrors.email    = EMAIL_RE.test(regForm.email) ? '' : 'Enter a valid email address.'
  if (field === 'password') {
    if (!regForm.password)         regErrors.password = 'Password is required.'
    else if (regForm.password.length < 8) regErrors.password = 'Password must be at least 8 characters.'
    else if (!/[0-9]/.test(regForm.password)) regErrors.password = 'Password must contain at least one number.'
    else regErrors.password = ''
  }
  if (field === 'confirm') {
    regErrors.confirm = regForm.confirm === regForm.password ? '' : 'Passwords do not match.'
  }
  if (field === 'role') {
    regErrors.role = regForm.role ? '' : 'Please select a role.'
  }
}

function isLoginValid() {
  validateLoginField('identifiant')
  validateLoginField('password')
  return !loginErrors.identifiant && !loginErrors.password
}

function isRegisterValid() {
  ;['name', 'username', 'email', 'password', 'confirm', 'role'].forEach(f => validateRegField(f))
  return !Object.values(regErrors).some(e => e)
}

// ── Handlers ──────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab.value = tab
  loginServerError.value = ''
  regServerError.value = ''
  regSuccess.value = ''
}

async function handleLogin() {
  if (!isLoginValid()) return
  loginLoading.value = true
  loginServerError.value = ''
  try {
    const res = await login(loginForm)
    authStore.setAuthData(res.data.access_token, res.data)
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/user-dashboard')
    }
  } catch (err) {
    loginServerError.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  if (!isRegisterValid()) return
  regLoading.value = true
  regServerError.value = ''
  regSuccess.value = ''
  try {
    const payload = {
      name:     regForm.name,
      username: regForm.username,
      email:    regForm.email,
      password: regForm.password,
      role:     regForm.role,
    }
    await register(payload)
    regSuccess.value = 'Account created! Signing you in…'

    // Auto-login after registration
    const res = await login({ identifiant: regForm.email, password: regForm.password })
    authStore.setAuthData(res.data.access_token, res.data)
    setTimeout(() => {
      if (authStore.isAdmin) router.push('/admin')
      else router.push('/user-dashboard')
    }, 800)
  } catch (err) {
    regServerError.value = err.response?.data?.message || 'Registration failed. Email or username may already exist.'
  } finally {
    regLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

/* ══ Design tokens (mirroring Home page) ══════════════════════════ */
.auth-page {
  --ink:    #1a1208;
  --cream:  #faf6ef;
  --gold:   #c2a87a;
  --brown:  #7c5533;
  --sand:   #e8ddc8;
  --muted:  #8c7b6a;
  --accent: #b94030;
}

/* ── Page & background ────────────────────────────────────────── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Warm parchment texture overlay */
.auth-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 60px,
      rgba(194,168,122,0.03) 60px,
      rgba(194,168,122,0.03) 61px
    );
  pointer-events: none;
  z-index: 0;
}

.auth-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

/* Warm amber/brown orbs instead of purple/pink */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.28;
  animation: drift 12s ease-in-out infinite alternate;
}
.orb1 {
  width: 550px; height: 550px;
  background: radial-gradient(circle, #7c5533, transparent);
  top: -180px; left: -120px;
  animation-delay: 0s;
}
.orb2 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, #c2a87a, transparent);
  bottom: -120px; right: -100px;
  animation-delay: -4s;
}
.orb3 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, #b94030, transparent);
  top: 38%; left: 52%;
  animation-delay: -8s;
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 20px) scale(1.08); }
}

/* ── Card ─────────────────────────────────────────────────────── */
.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 490px;
  background: rgba(250, 246, 239, 0.07);
  border: 1px solid rgba(194, 168, 122, 0.22);
  border-radius: 20px;
  padding: 44px 40px;
  backdrop-filter: blur(24px);
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(194, 168, 122, 0.15),
    0 0 0 1px rgba(194, 168, 122, 0.06);
}

/* ── Logo ─────────────────────────────────────────────────────── */
.auth-logo {
  text-align: center;
  margin-bottom: 32px;
}
.logo-icon {
  font-size: 42px;
  display: block;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 8px rgba(194,168,122,0.4));
}
.auth-logo h1 {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 30px;
  font-weight: 700;
  margin: 0 0 6px;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #c2a87a, #e8c89a, #a07848);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.auth-logo p {
  color: rgba(232, 220, 200, 0.5);
  font-size: 13px;
  margin: 0;
  letter-spacing: 0.3px;
}

/* Decorative divider below logo */
.auth-logo::after {
  content: '';
  display: block;
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  margin: 14px auto 0;
}

/* ── Tabs ─────────────────────────────────────────────────────── */
.auth-tabs {
  display: flex;
  background: rgba(26, 18, 8, 0.35);
  border: 1px solid rgba(194, 168, 122, 0.15);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
  position: relative;
}
.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: rgba(232, 220, 200, 0.45);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
  cursor: pointer;
  border-radius: 9px;
  transition: color 0.3s;
  position: relative;
  z-index: 2;
  letter-spacing: 0.3px;
}
.tab-btn.active { color: var(--ink); }

/* Warm gold gradient tab indicator */
.tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: linear-gradient(135deg, #c2a87a, #d4bc92);
  border-radius: 9px;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(194, 168, 122, 0.35);
}
.tab-indicator.login    { left: 4px; }
.tab-indicator.register { left: calc(50%); }

/* ── Form ─────────────────────────────────────────────────────── */
.auth-form { display: flex; flex-direction: column; gap: 16px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(194, 168, 122, 0.8);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 12px;
  font-size: 15px;
  pointer-events: none;
  z-index: 1;
}
.input-wrap input,
.input-wrap select {
  width: 100%;
  padding: 12px 42px 12px 38px;
  background: rgba(26, 18, 8, 0.4);
  border: 1px solid rgba(194, 168, 122, 0.2);
  border-radius: 10px;
  color: #e8ddc8;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  box-sizing: border-box;
  appearance: none;
}
.input-wrap input::placeholder { color: rgba(194, 168, 122, 0.3); }
.input-wrap input:focus,
.input-wrap select:focus {
  border-color: var(--gold);
  background: rgba(194, 168, 122, 0.08);
  box-shadow: 0 0 0 3px rgba(194, 168, 122, 0.18);
}
.form-group.error .input-wrap input,
.form-group.error .input-wrap select {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.15);
}

.select-wrap select option { background: #2e2010; color: #e8ddc8; }

.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.eye-btn:hover { opacity: 1; }

/* ── Password strength ─────────────────────────────────────────── */
.strength-bar {
  height: 4px;
  background: rgba(194, 168, 122, 0.12);
  border-radius: 99px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease, background 0.4s ease;
}
.strength-fill.weak   { background: #f87171; }
.strength-fill.fair   { background: #fb923c; }
.strength-fill.good   { background: #facc15; }
.strength-fill.strong { background: #4ade80; }
.strength-label { font-size: 11px; font-weight: 600; margin: 0; }
.strength-label.weak   { color: #f87171; }
.strength-label.fair   { color: #fb923c; }
.strength-label.good   { color: #facc15; }
.strength-label.strong { color: #4ade80; }

/* ── Errors / Success ──────────────────────────────────────────── */
.field-error  { font-size: 11px; color: #f87171; margin: 0; }
.server-error {
  background: rgba(248,113,113,0.1);
  border: 1px solid rgba(248,113,113,0.3);
  color: #f87171;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin: 0;
}
.server-success {
  background: rgba(74,222,128,0.1);
  border: 1px solid rgba(74,222,128,0.3);
  color: #4ade80;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin: 0;
}

/* ── Primary button (gold, matching Home page signin-btn style) ── */
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #c2a87a, #d4bc92);
  color: var(--ink);
  border: none;
  border-radius: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  letter-spacing: 0.4px;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, opacity 0.2s;
  box-shadow: 0 8px 24px rgba(194, 168, 122, 0.3);
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #d4bc92, #e8d0a8);
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(194, 168, 122, 0.45);
}
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Spinner ───────────────────────────────────────────────────── */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(26, 18, 8, 0.25);
  border-top-color: var(--ink);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Switch hint ───────────────────────────────────────────────── */
.switch-hint {
  text-align: center;
  font-size: 13px;
  color: rgba(194, 168, 122, 0.5);
  margin: 4px 0 0;
}
.link-btn {
  background: none;
  border: none;
  color: var(--gold);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.link-btn:hover { color: #e8c89a; }

/* ── Transitions (UNCHANGED) ───────────────────────────────────── */
.form-slide-enter-active,
.form-slide-leave-active { transition: all 0.3s ease; }
.form-slide-enter-from { opacity: 0; transform: translateX(20px); }
.form-slide-leave-to  { opacity: 0; transform: translateX(-20px); }

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 500px) {
  .auth-card { padding: 32px 20px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
