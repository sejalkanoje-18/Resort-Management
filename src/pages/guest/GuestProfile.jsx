import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { statusBadge } from '../../components/ui/Badge'
import {
  Crown, Star, Award, Edit2, Save, Camera, Shield, CreditCard,
  Bell, Globe, CheckCircle, Sparkles, MapPin, Phone, Mail, Calendar, User
} from 'lucide-react'
import clsx from 'clsx'

const TIER_CONFIG = {
  Platinum: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Crown,  gradient: 'from-purple-900/30 to-resort-navy' },
  Gold:     { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Star,   gradient: 'from-yellow-900/20 to-resort-navy' },
  Silver:   { color: 'text-gray-300',   bg: 'bg-gray-500/10',   border: 'border-gray-500/30',   icon: Award,  gradient: 'from-gray-900/30 to-resort-navy' },
  Bronze:   { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Award,  gradient: 'from-orange-900/20 to-resort-navy' },
}

const PREFERENCES_OPTIONS = [
  'Sea View', 'Hill View', 'Pool View', 'Garden View', 'High Floor', 'Ground Floor',
  'Non-Veg', 'Veg', 'Vegan', 'Early Check-in', 'Late Check-out',
  'King Bed', 'Twin Beds', 'Extra Pillows', 'Quiet Room',
  'Spa Access', 'Butler Service', 'Baby Cot', 'Pet Friendly',
]

