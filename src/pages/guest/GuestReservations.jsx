import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { reservations } from '../../data/mockData'
import { statusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import {
  CalendarCheck, MapPin, BedDouble, Clock, CheckCircle,
  XCircle, Download, ArrowRight, Star, Sparkles, ReceiptText
} from 'lucide-react'
import clsx from 'clsx'

// Guest's reservations (matched by name for demo)
const GUEST_RESERVATIONS = [
  {
    id: 'RES-001', resort: 'Serenity Goa', resortImg: '🏖️', room: '101', roomType: 'Deluxe Room',
    checkIn: '2026-09-18', checkOut: '2026-09-23', nights: 5, adults: 2, children: 0,
    amount: 42500, paid: 42500, status: 'checked-in', source: 'Direct',
    confirmDate: '2026-09-10', pointsEarned: 2125,
    services: ['Spa: Ayurvedic Massage — ₹4,500', 'Dining: In-room dinner — ₹2,800'],
  },
  {
    id: 'RES-005', resort: 'Serenity Manali', resortImg: '🏔️', room: '401', roomType: 'Presidential Villa',
    checkIn: '2026-09-25', checkOut: '2026-09-30', nights: 5, adults: 2, children: 0,
    amount: 175000, paid: 87500, status: 'confirmed', source: 'Website',
    confirmDate: '2026-09-16', pointsEarned: 8750,
    services: [],
  },
  {
    id: 'RES-PAST-1', resort: 'Serenity Coorg', resortImg: '🌿', room: '205', roomType: 'Premium Suite',
    checkIn: '2026-08-10', checkOut: '2026-08-14', nights: 4, adults: 2, children: 1,
    amount: 60000, paid: 60000, status: 'checked-out', source: 'Direct',
    confirmDate: '2026-08-01', pointsEarned: 3000,
    services: ['Spa: Couple Package — ₹9,000', 'Adventure: Trekking — ₹3,500'],
  },
  {
    id: 'RES-PAST-2', resort: 'Serenity Goa', resortImg: '🏖️', room: '301', roomType: 'Premium Suite',
    checkIn: '2026-06-20', checkOut: '2026-06-25', nights: 5, adults: 2, children: 0,
    amount: 75000, paid: 75000, status: 'checked-out', source: 'Website',
    confirmDate: '2026-06-10', pointsEarned: 3750,
    services: ['Beach Cabana — ₹5,000', 'Spa — ₹8,000'],
  },
]

const TABS = [
  { id: 'all',       label: 'All' },
  { id: 'active',    label: 'Active' },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'past',      label: 'Past' },
]

