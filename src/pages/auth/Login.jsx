import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Crown, Briefcase, UserCheck, AlertCircle, Loader2, User } from 'lucide-react'
import { resortImages } from '../../data/resortVisuals'

const DEMO_LOGINS = [
  { role: 'owner',      email: 'owner@serenityresorts.com',   password: 'owner123',   label: 'Owner',      icon: Crown,      color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { role: 'management', email: 'manager@serenityresorts.com', password: 'manager123', label: 'Management', icon: Briefcase,  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30' },
  { role: 'staff',      email: 'staff@serenityresorts.com',   password: 'staff123',   label: 'Staff',      icon: UserCheck,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
]

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) {
      const routes = { owner: '/owner', management: '/management', staff: '/staff' }
      navigate(routes[result.role] || '/staff')
    }
  }

  const quickLogin = async ({ email: e, password: p, role }) => {
    const result = await login(e, p)
    if (result.success) {
      const routes = { owner: '/owner', management: '/management', staff: '/staff' }
      navigate(routes[role] || '/staff')
    }
  }

  return (
    <div className="min-h-screen bg-dark-gradient flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${resortImages.restaurant})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-resort-dark/95 via-resort-dark/70 to-resort-slate/45" />
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold">
              <span className="text-resort-dark font-bold font-serif text-xl">S</span>
            </div>
            <div>
              <p className="font-serif text-resort-accent font-bold text-xl">Serenity Resorts</p>
              <p className="text-resort-muted text-sm">Admin &amp; Staff Portal</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 p-12">
          <p className="text-sm uppercase tracking-[0.28em] text-resort-accent mb-3">Resort and Restaurant Command Center</p>
          <blockquote className="text-3xl font-serif text-resort-text leading-relaxed mb-6 max-w-xl">
            Keep rooms, restaurants, service teams and guest moments perfectly in sync.
          </blockquote>
          <div className="flex gap-6">
            {[
              { label: 'Properties', value: '4' },
              { label: 'Rooms', value: '360' },
              { label: 'Years', value: '18' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-3xl font-bold font-serif text-resort-accent">{item.value}+</p>
                <p className="text-resort-muted text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 p-12">
          <p className="text-resort-muted text-xs">2026 Serenity Resorts Group. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
            <span className="text-resort-dark font-bold font-serif">S</span>
          </div>
          <div>
            <p className="font-serif text-resort-accent font-bold text-lg">Serenity Resorts</p>
            <p className="text-resort-muted text-xs">Admin Portal</p>
          </div>
        </div>

        <div className="w-full max-w-md luxury-card p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-resort-text font-bold">Welcome Back</h2>
            <p className="text-resort-muted mt-2">Sign in to manage stays, dining, service and revenue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-resort-text text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="luxury-input"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-resort-text text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="luxury-input pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-resort-muted hover:text-resort-text"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="luxury-btn w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-resort-border" />
              <span className="text-resort-muted text-xs">QUICK DEMO ACCESS</span>
              <div className="flex-1 h-px bg-resort-border" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_LOGINS.map(demo => (
                <button
                  key={demo.role}
                  onClick={() => quickLogin(demo)}
                  disabled={loading}
                  className={`p-3 rounded-xl border ${demo.bg} hover:opacity-80 transition-opacity text-center`}
                >
                  <demo.icon className={`w-5 h-5 mx-auto mb-1 ${demo.color}`} />
                  <p className={`text-xs font-medium ${demo.color}`}>{demo.label}</p>
                </button>
              ))}
            </div>
            <p className="text-resort-muted text-xs text-center mt-3">Click any role above to instantly access the demo portal</p>
          </div>

          {/* Guest portal link */}
          <div className="mt-6 pt-6 border-t border-resort-border text-center">
            <p className="text-resort-muted text-sm mb-2">Are you a guest?</p>
            <Link
              to="/guest/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-resort-accent/30 text-resort-accent hover:bg-resort-accent/10 transition-all text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Guest Portal - Book &amp; Manage Your Stays
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
