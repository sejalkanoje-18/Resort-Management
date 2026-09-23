import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import clsx from 'clsx'
import {
  LayoutDashboard, Building2, BedDouble, CalendarCheck, Users, SprayCan,
  Wrench, Receipt, BarChart3, Settings, UserCog, ClipboardList, LogOut,
  ChevronDown, ChevronRight, Crown, Briefcase, UserCheck, Dumbbell,
  UtensilsCrossed, Leaf, CreditCard, Shield, Bell, X
} from 'lucide-react'

const ownerNav = [
  { to: '/owner', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/owner/resorts', label: 'Resort Overview', icon: Building2 },
  { to: '/owner/revenue', label: 'Revenue & P&L', icon: CreditCard },
  { to: '/owner/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/owner/staff', label: 'Staff Overview', icon: Users },
  { to: '/owner/settings', label: 'Settings', icon: Settings },
]

const managementNav = [
  { to: '/management', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/management/resorts', label: 'Resort Management', icon: Building2 },
  { to: '/management/rooms', label: 'Room Management', icon: BedDouble },
  { to: '/management/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/management/guests', label: 'Guest Management', icon: Users },
  { to: '/management/housekeeping', label: 'Housekeeping', icon: SprayCan },
  { to: '/management/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/management/billing', label: 'Billing & Payments', icon: Receipt },
  { to: '/management/reports', label: 'Reports', icon: BarChart3 },
  {
    label: 'Administration',
    icon: Shield,
    children: [
      { to: '/management/users', label: 'Users & Roles', icon: UserCog },
      { to: '/management/permissions', label: 'Permissions', icon: Shield },
      { to: '/management/audit', label: 'Audit Logs', icon: ClipboardList },
    ]
  },
  { to: '/management/settings', label: 'Settings', icon: Settings },
]

const staffNav = [
  { to: '/staff', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/front-desk', label: 'Front Desk', icon: UserCheck },
  { to: '/staff/housekeeping', label: 'Housekeeping', icon: SprayCan },
  { to: '/staff/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/staff/fnb', label: 'Food & Beverage', icon: UtensilsCrossed },
  { to: '/staff/spa', label: 'Spa & Wellness', icon: Dumbbell },
  { to: '/staff/garden', label: 'Garden & Grounds', icon: Leaf },
]

const ROLE_CONFIG = {
  owner:      { nav: ownerNav,      label: 'Owner',      icon: Crown,    color: 'text-yellow-400' },
  management: { nav: managementNav, label: 'Management', icon: Briefcase, color: 'text-blue-400' },
  staff:      { nav: staffNav,      label: 'Staff',      icon: UserCheck, color: 'text-emerald-400' },
}

function NavItem({ item, depth = 0 }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  if (item.children) {
    const anyActive = item.children.some(c => location.pathname.startsWith(c.to))
    return (
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className={clsx(
            'nav-item w-full justify-between',
            depth > 0 && 'pl-8',
            anyActive && 'text-resort-accent'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </div>
          {open || anyActive ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {(open || anyActive) && (
          <div className="ml-4 mt-1 border-l border-resort-border/50 pl-3 space-y-0.5">
            {item.children.map(child => (
              <NavItem key={child.to} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.to.split('/').length <= 2}
      className={({ isActive }) => clsx(
        'nav-item',
        depth > 0 && 'pl-6 text-xs',
        isActive && 'active'
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const config = ROLE_CONFIG[user?.role] || ROLE_CONFIG.staff
  const RoleIcon = config.icon

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        'fixed top-0 left-0 h-full w-64 bg-resort-navy border-r border-resort-border z-40 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-resort-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
                  <span className="text-resort-dark font-bold font-serif text-sm">S</span>
                </div>
                <div>
                  <p className="font-serif text-resort-accent font-semibold text-sm leading-tight">Serenity</p>
                  <p className="text-resort-muted text-xs leading-tight">Resorts</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <RoleIcon className={clsx('w-3.5 h-3.5', config.color)} />
                <span className={clsx('text-xs font-medium', config.color)}>{config.label} Portal</span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-resort-muted hover:text-resort-text">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {config.nav.map((item, i) => (
            <NavItem key={item.to || i} item={item} />
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-resort-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center">
              <span className="text-resort-accent font-semibold text-sm">{user?.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-resort-text text-sm font-medium truncate">{user?.name}</p>
              <p className="text-resort-muted text-xs truncate">{user?.title}</p>
            </div>
          </div>
          <button
            onClick={logout}
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
