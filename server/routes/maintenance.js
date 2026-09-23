import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/maintenance
router.get('/', async (req, res) => {
  const { status, priority, search, assignee } = req.query
  try {
    let sql = 'SELECT * FROM maintenance_tasks WHERE 1=1'
    const params = []

    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    if (priority && priority !== 'all') {
      sql += ' AND priority = ?'
      params.push(priority)
    }
    if (assignee) {
      sql += ' AND assignee = ?'
      params.push(assignee)
    }
    if (search) {
      sql += ' AND (ticketNo LIKE ? OR location LIKE ? OR issue LIKE ? OR assignee LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY id DESC'
    const tickets = await query(sql, params)
    res.json(tickets)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch maintenance tasks' })
  }
})

// POST /api/maintenance
router.post('/', async (req, res) => {
  const { resort, location, category, issue, priority, assignee, notes } = req.body
  try {
    const countRow = await getOne('SELECT COUNT(*) as count FROM maintenance_tasks')
    const ticketNo = `MNT-${String(countRow.count + 1).padStart(3, '0')}`
    const today = new Date().toISOString().slice(0, 10)

    const result = await run(
      `INSERT INTO maintenance_tasks (ticketNo, resort, location, category, issue, priority, status, assignee, reported, scheduled, notes) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [ticketNo, resort || 'Serenity Goa', location, category || 'General', issue, priority || 'medium', assignee || 'Suresh Nair', today, today, notes || '']
    )

    // Extract room number if location specifies Room X
    const roomMatch = location.match(/Room\s*(\d+)/i)
    if (roomMatch) {
      const roomNum = roomMatch[1]
      await run(
        `UPDATE rooms SET status = 'maintenance' WHERE number = ? AND resort = ?`,
        [roomNum, resort || 'Serenity Goa']
      )
    }

    const newTicket = await getOne('SELECT * FROM maintenance_tasks WHERE id = ?', [result.lastID])
    res.status(201).json(newTicket)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create maintenance ticket' })
  }
})

// PATCH /api/maintenance/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status, notes } = req.body
  try {
    const ticket = await getOne('SELECT * FROM maintenance_tasks WHERE id = ?', [req.params.id])
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' })

    await run(
      `UPDATE maintenance_tasks SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`,
      [status, notes || null, req.params.id]
    )

    // If resolved, return room back to available
    if (status === 'resolved' && ticket.location) {
      const roomMatch = ticket.location.match(/Room\s*(\d+)/i)
      if (roomMatch) {
        const roomNum = roomMatch[1]
        await run(
          `UPDATE rooms SET status = 'available' WHERE number = ? AND resort = ? AND status = 'maintenance'`,
          [roomNum, ticket.resort]
        )
      }
    }

    const updated = await getOne('SELECT * FROM maintenance_tasks WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket status' })
  }
})

export default router
