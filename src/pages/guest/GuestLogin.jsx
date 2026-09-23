import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, AlertCircle, Loader2, User, Sparkles, Star, Crown } from 'lucide-react'
import { resortImages } from '../../data/resortVisuals'

const DEMO_GUESTS = [
  {
    email: 'guest@serenityresorts.com',
    password: 'guest123',
    label: 'Rajesh Kumar',
    tier: 'Platinum',
    avatar: 'RK',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    icon: Crown,
  },
  {
    email: 'anita@serenityresorts.com',
    password: 'guest123',
    label: 'Anita Desai',
    tier: 'Gold',
    avatar: 'AD',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: Star,
  },
]

export default function GuestLogin() {
  const { login, register, loading, error } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [localError, setLocalError] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleLogin = async e => {
    e.preventDefault()
    setLocalError('')
    const result = await login(form.email, form.password)
    if (result.success) {
      if (result.role === 'guest') navigate('/guest')
      else navigate('/')
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setLocalError('')
    if (form.password !== form.confirm) { setLocalError('Passwords do not match.'); return }
    if (form.password.length < 6) { setLocalError('Password must be at least 6 characters.'); return }
    const result = await register(form.name, form.email, form.password, form.phone)
    if (result.success) navigate('/guest')
  }

  const quickLogin = async demo => {
    const result = await login(demo.email, demo.password)
    if (result.success) navigate('/guest')
  }

  const displayError = error || localError

  return (
    <div className="min-h-screen bg-dark-gradient flex">
      {/* ── Left Hero Panel ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden">
        {/* Background layers */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${resortImages.goa})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-resort-dark/95 via-resort-dark/70 to-resort-slate/30" />

        {/* Logo */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold">
              <span className="text-resort-dark font-bold font-serif text-xl">S</span>
            </div>
            <div>
              <p className="font-serif text-resort-accent font-bold text-xl">Serenity Resorts</p>
              <p className="text-resort-muted text-sm">Guest Portal</p>
            </div>
          </div>
        </div>

        {/* Middle content */}
        <div className="relative z-10 p-12 space-y-8">
          <div>
            <h2 className="font-serif text-4xl text-white font-bold leading-tight">
              Your Perfect<br />
              <span className="text-resort-accent">Escape Awaits</span>
            </h2>
            <p className="text-resort-muted mt-4 text-lg leading-relaxed max-w-lg">
              Discover handpicked luxury resorts, book your stay and manage all your experiences in one place.
            </p>
          </div>
          {/* Feature chips */}
          <div className="space-y-3">
            {[
              { icon: 'Beach', text: 'Beach, hill and heritage resorts across India' },
              { icon: 'Perks', text: 'Loyalty rewards - earn points on every stay' },
              { icon: 'Dine', text: 'Spa, F&B, activities and curated experiences' },
              { icon: 'Safe', text: 'Secure booking with instant confirmation' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="w-14 text-xs text-center text-resort-accent bg-resort-accent/10 border border-resort-accent/30 rounded-full py-1">{item.icon}</span>
                <span className="text-resort-muted text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div className="flex gap-8">
            {[
              { label: 'Properties', value: '4+' },
              { label: 'Happy Guests', value: '50K+' },
              { label: 'Avg. Rating', value: '4.8' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold font-serif text-resort-accent">{s.value}</p>
                <p className="text-resort-muted text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-resort-muted text-xs">2026 Serenity Resorts Group. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Form Panel ────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
            <span className="text-resort-dark font-bold font-serif">S</span>
          </div>
          <div>
            <p className="font-serif text-resort-accent font-bold text-lg">Serenity Resorts</p>
            <p className="text-resort-muted text-xs">Guest Portal</p>
          </div>
        </div>

        <div className="w-full max-w-md luxury-card p-6 lg:p-8">
          {/* Tab switcher */}
          <div className="flex gap-1 bg-resort-slate rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text'}`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-3xl text-resort-text font-bold">Welcome Back</h2>
                <p className="text-resort-muted mt-1">Sign in to your guest account</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className="luxury-input" required autoComplete="email" />
                </div>
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Password" className="luxury-input pr-10" required />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-resort-muted hover:text-resort-text">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {displayError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{displayError}</p>
                  </div>
                )}
                <button type="submit" disabled={loading} className="luxury-btn w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Quick demo access */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-resort-border" />
                  <span className="text-resort-muted text-xs uppercase tracking-wider">Demo Guest Accounts</span>
                  <div className="flex-1 h-px bg-resort-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DEMO_GUESTS.map(demo => (
                    <button key={demo.email} onClick={() => quickLogin(demo)} disabled={loading}
                      className={`p-4 rounded-xl border ${demo.bg} hover:opacity-80 transition-opacity text-left`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center">
                          <span className={`text-xs font-bold ${demo.color}`}>{demo.avatar}</span>
                        </div>
                        <demo.icon className={`w-4 h-4 ${demo.color}`} />
                      </div>
                      <p className={`text-sm font-semibold ${demo.color}`}>{demo.label}</p>
                      <p className="text-resort-muted text-xs">{demo.tier} Member</p>
                    </button>
                  ))}
                </div>
                <p className="text-resort-muted text-xs text-center mt-3">Click any guest card for instant demo access</p>
              </div>

              {/* Admin portal link */}
              <div className="mt-6 pt-6 border-t border-resort-border text-center">
                <Link to="/login" className="text-resort-accent hover:underline text-sm">
                  Staff / Admin Portal
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-3xl text-resort-text font-bold">Join Serenity</h2>
                <p className="text-resort-muted mt-1">Create your account and start earning rewards</p>
              </div>

              {/* Membership perks */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['500 Welcome Points', 'Exclusive Offers', 'Priority Booking'].map(p => (
                  <span key={p} className="flex items-center gap-1 px-2.5 py-1 bg-resort-accent/10 border border-resort-accent/30 rounded-full text-resort-accent text-xs">
                    <Sparkles className="w-3 h-3" />{p}
                  </span>
                ))}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Full Name</label>
                  <input type="text" value={form.name} onChange={set('name')} placeholder="Your full name" className="luxury-input" required />
                </div>
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className="luxury-input" required />
                </div>
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 00000" className="luxury-input" />
                </div>
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className="luxury-input pr-10" required />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-resort-muted hover:text-resort-text">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-resort-text text-sm font-medium mb-1.5">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter password" className="luxury-input" required />
                </div>
                {displayError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{displayError}</p>
                  </div>
                )}
                <button type="submit" disabled={loading} className="luxury-btn w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Creating account...' : 'Create My Account'}
                </button>
                <p className="text-resort-muted text-xs text-center">
                  By registering you agree to our Terms & Privacy Policy
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
