import { computed, ref } from 'vue'
import { getBooks } from '@/api/Book'

// fonction tetransformi tuple lel format li nhebou naffichiwha
function toDisplayBook(raw) {
  // hné n7adhrou esm l author : ken string nasta3mlou direct
  // sinon njibou prénom + nom 
  const authorName =
    typeof raw.author === 'string'
      ? raw.author
      : [raw.author?.prenom, raw.author?.nom].filter(Boolean).join(' ').trim()

  return {
    id: raw.id, // id mta3 l book
    title: raw.title || 'Untitled', // ken ma famech title n7otou valeur par défaut
    author: authorName || 'Unknown author', // ken ma famech author n7otou valeur par défaut
    price: Number(raw.price ?? 25), // n7awlou price l number, sinon 25
    category: raw.category || 'General', // catégorie ou valeur par défaut
    rating: Number(raw.rating ?? 4), // rating ou valeur par défaut
    isNew: Boolean(raw.isNew ?? false), // book jdida wela le
    discount: Number(raw.discount ?? 0), // remise ou 0
    image: raw.image || '', // image ou vide
  }
}

export function useBooksCatalog() {
  // state variables
  const books = ref([]) // liste mta3 books
  const loading = ref(true) // loading state
  const loadError = ref('') // message d'erreur
  const search = ref('') // valeur mta3 recherche
  const sortBy = ref('default') // tri
  const selectedCategory = ref('All') // catégorie choisie

  // nraj3ou liste catégories unique men books
  const allCategories = computed(() => {
    const categories = [...new Set(books.value.map((book) => book.category).filter(Boolean))]
    return ['All', ...categories] // nzidou "All" fi lowel
  })

  // filtre + tri des books selon choix user
  const filteredBooks = computed(() => {
    let list = [...books.value] // na3mlou copie men liste

    // filtre par catégorie
    if (selectedCategory.value !== 'All') {
      list = list.filter((book) => book.category === selectedCategory.value)
    }

    // filtre par recherche (title ou author)
    const query = search.value.toLowerCase().trim()
    if (query) {
      list = list.filter((book) => {
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        )
      })
    }

    // tri selon choix
    if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sortBy.value === 'title-asc') list.sort((a, b) => a.title.localeCompare(b.title))

    return list
  })

  // fonction tjib lbooks ml API
  async function fetchBooks() {
    loading.value = true 
    loadError.value = '' 

    try {
      const response = await getBooks() // appel API

      // nverifiw l format mta3
      const apiBooks = Array.isArray(response.data?.listeBooks)
        ? response.data.listeBooks
        : Array.isArray(response.data)
          ? response.data
          : []

      books.value = apiBooks.map(toDisplayBook)

      // ken l catégorie l khtarneha madesh mawjouda nrajouha "all"
      if (!allCategories.value.includes(selectedCategory.value)) {
        selectedCategory.value = 'All'
      }
    } catch (error) {
      console.error('Failed to load books from API.', error)
      books.value = [] // nvidiw liste
      loadError.value = 'Unable to load books from backend. Check backend server and database connection.'
    } finally {
      loading.value = false 
    }
  }

  // reset filtres
  function clearFilters() {
    search.value = ''
    selectedCategory.value = 'All'
    sortBy.value = 'default'
  }

  // image placeholder ken ma famech image
  function placeholderImg(title) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=200&background=2d2016&color=c2a87a&bold=true`
  }

  // nrajou les variables w fonctions bech nesta3mlouhom fl components
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