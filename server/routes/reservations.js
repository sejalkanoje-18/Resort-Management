import express from 'express'
import bcrypt from 'bcryptjs'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/reservations
router.get('/', async (req, res) => {
  const { status, resort, search } = req.query
  try {
    let sql = 'SELECT * FROM reservations WHERE 1=1'
    const params = []

    if (resort && resort !== 'all') {
      sql += ' AND resort = ?'
      params.push(resort)
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    if (search) {
      sql += ' AND (guest LIKE ? OR id LIKE ? OR room LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY created DESC, id DESC'
    const reservations = await query(sql, params)
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
})

// GET /api/reservations/:id
router.get('/:id', async (req, res) => {
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const charges = await query('SELECT * FROM folio_charges WHERE reservationId = ?', [reservation.id])
    res.json({ ...reservation, charges })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservation details' })
  }
})

// POST /api/reservations (Walk-in / Manual Booking by Receptionist)
router.post('/', async (req, res) => {
  const {
    guestName, guestEmail, guestPhone,
    resort, roomType, roomNumber,
    checkIn, checkOut, adults, children,
    source, offerCode, specialRequests, initialPayment
  } = req.body

  if (!guestName || !checkIn || !checkOut || !resort || !roomType) {
    return res.status(400).json({ error: 'Missing required reservation fields' })
  }

  try {
    // 1. Calculate nights
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))

    // 2. Select room details
    let selectedRoom = null
    if (roomNumber) {
      selectedRoom = await getOne('SELECT * FROM rooms WHERE number = ? AND resort = ?', [roomNumber, resort])
      if (selectedRoom && selectedRoom.status !== 'available') {
        return res.status(409).json({ error: `Room ${roomNumber} is currently ${selectedRoom.status} and unavailable` })
      }
    } else {
      // Find an available room of this type
      selectedRoom = await getOne(
        `SELECT * FROM rooms WHERE type = ? AND resort = ? AND status = 'available' LIMIT 1`,
        [roomType, resort]
      )
    }

    const roomNum = selectedRoom ? selectedRoom.number : (roomNumber || 'TBD')
    const roomPrice = selectedRoom ? selectedRoom.price : (roomType.includes('Suite') ? 15000 : roomType.includes('Villa') ? 35000 : 8500)

    // 3. Double-booking check for dates
    if (selectedRoom) {
      const conflict = await getOne(
        `SELECT id FROM reservations 
         WHERE room = ? AND resort = ? AND status IN ('confirmed', 'checked-in')
         AND ((checkIn <= ? AND checkOut > ?) OR (checkIn < ? AND checkOut >= ?))`,
        [selectedRoom.number, resort, checkIn, checkIn, checkOut, checkOut]
      )
      if (conflict) {
        return res.status(409).json({ error: `Room ${selectedRoom.number} is already booked for the selected dates` })
      }
    }

    // 4. Calculate total amount & apply offer
    let baseAmount = nights * roomPrice
    let discount = 0
    let appliedOfferId = null

    if (offerCode) {
      const offer = await getOne('SELECT * FROM offers WHERE code = ? AND isActive = 1', [offerCode])
      if (offer) {
        appliedOfferId = offer.id
        if (offer.discountPercent > 0) {
          discount = (baseAmount * offer.discountPercent) / 100
        } else if (offer.discountAmount > 0) {
          discount = Math.min(baseAmount, offer.discountAmount)
        }
      }
    }

    const finalAmount = Math.max(0, baseAmount - discount)
    const paidAmount = Number(initialPayment) || 0

    // 5. Find or Create Guest record
    let guest = await getOne('SELECT * FROM guests WHERE email = ? OR name = ?', [guestEmail || guestName, guestName])
    let guestId = guest ? guest.id : null

    if (!guest) {
      const email = guestEmail || `guest_${Date.now()}@serenityresorts.com`
      const phone = guestPhone || '+91 98765 00000'
      const guestResult = await run(
        `INSERT INTO guests (name, email, phone, tier, visits, totalSpend, lastVisit, preferences, notes) VALUES (?, ?, ?, 'Bronze', 1, ?, ?, '[]', 'Manual Walk-in Guest')`,
        [guestName, email, phone, finalAmount, checkIn]
      )
      guestId = guestResult.lastID

      // Create guest user login credentials
      const guestPw = await bcrypt.hash('guest123', 10)
      const initials = guestName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      await run(
        `INSERT INTO users (name, email, password_hash, role, avatar, title, resort, department, phone, tier, loyaltyPoints, totalVisits, totalSpend, memberSince, preferences, permissions) VALUES (?, ?, ?, 'guest', ?, 'Bronze Member', ?, 'guest', ?, 'Bronze', 500, 1, ?, ?, '[]', '["guest"]')`,
        [guestName, email, guestPw, initials, resort, phone, finalAmount, checkIn]
      )
    }

    // 6. Generate Reservation ID
    const countRow = await getOne('SELECT COUNT(*) as count FROM reservations')
    const resId = `RES-${String(countRow.count + 1).padStart(3, '0')}`
    const createdDate = new Date().toISOString().slice(0, 10)

    await run(
      `INSERT INTO reservations (id, guest, guestId, room, roomType, resort, checkIn, checkOut, nights, adults, children, status, amount, paid, source, created, offerId, specialRequests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?)`,
      [resId, guestName, guestId, roomNum, roomType, resort, checkIn, checkOut, nights, Number(adults) || 2, Number(children) || 0, finalAmount, paidAmount, source || 'Direct', createdDate, appliedOfferId, specialRequests || '']
    )

    // 7. Post initial Folio Charge
    await run(
      `INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, 'Room', ?, ?, ?)`,
      [resId, `${roomType} (${nights} night${nights > 1 ? 's' : ''})`, finalAmount, createdDate]
    )

    // 8. Audit Log
    await run(
      `INSERT INTO audit_logs (timestamp, user, role, action, module, description, ip) VALUES (?, 'Receptionist', 'staff', 'CREATE', 'Reservations', ?, '192.168.1.15')`,
      [new Date().toISOString().replace('T', ' ').slice(0, 19), `Created reservation ${resId} for ${guestName}`]
    )

    const createdRes = await getOne('SELECT * FROM reservations WHERE id = ?', [resId])
    res.status(201).json(createdRes)
  } catch (err) {
    console.error('Create reservation error:', err)
    res.status(500).json({ error: 'Failed to create reservation: ' + err.message })
  }
})

