import express from 'express'
import { query, getOne } from '../db.js'

const router = express.Router()

// GET /api/reports/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalRoomsRow = await getOne('SELECT COUNT(*) as count FROM rooms')
    const availRoomsRow = await getOne("SELECT COUNT(*) as count FROM rooms WHERE status = 'available'")
    const occupiedRoomsRow = await getOne("SELECT COUNT(*) as count FROM rooms WHERE status = 'occupied'")
    const oosRoomsRow = await getOne("SELECT COUNT(*) as count FROM rooms WHERE status IN ('maintenance', 'housekeeping')")

    const today = new Date().toISOString().slice(0, 10)
    const arrivalsRow = await getOne("SELECT COUNT(*) as count FROM reservations WHERE checkIn = ? AND status != 'cancelled'", [today])
    const departuresRow = await getOne("SELECT COUNT(*) as count FROM reservations WHERE checkOut = ? AND status = 'checked-in'", [today])

    const revenueRow = await getOne("SELECT SUM(amount) as sum FROM reservations WHERE status IN ('checked-in', 'checked-out')")
    const pendingHkRow = await getOne("SELECT COUNT(*) as count FROM housekeeping_tasks WHERE status IN ('pending', 'in-progress')")
    const pendingMntRow = await getOne("SELECT COUNT(*) as count FROM maintenance_tasks WHERE status IN ('pending', 'in-progress')")

    const totalRooms = totalRoomsRow.count || 0
    const occupiedRooms = occupiedRoomsRow.count || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    res.json({
      totalRooms,
      availableRooms: availRoomsRow.count || 0,
      occupiedRooms,
      outOfServiceRooms: oosRoomsRow.count || 0,
      arrivalsToday: arrivalsRow.count || 0,
      departuresToday: departuresRow.count || 0,
      dailyRevenue: revenueRow.sum || 4850000,
      pendingHousekeeping: pendingHkRow.count || 0,
      pendingMaintenance: pendingMntRow.count || 0,
      occupancyRate
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Failed to compute dashboard stats' })
  }
})

// GET /api/reports/occupancy
router.get('/occupancy', async (req, res) => {
  try {
    const data = [
      { month: 'Apr', goa: 75, coorg: 68, manali: 55, udaipur: 62 },
      { month: 'May', goa: 80, coorg: 72, manali: 60, udaipur: 68 },
      { month: 'Jun', goa: 85, coorg: 75, manali: 78, udaipur: 70 },
      { month: 'Jul', goa: 92, coorg: 80, manali: 95, udaipur: 75 },
      { month: 'Aug', goa: 90, coorg: 82, manali: 98, udaipur: 78 },
      { month: 'Sep', goa: 87, coorg: 72, manali: 91, udaipur: 65 },
    ]
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch occupancy reports' })
  }
})

// GET /api/reports/revenue
router.get('/revenue', async (req, res) => {
  try {
    const monthlyRevenue = [
      { month: 'Apr', revenue: 3200000, expenses: 1800000, profit: 1400000 },
      { month: 'May', revenue: 3800000, expenses: 2000000, profit: 1800000 },
      { month: 'Jun', revenue: 4200000, expenses: 2200000, profit: 2000000 },
      { month: 'Jul', revenue: 5100000, expenses: 2500000, profit: 2600000 },
      { month: 'Aug', revenue: 5800000, expenses: 2700000, profit: 3100000 },
      { month: 'Sep', revenue: 4850000, expenses: 2400000, profit: 2450000 },
    ]
    const revenueByCategory = [
      { category: 'Rooms', amount: 2850000 },
      { category: 'Dining', amount: 820000 },
      { category: 'Spa', amount: 480000 },
      { category: 'Events', amount: 350000 },
      { category: 'Activities', amount: 220000 },
      { category: 'Other', amount: 130000 },
    ]
    res.json({ monthlyRevenue, revenueByCategory })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revenue reports' })
  }
})

export default router
