import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
})

export const getBooks = () => api.get('/books/all')
export const getBook  = (id) => api.get(`/books/search/${id}`)