import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProductCache } from '../hooks/useProductCache'
import { CATEGORIES } from '../data/products'

const SEARCH_HISTORY_KEY = 'se333_search_history'
const MAX_HISTORY = 3

function getSearchHistory() {
  try {
    return JSON.parse(sessionStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function addToSearchHistory(query) {
  if (!query) return
  const history = getSearchHistory().filter((q) => q !== query)
  const updated = [query, ...history].slice(0, MAX_HISTORY)
  sessionStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
}

export default function Home() {
  const { products, loading } = useProductCache()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [searchHistory, setSearchHistory] = useState(getSearchHistory)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  function handleSearch(e) {
    e.preventDefault()
    const q = searchInput.trim()
    addToSearchHistory(q)
    setSearchHistory(getSearchHistory())
    setShowSuggestions(false)
    if (q) setSearchParams({ q })
    else setSearchParams({})
  }

  function applyHistory(q) {
    setSearchInput(q)
    setShowSuggestions(false)
    if (q) setSearchParams({ q })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }
    if (query) {
      const lq = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lq) ||
          p.description.toLowerCase().includes(lq) ||
          p.category.toLowerCase().includes(lq)
      )
    }
    return result
  }, [products, activeCategory, query])

  return (
    <main className="home">
      <section className="hero">
        <h1>Find Your Next Favourite Gadget</h1>
        <p>Great products, great prices. No fuss.</p>
        <form className="hero-search" onSubmit={handleSearch}>
          <div className="search-wrap" style={{ position: 'relative' }}>
            <input
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search products…"
              autoComplete="off"
            />
            {showSuggestions && searchHistory.length > 0 && (
              <ul className="search-suggestions">
                {searchHistory.map((h) => (
                  <li key={h} onMouseDown={() => applyHistory(h)}>{h}</li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="catalog-section">
        <aside className="sidebar">
          <h3>Category</h3>
          <ul className="category-list">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="catalog-main">
          {query && (
            <p className="search-result-label">
              Results for <strong>"{query}"</strong>
              <button className="clear-search" onClick={() => { setSearchParams({}); setSearchInput('') }}>✕ Clear</button>
            </p>
          )}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="no-results">No products found.</p>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
