import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/resorts
router.get('/', async (req, res) => {
  try {
    const resorts = await query('SELECT * FROM resorts ORDER BY name ASC')
    res.json(resorts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resorts' })
  }
})

// POST /api/resorts
router.post('/', async (req, res) => {
  const { name, location, category, rooms, status, image, manager, contact } = req.body
  try {
    const result = await run(
      `INSERT INTO resorts (name, location, category, rooms, rating, status, image, established, manager, contact, revenue, occupancy) VALUES (?, ?, ?, ?, 4.5, ?, ?, ?, ?, ?, 0, 0)`,
      [name, location, category, rooms || 50, status || 'active', image || '🏖️', new Date().getFullYear().toString(), manager || '', contact || '']
    )
    const newResort = await getOne('SELECT * FROM resorts WHERE id = ?', [result.lastID])
    res.status(201).json(newResort)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resort' })
  }
})

// PUT /api/resorts/:id
router.put('/:id', async (req, res) => {
  const { name, location, category, rooms, status, image, manager, contact } = req.body
  try {
    await run(
      `UPDATE resorts SET name = ?, location = ?, category = ?, rooms = ?, status = ?, image = ?, manager = ?, contact = ? WHERE id = ?`,
      [name, location, category, rooms, status, image, manager, contact, req.params.id]
    )
    const updated = await getOne('SELECT * FROM resorts WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resort' })
  }
})

export default router
