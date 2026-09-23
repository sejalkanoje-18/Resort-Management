import express from 'express'
import bcrypt from 'bcryptjs'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, avatar, title, resort, department, phone, status, tier FROM users ORDER BY id ASC')
    const formatted = users.map(u => ({ ...u, permissions: JSON.parse(u.permissions || '[]') }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// POST /api/users
router.post('/', async (req, res) => {
  const { name, email, password, role, title, resort, department, phone, permissions } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' })
  }

  try {
    const password_hash = await bcrypt.hash(password, 10)
    const avatar = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, avatar, title, resort, department, phone, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, role, avatar, title || 'Staff', resort || 'Serenity Goa', department || 'front_desk', phone || '', JSON.stringify(permissions || [])]
    )

    const newUser = await getOne('SELECT id, name, email, role, avatar, title, resort, department, phone FROM users WHERE id = ?', [result.lastID])
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create staff account' })
  }
})

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { name, email, role, title, resort, department, phone, permissions } = req.body
  try {
    await run(
      `UPDATE users SET name = ?, email = ?, role = ?, title = ?, resort = ?, department = ?, phone = ?, permissions = ? WHERE id = ?`,
      [name, email, role, title, resort, department, phone, JSON.stringify(permissions || []), req.params.id]
    )
    const updated = await getOne('SELECT id, name, email, role, avatar, title, resort, department, phone FROM users WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

export default router
