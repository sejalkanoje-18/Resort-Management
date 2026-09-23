import express from 'express'
import { query, getOne, run } from '../db.js'

const router = express.Router()

// GET /api/offers
router.get('/', async (req, res) => {
  try {
    const offers = await query('SELECT * FROM offers ORDER BY id DESC')
    res.json(offers)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offers' })
  }
})

// POST /api/offers
router.post('/', async (req, res) => {
  const { code, title, discountPercent, discountAmount, validFrom, validTo, minSpend, isActive } = req.body
  if (!code || !title) return res.status(400).json({ error: 'Code and title required' })

  try {
    const result = await run(
      `INSERT INTO offers (code, title, discountPercent, discountAmount, validFrom, validTo, minSpend, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [code.toUpperCase(), title, Number(discountPercent) || 0, Number(discountAmount) || 0, validFrom, validTo, Number(minSpend) || 0, isActive ? 1 : 1]
    )
    const newOffer = await getOne('SELECT * FROM offers WHERE id = ?', [result.lastID])
    res.status(201).json(newOffer)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create offer' })
  }
})

// POST /api/offers/validate
router.post('/validate', async (req, res) => {
  const { code, amount } = req.body
  if (!code) return res.status(400).json({ error: 'Promo code is required' })

  try {
    const offer = await getOne('SELECT * FROM offers WHERE code = ? AND isActive = 1', [code.toUpperCase()])
    if (!offer) return res.status(404).json({ error: 'Invalid or expired offer code' })

    const baseAmount = Number(amount) || 0
    if (offer.minSpend > 0 && baseAmount < offer.minSpend) {
      return res.status(400).json({ error: `Minimum spend of ₹${offer.minSpend.toLocaleString()} required for this offer` })
    }

    let discount = 0
    if (offer.discountPercent > 0) discount = (baseAmount * offer.discountPercent) / 100
    else if (offer.discountAmount > 0) discount = Math.min(baseAmount, offer.discountAmount)

    res.json({ valid: true, offer, discount, finalAmount: Math.max(0, baseAmount - discount) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate offer' })
  }
})

export default router
