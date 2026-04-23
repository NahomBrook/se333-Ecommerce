import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const q = e.target.q.value.trim()
    if (q) navigate(`/?q=${encodeURIComponent(q)}`)
    else navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">ShopEase</Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input name="q" type="text" placeholder="Search products…" />
          <button type="submit">Search</button>
        </form>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart" className="nav-cart">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
