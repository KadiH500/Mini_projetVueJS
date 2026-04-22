import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur : ajoute le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur : gestion des erreurs globales (401 → redirection)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  signUp: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post('/auth/signup', data),

  signIn: (data: { identifiant: string; password: string }) =>
    api.post('/auth/signin', data)
}

// ─── Books ───────────────────────────────────────────────────────────────────
export const booksAPI = {
  getAll: () => api.get('/books/all'),
  getById: (id: number) => api.get(`/books/search/${id}`),
  add: (data: object) => api.post('/books/new', data),
  update: (id: number, data: object) => api.put(`/books/edit/${id}`, data),
  remove: (id: number) => api.delete(`/books/remove/${id}`),
  softDelete: (id: number) => api.delete(`/books/softdelete/${id}`),
  restore: (id: number) => api.patch(`/books/restore/${id}`),
  recover: (id: number) => api.patch(`/books/recover/${id}`),
  statsPerYear: () => api.get('/books/stats'),
  statsPerYearRange: (year1: number, year2: number) =>
    api.get(`/books/stats/v2?year1=${year1}&year2=${year2}`)
}

// ─── Authors ─────────────────────────────────────────────────────────────────
export const authorsAPI = {
  getAll: () => api.get('/author/all'),
  add: (data: { prenom: string; nom: string }) => api.post('/author/add', data)
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: () => api.get('/tasks/all'),
  getById: (id: string) => api.get(`/tasks/search/${id}`),
  add: (data: { title: string; year: number; statut: string }) => api.post('/tasks/add', data),
  update: (id: string, data: object) => api.put(`/tasks/edit/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/delete/${id}`),
  stats: (startYear: number, endYear: number) =>
    api.get(`/tasks/stats?startYear=${startYear}&endYear=${endYear}`)
}

export default api