// POST /api/reservations/:id/check-in
router.post('/:id/check-in', async (req, res) => {
  const { roomNumber } = req.body
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const assignedRoom = roomNumber || reservation.room
    if (!assignedRoom || assignedRoom === 'TBD') {
      return res.status(400).json({ error: 'Please select a room before check-in' })
    }

    // Update Reservation status
    await run(
      `UPDATE reservations SET status = 'checked-in', room = ? WHERE id = ?`,
      [assignedRoom, reservation.id]
    )

    // Update Room status to occupied
    await run(
      `UPDATE rooms SET status = 'occupied', guest = ?, checkIn = ?, checkOut = ? WHERE number = ? AND resort = ?`,
      [reservation.guest, reservation.checkIn, reservation.checkOut, assignedRoom, reservation.resort]
    )

    // Audit log
    await run(
      `INSERT INTO audit_logs (timestamp, user, role, action, module, description, ip) VALUES (?, 'Front Desk', 'staff', 'UPDATE', 'Reservations', ?, '192.168.1.15')`,
      [new Date().toISOString().replace('T', ' ').slice(0, 19), `Checked in reservation ${reservation.id} into Room ${assignedRoom}`]
    )

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    console.error('Check-in error:', err)
    res.status(500).json({ error: 'Failed to complete check-in' })
  }
})

// POST /api/reservations/:id/check-out
router.post('/:id/check-out', async (req, res) => {
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    // Update Reservation status
    await run(`UPDATE reservations SET status = 'checked-out' WHERE id = ?`, [reservation.id])

    // Update Room status to housekeeping / cleaning
    if (reservation.room && reservation.room !== 'TBD') {
      await run(
        `UPDATE rooms SET status = 'housekeeping', guest = NULL, checkIn = NULL, checkOut = NULL WHERE number = ? AND resort = ?`,
        [reservation.room, reservation.resort]
      )

      // Automatically create a Housekeeping task for this room
      await run(
        `INSERT INTO housekeeping_tasks (room, resort, type, assignee, priority, status, scheduled, notes) VALUES (?, ?, 'Deep Cleaning', 'Meena K', 'high', 'pending', ?, 'Guest checked out from reservation ${reservation.id}')`,
        [reservation.room, reservation.resort, new Date().toISOString().replace('T', ' ').slice(0, 16)]
      )
    }

    // Audit log
    await run(
      `INSERT INTO audit_logs (timestamp, user, role, action, module, description, ip) VALUES (?, 'Front Desk', 'staff', 'UPDATE', 'Reservations', ?, '192.168.1.15')`,
      [new Date().toISOString().replace('T', ' ').slice(0, 19), `Checked out reservation ${reservation.id} from Room ${reservation.room}`]
    )

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    console.error('Check-out error:', err)
    res.status(500).json({ error: 'Failed to complete check-out' })
  }
})

