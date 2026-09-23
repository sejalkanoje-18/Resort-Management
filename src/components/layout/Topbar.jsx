import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/owner': 'Owner Dashboard',
  '/owner/resorts': 'Resort Overview',
  '/owner/revenue': 'Revenue & P&L',
  '/owner/reports': 'Reports & Analytics',
  '/owner/staff': 'Staff Overview',
  '/owner/settings': 'Settings',
  '/management': 'Management Dashboard',
  '/management/resorts': 'Resort Management',
  '/management/rooms': 'Room Management',
  '/management/reservations': 'Reservations',
  '/management/guests': 'Guest Management',
  '/management/housekeeping': 'Housekeeping',
  '/management/maintenance': 'Maintenance',
  '/management/billing': 'Billing & Payments',
  '/management/reports': 'Reports',
  '/management/users': 'Users & Roles',
  '/management/permissions': 'Permissions',
  '/management/audit': 'Audit Logs',
  '/management/settings': 'Settings',
  '/staff': 'Staff Dashboard',
  '/staff/front-desk': 'Front Desk',
  '/staff/housekeeping': 'Housekeeping',
  '/staff/maintenance': 'Maintenance',
  '/staff/fnb': 'Food & Beverage',
  '/staff/spa': 'Spa & Wellness',
  '/staff/garden': 'Garden & Grounds',
}

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Room 202 ready for inspection', time: '5m ago', type: 'housekeeping' },
  { id: 2, text: 'New reservation: Arun Kapoor — Oct 1', time: '12m ago', type: 'booking' },
  { id: 3, text: 'Maintenance ticket MNT-002 assigned', time: '1h ago', type: 'maintenance' },
  { id: 4, text: 'Invoice INV-002 payment pending', time: '2h ago', type: 'billing' },
]

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation()
  const [showNotifs, setShowNotifs] = useState(false)

  const title = PAGE_TITLES[location.pathname] || 'Admin Portal'
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="h-16 bg-resort-navy border-b border-resort-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-resort-muted hover:text-resort-text hover:bg-resort-slate rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="font-serif text-resort-text font-semibold text-lg leading-tight">{title}</h1>
        <p className="text-resort-muted text-xs hidden sm:block">{today}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(v => !v)}
            className="relative p-2 text-resort-muted hover:text-resort-text hover:bg-resort-slate rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 luxury-card shadow-luxury z-50">
              <div className="p-4 border-b border-resort-border">
                <p className="font-semibold text-resort-text text-sm">Notifications</p>
              </div>
              <div className="divide-y divide-resort-border/50">
                {MOCK_NOTIFICATIONS.map(n => (
                  <div key={n.id} className="p-4 hover:bg-resort-slate/50 cursor-pointer transition-colors">
                    <p className="text-resort-text text-sm">{n.text}</p>
                    <p className="text-resort-muted text-xs mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-resort-border">
                <button
                  onClick={() => setShowNotifs(false)}
                  className="w-full text-center text-resort-accent text-sm hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-resort-border">
          <div className="w-8 h-8 rounded-full bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center">
            <span className="text-resort-accent font-semibold text-xs">{user?.avatar}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-resort-text text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-resort-muted text-xs leading-tight">{user?.resort}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
