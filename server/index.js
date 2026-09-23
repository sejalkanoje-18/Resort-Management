import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'

import authRoutes from './routes/auth.js'
import resortsRoutes from './routes/resorts.js'
import roomsRoutes from './routes/rooms.js'
import guestsRoutes from './routes/guests.js'
import reservationsRoutes from './routes/reservations.js'
import housekeepingRoutes from './routes/housekeeping.js'
import maintenanceRoutes from './routes/maintenance.js'
import fnbRoutes from './routes/fnb.js'
import spaRoutes from './routes/spa.js'
import billingRoutes from './routes/billing.js'
import offersRoutes from './routes/offers.js'
import reviewsRoutes from './routes/reviews.js'
import reportsRoutes from './routes/reports.js'
import usersRoutes from './routes/users.js'
import auditRoutes from './routes/audit.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/resorts', resortsRoutes)
app.use('/api/rooms', roomsRoutes)
app.use('/api/guests', guestsRoutes)
app.use('/api/reservations', reservationsRoutes)
app.use('/api/housekeeping', housekeepingRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/fnb', fnbRoutes)
app.use('/api/spa', spaRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/audit', auditRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Initialize DB and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Resort Management REST API Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
