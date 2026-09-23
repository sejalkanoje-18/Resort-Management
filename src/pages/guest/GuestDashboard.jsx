import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { reservations, resorts } from '../../data/mockData'
import { getResortImage, resortImages } from '../../data/resortVisuals'
import { statusBadge } from '../../components/ui/Badge'
import {
  Crown, Star, Award, Sparkles, CalendarCheck, MapPin,
  ArrowRight, BedDouble, Clock, CreditCard, Heart, Gift, Phone,
  UtensilsCrossed, SprayCan, Dumbbell, ConciergeBell, CheckCircle
} from 'lucide-react'
import clsx from 'clsx'

const TIER_CONFIG = {
  Platinum: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Crown,  nextTier: null,    nextAt: null,    perks: ['Late Check-out 2 PM', 'Room Upgrade', 'Welcome Drink', 'Butler Service', 'Spa Discount 20%'] },
  Gold:     { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Star,   nextTier: 'Platinum', nextAt: 15000, perks: ['Late Check-out 1 PM', 'Room Upgrade (Subject to Availability)', 'Welcome Gift', 'Spa Discount 10%'] },
  Silver:   { color: 'text-gray-300',   bg: 'bg-gray-500/10',   border: 'border-gray-500/30',   icon: Award,  nextTier: 'Gold',    nextAt: 8000,  perks: ['Priority Check-in', 'Welcome Snack', 'Spa Discount 5%'] },
  Bronze:   { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Award,  nextTier: 'Silver',  nextAt: 3000,  perks: ['500 Welcome Points', 'Member Rates', 'Birthday Bonus Points'] },
}

const QUICK_ACTIONS = [
  { label: 'Book a Stay',       icon: BedDouble,     to: '/guest/discover',      color: 'text-resort-accent', bg: 'bg-resort-accent/10' },
  { label: 'My Reservations',   icon: CalendarCheck,  to: '/guest/reservations',  color: 'text-blue-400',      bg: 'bg-blue-500/10' },
  { label: 'My Profile',        icon: Crown,          to: '/guest/profile',       color: 'text-purple-400',    bg: 'bg-purple-500/10' },
  { label: 'Give Feedback',     icon: Heart,          to: '/guest/feedback',      color: 'text-red-400',       bg: 'bg-red-500/10' },
]

const RECENT_ACTIVITY = [
  { text: 'Checked out from Serenity Goa - Room 101', time: '3 days ago', points: '+850', icon: BedDouble },
  { text: '500 bonus points added - Anniversary offer', time: '5 days ago', points: '+500', icon: Gift },
  { text: 'Spa session - Ayurvedic Massage booked', time: '6 days ago', points: '+180', icon: Dumbbell },
  { text: 'Reservation RES-001 confirmed', time: '11 days ago', points: null, icon: CheckCircle },
]

