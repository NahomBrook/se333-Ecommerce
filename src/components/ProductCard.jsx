import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const outOfStock = product.stock === 0

  return (
    <div className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}>
      <Link to={`/product/${product.id}`} className="card-img-link">
        <img src={product.image} alt={product.name} loading="lazy" />
        {outOfStock && <span className="oos-badge">Out of Stock</span>}
      </Link>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="card-title">{product.name}</Link>
        <p className="card-price">${product.price.toFixed(2)}</p>
        <button
          className="btn-primary"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
