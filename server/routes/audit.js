import express from 'express'
import { query } from '../db.js'

const router = express.Router()

// GET /api/audit
router.get('/', async (req, res) => {
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100')
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' })
  }
})

export default router
