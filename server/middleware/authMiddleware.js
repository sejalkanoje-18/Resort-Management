import jwt from 'jsonwebtoken'
import { getOne } from '../db.js'

export const JWT_SECRET = 'resort_super_secret_jwt_key_2026'

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await getOne('SELECT id, name, email, role, avatar, title, resort, department, phone, permissions, tier FROM users WHERE id = ?', [decoded.id])
    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists' })
    }
    user.permissions = JSON.parse(user.permissions || '[]')
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' })
    }
    next()
  }
}
