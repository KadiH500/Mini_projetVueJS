import { computed, ref } from 'vue'
import { getBooks } from '@/api/Book'

function toDisplayBook(raw) {
  const authorName =
    typeof raw.author === 'string'
      ? raw.author
      : [raw.author?.prenom, raw.author?.nom].filter(Boolean).join(' ').trim()

  return {
    id: raw.id,
    title: raw.title || 'Untitled',
    author: authorName || 'Unknown author',
    price: Number(raw.price ?? 25),
    category: raw.category || 'General',
    rating: Number(raw.rating ?? 4),
    isNew: Boolean(raw.isNew ?? false),
    discount: Number(raw.discount ?? 0),
    image: raw.image || '',
  }
}

export function useBooksCatalog() {
  const books = ref([])
  const loading = ref(true)
  const loadError = ref('')
  const search = ref('')
  const sortBy = ref('default')
  const selectedCategory = ref('All')

  const allCategories = computed(() => {
    const categories = [...new Set(books.value.map((book) => book.category).filter(Boolean))]
    return ['All', ...categories]
  })

  const filteredBooks = computed(() => {
    let list = [...books.value]

    if (selectedCategory.value !== 'All') {
      list = list.filter((book) => book.category === selectedCategory.value)
    }

    const query = search.value.toLowerCase().trim()
    if (query) {
      list = list.filter((book) => {
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        )
      })
    }

    if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sortBy.value === 'title-asc') list.sort((a, b) => a.title.localeCompare(b.title))

    return list
  })

  async function fetchBooks() {
    loading.value = true
    loadError.value = ''

    try {
      const response = await getBooks()
      const apiBooks = Array.isArray(response.data?.listeBooks)
        ? response.data.listeBooks
        : Array.isArray(response.data)
          ? response.data
          : []

      books.value = apiBooks.map(toDisplayBook)
      if (!allCategories.value.includes(selectedCategory.value)) {
        selectedCategory.value = 'All'
      }
    } catch (error) {
      console.error('Failed to load books from API.', error)
      books.value = []
      loadError.value = 'Unable to load books from backend. Check backend server and database connection.'
    } finally {
      loading.value = false
    }
  }

  function clearFilters() {
    search.value = ''
    selectedCategory.value = 'All'
    sortBy.value = 'default'
  }

  function placeholderImg(title) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=200&background=2d2016&color=c2a87a&bold=true`
  }

  return {
    books,
    loading,
    loadError,
    search,
    sortBy,
    selectedCategory,
    allCategories,
    filteredBooks,
    fetchBooks,
    clearFilters,
    placeholderImg,
  }
}