export default function GuestProfile() {
  const { user } = useAuth()
  const tier = user?.tier || 'Bronze'
  const tc = TIER_CONFIG[tier] || TIER_CONFIG.Bronze
  const TierIcon = tc.icon

  const [activeTab, setActiveTab] = useState('personal')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState(user?.preferences || [])
  const [form, setForm] = useState({
    name:        user?.name    || '',
    email:       user?.email   || '',
    phone:       user?.phone   || '',
    dob:         user?.dob     || '',
    nationality: user?.nationality || 'Indian',
    idType:      user?.idType  || 'Passport',
    idNumber:    user?.idNumber || '',
    address:     '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const togglePref = p => {
    setPrefs(pp => pp.includes(p) ? pp.filter(x => x !== p) : [...pp, p])
  }

  const tabs = [
    { id: 'personal',     label: 'Personal Info',  icon: User },
    { id: 'preferences',  label: 'Preferences',    icon: Star },
    { id: 'loyalty',      label: 'Loyalty & Perks', icon: Sparkles },
    { id: 'security',     label: 'Security',        icon: Shield },
  ]

  const stats = [
    { label: 'Total Stays',   value: user?.totalVisits || 0 },
    { label: 'Total Spend',   value: `₹${((user?.totalSpend || 0)/100000).toFixed(1)}L` },
    { label: 'Points',        value: (user?.loyaltyPoints || 0).toLocaleString() },
    { label: 'Member Since',  value: user?.memberSince?.slice(0, 7) || '2026-09' },
  ]

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-400 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* ── Profile Hero Card ────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-gradient-to-br border ${tc.border} ${tc.bg}`}
        style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${tc.gradient}`} />
        <div className="relative z-10 flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={clsx('w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center border-2 text-3xl lg:text-4xl font-bold font-serif', tc.bg, tc.border, tc.color)}>
              {user?.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-resort-accent rounded-full flex items-center justify-center shadow-gold hover:bg-gold-600 transition-colors">
              <Camera className="w-3.5 h-3.5 text-resort-dark" />
            </button>
          </div>
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-serif text-2xl lg:text-3xl text-white font-bold">{user?.name}</h2>
              <span className={clsx('flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border', tc.bg, tc.color, tc.border)}>
                <TierIcon className="w-3.5 h-3.5" /> {tier} Member
              </span>
            </div>
            <p className="text-resort-muted mt-1">{user?.email}</p>
            <p className="text-resort-muted text-sm">Member since {user?.memberSince || '2026'}</p>
            {/* Stats row */}
            <div className="flex gap-6 mt-4 flex-wrap">
              {stats.map(s => (
                <div key={s.label}>
                  <p className={clsx('font-bold text-xl font-serif', tc.color)}>{s.value}</p>
                  <p className="text-resort-muted text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setEditing(v => !v)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all', editing ? 'border-resort-accent bg-resort-accent/10 text-resort-accent' : 'border-resort-border text-resort-muted hover:text-resort-text')}>
            <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────── */}
      <div className="flex gap-1 bg-resort-slate rounded-xl p-1 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text')}>
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Personal Info ───────────────────────────── */}
      {activeTab === 'personal' && (
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name',    key: 'name',        icon: User,     type: 'text',  placeholder: 'Your full name' },
              { label: 'Email',        key: 'email',       icon: Mail,     type: 'email', placeholder: 'your@email.com' },
              { label: 'Phone',        key: 'phone',       icon: Phone,    type: 'tel',   placeholder: '+91 98765 00000' },
              { label: 'Date of Birth',key: 'dob',         icon: Calendar, type: 'date',  placeholder: '' },
              { label: 'Nationality',  key: 'nationality', icon: Globe,    type: 'text',  placeholder: 'Indian' },
              { label: 'Home Address', key: 'address',     icon: MapPin,   type: 'text',  placeholder: 'Your address' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-resort-muted text-sm mb-1.5 flex items-center gap-1.5">
                  <field.icon className="w-3.5 h-3.5" /> {field.label}
                </label>
                {editing ? (
                  <input type={field.type} className="luxury-input" value={form[field.key]} onChange={set(field.key)} placeholder={field.placeholder} />
                ) : (
                  <div className="px-4 py-2.5 bg-resort-slate rounded-lg border border-resort-border text-resort-text text-sm">
                    {form[field.key] || <span className="text-resort-muted italic">Not set</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ID Document section */}
          <div className="mt-6 pt-5 border-t border-resort-border">
            <h4 className="font-medium text-resort-text mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-resort-muted" /> Identity Document
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">ID Type</label>
                {editing ? (
                  <select className="luxury-select" value={form.idType} onChange={set('idType')}>
                    <option>Passport</option><option>Aadhaar</option><option>PAN</option><option>Driving License</option>
                  </select>
                ) : (
                  <div className="px-4 py-2.5 bg-resort-slate rounded-lg border border-resort-border text-resort-text text-sm">{form.idType || <span className="text-resort-muted italic">Not set</span>}</div>
                )}
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">ID Number</label>
                {editing ? (
                  <input className="luxury-input" value={form.idNumber} onChange={set('idNumber')} placeholder="ID number" />
                ) : (
                  <div className="px-4 py-2.5 bg-resort-slate rounded-lg border border-resort-border text-resort-text text-sm font-mono">
                    {form.idNumber ? `••••${form.idNumber.slice(-4)}` : <span className="text-resort-muted italic">Not set</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex justify-end mt-6 pt-5 border-t border-resort-border">
              <button onClick={handleSave} className="luxury-btn flex items-center gap-2 px-6 py-2.5">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Preferences ────────────────────────────── */}
      {activeTab === 'preferences' && (
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Stay Preferences</h3>
            <span className="text-resort-muted text-sm">{prefs.length} selected</span>
          </div>
          <p className="text-resort-muted text-sm mb-5">We'll use these to personalise your stay experience at all Serenity properties.</p>
          <div className="flex flex-wrap gap-3">
            {PREFERENCES_OPTIONS.map(p => (
              <button key={p} onClick={() => togglePref(p)}
                className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                  prefs.includes(p) ? 'border-resort-accent bg-resort-accent/10 text-resort-accent' : 'border-resort-border text-resort-muted hover:text-resort-text hover:border-resort-border/80')}>
                {prefs.includes(p) && <CheckCircle className="w-3.5 h-3.5" />}
                {p}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-6 pt-5 border-t border-resort-border">
            <button onClick={handleSave} className="luxury-btn flex items-center gap-2 px-6 py-2.5">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Loyalty & Perks ─────────────────────────── */}
      {activeTab === 'loyalty' && (
        <div className="space-y-4">
          {/* Current tier */}
          <div className={`luxury-card p-6 border ${tc.border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={clsx('p-3 rounded-xl', tc.bg)}>
                  <TierIcon className={clsx('w-6 h-6', tc.color)} />
                </div>
                <div>
                  <p className={clsx('font-serif text-xl font-bold', tc.color)}>{tier} Member</p>
                  <p className="text-resort-muted text-sm">Since {user?.memberSince || '2026'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={clsx('font-bold text-3xl font-serif', tc.color)}>{(user?.loyaltyPoints || 0).toLocaleString()}</p>
                <p className="text-resort-muted text-sm">Loyalty Points</p>
              </div>
            </div>
            {/* Tier benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {[
                'Late Check-out', 'Room Upgrade', 'Welcome Gift', 'Priority Support',
                'Spa Discount', 'Birthday Bonus', 'Member-only Rates', 'Early Access to Deals'
              ].slice(0, tier === 'Platinum' ? 8 : tier === 'Gold' ? 6 : tier === 'Silver' ? 4 : 2).map(b => (
                <div key={b} className="flex items-center gap-2 text-sm text-resort-text">
                  <CheckCircle className={clsx('w-4 h-4 flex-shrink-0', tc.color)} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Tier roadmap */}
          <div className="luxury-card p-6">
            <h4 className="font-serif text-resort-text font-semibold mb-4">Membership Tiers</h4>
            <div className="space-y-3">
              {[
                { name: 'Bronze',   points: '0',     icon: Award,  color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { name: 'Silver',   points: '3,000', icon: Award,  color: 'text-gray-300',   bg: 'bg-gray-500/10' },
                { name: 'Gold',     points: '8,000', icon: Star,   color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { name: 'Platinum', points: '15,000',icon: Crown,  color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map(t => (
                <div key={t.name} className={clsx('flex items-center justify-between p-4 rounded-xl border',
                  t.name === tier ? `${tc.bg} ${tc.border}` : 'border-resort-border bg-resort-slate/50')}>
                  <div className="flex items-center gap-3">
                    <div className={clsx('p-2 rounded-lg', t.bg)}>
                      <t.icon className={clsx('w-4 h-4', t.color)} />
                    </div>
                    <div>
                      <p className={clsx('font-semibold', t.color)}>{t.name}</p>
                      <p className="text-resort-muted text-xs">{t.points}+ points</p>
                    </div>
                  </div>
                  {t.name === tier && <span className="text-xs px-2 py-1 bg-resort-accent/20 text-resort-accent rounded-full font-medium">Current</span>}
                </div>
              ))}
            </div>
          </div>

          {/* How to earn */}
          <div className="luxury-card p-6">
            <h4 className="font-serif text-resort-text font-semibold mb-3">How to Earn Points</h4>
            <div className="space-y-2">
              {[
                { action: 'Room Booking',       earn: '1 pt per ₹10 spent' },
                { action: 'Spa Services',        earn: '1.5 pts per ₹10 spent' },
                { action: 'Dining',              earn: '1 pt per ₹10 spent' },
                { action: 'Refer a Friend',      earn: '500 pts per referral' },
                { action: 'Complete Profile',    earn: '100 pts' },
                { action: 'Birthday Month Stay', earn: '2x points' },
              ].map(e => (
                <div key={e.action} className="flex items-center justify-between py-2.5 border-b border-resort-border/40 last:border-0 text-sm">
                  <span className="text-resort-muted">{e.action}</span>
                  <span className="text-resort-accent font-medium">{e.earn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Security ────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-5">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Current Password</label>
                <input type="password" className="luxury-input" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">New Password</label>
                <input type="password" className="luxury-input" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Confirm New Password</label>
                <input type="password" className="luxury-input" placeholder="Re-enter new password" />
              </div>
              <button className="luxury-btn flex items-center gap-2 px-6 py-2.5">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
          </div>

          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Booking Confirmations',     desc: 'Email & SMS on new reservations' },
                { label: 'Check-in Reminders',        desc: '24 hours before your stay' },
                { label: 'Promotional Offers',        desc: 'Deals & exclusive member offers' },
                { label: 'Loyalty Points Updates',    desc: 'Earn & expiry notifications' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-resort-slate rounded-xl">
                  <div>
                    <p className="text-resort-text font-medium text-sm">{item.label}</p>
                    <p className="text-resort-muted text-xs">{item.desc}</p>
                  </div>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${i < 2 ? 'bg-resort-accent' : 'bg-resort-border'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${i < 2 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
