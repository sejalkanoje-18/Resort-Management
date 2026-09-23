import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, BedDouble, Sparkles, Crown, Star, Award } from 'lucide-react'
import clsx from 'clsx'

const PAGE_TITLES = {
  '/guest':               'My Dashboard',
  '/guest/discover':      'Explore Resorts',
  '/guest/book':          'Book a Stay',
  '/guest/reservations':  'My Reservations',
  '/guest/profile':       'My Profile',
  '/guest/feedback':      'Reviews & Feedback',
}

const TIER_CONFIG = {
  Platinum: { color: 'text-purple-400', icon: Crown },
  Gold:     { color: 'text-yellow-400', icon: Star },
  Silver:   { color: 'text-gray-300',   icon: Award },
  Bronze:   { color: 'text-orange-400', icon: Award },
}

const NOTIFICATIONS = [
  { text: 'Your booking RES-005 is confirmed for Sep 25', time: '2h ago',  type: 'booking' },
  { text: 'Earn 2x points this weekend — Serenity Coorg', time: '5h ago',  type: 'offer' },
  { text: '+2,125 points added from your last stay',       time: '3d ago',  type: 'points' },
  { text: 'Your review earned 100 bonus points!',          time: '5d ago',  type: 'points' },
]

export default function GuestTopbar({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifs, setShowNotifs] = useState(false)

  const title = PAGE_TITLES[location.pathname] || 'Guest Portal'
  const tier  = user?.tier || 'Bronze'
  const tc    = TIER_CONFIG[tier] || TIER_CONFIG.Bronze
  const TierIcon = tc.icon

  return (
    <header className="h-16 bg-resort-navy border-b border-resort-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 sticky top-0 z-20">
      <button onClick={onMenuClick}
        className="lg:hidden p-2 text-resort-muted hover:text-resort-text hover:bg-resort-slate rounded-lg transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="font-serif text-resort-text font-semibold text-lg leading-tight">{title}</h1>
        <div className="hidden sm:flex items-center gap-2">
          <TierIcon className={clsx('w-3 h-3', tc.color)} />
          <span className={clsx('text-xs font-medium', tc.color)}>{tier} Member</span>
          <span className="text-resort-muted text-xs">·</span>
          <Sparkles className="w-3 h-3 text-resort-accent" />
          <span className="text-resort-accent text-xs font-medium">{(user?.loyaltyPoints || 0).toLocaleString()} pts</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Book CTA */}
        <button onClick={() => navigate('/guest/book')}
          className="hidden sm:flex items-center gap-1.5 luxury-btn text-xs px-3 py-2">
          <BedDouble className="w-3.5 h-3.5" /> Book Now
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(v => !v)}
            className="relative p-2 text-resort-muted hover:text-resort-text hover:bg-resort-slate rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-resort-accent rounded-full" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 luxury-card shadow-luxury z-50">
              <div className="p-4 border-b border-resort-border flex items-center justify-between">
                <p className="font-semibold text-resort-text text-sm">Notifications</p>
                <span className="text-resort-accent text-xs">{NOTIFICATIONS.length} new</span>
              </div>
              <div className="divide-y divide-resort-border/50">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="p-4 hover:bg-resort-slate/50 cursor-pointer transition-colors">
                    <p className="text-resort-text text-sm">{n.text}</p>
                    <p className="text-resort-muted text-xs mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-resort-border">
                <button onClick={() => setShowNotifs(false)} className="w-full text-center text-resort-accent text-sm hover:underline">
                  View All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-resort-border">
          <div className="w-8 h-8 rounded-full bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center">
            <span className="text-resort-accent font-semibold text-xs">{user?.avatar}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-resort-text text-sm font-medium leading-tight">{user?.name?.split(' ')[0]}</p>
            <p className={clsx('text-xs leading-tight font-medium', tc.color)}>{tier}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
