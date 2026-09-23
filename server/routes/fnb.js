import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/fnb/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await query('SELECT * FROM fnb_orders ORDER BY id DESC')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch F&B orders' })
  }
})

// POST /api/fnb/orders
router.post('/orders', async (req, res) => {
  const { room, guest, items, amount, type, reservationId } = req.body
  try {
    const countRow = await getOne('SELECT COUNT(*) as count FROM fnb_orders')
    const orderId = `ORD-${String(countRow.count + 1).padStart(3, '0')}`
    const timeStr = new Date().toTimeString().slice(0, 5)
    const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19)

    // Lookup active reservation for room if not provided
    let resId = reservationId
    if (!resId && room && room !== 'Restaurant') {
      const activeRes = await getOne(
        `SELECT id FROM reservations WHERE room = ? AND status = 'checked-in' LIMIT 1`,
        [room]
      )
      if (activeRes) resId = activeRes.id
    }

    const result = await run(
      `INSERT INTO fnb_orders (id, room, guest, reservationId, items, amount, time, status, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [orderId, room || 'Restaurant', guest || 'Guest', resId || null, items, Number(amount) || 0, timeStr, type || 'Room Service', createdAt]
    )

    const newOrder = await getOne('SELECT * FROM fnb_orders WHERE id = ?', [orderId])
    res.status(201).json(newOrder)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create F&B order' })
  }
})

// PATCH /api/fnb/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body
  try {
    const order = await getOne('SELECT * FROM fnb_orders WHERE id = ?', [req.params.id])
    if (!order) return res.status(404).json({ error: 'Order not found' })

    await run('UPDATE fnb_orders SET status = ? WHERE id = ?', [status, req.params.id])

    // If order delivered/completed and tied to a reservation, post to folio charges
    if (['delivered', 'completed'].includes(status) && order.reservationId) {
      const existingCharge = await getOne(
        `SELECT id FROM folio_charges WHERE reservationId = ? AND description LIKE ?`,
        [order.reservationId, `%${order.id}%`]
      )
      if (!existingCharge) {
        await run(
          `INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, 'Dining', ?, ?, ?)`,
          [order.reservationId, `F&B Order (${order.id}) — ${order.items}`, order.amount, new Date().toISOString().slice(0, 10)]
        )
      }
    }

    const updated = await getOne('SELECT * FROM fnb_orders WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
