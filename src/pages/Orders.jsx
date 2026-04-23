import { useState } from 'react'
import { Link } from 'react-router-dom'

const ORDERS_KEY = 'se333_orders'

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Orders() {
  const [orders] = useState(loadOrders)

  if (orders.length === 0) {
    return (
      <main className="orders-page empty-orders">
        <h2>Order History</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">{order.id}</span>
              <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
              <span className="order-total">${order.total.toFixed(2)}</span>
            </div>
            <div className="order-customer">
              <span>{order.customer.name}</span> · <span>{order.customer.email}</span>
            </div>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                  <span> × {item.qty} — ${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
