import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/rooms
router.get('/', async (req, res) => {
  const { resort, status } = req.query
  try {
    let sql = 'SELECT * FROM rooms WHERE 1=1'
    const params = []
    if (resort && resort !== 'all') {
      sql += ' AND resort = ?'
      params.push(resort)
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    sql += ' ORDER BY CAST(number AS INT) ASC'

    const rows = await query(sql, params)
    const formatted = rows.map(r => ({
      ...r,
      amenities: JSON.parse(r.amenities || '[]')
    }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' })
  }
})

// GET /api/rooms/available
router.get('/available', async (req, res) => {
  const { resort, checkIn, checkOut, roomType } = req.query
  try {
    let sql = `SELECT * FROM rooms WHERE status = 'available'`
    const params = []

    if (resort) {
      sql += ' AND resort = ?'
      params.push(resort)
    }
    if (roomType) {
      sql += ' AND type = ?'
      params.push(roomType)
    }

    // Filter out rooms already occupied by overlapping confirmed or checked-in reservations
    if (checkIn && checkOut) {
      const bookedRooms = await query(
        `SELECT DISTINCT room FROM reservations 
         WHERE status IN ('confirmed', 'checked-in') 
         AND resort = ? 
         AND ((checkIn <= ? AND checkOut > ?) OR (checkIn < ? AND checkOut >= ?))`,
        [resort || 'Serenity Goa', checkIn, checkIn, checkOut, checkOut]
      )
      const bookedNumbers = bookedRooms.map(b => b.room)
      if (bookedNumbers.length > 0) {
        const placeholders = bookedNumbers.map(() => '?').join(',')
        sql += ` AND number NOT IN (${placeholders})`
        params.push(...bookedNumbers)
      }
    }

    sql += ' ORDER BY CAST(number AS INT) ASC'
    const rooms = await query(sql, params)
    res.json(rooms.map(r => ({ ...r, amenities: JSON.parse(r.amenities || '[]') })))
  } catch (err) {
    console.error('Error finding available rooms:', err)
    res.status(500).json({ error: 'Failed to search available rooms' })
  }
})

// POST /api/rooms
router.post('/', async (req, res) => {
  const { number, type, resort, floor, bedType, view, capacity, price, amenities } = req.body
  try {
    const result = await run(
      `INSERT INTO rooms (number, type, resort, floor, bedType, view, capacity, price, status, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)`,
      [number, type, resort || 'Serenity Goa', floor || 1, bedType || 'King', view || 'Garden View', capacity || 2, price || 8500, JSON.stringify(amenities || [])]
    )
    const newRoom = await getOne('SELECT * FROM rooms WHERE id = ?', [result.lastID])
    newRoom.amenities = JSON.parse(newRoom.amenities || '[]')
    res.status(201).json(newRoom)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' })
  }
})

// PUT /api/rooms/:id
router.put('/:id', async (req, res) => {
  const { number, type, resort, floor, bedType, view, capacity, price, status, amenities } = req.body
  try {
    await run(
      `UPDATE rooms SET number = ?, type = ?, resort = ?, floor = ?, bedType = ?, view = ?, capacity = ?, price = ?, status = ?, amenities = ? WHERE id = ?`,
      [number, type, resort, floor, bedType, view, capacity, price, status, JSON.stringify(amenities || []), req.params.id]
    )
    const updated = await getOne('SELECT * FROM rooms WHERE id = ?', [req.params.id])
    updated.amenities = JSON.parse(updated.amenities || '[]')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room' })
  }
})

// PATCH /api/rooms/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status, guest, checkIn, checkOut } = req.body
  try {
    await run(
      `UPDATE rooms SET status = ?, guest = ?, checkIn = ?, checkOut = ? WHERE id = ?`,
      [status, guest || null, checkIn || null, checkOut || null, req.params.id]
    )
    const updated = await getOne('SELECT * FROM rooms WHERE id = ?', [req.params.id])
    updated.amenities = JSON.parse(updated.amenities || '[]')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room status' })
  }
})

export default router
