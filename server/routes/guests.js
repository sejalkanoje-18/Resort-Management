import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/guests
router.get('/', async (req, res) => {
  const { search } = req.query
  try {
    let sql = 'SELECT * FROM guests WHERE 1=1'
    const params = []
    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR idNumber LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term, term)
    }
    sql += ' ORDER BY id DESC'

    const guests = await query(sql, params)
    const formatted = guests.map(g => ({
      ...g,
      preferences: JSON.parse(g.preferences || '[]')
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guests' })
  }
})

// GET /api/guests/:id
router.get('/:id', async (req, res) => {
  try {
    const guest = await getOne('SELECT * FROM guests WHERE id = ?', [req.params.id])
    if (!guest) return res.status(404).json({ error: 'Guest not found' })

    guest.preferences = JSON.parse(guest.preferences || '[]')
    const history = await query('SELECT * FROM reservations WHERE guestId = ? ORDER BY checkIn DESC', [guest.id])
    res.json({ ...guest, history })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guest details' })
  }
})

// POST /api/guests
router.post('/', async (req, res) => {
  const { name, email, phone, nationality, dob, idType, idNumber, tier, preferences, notes } = req.body
  try {
    const result = await run(
      `INSERT INTO guests (name, email, phone, nationality, dob, idType, idNumber, tier, visits, totalSpend, lastVisit, preferences, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)`,
      [name, email, phone || '', nationality || 'Indian', dob || null, idType || 'Aadhaar', idNumber || '', tier || 'Bronze', new Date().toISOString().slice(0, 10), JSON.stringify(preferences || []), notes || '']
    )
    const newGuest = await getOne('SELECT * FROM guests WHERE id = ?', [result.lastID])
    newGuest.preferences = JSON.parse(newGuest.preferences || '[]')
    res.status(201).json(newGuest)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create guest' })
  }
})

// PUT /api/guests/:id
router.put('/:id', async (req, res) => {
  const { name, email, phone, nationality, dob, idType, idNumber, tier, preferences, notes } = req.body
  try {
    await run(
      `UPDATE guests SET name = ?, email = ?, phone = ?, nationality = ?, dob = ?, idType = ?, idNumber = ?, tier = ?, preferences = ?, notes = ? WHERE id = ?`,
      [name, email, phone, nationality, dob, idType, idNumber, tier, JSON.stringify(preferences || []), notes, req.params.id]
    )
    const updated = await getOne('SELECT * FROM guests WHERE id = ?', [req.params.id])
    updated.preferences = JSON.parse(updated.preferences || '[]')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update guest' })
  }
})

export default router
