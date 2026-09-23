import React, { useState } from 'react'
import { Save, Building2, Bell, Shield, CreditCard, Mail, Palette, Database, Globe, CheckCircle } from 'lucide-react'

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    resortName: 'Serenity Goa',
    address: 'Calangute Beach Road, Panaji, Goa — 403516',
    phone: '+91 98765 43210',
    email: 'info@serenitygoa.com',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    taxRate: 18,
    emailNotifs: true,
    smsNotifs: true,
    lowOccupancyAlert: 50,
    maintenanceAlerts: true,
    bookingAlerts: true,
    paymentAlerts: true,
    autoInvoice: true,
    paymentGateway: 'Razorpay',
    backupFreq: 'daily',
    sessionTimeout: 30,
    twoFA: false,
    strongPwd: true,
  })

  const update = key => val => setSettings(s => ({ ...s, [key]: val }))
  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-400 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="flex gap-1 bg-resort-slate rounded-xl p-1 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="luxury-card p-6 space-y-5">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Resort Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Resort Name</label>
              <input className="luxury-input" value={settings.resortName} onChange={e => update('resortName')(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Contact Phone</label>
              <input className="luxury-input" value={settings.phone} onChange={e => update('phone')(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Address</label>
              <textarea className="luxury-input h-20 resize-none" value={settings.address} onChange={e => update('address')(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Contact Email</label>
              <input className="luxury-input" type="email" value={settings.email} onChange={e => update('email')(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Timezone</label>
              <select className="luxury-select" value={settings.timezone} onChange={e => update('timezone')(e.target.value)}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-In Time</label>
              <input className="luxury-input" type="time" value={settings.checkInTime} onChange={e => update('checkInTime')(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Check-Out Time</label>
              <input className="luxury-input" type="time" value={settings.checkOutTime} onChange={e => update('checkOutTime')(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="luxury-card p-6 space-y-5">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive daily summaries and alerts via email' },
              { key: 'smsNotifs', label: 'SMS Notifications', desc: 'Critical alerts via SMS' },
              { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'New and overdue maintenance tickets' },
              { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'New reservations and cancellations' },
              { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Payment received and outstanding balances' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-resort-slate rounded-xl">
                <div>
                  <p className="text-resort-text font-medium">{item.label}</p>
                  <p className="text-resort-muted text-sm">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settings[item.key] ? 'bg-resort-accent' : 'bg-resort-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Low Occupancy Alert Threshold (%)</label>
              <input
                className="luxury-input"
                type="number"
                min={0} max={100}
                value={settings.lowOccupancyAlert}
                onChange={e => update('lowOccupancyAlert')(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="luxury-card p-6 space-y-5">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Billing & Payment Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Currency</label>
              <select className="luxury-select" value={settings.currency} onChange={e => update('currency')(e.target.value)}>
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">GST / Tax Rate (%)</label>
              <input className="luxury-input" type="number" value={settings.taxRate} onChange={e => update('taxRate')(parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Payment Gateway</label>
              <select className="luxury-select" value={settings.paymentGateway} onChange={e => update('paymentGateway')(e.target.value)}>
                <option>Razorpay</option>
                <option>PayU</option>
                <option>Stripe</option>
                <option>CCAvenue</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-resort-slate rounded-xl">
            <div>
              <p className="text-resort-text font-medium">Auto-Generate Invoices</p>
              <p className="text-resort-muted text-sm">Automatically generate invoices on check-out</p>
            </div>
            <button
              onClick={() => toggle('autoInvoice')}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoInvoice ? 'bg-resort-accent' : 'bg-resort-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.autoInvoice ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="luxury-card p-6 space-y-5">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Security Settings</h3>
          <div className="space-y-4">
            {[
              { key: 'twoFA', label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins' },
              { key: 'strongPwd', label: 'Enforce Strong Passwords', desc: 'Min 8 chars, uppercase, number, and symbol' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-resort-slate rounded-xl">
                <div>
                  <p className="text-resort-text font-medium">{item.label}</p>
                  <p className="text-resort-muted text-sm">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settings[item.key] ? 'bg-resort-accent' : 'bg-resort-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Session Timeout (minutes)</label>
              <input
                className="luxury-input"
                type="number"
                min={5}
                value={settings.sessionTimeout}
                onChange={e => update('sessionTimeout')(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="luxury-card p-6 space-y-5">
          <h3 className="font-serif text-lg text-resort-text font-semibold">System Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Data Backup Frequency</label>
              <select className="luxury-select" value={settings.backupFreq} onChange={e => update('backupFreq')(e.target.value)}>
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-resort-slate rounded-xl">
            <p className="text-resort-text font-medium mb-1">System Information</p>
            <div className="space-y-1 text-sm text-resort-muted">
              <p>Version: Serenity Portal v1.0.0</p>
              <p>Environment: Production</p>
              <p>Last backup: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="luxury-btn-outline px-4 py-2 text-sm flex items-center gap-2">
              <Database className="w-4 h-4" /> Backup Now
            </button>
            <button className="px-4 py-2 text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              Clear Cache
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} className="luxury-btn flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}
