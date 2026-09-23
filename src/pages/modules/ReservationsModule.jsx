import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { CalendarCheck, Plus, Eye, Users, CheckCircle, Clock } from 'lucide-react'
import { reservationsApi, roomsApi, offersApi } from '../../api/client'

export default function ReservationsModule() {
  const [resList, setResList] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [availableRooms, setAvailableRooms] = useState([])

  // Form State
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [resort, setResort] = useState('Serenity Goa')
  const [roomType, setRoomType] = useState('Deluxe Room')
  const [roomNumber, setRoomNumber] = useState('')
  const [checkIn, setCheckIn] = useState('2026-09-22')
  const [checkOut, setCheckOut] = useState('2026-09-25')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [offerCode, setOfferCode] = useState('')
  const [discountInfo, setDiscountInfo] = useState(null)

  async function fetchReservations() {
    try {
      const data = await reservationsApi.getAll({ status: filterStatus, resort, search })
      setResList(data)
    } catch (err) {
      console.error('Failed to load reservations:', err)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [filterStatus, search])

  // Fetch available rooms when room type/dates change
  useEffect(() => {
    async function loadAvail() {
      try {
        const rooms = await roomsApi.getAvailable({ resort, roomType, checkIn, checkOut })
        setAvailableRooms(rooms)
        if (rooms.length > 0) setRoomNumber(rooms[0].number)
        else setRoomNumber('')
      } catch (err) {
        setAvailableRooms([])
      }
    }
    loadAvail()
  }, [resort, roomType, checkIn, checkOut])

  const handleValidateOffer = async () => {
    if (!offerCode) return
    try {
      const res = await offersApi.validate(offerCode, 25000)
      setDiscountInfo(res)
    } catch (err) {
      alert(err.message || 'Invalid promo code')
      setDiscountInfo(null)
    }
  }

  const handleCreateReservation = async () => {
    if (!guestName || !checkIn || !checkOut) {
      alert('Please fill in required fields (Guest Name, Check-in, Check-out)')
      return
    }

    try {
      await reservationsApi.create({
        guestName,
        guestEmail,
        guestPhone,
        resort,
        roomType,
        roomNumber,
        checkIn,
        checkOut,
        adults: Number(adults),
        children: Number(children),
        source: 'Direct Walk-in',
        offerCode: discountInfo ? offerCode : null,
      })
      setShowAdd(false)
      setGuestName('')
      setGuestEmail('')
      setGuestPhone('')
      fetchReservations()
    } catch (err) {
      alert(err.message || 'Failed to create reservation')
    }
  }

  const handleAction = async (action, resId) => {
    try {
      if (action === 'check-in') await reservationsApi.checkIn(resId)
      else if (action === 'check-out') await reservationsApi.checkOut(resId)
      else if (action === 'cancel') await reservationsApi.cancel(resId, 'Cancelled by receptionist')

      setSelected(null)
      fetchReservations()
    } catch (err) {
      alert(err.message || `Failed to perform ${action}`)
    }
  }

  const checkedIn = resList.filter(r => r.status === 'checked-in').length
  const confirmed = resList.filter(r => r.status === 'confirmed').length
  const pending   = resList.filter(r => r.status === 'pending').length
  const totalRev  = resList.reduce((s, r) => s + (r.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Checked In" value={checkedIn} icon={CheckCircle} color="green" />
        <StatCard title="Confirmed" value={confirmed} icon={CalendarCheck} color="blue" />
        <StatCard title="Pending" value={pending} icon={Clock} color="yellow" />
        <StatCard title="Total Revenue" value={`₹${(totalRev/100000).toFixed(1)}L`} icon={Users} color="gold" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by guest or ID..." className="w-64" />
        <select className="luxury-select w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="checked-in">Checked In</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> New Reservation
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Res. ID</th>
                <th>Guest</th>
                <th>Resort</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resList.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-resort-accent text-xs font-medium">{r.id}</td>
                  <td>
                    <div>
                      <p className="font-medium text-resort-text">{r.guest}</p>
                      <p className="text-resort-muted text-xs">Created: {r.created}</p>
                    </div>
                  </td>
                  <td className="text-resort-muted">{r.resort}</td>
                  <td>
                    <div>
                      <p>{r.room}</p>
                      <p className="text-resort-muted text-xs">{r.roomType}</p>
                    </div>
                  </td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td className="text-center">{r.nights}</td>
                  <td className="text-center">{r.adults + r.children}</td>
                  <td>
                    <div>
                      <p className="text-resort-accent font-semibold">₹{r.amount ? r.amount.toLocaleString() : 0}</p>
                      <p className="text-resort-muted text-xs">Paid: ₹{r.paid ? r.paid.toLocaleString() : 0}</p>
                    </div>
                  </td>
                  <td className="text-resort-muted text-xs">{r.source}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <button onClick={() => setSelected(r)} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Reservation ${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Guest', value: selected.guest },
                { label: 'Resort', value: selected.resort },
                { label: 'Room', value: `${selected.room} (${selected.roomType})` },
                { label: 'Check-In', value: selected.checkIn },
                { label: 'Check-Out', value: selected.checkOut },
                { label: 'Nights', value: selected.nights },
                { label: 'Adults', value: selected.adults },
                { label: 'Children', value: selected.children },
                { label: 'Amount', value: `₹${selected.amount ? selected.amount.toLocaleString() : 0}` },
                { label: 'Paid', value: `₹${selected.paid ? selected.paid.toLocaleString() : 0}` },
                { label: 'Source', value: selected.source },
                { label: 'Status', value: statusBadge(selected.status) },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <div className="text-resort-text font-medium mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              {['confirmed', 'pending'].includes(selected.status) && (
                <button onClick={() => handleAction('check-in', selected.id)} className="luxury-btn flex-1 py-2 text-sm">Check In</button>
              )}
              {selected.status === 'checked-in' && (
                <button onClick={() => handleAction('check-out', selected.id)} className="luxury-btn-outline flex-1 py-2 text-sm">Check Out</button>
              )}
              {selected.status !== 'cancelled' && selected.status !== 'checked-out' && (
                <button onClick={() => handleAction('cancel', selected.id)} className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors">Cancel</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Reservation Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Walk-In Reservation" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Guest Name *</label>
              <input className="luxury-input" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Mobile Number</label>
              <input className="luxury-input" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 98765 00000" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Email Address</label>
              <input className="luxury-input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Resort</label>
              <select className="luxury-select" value={resort} onChange={e => setResort(e.target.value)}>
                <option>Serenity Goa</option>
                <option>Serenity Coorg</option>
                <option>Serenity Manali</option>
                <option>Serenity Udaipur</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Room Type</label>
              <select className="luxury-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
                <option>Deluxe Room</option>
                <option>Premium Suite</option>
                <option>Presidential Villa</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Assign Room (Available: {availableRooms.length})</label>
              <select className="luxury-select" value={roomNumber} onChange={e => setRoomNumber(e.target.value)}>
                {availableRooms.map(r => (
                  <option key={r.number} value={r.number}>Room {r.number} (₹{r.price}/night)</option>
                ))}
                {availableRooms.length === 0 && <option value="">No Available Rooms</option>}
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-In Date</label>
              <input className="luxury-input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-Out Date</label>
              <input className="luxury-input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Adults</label>
              <input className="luxury-input" type="number" value={adults} onChange={e => setAdults(e.target.value)} min={1} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Children</label>
              <input className="luxury-input" type="number" value={children} onChange={e => setChildren(e.target.value)} min={0} />
            </div>
            <div className="col-span-2 flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-resort-muted text-sm mb-1.5">Offer / Promo Code</label>
                <input className="luxury-input" value={offerCode} onChange={e => setOfferCode(e.target.value)} placeholder="e.g. FESTIVE20" />
              </div>
              <button onClick={handleValidateOffer} className="luxury-btn-outline px-4 py-2.5 text-xs">Apply</button>
            </div>
            {discountInfo && (
              <div className="col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
                ✓ Offer applied: ₹{discountInfo.discount.toLocaleString()} discount
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateReservation} className="luxury-btn px-4 py-2">Confirm Reservation</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