// POST /api/reservations/:id/extend
router.post('/:id/extend', async (req, res) => {
  const { additionalNights, newCheckOut } = req.body
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const addNights = Number(additionalNights) || 1
    const oldOut = new Date(reservation.checkOut)
    oldOut.setDate(oldOut.getDate() + addNights)
    const updatedCheckOut = newCheckOut || oldOut.toISOString().slice(0, 10)

    // Calculate additional cost
    const room = await getOne('SELECT price FROM rooms WHERE number = ? AND resort = ?', [reservation.room, reservation.resort])
    const roomPrice = room ? room.price : 8500
    const additionalCost = addNights * roomPrice
    const newTotalNights = reservation.nights + addNights
    const newTotalAmount = reservation.amount + additionalCost

    await run(
      `UPDATE reservations SET checkOut = ?, nights = ?, amount = ? WHERE id = ?`,
      [updatedCheckOut, newTotalNights, newTotalAmount, reservation.id]
    )

    // Add folio charge
    await run(
      `INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, 'Room Extension', ?, ?, ?)`,
      [reservation.id, `Stay Extended — ${addNights} extra night(s)`, additionalCost, new Date().toISOString().slice(0, 10)]
    )

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to extend stay' })
  }
})

// POST /api/reservations/:id/transfer
router.post('/:id/transfer', async (req, res) => {
  const { newRoomNumber } = req.body
  if (!newRoomNumber) return res.status(400).json({ error: 'New room number is required' })

  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    const targetRoom = await getOne('SELECT * FROM rooms WHERE number = ? AND resort = ?', [newRoomNumber, reservation.resort])
    if (!targetRoom || targetRoom.status !== 'available') {
      return res.status(409).json({ error: `Target room ${newRoomNumber} is unavailable` })
    }

    const oldRoom = reservation.room

    // Release old room to housekeeping
    if (oldRoom && oldRoom !== 'TBD') {
      await run(
        `UPDATE rooms SET status = 'housekeeping', guest = NULL, checkIn = NULL, checkOut = NULL WHERE number = ? AND resort = ?`,
        [oldRoom, reservation.resort]
      )
    }

    // Occupy new room
    await run(
      `UPDATE rooms SET status = 'occupied', guest = ?, checkIn = ?, checkOut = ? WHERE number = ? AND resort = ?`,
      [reservation.guest, reservation.checkIn, reservation.checkOut, newRoomNumber, reservation.resort]
    )

    // Update reservation
    await run(
      `UPDATE reservations SET room = ?, roomType = ? WHERE id = ?`,
      [newRoomNumber, targetRoom.type, reservation.id]
    )

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to transfer room' })
  }
})

// POST /api/reservations/:id/cancel
router.post('/:id/cancel', async (req, res) => {
  const { reason } = req.body
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    await run(
      `UPDATE reservations SET status = 'cancelled', cancellationReason = ? WHERE id = ?`,
      [reason || 'Guest requested cancellation', reservation.id]
    )

    if (reservation.room && reservation.room !== 'TBD') {
      await run(
        `UPDATE rooms SET status = 'available', guest = NULL, checkIn = NULL, checkOut = NULL WHERE number = ? AND resort = ?`,
        [reservation.room, reservation.resort]
      )
    }

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel reservation' })
  }
})

// POST /api/reservations/:id/no-show
router.post('/:id/no-show', async (req, res) => {
  try {
    const reservation = await getOne('SELECT * FROM reservations WHERE id = ?', [req.params.id])
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })

    await run(`UPDATE reservations SET status = 'no-show' WHERE id = ?`, [reservation.id])

    if (reservation.room && reservation.room !== 'TBD') {
      await run(
        `UPDATE rooms SET status = 'available', guest = NULL, checkIn = NULL, checkOut = NULL WHERE number = ? AND resort = ?`,
        [reservation.room, reservation.resort]
      )
    }

    const updated = await getOne('SELECT * FROM reservations WHERE id = ?', [reservation.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to set no-show status' })
  }
})

export default router
