import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await query('SELECT * FROM reviews_complaints ORDER BY id DESC')
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews and complaints' })
  }
})

// POST /api/reviews
router.post('/', async (req, res) => {
  const { guest, resort, type, rating, category, subject, description, priority } = req.body
  try {
    const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const result = await run(
      `INSERT INTO reviews_complaints (guest, resort, type, rating, category, subject, description, priority, status, assignee, resolutionNotes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'Unassigned', '', ?)`,
      [guest || 'Guest', resort || 'Serenity Goa', type || 'Review', rating || 5, category || 'General', subject, description || '', priority || 'medium', createdAt]
    )
    const newRecord = await getOne('SELECT * FROM reviews_complaints WHERE id = ?', [result.lastID])
    res.status(201).json(newRecord)
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review/complaint' })
  }
})

// PATCH /api/reviews/:id
router.patch('/:id', async (req, res) => {
  const { status, assignee, resolutionNotes } = req.body
  try {
    await run(
      `UPDATE reviews_complaints SET status = COALESCE(?, status), assignee = COALESCE(?, assignee), resolutionNotes = COALESCE(?, resolutionNotes) WHERE id = ?`,
      [status || null, assignee || null, resolutionNotes || null, req.params.id]
    )
    const updated = await getOne('SELECT * FROM reviews_complaints WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resolution status' })
  }
})

export default router
