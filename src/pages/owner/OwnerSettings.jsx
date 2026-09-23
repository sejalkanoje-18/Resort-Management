import React, { useState } from 'react'
import { Save, Building2, Bell, Shield, Globe, CreditCard, Mail, CheckCircle2, Lock } from 'lucide-react'

export default function OwnerSettings() {
  const [activeTab, setActiveTab] = useState('group') // group, security, notifications, gateways
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    // Group Info
    groupName: 'Serenity Resorts Group',
    primaryEmail: 'owner@serenityresorts.com',
    phone: '+91 98765 43200',
    website: 'www.serenityresorts.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',

    // Security Settings
    sessionTimeoutMins: '30',
    passwordMinLength: '8',
    requireSpecialChar: true,
    enforce2FA: true,
    maxFailedAttempts: '3',

    // Notifications
    emailNotifs: true,
    smsNotifs: true,
    reportFreq: 'weekly',

    // Payment Gateways
    razorpayKeyId: 'rzp_live_9A8B7C6D5E4F',
    razorpaySecret: '••••••••••••••••••••••••',
    stripeKey: 'pk_live_51M7x8y9z0a1b2c3d',
    gatewayMode: 'live', // live or test

    // Email / SMS Gateways
    smtpHost: 'smtp.serenityresorts.com',
    smtpPort: '587',
    smtpUser: 'notifications@serenityresorts.com',
    twilioAccountSid: 'AC9876543210fedcba9876543210',
    twilioSenderId: '+18005550199'
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Sub-Tabs */}
      <div className="luxury-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-border pb-4">
          <div>
            <h3 className="font-serif text-xl text-resort-text font-bold">System Settings & Infrastructure Governance</h3>
            <p className="text-resort-muted text-xs mt-0.5">Manage group branding, security policies, payment gateways, and notification servers</p>
          </div>

          <div className="flex items-center gap-2 bg-resort-slate p-1 rounded-xl border border-resort-border overflow-x-auto">
            <button
              onClick={() => setActiveTab('group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'group' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Group Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'security' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Security Policy
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'notifications' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('gateways')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'gateways' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Payment & API Gateways
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>System settings updated successfully. Security policies and gateway parameters reloaded.</span>
          </div>
        )}

        {/* Tab 1: Group Profile */}
        {activeTab === 'group' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Group Name</label>
                <input className="luxury-input" value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Primary Email</label>
                <input className="luxury-input" type="email" value={form.primaryEmail} onChange={e => setForm({ ...form, primaryEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Contact Phone</label>
                <input className="luxury-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Group Website</label>
                <input className="luxury-input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Base Currency</label>
                <select className="luxury-select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">System Timezone</label>
                <select className="luxury-select" value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security Policy */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Session Inactivity Timeout (Minutes)</label>
                <input className="luxury-input" value={form.sessionTimeoutMins} onChange={e => setForm({ ...form, sessionTimeoutMins: e.target.value })} />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Max Failed Login Attempts</label>
                <input className="luxury-input" value={form.maxFailedAttempts} onChange={e => setForm({ ...form, maxFailedAttempts: e.target.value })} />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-resort-slate border border-resort-border rounded-xl">
                <div>
                  <p className="text-resort-text font-medium text-sm">Enforce 2-Factor Authentication (2FA)</p>
                  <p className="text-resort-muted text-xs">Require Authenticator app for Owner & Management logins</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, enforce2FA: !f.enforce2FA }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.enforce2FA ? 'bg-resort-accent' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.enforce2FA ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-resort-slate border border-resort-border rounded-xl">
                <div>
                  <p className="text-resort-text font-medium text-sm">Require Password Special Characters</p>
                  <p className="text-resort-muted text-xs">Require numbers, symbols, and uppercase letters</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, requireSpecialChar: !f.requireSpecialChar }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.requireSpecialChar ? 'bg-resort-accent' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.requireSpecialChar ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-resort-slate border border-resort-border rounded-xl">
                <div>
                  <p className="text-resort-text font-medium text-sm">Email Executive Digest</p>
                  <p className="text-resort-muted text-xs">Daily/weekly summaries of revenue & occupancy</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, emailNotifs: !f.emailNotifs }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.emailNotifs ? 'bg-resort-accent' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.emailNotifs ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-resort-slate border border-resort-border rounded-xl">
                <div>
                  <p className="text-resort-text font-medium text-sm">SMS Critical Incident Alerts</p>
                  <p className="text-resort-muted text-xs">Immediate SMS for payment failures or emergency maintenance</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, smsNotifs: !f.smsNotifs }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.smsNotifs ? 'bg-resort-accent' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.smsNotifs ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Executive Report Frequency</label>
              <select className="luxury-select" value={form.reportFreq} onChange={e => setForm({ ...form, reportFreq: e.target.value })}>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Digest</option>
                <option value="monthly">Monthly Statement</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 4: Gateways (Payment & SMS) */}
        {activeTab === 'gateways' && (
          <div className="space-y-6">
            {/* Payment Gateway */}
            <div className="space-y-4">
              <h4 className="font-serif text-base text-resort-text font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-resort-accent" /> Payment Gateway Integration (Razorpay / Stripe)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Razorpay Key ID</label>
                  <input className="luxury-input" value={form.razorpayKeyId} onChange={e => setForm({ ...form, razorpayKeyId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Razorpay Secret Key</label>
                  <input type="password" className="luxury-input" value={form.razorpaySecret} onChange={e => setForm({ ...form, razorpaySecret: e.target.value })} />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Gateway Environment</label>
                  <select className="luxury-select" value={form.gatewayMode} onChange={e => setForm({ ...form, gatewayMode: e.target.value })}>
                    <option value="live">Production (Live)</option>
                    <option value="test">Sandbox (Test Mode)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email / SMS Server */}
            <div className="space-y-4 pt-2 border-t border-resort-border/60">
              <h4 className="font-serif text-base text-resort-text font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" /> Email & SMS Gateway Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">SMTP Server Host</label>
                  <input className="luxury-input" value={form.smtpHost} onChange={e => setForm({ ...form, smtpHost: e.target.value })} />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">SMTP Port</label>
                  <input className="luxury-input" value={form.smtpPort} onChange={e => setForm({ ...form, smtpPort: e.target.value })} />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Twilio Account SID (SMS)</label>
                  <input className="luxury-input" value={form.twilioAccountSid} onChange={e => setForm({ ...form, twilioAccountSid: e.target.value })} />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">SMS Sender ID</label>
                  <input className="luxury-input" value={form.twilioSenderId} onChange={e => setForm({ ...form, twilioSenderId: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-resort-border">
          <button onClick={handleSave} className="luxury-btn flex items-center gap-2">
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </div>
    </div>
  )
}
