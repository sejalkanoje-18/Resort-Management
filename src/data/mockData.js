// ─── RESORTS ─────────────────────────────────────────────────────────────────
export const resorts = [
  { id: 1, name: 'Serenity Goa', location: 'Panaji, Goa', category: 'Beach', rooms: 120, rating: 4.8, status: 'active', image: '🏖️', established: '2008', manager: 'Priya Sharma', contact: '+91 98765 43210', revenue: 4850000, occupancy: 87 },
  { id: 2, name: 'Serenity Coorg', location: 'Madikeri, Coorg', category: 'Hill Station', rooms: 85, rating: 4.7, status: 'active', image: '🌿', established: '2012', manager: 'Anil Kumar', contact: '+91 98765 43211', revenue: 3200000, occupancy: 72 },
  { id: 3, name: 'Serenity Manali', location: 'Kullu Manali, HP', category: 'Mountain', rooms: 60, rating: 4.9, status: 'active', image: '🏔️', established: '2015', manager: 'Rohit Singh', contact: '+91 98765 43212', revenue: 2800000, occupancy: 91 },
  { id: 4, name: 'Serenity Udaipur', location: 'Udaipur, Rajasthan', category: 'Heritage', rooms: 95, rating: 4.6, status: 'maintenance', image: '🏰', established: '2018', manager: 'Kavitha Reddy', contact: '+91 98765 43213', revenue: 3600000, occupancy: 65 },
]

