import axios from 'axios'

// creation mta3 instance men axios pour les appels API
const api = axios.create({
  // hné n7otou base URL : ken fama variable fi env nasta3mlouha
  // sinon nrodouha localhost (pour dev)
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
})

// fonction traja3 liste mta3 lbooks lkol mel API
export const getBooks = () => api.get('/books/all')

// fonction traja3 l book by id
export const getBook  = (id) => api.get(`/books/search/${id}`)