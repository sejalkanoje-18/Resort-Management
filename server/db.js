import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, 'database.sqlite')
const db = new sqlite3.Database(dbPath)

// Helper wrapper for async/await DB queries
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

export const exec = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function initDb() {
  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      title TEXT,
      resort TEXT,
      department TEXT,
      phone TEXT,
      tier TEXT,
      loyaltyPoints INTEGER DEFAULT 0,
      totalVisits INTEGER DEFAULT 0,
      totalSpend REAL DEFAULT 0,
      memberSince TEXT,
      preferences TEXT,
      permissions TEXT
    );

    CREATE TABLE IF NOT EXISTS resorts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      rooms INTEGER NOT NULL,
      rating REAL DEFAULT 4.5,
      status TEXT DEFAULT 'active',
      image TEXT,
      established TEXT,
      manager TEXT,
      contact TEXT,
      revenue REAL DEFAULT 0,
      occupancy INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL,
      type TEXT NOT NULL,
      resort TEXT NOT NULL,
      floor INTEGER,
      bedType TEXT,
      view TEXT,
      capacity INTEGER,
      price REAL NOT NULL,
      status TEXT DEFAULT 'available',
      guest TEXT,
      checkIn TEXT,
      checkOut TEXT,
      amenities TEXT
    );

    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      nationality TEXT,
      dob TEXT,
      idType TEXT,
      idNumber TEXT,
      tier TEXT DEFAULT 'Bronze',
      visits INTEGER DEFAULT 0,
      totalSpend REAL DEFAULT 0,
      lastVisit TEXT,
      preferences TEXT,
      notes TEXT,
      userId INTEGER
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      guest TEXT NOT NULL,
      guestId INTEGER,
      room TEXT,
      roomType TEXT,
      resort TEXT NOT NULL,
      checkIn TEXT NOT NULL,
      checkOut TEXT NOT NULL,
      nights INTEGER NOT NULL,
      adults INTEGER DEFAULT 1,
      children INTEGER DEFAULT 0,
      status TEXT DEFAULT 'confirmed',
      amount REAL NOT NULL,
      paid REAL DEFAULT 0,
      source TEXT DEFAULT 'Direct',
      created TEXT,
      offerId INTEGER,
      specialRequests TEXT,
      cancellationReason TEXT
    );

    CREATE TABLE IF NOT EXISTS housekeeping_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room TEXT NOT NULL,
      resort TEXT NOT NULL,
      type TEXT NOT NULL,
      assignee TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      scheduled TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketNo TEXT UNIQUE NOT NULL,
      resort TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      issue TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      assignee TEXT,
      reported TEXT,
      scheduled TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS fnb_orders (
      id TEXT PRIMARY KEY,
      room TEXT NOT NULL,
      guest TEXT NOT NULL,
      reservationId TEXT,
      items TEXT NOT NULL,
      amount REAL NOT NULL,
      time TEXT,
      status TEXT DEFAULT 'pending',
      type TEXT DEFAULT 'Room Service',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS spa_appointments (
      id TEXT PRIMARY KEY,
      reservationId TEXT,
      guest TEXT NOT NULL,
      service TEXT NOT NULL,
      therapist TEXT,
      date TEXT,
      time TEXT,
      status TEXT DEFAULT 'confirmed',
      amount REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS folio_charges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservationId TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      reservationId TEXT NOT NULL,
      guest TEXT NOT NULL,
      resort TEXT NOT NULL,
      checkIn TEXT,
      checkOut TEXT,
      roomCharges REAL DEFAULT 0,
      diningCharges REAL DEFAULT 0,
      spaCharges REAL DEFAULT 0,
      otherCharges REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      taxes REAL DEFAULT 0,
      total REAL NOT NULL,
      paid REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      method TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      discountPercent REAL DEFAULT 0,
      discountAmount REAL DEFAULT 0,
      validFrom TEXT,
      validTo TEXT,
      minSpend REAL DEFAULT 0,
      isActive INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reviews_complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest TEXT NOT NULL,
      resort TEXT NOT NULL,
      type TEXT NOT NULL,
      rating INTEGER,
      category TEXT,
      subject TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      assignee TEXT,
      resolutionNotes TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      user TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      description TEXT,
      ip TEXT
    );
  `)

  await seedData()
}

async function seedData() {
  const userCount = await getOne('SELECT COUNT(*) as count FROM users')
  if (userCount.count > 0) return // Already seeded

  console.log('Seeding initial data into SQLite database...')

  const ownerPw = await bcrypt.hash('owner123', 10)
  const managerPw = await bcrypt.hash('manager123', 10)
  const staffPw = await bcrypt.hash('staff123', 10)
  const guestPw = await bcrypt.hash('guest123', 10)

  // Seed Users
  const users = [
    { name: 'Rajiv Mehta', email: 'owner@serenityresorts.com', password_hash: ownerPw, role: 'owner', avatar: 'RM', title: 'Resort Owner', resort: 'Serenity Resorts Group', department: 'management', phone: '+91 98765 00000', permissions: JSON.stringify(['all']) },
    { name: 'Priya Sharma', email: 'manager@serenityresorts.com', password_hash: managerPw, role: 'management', avatar: 'PS', title: 'General Manager', resort: 'Serenity Goa', department: 'management', phone: '+91 98765 43210', permissions: JSON.stringify(['dashboard', 'resorts', 'rooms', 'reservations', 'guests', 'housekeeping', 'maintenance', 'billing', 'reports', 'settings']) },
    { name: 'Arjun Patel', email: 'staff@serenityresorts.com', password_hash: staffPw, role: 'staff', avatar: 'AP', title: 'Front Desk Officer', resort: 'Serenity Goa', department: 'front_desk', phone: '+91 98765 43211', permissions: JSON.stringify(['dashboard', 'reservations', 'guests', 'housekeeping']) },
    { name: 'Meena Krishnan', email: 'housekeeper@serenityresorts.com', password_hash: staffPw, role: 'staff', avatar: 'MK', title: 'Head Housekeeper', resort: 'Serenity Goa', department: 'housekeeping', phone: '+91 98765 43212', permissions: JSON.stringify(['dashboard', 'housekeeping']) },
    { name: 'Suresh Nair', email: 'maintenance@serenityresorts.com', password_hash: staffPw, role: 'staff', avatar: 'SN', title: 'Maintenance Supervisor', resort: 'Serenity Goa', department: 'maintenance', phone: '+91 98765 43213', permissions: JSON.stringify(['dashboard', 'maintenance']) },
    { name: 'Rajesh Kumar', email: 'guest@serenityresorts.com', password_hash: guestPw, role: 'guest', avatar: 'RK', title: 'Platinum Member', resort: 'Serenity Goa', department: 'guest', phone: '+91 98765 11111', tier: 'Platinum', loyaltyPoints: 12450, totalVisits: 12, totalSpend: 485000, memberSince: '2018-04-10', preferences: JSON.stringify(['Sea View', 'Non-Veg', 'Late Checkout']), permissions: JSON.stringify(['guest']) },
    { name: 'Anita Desai', email: 'anita@serenityresorts.com', password_hash: guestPw, role: 'guest', avatar: 'AD', title: 'Gold Member', resort: 'Serenity Goa', department: 'guest', phone: '+91 98765 22222', tier: 'Gold', loyaltyPoints: 5800, totalVisits: 6, totalSpend: 220000, memberSince: '2021-08-15', preferences: JSON.stringify(['High Floor', 'Veg', 'Early Check-in']), permissions: JSON.stringify(['guest']) },
  ]

  for (const u of users) {
    await run(
      `INSERT INTO users (name, email, password_hash, role, avatar, title, resort, department, phone, tier, loyaltyPoints, totalVisits, totalSpend, memberSince, preferences, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.name, u.email, u.password_hash, u.role, u.avatar, u.title, u.resort, u.department, u.phone, u.tier || null, u.loyaltyPoints || 0, u.totalVisits || 0, u.totalSpend || 0, u.memberSince || null, u.preferences || '[]', u.permissions]
    )
  }

  // Seed Resorts
  const resorts = [
    { name: 'Serenity Goa', location: 'Panaji, Goa', category: 'Beach', rooms: 120, rating: 4.8, status: 'active', image: '🏖️', established: '2008', manager: 'Priya Sharma', contact: '+91 98765 43210', revenue: 4850000, occupancy: 87 },
    { name: 'Serenity Coorg', location: 'Madikeri, Coorg', category: 'Hill Station', rooms: 85, rating: 4.7, status: 'active', image: '🌿', established: '2012', manager: 'Anil Kumar', contact: '+91 98765 43211', revenue: 3200000, occupancy: 72 },
    { name: 'Serenity Manali', location: 'Kullu Manali, HP', category: 'Mountain', rooms: 60, rating: 4.9, status: 'active', image: '🏔️', established: '2015', manager: 'Rohit Singh', contact: '+91 98765 43212', revenue: 2800000, occupancy: 91 },
    { name: 'Serenity Udaipur', location: 'Udaipur, Rajasthan', category: 'Heritage', rooms: 95, rating: 4.6, status: 'maintenance', image: '🏰', established: '2018', manager: 'Kavitha Reddy', contact: '+91 98765 43213', revenue: 3600000, occupancy: 65 },
  ]

  for (const r of resorts) {
    await run(
      `INSERT INTO resorts (name, location, category, rooms, rating, status, image, established, manager, contact, revenue, occupancy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.name, r.location, r.category, r.rooms, r.rating, r.status, r.image, r.established, r.manager, r.contact, r.revenue, r.occupancy]
    )
  }

  // Seed Rooms
  const rooms = [
    { number: '101', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'King', view: 'Pool View', capacity: 2, price: 8500, status: 'occupied', guest: 'Rajesh Kumar', checkIn: '2026-09-18', checkOut: '2026-09-23', amenities: JSON.stringify(['WiFi', 'AC', 'Minibar', 'TV']) },
    { number: '102', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Twin', view: 'Garden View', capacity: 2, price: 7500, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: JSON.stringify(['WiFi', 'AC', 'TV']) },
    { number: '201', type: 'Premium Suite', resort: 'Serenity Goa', floor: 2, bedType: 'King', view: 'Sea View', capacity: 3, price: 15000, status: 'occupied', guest: 'Anita Desai', checkIn: '2026-09-20', checkOut: '2026-09-25', amenities: JSON.stringify(['WiFi', 'AC', 'Minibar', 'TV', 'Jacuzzi']) },
    { number: '202', type: 'Premium Suite', resort: 'Serenity Goa', floor: 2, bedType: 'King', view: 'Sea View', capacity: 3, price: 15000, status: 'housekeeping', guest: null, checkIn: null, checkOut: null, amenities: JSON.stringify(['WiFi', 'AC', 'Minibar', 'TV', 'Jacuzzi']) },
    { number: '301', type: 'Presidential Villa', resort: 'Serenity Goa', floor: 3, bedType: 'King', view: 'Ocean View', capacity: 4, price: 35000, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: JSON.stringify(['WiFi', 'AC', 'Minibar', 'TV', 'Private Pool', 'Butler']) },
    { number: '103', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Queen', view: 'Garden View', capacity: 2, price: 7500, status: 'maintenance', guest: null, checkIn: null, checkOut: null, amenities: JSON.stringify(['WiFi', 'AC', 'TV']) },
    { number: '104', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'King', view: 'Pool View', capacity: 2, price: 8500, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar']) },
    { number: '105', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Twin', view: 'Garden View', capacity: 2, price: 7500, status: 'occupied', guest: 'Sunita Verma', checkIn: '2026-09-19', checkOut: '2026-09-22', amenities: JSON.stringify(['WiFi', 'AC', 'TV']) },
  ]

  for (const rm of rooms) {
    await run(
      `INSERT INTO rooms (number, type, resort, floor, bedType, view, capacity, price, status, guest, checkIn, checkOut, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [rm.number, rm.type, rm.resort, rm.floor, rm.bedType, rm.view, rm.capacity, rm.price, rm.status, rm.guest, rm.checkIn, rm.checkOut, rm.amenities]
    )
  }

  // Seed Guests
  const guests = [
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765 11111', nationality: 'Indian', dob: '1982-03-15', idType: 'Passport', idNumber: 'P1234567', tier: 'Platinum', visits: 12, totalSpend: 485000, lastVisit: '2026-09-18', preferences: JSON.stringify(['Sea View', 'Non-Veg', 'Late Checkout']), notes: 'VIP Guest — complimentary welcome drink' },
    { name: 'Anita Desai', email: 'anita.desai@email.com', phone: '+91 98765 22222', nationality: 'Indian', dob: '1990-07-22', idType: 'Aadhaar', idNumber: '1234-5678-9012', tier: 'Gold', visits: 6, totalSpend: 220000, lastVisit: '2026-09-20', preferences: JSON.stringify(['High Floor', 'Veg', 'Early Check-in']), notes: '' },
    { name: 'Mohan Iyer', email: 'mohan.iyer@email.com', phone: '+91 98765 33333', nationality: 'Indian', dob: '1975-12-01', idType: 'PAN', idNumber: 'ABCDE1234F', tier: 'Silver', visits: 3, totalSpend: 95000, lastVisit: '2026-08-10', preferences: JSON.stringify(['Ground Floor', 'Veg']), notes: '' },
    { name: 'Sunita Verma', email: 'sunita.verma@email.com', phone: '+91 98765 44444', nationality: 'Indian', dob: '1988-05-18', idType: 'Driving License', idNumber: 'MH01 20120001', tier: 'Gold', visits: 8, totalSpend: 310000, lastVisit: '2026-09-19', preferences: JSON.stringify(['Pool View', 'Non-Veg']), notes: 'Celebrate anniversary on Sep 21' },
    { name: 'Vikram Malhotra', email: 'vikram.m@email.com', phone: '+91 98765 55555', nationality: 'Indian', dob: '1979-09-30', idType: 'Passport', idNumber: 'P7654321', tier: 'Platinum', visits: 15, totalSpend: 720000, lastVisit: '2026-09-16', preferences: JSON.stringify(['Villa', 'Non-Veg', 'Private Pool', 'Butler Service']), notes: 'CEO — ensure full privacy' },
    { name: 'Priti Joshi', email: 'priti.j@email.com', phone: '+91 98765 66666', nationality: 'Indian', dob: '1995-01-10', idType: 'Aadhaar', idNumber: '9876-5432-1098', tier: 'Bronze', visits: 2, totalSpend: 58000, lastVisit: '2026-09-17', preferences: JSON.stringify(['Garden View']), notes: '' },
  ]

  for (const g of guests) {
    await run(
      `INSERT INTO guests (name, email, phone, nationality, dob, idType, idNumber, tier, visits, totalSpend, lastVisit, preferences, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [g.name, g.email, g.phone, g.nationality, g.dob, g.idType, g.idNumber, g.tier, g.visits, g.totalSpend, g.lastVisit, g.preferences, g.notes]
    )
  }

  // Seed Reservations
  const reservations = [
    { id: 'RES-001', guest: 'Rajesh Kumar', guestId: 1, room: '101', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-18', checkOut: '2026-09-23', nights: 5, adults: 2, children: 0, status: 'checked-in', amount: 42500, paid: 42500, source: 'Direct', created: '2026-09-10' },
    { id: 'RES-002', guest: 'Anita Desai', guestId: 2, room: '201', roomType: 'Premium Suite', resort: 'Serenity Goa', checkIn: '2026-09-20', checkOut: '2026-09-25', nights: 5, adults: 2, children: 1, status: 'checked-in', amount: 75000, paid: 37500, source: 'Website', created: '2026-09-12' },
    { id: 'RES-003', guest: 'Mohan Iyer', guestId: 3, room: '302', roomType: 'Premium Suite', resort: 'Serenity Coorg', checkIn: '2026-09-22', checkOut: '2026-09-26', nights: 4, adults: 2, children: 2, status: 'confirmed', amount: 60000, paid: 30000, source: 'Travel Agent', created: '2026-09-14' },
    { id: 'RES-004', guest: 'Sunita Verma', guestId: 4, room: '105', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-19', checkOut: '2026-09-22', nights: 3, adults: 2, children: 0, status: 'checked-in', amount: 22500, paid: 22500, source: 'Direct', created: '2026-09-15' },
    { id: 'RES-005', guest: 'Vikram Malhotra', guestId: 5, room: '401', roomType: 'Presidential Villa', resort: 'Serenity Manali', checkIn: '2026-09-25', checkOut: '2026-09-30', nights: 5, adults: 3, children: 1, status: 'confirmed', amount: 175000, paid: 87500, source: 'Website', created: '2026-09-16' },
    { id: 'RES-006', guest: 'Priti Joshi', guestId: 6, room: '203', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-17', checkOut: '2026-09-21', nights: 4, adults: 1, children: 0, status: 'checked-out', amount: 30000, paid: 30000, source: 'OTA', created: '2026-09-09' },
    { id: 'RES-007', guest: 'Arun Kapoor', guestId: 7, room: '502', roomType: 'Heritage Suite', resort: 'Serenity Udaipur', checkIn: '2026-10-01', checkOut: '2026-10-05', nights: 4, adults: 2, children: 0, status: 'pending', amount: 80000, paid: 0, source: 'Travel Agent', created: '2026-09-18' },
    { id: 'RES-008', guest: 'Deepa Nair', guestId: 8, room: '104', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-21', checkOut: '2026-09-24', nights: 3, adults: 2, children: 1, status: 'confirmed', amount: 25500, paid: 12750, source: 'Direct', created: '2026-09-17' },
  ]

  for (const res of reservations) {
    await run(
      `INSERT INTO reservations (id, guest, guestId, room, roomType, resort, checkIn, checkOut, nights, adults, children, status, amount, paid, source, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [res.id, res.guest, res.guestId, res.room, res.roomType, res.resort, res.checkIn, res.checkOut, res.nights, res.adults, res.children, res.status, res.amount, res.paid, res.source, res.created]
    )
  }

  // Seed Housekeeping
  const housekeeping = [
    { room: '101', resort: 'Serenity Goa', type: 'Daily Cleaning', assignee: 'Lakshmi P', priority: 'high', status: 'in-progress', scheduled: '2026-09-21 09:00', notes: 'Guest checked in, full turndown service' },
    { room: '201', resort: 'Serenity Goa', type: 'Turndown Service', assignee: 'Raju M', priority: 'medium', status: 'pending', scheduled: '2026-09-21 18:00', notes: '' },
    { room: '202', resort: 'Serenity Goa', type: 'Deep Cleaning', assignee: 'Lakshmi P', priority: 'high', status: 'pending', scheduled: '2026-09-21 10:00', notes: 'Guest checked out, deep clean required' },
    { room: '105', resort: 'Serenity Goa', type: 'Daily Cleaning', assignee: 'Meena K', priority: 'medium', status: 'completed', scheduled: '2026-09-21 08:00', notes: '' },
    { room: '301', resort: 'Serenity Goa', type: 'Inspection', assignee: 'Meena K', priority: 'low', status: 'completed', scheduled: '2026-09-21 07:30', notes: 'Pre-arrival inspection' },
  ]

  for (const hk of housekeeping) {
    await run(
      `INSERT INTO housekeeping_tasks (room, resort, type, assignee, priority, status, scheduled, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [hk.room, hk.resort, hk.type, hk.assignee, hk.priority, hk.status, hk.scheduled, hk.notes]
    )
  }

  // Seed Maintenance
  const maintenance = [
    { ticketNo: 'MNT-001', resort: 'Serenity Goa', location: 'Room 103', category: 'HVAC', issue: 'AC unit not cooling properly', priority: 'high', status: 'in-progress', assignee: 'Suresh Nair', reported: '2026-09-20', scheduled: '2026-09-21', notes: 'Refrigerant may need recharging' },
    { ticketNo: 'MNT-002', resort: 'Serenity Goa', location: 'Pool Area', category: 'Plumbing', issue: 'Pool pump making noise', priority: 'medium', status: 'pending', assignee: 'Ramesh B', reported: '2026-09-19', scheduled: '2026-09-22', notes: '' },
  ]

  for (const m of maintenance) {
    await run(
      `INSERT INTO maintenance_tasks (ticketNo, resort, location, category, issue, priority, status, assignee, reported, scheduled, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [m.ticketNo, m.resort, m.location, m.category, m.issue, m.priority, m.status, m.assignee, m.reported, m.scheduled, m.notes]
    )
  }

  // Seed Invoices
  const invoices = [
    { id: 'INV-001', reservationId: 'RES-001', guest: 'Rajesh Kumar', resort: 'Serenity Goa', checkIn: '2026-09-18', checkOut: '2026-09-23', roomCharges: 42500, diningCharges: 8200, spaCharges: 5000, otherCharges: 1500, discount: 2000, taxes: 5574, total: 60774, paid: 60774, status: 'paid', method: 'Card', date: '2026-09-23' },
    { id: 'INV-002', reservationId: 'RES-002', guest: 'Anita Desai', resort: 'Serenity Goa', checkIn: '2026-09-20', checkOut: '2026-09-25', roomCharges: 75000, diningCharges: 12500, spaCharges: 8000, otherCharges: 2000, discount: 5000, taxes: 11025, total: 103525, paid: 37500, status: 'partial', method: 'UPI', date: '2026-09-20' },
  ]

  for (const inv of invoices) {
    await run(
      `INSERT INTO invoices (id, reservationId, guest, resort, checkIn, checkOut, roomCharges, diningCharges, spaCharges, otherCharges, discount, taxes, total, paid, status, method, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [inv.id, inv.reservationId, inv.guest, inv.resort, inv.checkIn, inv.checkOut, inv.roomCharges, inv.diningCharges, inv.spaCharges, inv.otherCharges, inv.discount, inv.taxes, inv.total, inv.paid, inv.status, inv.method, inv.date]
    )
  }

  // Seed Offers
  const offers = [
    { code: 'FESTIVE20', title: 'Festive Season Special', discountPercent: 20, discountAmount: 0, validFrom: '2026-09-01', validTo: '2026-10-31', minSpend: 10000, isActive: 1 },
    { code: 'LUXURY1000', title: 'Flat ₹1000 Off Suites', discountPercent: 0, discountAmount: 1000, validFrom: '2026-09-01', validTo: '2026-12-31', minSpend: 15000, isActive: 1 },
  ]

  for (const off of offers) {
    await run(
      `INSERT INTO offers (code, title, discountPercent, discountAmount, validFrom, validTo, minSpend, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [off.code, off.title, off.discountPercent, off.discountAmount, off.validFrom, off.validTo, off.minSpend, off.isActive]
    )
  }

  // Seed F&B Orders
  const fnbOrders = [
    { id: 'ORD-001', room: '101', guest: 'Rajesh Kumar', reservationId: 'RES-001', items: 'Butter Chicken, Naan x2, Lassi', amount: 1850, time: '08:15', status: 'delivered', type: 'Room Service', createdAt: '2026-09-21 08:15' },
    { id: 'ORD-002', room: 'Restaurant', guest: 'Walk-in', reservationId: null, items: 'Masala Dosa, Filter Coffee', amount: 450, time: '09:00', status: 'completed', type: 'Dine-in', createdAt: '2026-09-21 09:00' },
    { id: 'ORD-003', room: '201', guest: 'Anita Desai', reservationId: 'RES-002', items: 'Continental Breakfast, OJ', amount: 2200, time: '09:30', status: 'in-progress', type: 'Room Service', createdAt: '2026-09-21 09:30' },
  ]

  for (const ord of fnbOrders) {
    await run(
      `INSERT INTO fnb_orders (id, room, guest, reservationId, items, amount, time, status, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ord.id, ord.room, ord.guest, ord.reservationId, ord.items, ord.amount, ord.time, ord.status, ord.type, ord.createdAt]
    )
  }

  // Seed Folio Charges for initial reservations
  await run(`INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`, ['RES-001', 'Room', 'Deluxe Room — 5 Nights', 42500, '2026-09-18'])
  await run(`INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`, ['RES-001', 'Dining', 'Room Service (ORD-001)', 1850, '2026-09-21'])
  await run(`INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`, ['RES-002', 'Room', 'Premium Suite — 5 Nights', 75000, '2026-09-20'])
  await run(`INSERT INTO folio_charges (reservationId, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`, ['RES-002', 'Dining', 'Breakfast Service (ORD-003)', 2200, '2026-09-21'])

  console.log('Database seeding completed successfully!')
}
