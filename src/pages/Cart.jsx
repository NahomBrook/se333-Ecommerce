import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart()

  if (cart.length === 0) {
    return (
      <main className="cart-page empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-row">
              <img src={item.image} alt={item.name} className="cart-thumb" />
              <div className="cart-row-info">
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <p className="cart-line-total">${(item.price * item.qty).toFixed(2)}</p>
              <button className="cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn-primary btn-block">Proceed to Checkout</Link>
        </aside>
      </div>
    </main>
  )
}
