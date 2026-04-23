import { useParams, useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = PRODUCTS.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <main className="detail-page">
        <p>Product not found.</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>Back to Shop</button>
      </main>
    )
  }

  const outOfStock = product.stock === 0

  return (
    <main className="detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-inner">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="card-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-desc">{product.description}</p>
          <p className={`detail-stock ${outOfStock ? 'oos' : 'in-stock'}`}>
            {outOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
          </p>
          <button
            className="btn-primary btn-lg"
            onClick={() => { addToCart(product); navigate('/cart') }}
            disabled={outOfStock}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </main>
  )
}
