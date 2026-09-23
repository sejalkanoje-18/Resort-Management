import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'
import {
  LayoutDashboard, Compass, BedDouble, CalendarCheck,
  User, MessageSquare, LogOut, X, Crown, Star, Award, Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/guest',            label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/guest/discover',   label: 'Explore Resorts',  icon: Compass },
  { to: '/guest/book',       label: 'Book a Stay',      icon: BedDouble },
  { to: '/guest/reservations', label: 'My Reservations', icon: CalendarCheck },
  { to: '/guest/profile',    label: 'My Profile',       icon: User },
  { to: '/guest/feedback',   label: 'Reviews & Feedback', icon: MessageSquare },
]

const TIER_CONFIG = {
  Platinum: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Crown },
  Gold:     { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Star  },
  Silver:   { color: 'text-gray-300',   bg: 'bg-gray-500/10',   icon: Award },
  Bronze:   { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: Award },
}

export default function GuestSidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const tier = user?.tier || 'Bronze'
  const tc = TIER_CONFIG[tier] || TIER_CONFIG.Bronze
  const TierIcon = tc.icon

  const handleLogout = () => {
    logout()
    navigate('/guest/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={clsx(
        'fixed top-0 left-0 h-full w-64 bg-resort-navy border-r border-resort-border z-40 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-resort-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold">
                <span className="text-resort-dark font-bold font-serif text-sm">S</span>
              </div>
              <div>
                <p className="font-serif text-resort-accent font-semibold text-sm leading-tight">Serenity</p>
                <p className="text-resort-muted text-xs leading-tight">Guest Portal</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-resort-muted hover:text-resort-text">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => clsx(
                'nav-item',
                isActive && 'active'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Loyalty tier mini card */}
        <div className="p-3 flex-shrink-0">
          <div className={clsx('rounded-xl p-3 border border-resort-border mb-3', tc.bg)}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TierIcon className={clsx('w-4 h-4', tc.color)} />
                <span className={clsx('text-xs font-semibold', tc.color)}>{tier} Member</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-resort-accent" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-resort-muted text-xs">Points</span>
              <span className={clsx('font-bold text-sm', tc.color)}>{(user?.loyaltyPoints || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-resort-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center flex-shrink-0">
              <span className="text-resort-accent font-semibold text-sm">{user?.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-resort-text text-sm font-medium truncate">{user?.name}</p>
              <p className="text-resort-muted text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-resort-muted hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
