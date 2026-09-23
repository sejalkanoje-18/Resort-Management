import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/billing/invoices
router.get('/invoices', async (req, res) => {
  const { search } = req.query
  try {
    let sql = 'SELECT * FROM invoices WHERE 1=1'
    const params = []
    if (search) {
      sql += ' AND (id LIKE ? OR guest LIKE ? OR reservationId LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term)
    }
    sql += ' ORDER BY date DESC, id DESC'
    const invoices = await query(sql, params)
    res.json(invoices)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

// GET /api/billing/folio/:reservationId
router.get('/folio/:reservationId', async (req, res) => {
  const { reservationId } = req.params
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [reservationId])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const charges = await query('SELECT * FROM folio_charges WHERE reservationId = ? ORDER BY id ASC', [reservationId])

    let roomCharges = 0
    let diningCharges = 0
    let spaCharges = 0
    let otherCharges = 0

    charges.forEach(c => {
      const amt = Number(c.amount) || 0
      if (['Room', 'Room Extension'].includes(c.category)) roomCharges += amt
      else if (c.category === 'Dining') diningCharges += amt
      else if (c.category === 'Spa') spaCharges += amt
      else otherCharges += amt
    })

    // Fallback room charges if no folio charge exists yet
    if (roomCharges === 0 && reservation.amount) {
      roomCharges = reservation.amount
    }

    // Check discount from offer if any
    let discount = 0
    if (reservation.offerId) {
      const offer = await getOne('SELECT * FROM offers WHERE id = ?', [reservation.offerId])
      if (offer) {
        if (offer.discountPercent > 0) discount = (roomCharges * offer.discountPercent) / 100
        else if (offer.discountAmount > 0) discount = offer.discountAmount
      }
    }

    const subtotal = roomCharges + diningCharges + spaCharges + otherCharges
    const taxableAmount = Math.max(0, subtotal - discount)
    const taxes = Math.round(taxableAmount * 0.12) // 12% GST
    const total = taxableAmount + taxes
    const paid = reservation.paid || 0
    const balance = Math.max(0, total - paid)

    const folio = {
      reservationId,
      guest: reservation.guest,
      resort: reservation.resort,
      room: reservation.room,
      roomType: reservation.roomType,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      charges,
      breakdown: {
        roomCharges,
        diningCharges,
        spaCharges,
        otherCharges,
        subtotal,
        discount,
        taxes,
        total,
        paid,
        balance,
      }
    }

    res.json(folio)
  } catch (err) {
    console.error('Folio error:', err)
    res.status(500).json({ error: 'Failed to aggregate guest folio' })
  }
})

// POST /api/billing/folio/:reservationId/charge
router.post('/folio/:reservationId/charge', async (req, res) => {
  const { category, description, amount } = req.body
  if (!category || !description || !amount) {
    return res.status(400).json({ error: 'Category, description, and amount are required' })
  }
  try {
    const today = new Date().toISOString().slice(0, 10)
    const result = await run(
      `INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`,
      [req.params.reservationId, category, description, Number(amount), today]
    )
    const newCharge = await getOne('SELECT * FROM folio_charges WHERE id = ?', [result.lastID])
    res.status(201).json(newCharge)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add folio charge' })
  }
})

// POST /api/billing/folio/:reservationId/pay
router.post('/folio/:reservationId/pay', async (req, res) => {
  const { amount, method } = req.body
  const payAmt = Number(amount)
  if (!payAmt || payAmt <= 0) return res.status(400).json({ error: 'Valid payment amount required' })

  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.reservationId])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const newPaidTotal = (reservation.paid || 0) + payAmt
    await run('UPDATE reservations SET paid = ? WHERE id = ?', [newPaidTotal, reservation.id])

    // Generate or update invoice
    const countRow = await getOne('SELECT COUNT(*) as count FROM invoices')
    const invId = `INV-${String(countRow.count + 1).padStart(3, '0')}`
    const today = new Date().toISOString().slice(0, 10)

    const existingInv = await getOne('SELECT id FROM invoices WHERE reservationId = ?', [reservation.id])
    if (!existingInv) {
      await run(
        `INSERT INTO invoices (id, reservationId, guest, resort, checkIn, checkOut, roomCharges, diningCharges, spaCharges, otherCharges, discount, taxes, total, paid, status, method, date) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, ?, ?, ?, ?, ?)`,
        [invId, reservation.id, reservation.guest, reservation.resort, reservation.checkIn, reservation.checkOut, reservation.amount, reservation.amount, newPaidTotal, newPaidTotal >= reservation.amount ? 'paid' : 'partial', method || 'Card', today]
      )
    } else {
      await run(
        `UPDATE invoices SET paid = ?, status = ?, method = ?, date = ? WHERE reservationId = ?`,
        [newPaidTotal, newPaidTotal >= reservation.amount ? 'paid' : 'partial', method || 'Card', today, reservation.id]
      )
    }

    res.json({ success: true, paid: newPaidTotal, status: newPaidTotal >= reservation.amount ? 'paid' : 'partial' })
  } catch (err) {
    console.error('Payment error:', err)
    res.status(500).json({ error: 'Failed to process payment' })
  }
})

export default router
