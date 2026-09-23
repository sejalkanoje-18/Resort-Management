import React, { useState, useEffect } from 'react'
import { UtensilsCrossed, ClipboardList, Clock, CheckCircle, Plus } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { fnbApi, reservationsApi } from '../../api/client'

export default function FnBModule() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [activeRes, setActiveRes] = useState([])

  // Form
  const [room, setRoom] = useState('101')
  const [guest, setGuest] = useState('')
  const [items, setItems] = useState('')
  const [amount, setAmount] = useState(1200)
  const [type, setType] = useState('Room Service')
  const [selectedResId, setSelectedResId] = useState('')

  async function fetchOrders() {
    try {
      const data = await fnbApi.getOrders()
      setOrders(data)
    } catch (err) {
      console.error('Failed to load F&B orders:', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    reservationsApi.getAll({ status: 'checked-in' }).then(res => {
      setActiveRes(res)
      if (res.length > 0) {
        setRoom(res[0].room)
        setGuest(res[0].guest)
        setSelectedResId(res[0].id)
      }
    }).catch(() => {})
  }, [])

  const handleCreateOrder = async () => {
    if (!items || !amount) return
    try {
      await fnbApi.createOrder({ room, guest: guest || 'Walk-in Guest', items, amount, type, reservationId: selectedResId })
      setShowAdd(false)
      setItems('')
      fetchOrders()
    } catch (err) {
      alert(err.message || 'Failed to create order')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await fnbApi.updateStatus(id, status)
      fetchOrders()
    } catch (err) {
      alert(err.message || 'Failed to update order status')
    }
  }

  const MENU = [
    { category: 'Breakfast', items: ['Continental Breakfast — ₹1,200', 'Full Indian Breakfast — ₹800', 'Idli Sambar — ₹380', 'Masala Dosa — ₹250'] },
    { category: 'Main Course', items: ['Butter Chicken — ₹650', 'Dal Makhani — ₹450', 'Grilled Fish — ₹950', 'Paneer Tikka — ₹550'] },
    { category: 'Beverages', items: ['Filter Coffee — ₹120', 'Fresh Juice — ₹180', 'Lassi — ₹150', 'Mocktail — ₹250'] },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Today's Orders" value={orders.length} icon={ClipboardList} color="orange" />
        <StatCard title="Pending" value={orders.filter(o=>o.status==='pending').length} icon={Clock} color="yellow" />
        <StatCard title="In Progress" value={orders.filter(o=>o.status==='in-progress').length} icon={UtensilsCrossed} color="blue" />
        <StatCard title="Completed" value={orders.filter(o=>['completed','delivered'].includes(o.status)).length} icon={CheckCircle} color="green" />
      </div>

      <div className="flex gap-1 bg-resort-slate rounded-xl p-1 w-fit">
        {[{ id: 'orders', label: 'Orders' }, { id: 'menu', label: 'Menu' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Active Orders</h3>
            <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> New Order</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-resort-slate rounded-xl p-4 border border-resort-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-resort-accent text-xs">{order.id}</p>
                    <p className="font-medium text-resort-text">{order.guest}</p>
                    <p className="text-resort-muted text-xs">{order.type} · Room {order.room} · {order.time}</p>
                  </div>
                  {statusBadge(order.status)}
                </div>
                <p className="text-resort-text text-sm mb-3">{order.items}</p>
                <div className="flex items-center justify-between">
                  <span className="text-resort-accent font-bold">₹{order.amount ? order.amount.toLocaleString() : 0}</span>
                  {order.status === 'pending' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'in-progress')} className="px-3 py-1 bg-resort-accent/20 text-resort-accent rounded-lg text-xs">Start Preparing</button>
                  )}
                  {order.status === 'in-progress' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">Mark Delivered & Bill</button>
                  )}
                  {['completed', 'delivered'].includes(order.status) && (
                    <span className="text-emerald-400 text-xs font-medium">✓ Posted to Folio</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-4">
          {MENU.map(cat => (
            <div key={cat.category} className="luxury-card p-5">
              <h4 className="font-serif text-resort-accent font-semibold mb-3">{cat.category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map(item => (
                  <div key={item} className="flex items-center justify-between p-3 bg-resort-slate rounded-xl">
                    <span className="text-resort-text text-sm">{item.split(' — ')[0]}</span>
                    <span className="text-resort-accent font-medium text-sm">{item.split(' — ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Order Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New F&B Order">
        <div className="space-y-4">
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Select In-House Guest / Room</label>
            <select
              className="luxury-select"
              value={selectedResId}
              onChange={e => {
                const res = activeRes.find(r => r.id === e.target.value)
                if (res) {
                  setSelectedResId(res.id)
                  setRoom(res.room)
                  setGuest(res.guest)
                }
              }}
            >
              {activeRes.map(r => (
                <option key={r.id} value={r.id}>Room {r.room} — {r.guest}</option>
              ))}
              <option value="">Walk-in / Restaurant</option>
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Order Type</label>
            <select className="luxury-select" value={type} onChange={e => setType(e.target.value)}>
              <option>Room Service</option>
              <option>Dine-in</option>
              <option>Poolside Bar</option>
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Items Ordered</label>
            <input className="luxury-input" value={items} onChange={e => setItems(e.target.value)} placeholder="e.g. Butter Chicken, Naan x2, Lassi" />
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Total Amount (₹)</label>
            <input className="luxury-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateOrder} className="luxury-btn px-4 py-2">Create Order</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
