import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { CalendarCheck, Plus, Eye, Users, CheckCircle, Clock, Edit3, XCircle, Key, Copy, Tag, History, ExternalLink } from 'lucide-react'
import { reservationsApi, roomsApi, offersApi } from '../../api/client'
import { useNavigate } from 'react-router-dom'

export default function ReservationsModule() {
  const navigate = useNavigate()
  const [resList, setResList] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [availableRooms, setAvailableRooms] = useState([])
  const [allOffers, setAllOffers] = useState([])

  // Modal states for Flow Chart operations
  const [showCredsModal, setShowCredsModal] = useState(false)
  const [createdCreds, setCreatedCreds] = useState(null)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [copiedCreds, setCopiedCreds] = useState(false)

  // Form State
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [resort, setResort] = useState('Serenity Goa')
  const [roomType, setRoomType] = useState('Deluxe Room')
  const [roomNumber, setRoomNumber] = useState('')
  const [checkIn, setCheckIn] = useState('2026-09-24')
  const [checkOut, setCheckOut] = useState('2026-09-27')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [offerCode, setOfferCode] = useState('')
  const [discountInfo, setDiscountInfo] = useState(null)

  // Modify form state
  const [modCheckIn, setModCheckIn] = useState('')
  const [modCheckOut, setModCheckOut] = useState('')
  const [modRoom, setModRoom] = useState('')
  const [modAdults, setModAdults] = useState(2)
  const [modChildren, setModChildren] = useState(0)

  async function fetchReservations() {
    try {
      const data = await reservationsApi.getAll({ status: filterStatus, resort, search })
      setResList(data || [])
    } catch (err) {
      console.error('Failed to load reservations:', err)
    }
  }

  async function fetchOffers() {
    try {
      const offers = await offersApi.getAll()
      setAllOffers(offers.filter(o => o.isActive === 1))
    } catch (err) {
      setAllOffers([])
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchOffers()
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

  const handleValidateOffer = async (codeToUse) => {
    const code = codeToUse || offerCode
    if (!code) return
    try {
      const res = await offersApi.validate(code, 25000)
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
      const created = await reservationsApi.create({
        guestName,
        guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        guestPhone: guestPhone || '+91 98765 00000',
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

      // Set credentials to trigger Step 4/5 flowchart output: "Create Guest Account & Issue Login Credentials"
      setCreatedCreds({
        resId: created.id,
        guestName,
        email: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        password: 'guest123',
        room: created.room,
        resort: created.resort,
      })
      setShowCredsModal(true)

      setGuestName('')
      setGuestEmail('')
      setGuestPhone('')
      setOfferCode('')
      setDiscountInfo(null)
      fetchReservations()
    } catch (err) {
      alert(err.message || 'Failed to create reservation')
    }
  }

  const handleAction = async (action, resId) => {
    try {
      if (action === 'check-in') await reservationsApi.checkIn(resId)
      else if (action === 'check-out') await reservationsApi.checkOut(resId)
      else if (action === 'no-show') await reservationsApi.noShow(resId)

      setSelected(null)
      fetchReservations()
    } catch (err) {
      alert(err.message || `Failed to perform ${action}`)
    }
  }

  const handleConfirmCancel = async () => {
    if (!selected) return
    try {
      await reservationsApi.cancel(selected.id, cancelReason || 'Cancelled by receptionist')
      setShowCancelModal(false)
      setSelected(null)
      fetchReservations()
    } catch (err) {
      alert(err.message || 'Failed to cancel reservation')
    }
  }

  const handleConfirmModify = async () => {
    if (!selected) return
    try {
      // If dates extended
      if (modCheckOut !== selected.checkOut) {
        const diffDays = Math.max(1, Math.ceil((new Date(modCheckOut) - new Date(selected.checkOut)) / (1000 * 60 * 60 * 24)))
        await reservationsApi.extend(selected.id, diffDays)
      }
      setShowModifyModal(false)
      setSelected(null)
      fetchReservations()
    } catch (err) {
      alert(err.message || 'Failed to modify reservation')
    }
  }

  const handleCopyCredsText = () => {
    if (!createdCreds) return
    const text = `Serenity Resorts - Guest Portal Login:\nEmail: ${createdCreds.email}\nPassword: ${createdCreds.password}\nResort: ${createdCreds.resort}`
    navigator.clipboard.writeText(text)
    setCopiedCreds(true)
    setTimeout(() => setCopiedCreds(false), 2000)
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search guest name, room or RES ID..." className="w-64" />
        <select className="luxury-select w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="checked-in">Checked In</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> New Walk-In Reservation
        </button>
      </div>

      {/* Reservation Table */}
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
                      <p className="font-medium">{r.room}</p>
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
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(r)} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {['confirmed', 'pending'].includes(r.status) && (
                        <button
                          onClick={() => {
                            setSelected(r)
                            setModCheckIn(r.checkIn)
                            setModCheckOut(r.checkOut)
                            setModRoom(r.room)
                            setModAdults(r.adults)
                            setModChildren(r.children)
                            setShowModifyModal(true)
                          }}
                          className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-blue-400 transition-colors"
                          title="Modify Reservation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      <Modal open={!!selected && !showModifyModal && !showCancelModal && !showHistoryModal} onClose={() => setSelected(null)} title={`Reservation ${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Guest', value: selected.guest },
                { label: 'Resort', value: selected.resort },
                { label: 'Room', value: `${selected.room} (${selected.roomType})` },
                { label: 'Check-In', value: selected.checkIn },
                { label: 'Check-Out', value: selected.checkOut },
                { label: 'Nights', value: selected.nights },
                { label: 'Adults / Children', value: `${selected.adults} Adults, ${selected.children} Children` },
                { label: 'Total Amount', value: `₹${selected.amount ? selected.amount.toLocaleString() : 0}` },
                { label: 'Amount Paid', value: `₹${selected.paid ? selected.paid.toLocaleString() : 0}` },
                { label: 'Source', value: selected.source },
                { label: 'Status', value: statusBadge(selected.status) },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <div className="text-resort-text font-medium mt-1">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap pt-2">
              {['confirmed', 'pending'].includes(selected.status) && (
                <button onClick={() => handleAction('check-in', selected.id)} className="luxury-btn flex-1 py-2 text-sm">Front Desk Check In</button>
              )}
              {selected.status === 'checked-in' && (
                <button onClick={() => handleAction('check-out', selected.id)} className="luxury-btn-outline flex-1 py-2 text-sm">Front Desk Check Out</button>
              )}
              {['confirmed', 'pending'].includes(selected.status) && (
                <button onClick={() => handleAction('no-show', selected.id)} className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 text-sm font-medium">Mark No-Show</button>
              )}
              {selected.status !== 'cancelled' && selected.status !== 'checked-out' && (
                <button onClick={() => setShowCancelModal(true)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium">Cancel Reservation</button>
              )}
              <button onClick={() => setShowHistoryModal(true)} className="px-3 py-2 rounded-lg bg-resort-slate text-resort-muted hover:text-resort-text text-sm font-medium flex items-center gap-1">
                <History className="w-4 h-4" /> History
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Walk-in Reservation Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Manual / Walk-In Reservation" size="lg">
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
              <input className="luxury-input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="guest@example.com" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Resort Location</label>
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

            {/* Step 12: Offers & Promotions selector */}
            <div className="col-span-2 space-y-2">
              <label className="block text-resort-muted text-sm flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" /> Apply Offer / Promo Package
              </label>
              <div className="flex gap-2">
                <select
                  className="luxury-select flex-1"
                  value={offerCode}
                  onChange={e => {
                    setOfferCode(e.target.value)
                    if (e.target.value) handleValidateOffer(e.target.value)
                    else setDiscountInfo(null)
                  }}
                >
                  <option value="">-- No Offer Selected --</option>
                  {allOffers.map(o => (
                    <option key={o.code} value={o.code}>
                      {o.code} - {o.title} ({o.discountPercent > 0 ? `${o.discountPercent}% OFF` : `₹${o.discountAmount} OFF`})
                    </option>
                  ))}
                </select>
                <input
                  className="luxury-input w-36 uppercase font-mono"
                  placeholder="Code"
                  value={offerCode}
                  onChange={e => setOfferCode(e.target.value.toUpperCase())}
                />
                <button onClick={() => handleValidateOffer(offerCode)} className="luxury-btn-outline px-4 text-xs">Apply</button>
              </div>
            </div>

            {discountInfo && (
              <div className="col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center justify-between">
                <span>✓ Offer {discountInfo.offer?.code} applied!</span>
                <span className="font-bold">Save ₹{discountInfo.discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateReservation} className="luxury-btn px-4 py-2">Confirm Reservation & Issue Credentials</button>
          </div>
        </div>
      </Modal>

      {/* Guest Credentials Issued Modal (Flow Chart Step 4 -> Guest Module unlock) */}
      <Modal open={showCredsModal} onClose={() => setShowCredsModal(false)} title="Guest Account & Credentials Issued">
        {createdCreds && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 via-resort-navy to-resort-navy border border-amber-500/40 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-resort-text text-base">Guest Account Unlocked!</h4>
                  <p className="text-resort-muted text-xs">Guest can log into the Guest Portal to view booking & request add-ons.</p>
                </div>
              </div>

              <div className="bg-resort-slate p-3 rounded-lg space-y-2 font-mono text-sm border border-resort-border">
                <div className="flex justify-between">
                  <span className="text-resort-muted">Guest Name:</span>
                  <span className="text-resort-text font-medium">{createdCreds.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-resort-muted">Username / Email:</span>
                  <span className="text-resort-accent font-semibold">{createdCreds.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-resort-muted">Temp Password:</span>
                  <span className="text-emerald-400 font-semibold">{createdCreds.password}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleCopyCredsText} className="luxury-btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" /> {copiedCreds ? 'Copied to Clipboard!' : 'Copy Guest Credentials'}
              </button>
              <button onClick={() => { setShowCredsModal(false); navigate('/guest/login'); }} className="luxury-btn flex-1 py-2 text-sm flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Switch to Guest Portal
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modify Reservation Modal */}
      <Modal open={showModifyModal} onClose={() => setShowModifyModal(false)} title={`Modify Reservation ${selected?.id}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-In</label>
              <input className="luxury-input" type="date" value={modCheckIn} onChange={e => setModCheckIn(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-Out</label>
              <input className="luxury-input" type="date" value={modCheckOut} onChange={e => setModCheckOut(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Adults</label>
              <input className="luxury-input" type="number" value={modAdults} onChange={e => setModAdults(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Children</label>
              <input className="luxury-input" type="number" value={modChildren} onChange={e => setModChildren(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowModifyModal(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleConfirmModify} className="luxury-btn px-4 py-2">Save Modifications</button>
          </div>
        </div>
      </Modal>

      {/* Cancel Reservation Modal */}
      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} title={`Cancel Reservation ${selected?.id}`}>
        <div className="space-y-4">
          <p className="text-resort-muted text-sm">Please state the cancellation reason for guest <span className="text-resort-text font-bold">{selected?.guest}</span>:</p>
          <textarea
            className="luxury-input h-24 resize-none"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            placeholder="e.g. Guest travel plans changed / Weather cancellation"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowCancelModal(false)} className="luxury-btn-outline px-4 py-2">Keep Booking</button>
            <button onClick={handleConfirmCancel} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 rounded-xl text-sm font-semibold">Confirm Cancellation</button>
          </div>
        </div>
      </Modal>

      {/* Reservation History Modal */}
      <Modal open={showHistoryModal} onClose={() => setShowHistoryModal(false)} title={`Reservation History — ${selected?.id}`}>
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              { time: selected?.created || '2026-09-24 10:00', event: 'Reservation Created (Walk-in)', actor: 'Receptionist' },
              { time: selected?.checkIn || '2026-09-24 14:00', event: `Status updated to ${selected?.status}`, actor: 'System Auto Log' },
            ].map((h, i) => (
              <div key={i} className="p-3 bg-resort-slate rounded-xl text-sm flex items-start justify-between">
                <div>
                  <p className="font-semibold text-resort-text">{h.event}</p>
                  <p className="text-resort-muted text-xs">By {h.actor}</p>
                </div>
                <span className="text-resort-muted text-xs font-mono">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