// ─── ROOMS ────────────────────────────────────────────────────────────────────
export const rooms = [
  { id: 1, number: '101', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'King', view: 'Pool View', capacity: 2, price: 8500, status: 'occupied', guest: 'Rajesh Kumar', checkIn: '2026-09-18', checkOut: '2026-09-23', amenities: ['WiFi', 'AC', 'Minibar', 'TV'] },
  { id: 2, number: '102', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Twin', view: 'Garden View', capacity: 2, price: 7500, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: ['WiFi', 'AC', 'TV'] },
  { id: 3, number: '201', type: 'Premium Suite', resort: 'Serenity Goa', floor: 2, bedType: 'King', view: 'Sea View', capacity: 3, price: 15000, status: 'occupied', guest: 'Anita Desai', checkIn: '2026-09-20', checkOut: '2026-09-25', amenities: ['WiFi', 'AC', 'Minibar', 'TV', 'Jacuzzi'] },
  { id: 4, number: '202', type: 'Premium Suite', resort: 'Serenity Goa', floor: 2, bedType: 'King', view: 'Sea View', capacity: 3, price: 15000, status: 'housekeeping', guest: null, checkIn: null, checkOut: null, amenities: ['WiFi', 'AC', 'Minibar', 'TV', 'Jacuzzi'] },
  { id: 5, number: '301', type: 'Presidential Villa', resort: 'Serenity Goa', floor: 3, bedType: 'King', view: 'Ocean View', capacity: 4, price: 35000, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: ['WiFi', 'AC', 'Minibar', 'TV', 'Private Pool', 'Butler'] },
  { id: 6, number: '103', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Queen', view: 'Garden View', capacity: 2, price: 7500, status: 'maintenance', guest: null, checkIn: null, checkOut: null, amenities: ['WiFi', 'AC', 'TV'] },
  { id: 7, number: '104', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'King', view: 'Pool View', capacity: 2, price: 8500, status: 'available', guest: null, checkIn: null, checkOut: null, amenities: ['WiFi', 'AC', 'TV', 'Minibar'] },
  { id: 8, number: '105', type: 'Deluxe Room', resort: 'Serenity Goa', floor: 1, bedType: 'Twin', view: 'Garden View', capacity: 2, price: 7500, status: 'occupied', guest: 'Kiran Bhat', checkIn: '2026-09-19', checkOut: '2026-09-22', amenities: ['WiFi', 'AC', 'TV'] },
]

// ─── RESERVATIONS ─────────────────────────────────────────────────────────────
export const reservations = [
  { id: 'RES-001', guest: 'Rajesh Kumar', guestId: 1, room: '101', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-18', checkOut: '2026-09-23', nights: 5, adults: 2, children: 0, status: 'checked-in', amount: 42500, paid: 42500, source: 'Direct', created: '2026-09-10' },
  { id: 'RES-002', guest: 'Anita Desai', guestId: 2, room: '201', roomType: 'Premium Suite', resort: 'Serenity Goa', checkIn: '2026-09-20', checkOut: '2026-09-25', nights: 5, adults: 2, children: 1, status: 'checked-in', amount: 75000, paid: 37500, source: 'Website', created: '2026-09-12' },
  { id: 'RES-003', guest: 'Mohan Iyer', guestId: 3, room: '302', roomType: 'Premium Suite', resort: 'Serenity Coorg', checkIn: '2026-09-22', checkOut: '2026-09-26', nights: 4, adults: 2, children: 2, status: 'confirmed', amount: 60000, paid: 30000, source: 'Travel Agent', created: '2026-09-14' },
  { id: 'RES-004', guest: 'Sunita Verma', guestId: 4, room: '105', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-19', checkOut: '2026-09-22', nights: 3, adults: 2, children: 0, status: 'checked-in', amount: 22500, paid: 22500, source: 'Direct', created: '2026-09-15' },
  { id: 'RES-005', guest: 'Vikram Malhotra', guestId: 5, room: '401', roomType: 'Presidential Villa', resort: 'Serenity Manali', checkIn: '2026-09-25', checkOut: '2026-09-30', nights: 5, adults: 3, children: 1, status: 'confirmed', amount: 175000, paid: 87500, source: 'Website', created: '2026-09-16' },
  { id: 'RES-006', guest: 'Priti Joshi', guestId: 6, room: '203', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-17', checkOut: '2026-09-21', nights: 4, adults: 1, children: 0, status: 'checked-out', amount: 30000, paid: 30000, source: 'OTA', created: '2026-09-09' },
  { id: 'RES-007', guest: 'Arun Kapoor', guestId: 7, room: '502', roomType: 'Heritage Suite', resort: 'Serenity Udaipur', checkIn: '2026-10-01', checkOut: '2026-10-05', nights: 4, adults: 2, children: 0, status: 'pending', amount: 80000, paid: 0, source: 'Travel Agent', created: '2026-09-18' },
  { id: 'RES-008', guest: 'Deepa Nair', guestId: 8, room: '104', roomType: 'Deluxe Room', resort: 'Serenity Goa', checkIn: '2026-09-21', checkOut: '2026-09-24', nights: 3, adults: 2, children: 1, status: 'confirmed', amount: 25500, paid: 12750, source: 'Direct', created: '2026-09-17' },
]

// ─── GUESTS ───────────────────────────────────────────────────────────────────
export const guests = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765 11111', nationality: 'Indian', dob: '1982-03-15', idType: 'Passport', idNumber: 'P1234567', tier: 'Platinum', visits: 12, totalSpend: 485000, lastVisit: '2026-09-18', preferences: ['Sea View', 'Non-Veg', 'Late Checkout'], notes: 'VIP Guest — complimentary welcome drink' },
  { id: 2, name: 'Anita Desai', email: 'anita.desai@email.com', phone: '+91 98765 22222', nationality: 'Indian', dob: '1990-07-22', idType: 'Aadhaar', idNumber: '1234-5678-9012', tier: 'Gold', visits: 6, totalSpend: 220000, lastVisit: '2026-09-20', preferences: ['High Floor', 'Veg', 'Early Check-in'], notes: '' },
  { id: 3, name: 'Mohan Iyer', email: 'mohan.iyer@email.com', phone: '+91 98765 33333', nationality: 'Indian', dob: '1975-12-01', idType: 'PAN', idNumber: 'ABCDE1234F', tier: 'Silver', visits: 3, totalSpend: 95000, lastVisit: '2026-08-10', preferences: ['Ground Floor', 'Veg'], notes: '' },
  { id: 4, name: 'Sunita Verma', email: 'sunita.verma@email.com', phone: '+91 98765 44444', nationality: 'Indian', dob: '1988-05-18', idType: 'Driving License', idNumber: 'MH01 20120001', tier: 'Gold', visits: 8, totalSpend: 310000, lastVisit: '2026-09-19', preferences: ['Pool View', 'Non-Veg'], notes: 'Celebrate anniversary on Sep 21' },
  { id: 5, name: 'Vikram Malhotra', email: 'vikram.m@email.com', phone: '+91 98765 55555', nationality: 'Indian', dob: '1979-09-30', idType: 'Passport', idNumber: 'P7654321', tier: 'Platinum', visits: 15, totalSpend: 720000, lastVisit: '2026-09-16', preferences: ['Villa', 'Non-Veg', 'Private Pool', 'Butler Service'], notes: 'CEO — ensure full privacy' },
  { id: 6, name: 'Priti Joshi', email: 'priti.j@email.com', phone: '+91 98765 66666', nationality: 'Indian', dob: '1995-01-10', idType: 'Aadhaar', idNumber: '9876-5432-1098', tier: 'Bronze', visits: 2, totalSpend: 58000, lastVisit: '2026-09-17', preferences: ['Garden View'], notes: '' },
]

// ─── HOUSEKEEPING ─────────────────────────────────────────────────────────────
export const housekeepingTasks = [
  { id: 1, room: '101', resort: 'Serenity Goa', type: 'Daily Cleaning', assignee: 'Lakshmi P', priority: 'high', status: 'in-progress', scheduled: '2026-09-21 09:00', notes: 'Guest checked in, full turndown service' },
  { id: 2, room: '201', resort: 'Serenity Goa', type: 'Turndown Service', assignee: 'Raju M', priority: 'medium', status: 'pending', scheduled: '2026-09-21 18:00', notes: '' },
  { id: 3, room: '202', resort: 'Serenity Goa', type: 'Deep Cleaning', assignee: 'Lakshmi P', priority: 'high', status: 'pending', scheduled: '2026-09-21 10:00', notes: 'Guest checked out, deep clean required' },
  { id: 4, room: '105', resort: 'Serenity Goa', type: 'Daily Cleaning', assignee: 'Meena K', priority: 'medium', status: 'completed', scheduled: '2026-09-21 08:00', notes: '' },
  { id: 5, room: '301', resort: 'Serenity Goa', type: 'Inspection', assignee: 'Meena K', priority: 'low', status: 'completed', scheduled: '2026-09-21 07:30', notes: 'Pre-arrival inspection' },
  { id: 6, room: '104', resort: 'Serenity Goa', type: 'Daily Cleaning', assignee: 'Raju M', priority: 'medium', status: 'pending', scheduled: '2026-09-21 11:00', notes: '' },
  { id: 7, room: '103', resort: 'Serenity Goa', type: 'Maintenance Check', assignee: 'Suresh N', priority: 'high', status: 'in-progress', scheduled: '2026-09-21 09:30', notes: 'AC unit not working properly' },
]

// ─── MAINTENANCE ──────────────────────────────────────────────────────────────
export const maintenanceTasks = [
  { id: 1, ticketNo: 'MNT-001', resort: 'Serenity Goa', location: 'Room 103', category: 'HVAC', issue: 'AC unit not cooling properly', priority: 'high', status: 'in-progress', assignee: 'Suresh N', reported: '2026-09-20', scheduled: '2026-09-21', notes: 'Refrigerant may need recharging' },
  { id: 2, ticketNo: 'MNT-002', resort: 'Serenity Goa', location: 'Pool Area', category: 'Plumbing', issue: 'Pool pump making noise', priority: 'medium', status: 'pending', assignee: 'Ramesh B', reported: '2026-09-19', scheduled: '2026-09-22', notes: '' },
  { id: 3, ticketNo: 'MNT-003', resort: 'Serenity Coorg', location: 'Restaurant', category: 'Electrical', issue: 'Flickering lights in dining area', priority: 'medium', status: 'resolved', assignee: 'Krishnan V', reported: '2026-09-18', scheduled: '2026-09-19', notes: 'Bulbs replaced' },
  { id: 4, ticketNo: 'MNT-004', resort: 'Serenity Goa', location: 'Lobby', category: 'General', issue: 'Water stain on ceiling', priority: 'low', status: 'pending', assignee: 'Ramesh B', reported: '2026-09-21', scheduled: '2026-09-24', notes: '' },
  { id: 5, ticketNo: 'MNT-005', resort: 'Serenity Manali', location: 'Room 201', category: 'Plumbing', issue: 'Hot water not available', priority: 'high', status: 'in-progress', assignee: 'Deepak S', reported: '2026-09-20', scheduled: '2026-09-21', notes: 'Boiler inspection needed' },
  { id: 6, ticketNo: 'MNT-006', resort: 'Serenity Udaipur', location: 'Spa', category: 'Electrical', issue: 'Sauna heater malfunction', priority: 'high', status: 'resolved', assignee: 'Mohan L', reported: '2026-09-17', scheduled: '2026-09-18', notes: 'Heating element replaced' },
]

// ─── BILLING ──────────────────────────────────────────────────────────────────
export const invoices = [
  { id: 'INV-001', reservationId: 'RES-001', guest: 'Rajesh Kumar', resort: 'Serenity Goa', checkIn: '2026-09-18', checkOut: '2026-09-23', roomCharges: 42500, diningCharges: 8200, spaCharges: 5000, otherCharges: 1500, discount: 2000, taxes: 5574, total: 60774, paid: 60774, status: 'paid', method: 'Card', date: '2026-09-23' },
  { id: 'INV-002', reservationId: 'RES-002', guest: 'Anita Desai', resort: 'Serenity Goa', checkIn: '2026-09-20', checkOut: '2026-09-25', roomCharges: 75000, diningCharges: 12500, spaCharges: 8000, otherCharges: 2000, discount: 5000, taxes: 11025, total: 103525, paid: 37500, status: 'partial', method: 'UPI', date: '2026-09-20' },
  { id: 'INV-003', reservationId: 'RES-003', guest: 'Mohan Iyer', resort: 'Serenity Coorg', checkIn: '2026-09-22', checkOut: '2026-09-26', roomCharges: 60000, diningCharges: 9000, spaCharges: 0, otherCharges: 1000, discount: 3000, taxes: 8055, total: 75055, paid: 30000, status: 'partial', method: 'Cash', date: '2026-09-22' },
  { id: 'INV-004', reservationId: 'RES-004', guest: 'Sunita Verma', resort: 'Serenity Goa', checkIn: '2026-09-19', checkOut: '2026-09-22', roomCharges: 22500, diningCharges: 4500, spaCharges: 2000, otherCharges: 500, discount: 0, taxes: 2610, total: 32110, paid: 32110, status: 'paid', method: 'Card', date: '2026-09-22' },
  { id: 'INV-005', reservationId: 'RES-007', guest: 'Arun Kapoor', resort: 'Serenity Udaipur', checkIn: '2026-10-01', checkOut: '2026-10-05', roomCharges: 80000, diningCharges: 0, spaCharges: 0, otherCharges: 0, discount: 0, taxes: 7200, total: 87200, paid: 0, status: 'pending', method: null, date: '2026-09-18' },
]

// ─── STAFF ────────────────────────────────────────────────────────────────────
export const staff = [
  { id: 1, name: 'Priya Sharma', role: 'management', title: 'General Manager', department: 'management', resort: 'Serenity Goa', email: 'manager@serenityresorts.com', phone: '+91 98765 43210', status: 'active', joinDate: '2018-06-01', shift: 'Day' },
  { id: 2, name: 'Arjun Patel', role: 'staff', title: 'Front Desk Officer', department: 'front_desk', resort: 'Serenity Goa', email: 'staff@serenityresorts.com', phone: '+91 98765 43211', status: 'active', joinDate: '2021-03-15', shift: 'Morning' },
  { id: 3, name: 'Meena Krishnan', role: 'staff', title: 'Head Housekeeper', department: 'housekeeping', resort: 'Serenity Goa', email: 'housekeeper@serenityresorts.com', phone: '+91 98765 43212', status: 'active', joinDate: '2020-09-01', shift: 'Morning' },
  { id: 4, name: 'Suresh Nair', role: 'staff', title: 'Maintenance Supervisor', department: 'maintenance', resort: 'Serenity Goa', email: 'maintenance@serenityresorts.com', phone: '+91 98765 43213', status: 'active', joinDate: '2019-12-10', shift: 'Day' },
  { id: 5, name: 'Lakshmi P', role: 'staff', title: 'Housekeeper', department: 'housekeeping', resort: 'Serenity Goa', email: 'lakshmi@serenityresorts.com', phone: '+91 98765 43214', status: 'active', joinDate: '2022-01-20', shift: 'Morning' },
  { id: 6, name: 'Raju M', role: 'staff', title: 'Housekeeper', department: 'housekeeping', resort: 'Serenity Goa', email: 'raju@serenityresorts.com', phone: '+91 98765 43215', status: 'active', joinDate: '2022-04-05', shift: 'Evening' },
  { id: 7, name: 'Ramesh B', role: 'staff', title: 'Maintenance Technician', department: 'maintenance', resort: 'Serenity Goa', email: 'ramesh@serenityresorts.com', phone: '+91 98765 43216', status: 'on-leave', joinDate: '2021-07-12', shift: 'Day' },
]

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export const auditLogs = [
  { id: 1, timestamp: '2026-09-21 09:45:12', user: 'Priya Sharma', role: 'management', action: 'UPDATE', module: 'Reservations', description: 'Updated reservation RES-002 check-out date', ip: '192.168.1.10' },
  { id: 2, timestamp: '2026-09-21 09:30:05', user: 'Arjun Patel', role: 'staff', action: 'CREATE', module: 'Guests', description: 'Created new guest profile for Deepa Nair', ip: '192.168.1.15' },
  { id: 3, timestamp: '2026-09-21 09:15:44', user: 'Rajiv Mehta', role: 'owner', action: 'VIEW', module: 'Reports', description: 'Viewed Monthly Revenue Report — September 2026', ip: '192.168.1.5' },
  { id: 4, timestamp: '2026-09-21 08:55:30', user: 'Meena Krishnan', role: 'staff', action: 'UPDATE', module: 'Housekeeping', description: 'Marked task #4 as completed for Room 105', ip: '192.168.1.20' },
  { id: 5, timestamp: '2026-09-21 08:40:22', user: 'Priya Sharma', role: 'management', action: 'CREATE', module: 'Billing', description: 'Generated invoice INV-004 for Sunita Verma', ip: '192.168.1.10' },
  { id: 6, timestamp: '2026-09-21 08:20:11', user: 'Suresh Nair', role: 'staff', action: 'UPDATE', module: 'Maintenance', description: 'Updated ticket MNT-001 status to in-progress', ip: '192.168.1.25' },
  { id: 7, timestamp: '2026-09-21 08:05:00', user: 'Rajiv Mehta', role: 'owner', action: 'LOGIN', module: 'Auth', description: 'Owner logged in successfully', ip: '192.168.1.5' },
  { id: 8, timestamp: '2026-09-20 18:30:00', user: 'Arjun Patel', role: 'staff', action: 'UPDATE', module: 'Rooms', description: 'Changed Room 202 status to Housekeeping', ip: '192.168.1.15' },
  { id: 9, timestamp: '2026-09-20 17:45:00', user: 'Priya Sharma', role: 'management', action: 'DELETE', module: 'Users', description: 'Deactivated staff account: temp_staff@serenityresorts.com', ip: '192.168.1.10' },
  { id: 10, timestamp: '2026-09-20 15:20:00', user: 'Rajiv Mehta', role: 'owner', action: 'UPDATE', module: 'Settings', description: 'Updated resort contact information for Serenity Manali', ip: '192.168.1.5' },
]

// ─── ANALYTICS DATA ───────────────────────────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Apr', revenue: 3200000, expenses: 1800000, profit: 1400000 },
  { month: 'May', revenue: 3800000, expenses: 2000000, profit: 1800000 },
  { month: 'Jun', revenue: 4200000, expenses: 2200000, profit: 2000000 },
  { month: 'Jul', revenue: 5100000, expenses: 2500000, profit: 2600000 },
  { month: 'Aug', revenue: 5800000, expenses: 2700000, profit: 3100000 },
  { month: 'Sep', revenue: 4850000, expenses: 2400000, profit: 2450000 },
]

export const occupancyData = [
  { month: 'Apr', goa: 75, coorg: 68, manali: 55, udaipur: 62 },
  { month: 'May', goa: 80, coorg: 72, manali: 60, udaipur: 68 },
  { month: 'Jun', goa: 85, coorg: 75, manali: 78, udaipur: 70 },
  { month: 'Jul', goa: 92, coorg: 80, manali: 95, udaipur: 75 },
  { month: 'Aug', goa: 90, coorg: 82, manali: 98, udaipur: 78 },
  { month: 'Sep', goa: 87, coorg: 72, manali: 91, udaipur: 65 },
]

export const bookingSourceData = [
  { name: 'Direct', value: 38, color: '#d4af37' },
  { name: 'Website', value: 28, color: '#3b82f6' },
  { name: 'OTA', value: 18, color: '#10b981' },
  { name: 'Travel Agent', value: 12, color: '#8b5cf6' },
  { name: 'Corporate', value: 4, color: '#f59e0b' },
]

export const revenueByCategory = [
  { category: 'Rooms', amount: 2850000 },
  { category: 'Dining', amount: 820000 },
  { category: 'Spa', amount: 480000 },
  { category: 'Events', amount: 350000 },
  { category: 'Activities', amount: 220000 },
  { category: 'Other', amount: 130000 },
]

export const weeklyOccupancy = [
  { day: 'Mon', rooms: 89 },
  { day: 'Tue', rooms: 85 },
  { day: 'Wed', rooms: 91 },
  { day: 'Thu', rooms: 88 },
  { day: 'Fri', rooms: 96 },
  { day: 'Sat', rooms: 100 },
  { day: 'Sun', rooms: 94 },
]