export default function GuestReservations() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  const filtered = GUEST_RESERVATIONS.filter(r => {
    if (tab === 'active')   return r.status === 'checked-in'
    if (tab === 'upcoming') return r.status === 'confirmed'
    if (tab === 'past')     return r.status === 'checked-out' || r.status === 'cancelled'
    return true
  })

  const totalPoints = GUEST_RESERVATIONS.reduce((s, r) => s + r.pointsEarned, 0)
  const totalSpend  = GUEST_RESERVATIONS.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.paid, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Stays',     value: GUEST_RESERVATIONS.length, icon: CalendarCheck, color: 'text-blue-400',    bg: 'bg-blue-500/10' },
          { label: 'Active Stay',     value: GUEST_RESERVATIONS.filter(r => r.status === 'checked-in').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Spend',     value: `₹${(totalSpend/100000).toFixed(1)}L`, icon: ReceiptText, color: 'text-resort-accent', bg: 'bg-resort-accent/10' },
          { label: 'Points Earned',   value: totalPoints.toLocaleString(), icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className="luxury-card p-5 flex items-center gap-4">
            <div className={clsx('p-3 rounded-xl', s.bg)}>
              <s.icon className={clsx('w-5 h-5', s.color)} />
            </div>
            <div>
              <p className="text-resort-muted text-xs uppercase tracking-wider">{s.label}</p>
              <p className={clsx('text-xl font-bold font-serif mt-0.5', s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Book button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-resort-slate rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text')}>
              {t.label}
              <span className="ml-1.5 text-xs opacity-70">
                ({GUEST_RESERVATIONS.filter(r => t.id === 'all' ? true : t.id === 'active' ? r.status === 'checked-in' : t.id === 'upcoming' ? r.status === 'confirmed' : r.status === 'checked-out').length})
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/guest/book')} className="luxury-btn flex items-center gap-2 text-sm px-5 py-2.5">
          <BedDouble className="w-4 h-4" /> New Booking
        </button>
      </div>

      {/* Reservation cards */}
      {filtered.length === 0 ? (
        <div className="luxury-card p-16 text-center">
          <CalendarCheck className="w-12 h-12 text-resort-muted opacity-40 mx-auto mb-3" />
          <p className="text-resort-text font-medium">No reservations found</p>
          <p className="text-resort-muted text-sm mt-1">Start planning your next escape</p>
          <button onClick={() => navigate('/guest/discover')} className="luxury-btn mt-4 px-6 py-2.5 text-sm">
            Explore Resorts
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(res => (
            <div key={res.id} className={clsx('luxury-card overflow-hidden transition-all hover:border-resort-accent/40',
              res.status === 'checked-in' && 'border-l-4 border-emerald-500')}>
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-resort-slate rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {res.resortImg}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-serif text-lg text-resort-text font-semibold">{res.resort}</p>
                        {statusBadge(res.status)}
                        {res.status === 'checked-in' && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            In-house
                          </span>
                        )}
                      </div>
                      <p className="text-resort-muted text-sm">
                        {res.roomType} · Room {res.room} · {res.adults} adult{res.adults > 1 ? 's' : ''}{res.children > 0 ? ` · ${res.children} child` : ''}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        <span className="text-resort-muted text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {res.checkIn}
                        </span>
                        <ArrowRight className="w-3 h-3 text-resort-muted" />
                        <span className="text-resort-muted text-sm">{res.checkOut}</span>
                        <span className="text-resort-muted text-sm">({res.nights} nights)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-resort-accent font-bold text-lg">₹{res.amount.toLocaleString()}</p>
                    <p className="text-resort-muted text-xs">Paid: ₹{res.paid.toLocaleString()}</p>
                    {res.paid < res.amount && (
                      <p className="text-red-400 text-xs">Due: ₹{(res.amount - res.paid).toLocaleString()}</p>
                    )}
                    <p className="text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" /> +{res.pointsEarned} pts
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-resort-border/50 flex-wrap">
                  <button onClick={() => setSelected(res)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-resort-border hover:bg-resort-slate text-resort-muted hover:text-resort-text text-sm transition-colors">
                    View Details
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-resort-border hover:bg-resort-slate text-resort-muted hover:text-resort-text text-sm transition-colors">
                    <Download className="w-3.5 h-3.5" /> Invoice
                  </button>
                  {res.status === 'checked-out' && (
                    <button onClick={() => navigate('/guest/feedback', { state: { reservation: res } })}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-resort-accent/30 bg-resort-accent/5 text-resort-accent text-sm transition-colors hover:bg-resort-accent/10">
                      <Star className="w-3.5 h-3.5" /> Leave Review
                    </button>
                  )}
                  {res.status === 'confirmed' && (
                    <button onClick={() => setCancelTarget(res)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors ml-auto">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                  {res.status === 'checked-in' && (
                    <button className="luxury-btn text-sm px-4 py-1.5 ml-auto">Request Service</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Reservation ${selected?.id}`} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-resort-slate rounded-xl">
              <span className="text-4xl">{selected.resortImg}</span>
              <div>
                <p className="font-serif text-xl text-resort-text font-semibold">{selected.resort}</p>
                <div className="mt-1">{statusBadge(selected.status)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Room Type',   value: selected.roomType },
                { label: 'Room No.',    value: selected.room },
                { label: 'Check-in',    value: selected.checkIn },
                { label: 'Check-out',   value: selected.checkOut },
                { label: 'Nights',      value: selected.nights },
                { label: 'Adults',      value: selected.adults },
                { label: 'Total',       value: `₹${selected.amount.toLocaleString()}` },
                { label: 'Paid',        value: `₹${selected.paid.toLocaleString()}` },
                { label: 'Points',      value: `+${selected.pointsEarned}` },
                { label: 'Booked via',  value: selected.source },
                { label: 'Confirmed',   value: selected.confirmDate },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-resort-text font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.services.length > 0 && (
              <div>
                <p className="text-resort-muted text-sm font-medium mb-2">Add-on Services</p>
                <div className="space-y-1.5">
                  {selected.services.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-resort-text">
                      <span className="text-resort-accent">✦</span>{s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button className="luxury-btn flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                <Download className="w-4 h-4" /> Download Invoice
              </button>
              {selected.status === 'checked-out' && (
                <button onClick={() => { setSelected(null); navigate('/guest/feedback') }}
                  className="luxury-btn-outline flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                  <Star className="w-4 h-4" /> Review Stay
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel confirm */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelTarget(null)} />
          <div className="relative luxury-card p-6 max-w-md w-full animate-fade-in">
            <h3 className="font-serif text-xl text-resort-text font-semibold mb-2">Cancel Reservation?</h3>
            <p className="text-resort-muted text-sm mb-5">
              Are you sure you want to cancel <strong>{cancelTarget.id}</strong> at {cancelTarget.resort}?
              Cancellation charges may apply as per policy.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} className="luxury-btn-outline flex-1 py-2">Keep Booking</button>
              <button onClick={() => setCancelTarget(null)} className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
