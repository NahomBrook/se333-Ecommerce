import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ORDERS_KEY = 'se333_orders'

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!/^\d{16}$/.test(form.card.replace(/\s/g, ''))) e.card = 'Enter a 16-digit card number'
    return e
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total,
      customer: { name: form.name, email: form.email, address: form.address },
    }

    const orders = loadOrders()
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]))
    clearCart()
    setDone(true)
  }

  if (done) {
    return (
      <main className="checkout-page success">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you, {form.name}. Your order has been received.</p>
          <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
        </div>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <p>Nothing to check out.</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>Go Shopping</button>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h3>Shipping Details</h3>
          {[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'address', label: 'Delivery Address', type: 'text' },
          ].map(({ name, label, type }) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className={errors[name] ? 'input-error' : ''}
              />
              {errors[name] && <span className="field-error">{errors[name]}</span>}
            </div>
          ))}

          <h3>Payment</h3>
          <div className="form-group">
            <label htmlFor="card">Card Number</label>
            <input
              id="card"
              name="card"
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={form.card}
              onChange={handleChange}
              className={errors.card ? 'input-error' : ''}
            />
            {errors.card && <span className="field-error">{errors.card}</span>}
          </div>

          <button type="submit" className="btn-primary btn-block btn-lg">Place Order</button>
        </form>

        <aside className="checkout-summary">
          <h3>Your Order</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
