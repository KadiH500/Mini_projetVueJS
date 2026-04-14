// src/main.js  — replace the whole file with this
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './Router/index.js'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')