export default function GuestDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const tier = user?.tier || 'Bronze'
  const tc = TIER_CONFIG[tier] || TIER_CONFIG.Bronze
  const TierIcon = tc.icon
  const points = user?.loyaltyPoints || 500
  const nextAt = tc.nextAt
  const progress = nextAt ? Math.min((points / nextAt) * 100, 100) : 100

  // guest's reservations
  const myRes = reservations.filter(r =>
    r.guest === user?.name || r.guestId === (user?.id === 6 ? 1 : user?.id === 7 ? 2 : -1)
  )
  const activeStay  = myRes.find(r => r.status === 'checked-in')
  const upcoming    = myRes.filter(r => r.status === 'confirmed').slice(0, 2)
  const featResorts = resorts.filter(r => r.status === 'active').slice(0, 3)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Welcome Banner ──────────────────────────── */}
      <div className="image-panel p-6 lg:p-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${resortImages.suite})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-resort-dark/95 via-resort-dark/75 to-resort-dark/25" />
        <div className="absolute top-4 right-6 opacity-20 hidden lg:block">
          <TierIcon className="w-32 h-32 text-resort-accent" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-resort-muted text-sm uppercase tracking-widest mb-1">{greeting()}</p>
            <h1 className="font-serif text-3xl lg:text-4xl text-white font-bold">{user?.name?.split(' ')[0]}</h1>
            <p className="text-resort-muted mt-2">
              {tier === 'Platinum' ? 'Welcome back, valued Platinum member. Your suite awaits.' : `You're a ${tier} member — keep earning to unlock more!`}
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border', tc.bg, tc.color, tc.border)}>
                <TierIcon className="w-3.5 h-3.5" /> {tier} Member
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-resort-accent/10 border border-resort-accent/30 rounded-full text-resort-accent text-sm font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {points.toLocaleString()} Points
              </span>
              {user?.totalVisits > 0 && (
                <span className="text-resort-muted text-sm">{user.totalVisits} stays - Rs. {(user.totalSpend / 100000).toFixed(1)}L total spend</span>
              )}
            </div>
          </div>
          <button onClick={() => navigate('/guest/discover')}
            className="luxury-btn flex items-center gap-2 whitespace-nowrap text-sm px-6 py-3 shadow-gold">
            <BedDouble className="w-4 h-4" /> Book a Stay
          </button>
        </div>
      </div>

      {/* ── Active Stay Card (if checked in) ─────────────── */}
      {activeStay && (
        <div className="luxury-card p-6 border-l-4 border-resort-accent">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Currently Staying</p>
              </div>
              <h3 className="font-serif text-xl text-resort-text font-semibold">{activeStay.resort}</h3>
              <p className="text-resort-muted mt-1">Room {activeStay.room} - {activeStay.roomType}</p>
              <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                <span className="text-resort-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Check-in: {activeStay.checkIn}
                </span>
                <span className="text-resort-muted flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5" /> Check-out: {activeStay.checkOut}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="luxury-btn text-sm px-4 py-2">Request Service</button>
              <button className="luxury-btn-outline text-sm px-4 py-2">View Bill</button>
            </div>
          </div>
          {/* In-stay quick services */}
          <div className="mt-4 pt-4 border-t border-resort-border grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Room Service', icon: UtensilsCrossed },
              { label: 'Housekeeping', icon: SprayCan },
              { label: 'Book Spa', icon: Dumbbell },
              { label: 'Concierge', icon: ConciergeBell },
            ].map(s => (
              <button key={s.label} className="flex flex-col items-center gap-1.5 p-3 bg-resort-slate hover:bg-resort-border rounded-xl transition-colors">
                <s.icon className="w-5 h-5 text-resort-accent" />
                <span className="text-resort-muted text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="luxury-card p-6">
          <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} onClick={() => navigate(a.to)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-resort-slate hover:bg-resort-border transition-colors group">
                <div className={clsx('p-2 rounded-lg', a.bg)}>
                  <a.icon className={clsx('w-4 h-4', a.color)} />
                </div>
                <span className="flex-1 text-left text-resort-text text-sm font-medium">{a.label}</span>
                <ArrowRight className="w-4 h-4 text-resort-muted group-hover:text-resort-accent transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Loyalty Status</h3>
            <TierIcon className={clsx('w-5 h-5', tc.color)} />
          </div>
          <div className={clsx('p-4 rounded-xl border mb-4', tc.bg, tc.border)}>
            <div className="flex items-center justify-between mb-1">
              <span className={clsx('font-bold text-lg font-serif', tc.color)}>{tier}</span>
              <span className={clsx('text-2xl font-bold font-serif', tc.color)}>{points.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-resort-muted mb-2">
              <span>Loyalty Points</span>
              {tc.nextTier && <span>Next: {tc.nextTier} at {tc.nextAt?.toLocaleString()} pts</span>}
            </div>
            {tc.nextTier && (
              <div className="w-full bg-resort-border rounded-full h-2">
                <div className={clsx('h-2 rounded-full transition-all',
                  tier === 'Gold' ? 'bg-yellow-400' : tier === 'Silver' ? 'bg-gray-400' : 'bg-orange-400'
                )} style={{ width: `${progress}%` }} />
              </div>
            )}
            {!tc.nextTier && (
              <p className={clsx('text-xs font-medium mt-1', tc.color)}>Highest tier achieved!</p>
            )}
          </div>
          <div>
            <p className="text-resort-muted text-xs uppercase tracking-wider mb-2">Your Perks</p>
            <ul className="space-y-1.5">
              {tc.perks.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-resort-text">
                  <span className="w-1.5 h-1.5 rounded-full bg-resort-accent" />{p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Upcoming Stays</h3>
            <button onClick={() => navigate('/guest/reservations')} className="text-resort-accent text-xs hover:underline">View all</button>
          </div>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map(r => (
                <div key={r.id} className="p-4 bg-resort-slate rounded-xl border border-resort-border hover:border-resort-accent/40 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-resort-text">{r.resort}</p>
                    {statusBadge(r.status)}
                  </div>
                  <p className="text-resort-muted text-sm">Room {r.room} - {r.roomType}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-resort-muted">
                    <span>{r.checkIn} to {r.checkOut}</span>
                    <span className="text-resort-accent font-semibold">Rs. {r.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BedDouble className="w-10 h-10 text-resort-muted mx-auto mb-2 opacity-50" />
              <p className="text-resort-muted text-sm">No upcoming stays</p>
              <button onClick={() => navigate('/guest/discover')} className="luxury-btn text-xs px-4 py-2 mt-3">
                Explore Resorts
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Featured Resorts ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-resort-text font-semibold">Featured Resorts</h3>
          <button onClick={() => navigate('/guest/discover')} className="text-resort-accent text-sm hover:underline flex items-center gap-1">
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featResorts.map(r => (
            <div key={r.id} onClick={() => navigate('/guest/discover')}
              className="luxury-card overflow-hidden group cursor-pointer hover:border-resort-accent/50 transition-all">
              {/* Hero area */}
              <div className="h-36 bg-resort-slate relative overflow-hidden">
                <img src={getResortImage(r)} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-yellow-400 text-xs font-medium">
                    <Star className="w-3 h-3 fill-yellow-400" /> {r.rating}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-resort-dark/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs px-2 py-0.5 bg-resort-accent/20 border border-resort-accent/40 rounded-full text-resort-accent">{r.category}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif text-resort-text font-semibold">{r.name}</h4>
                <p className="text-resort-muted text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{r.location}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-resort-accent font-bold">Rs. 7,500</span>
                    <span className="text-resort-muted text-xs"> / night</span>
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-resort-accent/40 text-resort-accent hover:bg-resort-accent/10 transition-colors">
                    View Rooms
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Points Activity ──────────────────────────────── */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Recent Points Activity</h3>
          <span className={clsx('text-sm font-semibold', tc.color)}>{points.toLocaleString()} pts total</span>
        </div>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-resort-border/40 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border border-resort-border bg-resort-slate flex items-center justify-center">
                  <a.icon className="w-4 h-4 text-resort-accent" />
                </span>
                <div>
                  <p className="text-resort-text text-sm">{a.text}</p>
                  <p className="text-resort-muted text-xs mt-0.5">{a.time}</p>
                </div>
              </div>
              {a.points && (
                <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap">{a.points} pts</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Special Offers Banner ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: 'Weekend Getaway', desc: 'Save 20% on 2-night stays at Serenity Coorg this weekend', cta: 'Book Now', color: 'from-teal-900/50 to-resort-navy', badge: '20% OFF' },
          { title: 'Loyalty Bonus', desc: `Earn double points on your next booking - limited time for ${tier} members`, cta: 'Explore', color: 'from-yellow-900/20 to-resort-navy', badge: '2X Points' },
        ].map(offer => (
          <div key={offer.title} className={`relative overflow-hidden rounded-2xl border border-resort-border p-6 bg-gradient-to-br ${offer.color}`}>
            <span className="inline-block px-2.5 py-0.5 bg-resort-accent/20 border border-resort-accent/40 rounded-full text-resort-accent text-xs font-bold mb-3">{offer.badge}</span>
            <h4 className="font-serif text-resort-text font-semibold text-lg">{offer.title}</h4>
            <p className="text-resort-muted text-sm mt-1 mb-4">{offer.desc}</p>
            <button onClick={() => navigate('/guest/discover')} className="luxury-btn text-sm px-4 py-2">
              {offer.cta} <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
