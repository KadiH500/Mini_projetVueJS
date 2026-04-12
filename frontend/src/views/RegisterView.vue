<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Create account </h1>
      <p>Sign up to get started</p>

      <input v-model="name" type="text" placeholder="Name" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="register">Sign Up</button>

      <p class="switch">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      console.log(this.name, this.email, this.password);
    },
  },
};
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #111827, #0b1220);
}

.auth-card {
  width: 380px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 35px;
  border-radius: 18px;
  color: white;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

h1 {
  margin-bottom: 5px;
  font-size: 24px;
}

p {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  transform: scale(1.03);
}

.switch {
  margin-top: 15px;
  font-size: 13px;
}

.switch a {
  color: #4ade80;
}
</style>