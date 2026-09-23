import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { resorts, rooms } from '../../data/mockData'
import { getResortImage } from '../../data/resortVisuals'
import { statusBadge } from '../../components/ui/Badge'
import {
  CalendarCheck, Users, BedDouble, CreditCard, CheckCircle,
  ChevronRight, MapPin, Star, ArrowLeft, Loader2, Gift, Sparkles
} from 'lucide-react'
import clsx from 'clsx'

const STEPS = ['Select Room', 'Guest Details', 'Review & Pay', 'Confirmation']

const ROOM_TYPES = [
  { type: 'Deluxe Room',      price: 7500,  capacity: 2, view: 'Pool/Garden View', emoji: '🛏️',  points: 750  },
  { type: 'Premium Suite',    price: 15000, capacity: 3, view: 'Sea/Hill View',     emoji: '🏷️',  points: 1500 },
  { type: 'Presidential Villa', price: 35000, capacity: 4, view: 'Ocean/Valley View', emoji: '🏡', points: 3500 },
]

export default function GuestBooking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const preselected = location.state || {}

  const [step, setStep] = useState(preselected.room ? 1 : 0)
  const [selectedResort, setSelectedResort] = useState(preselected.resort || resorts[0])
  const [selectedRoom, setSelectedRoom]     = useState(preselected.room ? ROOM_TYPES.find(r => r.type === preselected.room.type) || ROOM_TYPES[0] : null)
  const [checkIn,  setCheckIn]  = useState(preselected.checkIn  || '')
  const [checkOut, setCheckOut] = useState(preselected.checkOut || '')
  const [numGuests, setNumGuests] = useState(preselected.guests || 2)
  const [usePoints, setUsePoints] = useState(false)
  const [payMethod, setPayMethod] = useState('card')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [guestDetails, setGuestDetails] = useState({
    name: user?.name || '', email: '', phone: user?.phone || '',
    specialReq: '', earlyCheckIn: false, lateCheckOut: tier() === 'Platinum' || tier() === 'Gold',
  })

  function tier() { return user?.tier || 'Bronze' }
  function setGD(k) { return e => setGuestDetails(d => ({ ...d, [k]: e.target.value })) }
  function toggleGD(k) { setGuestDetails(d => ({ ...d, [k]: !d[k] })) }

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 3
  const roomPrice   = selectedRoom ? selectedRoom.price * nights : 0
  const discount    = usePoints ? Math.min(user?.loyaltyPoints || 0, 5000) / 10 : 0
  const taxes       = Math.round((roomPrice - discount) * 0.18)
  const total       = roomPrice - discount + taxes
  const earnPoints  = selectedRoom ? selectedRoom.points * nights : 0
  const confId      = `RES-${Date.now().toString().slice(-4)}`

  const handleBook = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="luxury-card p-8 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-serif text-3xl text-resort-text font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-resort-muted mb-6">Your reservation has been confirmed. See you soon!</p>

          {/* Confirmation card */}
          <div className="bg-resort-slate rounded-2xl p-6 text-left mb-6 border border-resort-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-resort-muted text-xs uppercase tracking-wider">Confirmation ID</p>
                <p className="font-mono text-resort-accent font-bold text-lg">{confId}</p>
              </div>
              <img src={getResortImage(selectedResort)} alt={selectedResort.name} className="w-16 h-16 rounded-xl object-cover border border-resort-border" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-resort-muted text-xs">Resort</p><p className="text-resort-text font-medium">{selectedResort.name}</p></div>
              <div><p className="text-resort-muted text-xs">Room</p><p className="text-resort-text font-medium">{selectedRoom?.type}</p></div>
              <div><p className="text-resort-muted text-xs">Check-in</p><p className="text-resort-text font-medium">{checkIn || 'TBD'}</p></div>
              <div><p className="text-resort-muted text-xs">Check-out</p><p className="text-resort-text font-medium">{checkOut || 'TBD'}</p></div>
              <div><p className="text-resort-muted text-xs">Guests</p><p className="text-resort-text font-medium">{numGuests}</p></div>
              <div><p className="text-resort-muted text-xs">Total Paid</p><p className="text-resort-accent font-bold">Rs. {total.toLocaleString()}</p></div>
            </div>
          </div>

          {/* Points earned */}
          <div className="flex items-center justify-center gap-2 p-4 bg-resort-accent/10 border border-resort-accent/30 rounded-xl mb-6">
            <Sparkles className="w-5 h-5 text-resort-accent" />
            <p className="text-resort-accent font-semibold">You earned <span className="text-xl font-bold font-serif">{earnPoints}</span> loyalty points!</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/guest/reservations')} className="luxury-btn flex-1 py-3">View My Reservations</button>
            <button onClick={() => navigate('/guest')} className="luxury-btn-outline flex-1 py-3">Back to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Progress stepper */}
      <div className="luxury-card p-5">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all',
                  i < step  ? 'bg-resort-accent border-resort-accent text-resort-dark' :
                  i === step ? 'border-resort-accent text-resort-accent bg-resort-accent/10' :
                  'border-resort-border text-resort-muted')}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={clsx('text-xs font-medium hidden sm:block', i === step ? 'text-resort-accent' : 'text-resort-muted')}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('flex-1 h-0.5 mx-2', i < step ? 'bg-resort-accent' : 'bg-resort-border')} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Step 0: Select Room ───────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="luxury-card p-6">
            <h3 className="font-serif text-xl text-resort-text font-semibold mb-4">Choose Your Stay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Resort</label>
                <select className="luxury-select" value={selectedResort.id}
                  onChange={e => setSelectedResort(resorts.find(r => r.id === Number(e.target.value)))}>
                  {resorts.filter(r => r.status === 'active').map(r => (
                    <option key={r.id} value={r.id}>{r.name} — {r.location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Guests</label>
                <select className="luxury-select" value={numGuests} onChange={e => setNumGuests(Number(e.target.value))}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Check-in</label>
                <input type="date" className="luxury-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Check-out</label>
                <input type="date" className="luxury-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
            </div>
          </div>

          <h3 className="font-serif text-xl text-resort-text font-semibold px-1">Select Room Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROOM_TYPES.filter(r => r.capacity >= numGuests).map(room => (
              <div key={room.type} onClick={() => setSelectedRoom(room)}
                className={clsx('luxury-card p-5 cursor-pointer transition-all hover:border-resort-accent/60', selectedRoom?.type === room.type ? 'border-resort-accent bg-resort-accent/5 shadow-gold' : 'hover:border-resort-border')}>
                <div className="flex items-start justify-between mb-3">
                  <BedDouble className="w-10 h-10 text-resort-accent" />
                  {selectedRoom?.type === room.type && <CheckCircle className="w-5 h-5 text-resort-accent" />}
                </div>
                <h4 className="font-serif text-resort-text font-semibold">{room.type}</h4>
                <p className="text-resort-muted text-sm mt-1">{room.view}</p>
                <p className="text-resort-muted text-sm">Up to {room.capacity} guests</p>
                <div className="mt-4 pt-3 border-t border-resort-border/50">
                  <p className="text-resort-accent font-bold text-xl">Rs. {room.price.toLocaleString()}<span className="text-resort-muted font-normal text-sm">/night</span></p>
                  <p className="text-resort-muted text-xs mt-0.5">+{room.points} pts/night</p>
                  {nights > 1 && <p className="text-resort-text text-sm font-medium mt-1">Rs. {(room.price * nights).toLocaleString()} for {nights} nights</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(1)} disabled={!selectedRoom}
              className={clsx('luxury-btn flex items-center gap-2 px-8 py-3', !selectedRoom && 'opacity-50 cursor-not-allowed')}>
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 1: Guest Details ─────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="luxury-card p-6">
            <h3 className="font-serif text-xl text-resort-text font-semibold mb-5">Guest Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Full Name</label>
                <input className="luxury-input" value={guestDetails.name} onChange={setGD('name')} placeholder="Full name as on ID" required />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Email</label>
                <input className="luxury-input" type="email" value={guestDetails.email} onChange={setGD('email')} placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Phone</label>
                <input className="luxury-input" value={guestDetails.phone} onChange={setGD('phone')} placeholder="+91 98765 00000" />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Special Requests</label>
                <input className="luxury-input" value={guestDetails.specialReq} onChange={setGD('specialReq')} placeholder="e.g. Sea view, anniversary" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { key: 'earlyCheckIn', label: 'Request Early Check-in (Subject to availability)' },
                { key: 'lateCheckOut', label: `Request Late Check-out${tier() === 'Platinum' ? ' - Complimentary for Platinum' : tier() === 'Gold' ? ' - Complimentary for Gold' : ' (Rs. 1,500 charge may apply)'}` },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={guestDetails[item.key]} onChange={() => toggleGD(item.key)} className="accent-resort-accent w-4 h-4" />
                  <span className="text-resort-text text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-between">
            <button onClick={() => setStep(0)} className="luxury-btn-outline flex items-center gap-2 px-6 py-2.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(2)} className="luxury-btn flex items-center gap-2 px-8 py-3">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Review & Pay ──────────────────────────── */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="luxury-card p-6">
              <h3 className="font-serif text-xl text-resort-text font-semibold mb-4">Booking Summary</h3>
              <div className="flex items-start gap-4 p-4 bg-resort-slate rounded-xl mb-4">
                <img src={getResortImage(selectedResort)} alt={selectedResort.name} className="w-16 h-16 rounded-xl object-cover border border-resort-border" />
                <div>
                  <h4 className="font-serif text-resort-text font-semibold">{selectedResort.name}</h4>
                  <p className="text-resort-muted text-sm">{selectedResort.location}</p>
                  <p className="text-resort-muted text-sm">{selectedRoom?.type} · {numGuests} guest{numGuests > 1 ? 's' : ''}</p>
                  <p className="text-resort-muted text-sm">{checkIn || 'TBD'} → {checkOut || 'TBD'} ({nights} nights)</p>
                </div>
              </div>
              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                {[
                  { label: `Rs. ${selectedRoom?.price.toLocaleString()} x ${nights} nights`, amount: roomPrice },
                  usePoints ? { label: `Loyalty Points Redemption (${Math.min(user?.loyaltyPoints || 0, 5000)} pts)`, amount: -discount, neg: true } : null,
                  { label: 'GST & Taxes (18%)', amount: taxes },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-resort-border/40">
                    <span className="text-resort-muted">{row.label}</span>
                    <span className={row.neg ? 'text-emerald-400' : 'text-resort-text'}>{row.neg ? '-' : ''}Rs. {Math.abs(row.amount).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 bg-resort-accent/10 rounded-xl px-4 mt-2">
                  <span className="font-bold text-resort-text font-serif text-lg">Total Amount</span>
                  <span className="font-bold text-resort-accent text-2xl font-serif">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              {/* Points toggle */}
              {(user?.loyaltyPoints || 0) > 0 && (
                <label className="flex items-center justify-between mt-4 p-3 bg-resort-slate rounded-xl cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-resort-accent" />
                    <span className="text-resort-text text-sm">Use {Math.min(user.loyaltyPoints, 5000)} loyalty points (save Rs. {(Math.min(user.loyaltyPoints, 5000) / 10).toFixed(0)})</span>
                  </div>
                  <button onClick={() => setUsePoints(v => !v)}
                    className={clsx('relative w-10 h-5 rounded-full transition-colors', usePoints ? 'bg-resort-accent' : 'bg-resort-border')}>
                    <span className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', usePoints ? 'translate-x-5' : 'translate-x-0.5')} />
                  </button>
                </label>
              )}
              {/* Points to earn */}
              <div className="flex items-center gap-2 mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">You'll earn <strong>{earnPoints}</strong> loyalty points on this booking</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="lg:col-span-2 space-y-4">
            <div className="luxury-card p-6">
              <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3 mb-5">
                {[
                  { id: 'card',  label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'upi',   label: 'UPI (GPay, PhonePe)', icon: '📱' },
                  { id: 'net',   label: 'Net Banking',          icon: '🏦' },
                  { id: 'wallet',label: 'Wallet / Paytm',       icon: '👛' },
                ].map(pm => (
                  <label key={pm.id} className={clsx('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    payMethod === pm.id ? 'border-resort-accent bg-resort-accent/5' : 'border-resort-border hover:border-resort-border/80')}>
                    <input type="radio" name="pay" value={pm.id} checked={payMethod === pm.id} onChange={() => setPayMethod(pm.id)} className="accent-resort-accent" />
                    <span className="text-lg">{pm.icon}</span>
                    <span className="text-resort-text text-sm">{pm.label}</span>
                  </label>
                ))}
              </div>
              {payMethod === 'card' && (
                <div className="space-y-3 mb-5">
                  <input className="luxury-input" placeholder="Card number" />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="luxury-input" placeholder="MM/YY" />
                    <input className="luxury-input" placeholder="CVV" />
                  </div>
                  <input className="luxury-input" placeholder="Cardholder name" />
                </div>
              )}
              {payMethod === 'upi' && (
                <input className="luxury-input mb-5" placeholder="Enter UPI ID (e.g. name@upi)" />
              )}
              <button onClick={handleBook} disabled={loading}
                className="luxury-btn w-full flex items-center justify-center gap-2 py-3 text-base">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {loading ? 'Processing...' : `Pay Rs. ${total.toLocaleString()}`}
              </button>
              <p className="text-resort-muted text-xs text-center mt-3">🔒 Secured with 256-bit SSL encryption</p>
            </div>
            <button onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 text-resort-muted hover:text-resort-text text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
