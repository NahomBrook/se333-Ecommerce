import { useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products'

const CACHE_KEY = 'se333_product_cache'
const TTL = 5 * 60 * 1000 // 5 minutes

function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS), 500)
  })
}

export function useProductCache() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const { data, timestamp } = JSON.parse(raw)
          if (Date.now() - timestamp < TTL) {
            setProducts(data)
            setLoading(false)
            return
          }
        }
      } catch {
        // stale or corrupt cache — fall through to fetch
      }

      const data = await fetchProducts()
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
      setProducts(data)
      setLoading(false)
    }

    load()
  }, [])

  return { products, loading }
}
