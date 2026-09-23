import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getOne, run } from '../db.js'
import { authenticateToken, JWT_SECRET } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await getOne('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const permissions = JSON.parse(user.permissions || '[]')
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      title: user.title,
      resort: user.resort,
      department: user.department,
      phone: user.phone,
      tier: user.tier,
      loyaltyPoints: user.loyaltyPoints,
      totalVisits: user.totalVisits,
      totalSpend: user.totalSpend,
      memberSince: user.memberSince,
      preferences: JSON.parse(user.preferences || '[]'),
      permissions,
    }

    return res.json({ token, user: safeUser })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/auth/register (Guest registration)
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  try {
    const existing = await getOne('SELECT id FROM users WHERE email = ?', [email])
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    const memberSince = new Date().toISOString().slice(0, 10)
    const permissions = JSON.stringify(['guest'])

    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, avatar, title, resort, department, phone, tier, loyaltyPoints, totalVisits, totalSpend, memberSince, preferences, permissions) VALUES (?, ?, ?, 'guest', ?, 'Bronze Member', 'Serenity Goa', 'guest', ?, 'Bronze', 500, 0, 0, ?, '[]', ?)`,
      [name, email, password_hash, initials, phone || '', memberSince, permissions]
    )

    const userId = result.lastID

    // Also insert into guests table
    await run(
      `INSERT INTO guests (name, email, phone, tier, visits, totalSpend, lastVisit, preferences, notes, userId) VALUES (?, ?, ?, 'Bronze', 0, 0, ?, '[]', '', ?)`,
      [name, email, phone || '', memberSince, userId]
    )

    const newUser = {
      id: userId,
      name,
      email,
      role: 'guest',
      avatar: initials,
      title: 'Bronze Member',
      resort: 'Serenity Goa',
      department: 'guest',
      phone: phone || '',
      tier: 'Bronze',
      loyaltyPoints: 500,
      totalVisits: 0,
      totalSpend: 0,
      memberSince,
      preferences: [],
      permissions: ['guest'],
    }

    const token = jwt.sign(
      { id: userId, email, role: 'guest' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({ token, user: newUser })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Failed to register account' })
  }
})

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user })
})

export default router
