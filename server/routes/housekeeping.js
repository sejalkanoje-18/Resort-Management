import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/housekeeping
router.get('/', async (req, res) => {
  const { status, priority, search, assignee } = req.query
  try {
    let sql = 'SELECT * FROM housekeeping_tasks WHERE 1=1'
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
      sql += ' AND (room LIKE ? OR assignee LIKE ? OR type LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY id DESC'
    const tasks = await query(sql, params)
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch housekeeping tasks' })
  }
})

// POST /api/housekeeping
router.post('/', async (req, res) => {
  const { room, resort, type, assignee, priority, scheduled, notes } = req.body
  try {
    const result = await run(
      `INSERT INTO housekeeping_tasks (room, resort, type, assignee, priority, status, scheduled, notes) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [room, resort || 'Serenity Goa', type || 'Daily Cleaning', assignee || 'Meena K', priority || 'medium', scheduled || new Date().toISOString().replace('T', ' ').slice(0, 16), notes || '']
    )
    const newTask = await getOne('SELECT * FROM housekeeping_tasks WHERE id = ?', [result.lastID])
    res.status(201).json(newTask)
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign housekeeping task' })
  }
})

// PATCH /api/housekeeping/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status, notes } = req.body
  try {
    const task = await getOne('SELECT * FROM housekeeping_tasks WHERE id = ?', [req.params.id])
    if (!task) return res.status(404).json({ error: 'Task not found' })

    await run(
      `UPDATE housekeeping_tasks SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`,
      [status, notes || null, req.params.id]
    )

    // If task is completed/inspected, set room status back to available (or ready) if it's currently housekeeping
    if (['completed', 'inspected'].includes(status) && task.room) {
      await run(
        `UPDATE rooms SET status = 'available' WHERE number = ? AND resort = ? AND status = 'housekeeping'`,
        [task.room, task.resort]
      )
    }

    const updated = await getOne('SELECT * FROM housekeeping_tasks WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task status' })
  }
})

export default router
