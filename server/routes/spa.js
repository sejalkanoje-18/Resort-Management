import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/spa/appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await query('SELECT * FROM spa_appointments ORDER BY id DESC')
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch spa appointments' })
  }
})

// POST /api/spa/appointments
router.post('/appointments', async (req, res) => {
  const { reservationId, guest, service, therapist, date, time, amount } = req.body
  try {
    const countRow = await getOne('SELECT COUNT(*) as count FROM spa_appointments')
    const aptId = `SPA-${String(countRow.count + 1).padStart(3, '0')}`

    await run(
      `INSERT INTO spa_appointments (id, reservationId, guest, service, therapist, date, time, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`,
      [aptId, reservationId || null, guest, service, therapist || 'Staff', date || new Date().toISOString().slice(0, 10), time || '14:00', Number(amount) || 2500]
    )

    const newApt = await getOne('SELECT * FROM spa_appointments WHERE id = ?', [aptId])
    res.status(201).json(newApt)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create spa appointment' })
  }
})

// PATCH /api/spa/appointments/:id/status
router.patch('/appointments/:id/status', async (req, res) => {
  const { status } = req.body
  try {
    const apt = await getOne('SELECT * FROM spa_appointments WHERE id = ?', [req.params.id])
    if (!apt) return res.status(404).json({ error: 'Appointment not found' })

    await run('UPDATE spa_appointments SET status = ? WHERE id = ?', [status, req.params.id])

    // If completed and tied to reservation, post to folio charges
    if (status === 'completed' && apt.reservationId) {
      const existingCharge = await getOne(
        `SELECT id FROM folio_charges WHERE reservationId = ? AND description LIKE ?`,
        [apt.reservationId, `%${apt.id}%`]
      )
      if (!existingCharge) {
        await run(
          `INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, 'Spa', ?, ?, ?)`,
          [apt.reservationId, `Spa Service (${apt.id}) — ${apt.service}`, apt.amount, new Date().toISOString().slice(0, 10)]
        )
      }
    }

    const updated = await getOne('SELECT * FROM spa_appointments WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment status' })
  }
})

export default router
