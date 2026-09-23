import React, { useState } from 'react'
import { Save, Building2, Bell, Shield, Globe } from 'lucide-react'

export default function OwnerSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    groupName: 'Serenity Resorts Group',
    primaryEmail: 'owner@serenityresorts.com',
    phone: '+91 98765 43200',
    website: 'www.serenityresorts.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    emailNotifs: true,
    smsNotifs: false,
    reportFreq: 'weekly',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Group Info */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-gold-500/10 rounded-lg"><Building2 className="w-5 h-5 text-gold-400" /></div>
          <h3 className="font-serif text-lg text-resort-text font-semibold">Resort Group Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Group Name</label>
            <input className="luxury-input" value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} />
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Primary Email</label>
            <input className="luxury-input" type="email" value={form.primaryEmail} onChange={e => setForm({...form, primaryEmail: e.target.value})} />
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Phone</label>
            <input className="luxury-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Website</label>
            <input className="luxury-input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-500/10 rounded-lg"><Globe className="w-5 h-5 text-blue-400" /></div>
          <h3 className="font-serif text-lg text-resort-text font-semibold">Regional Settings</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Currency</label>
            <select className="luxury-select" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Timezone</label>
            <select className="luxury-select" value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-purple-500/10 rounded-lg"><Bell className="w-5 h-5 text-purple-400" /></div>
          <h3 className="font-serif text-lg text-resort-text font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive daily summaries and alerts via email' },
            { key: 'smsNotifs', label: 'SMS Notifications', desc: 'Get critical alerts via SMS' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-resort-text font-medium">{item.label}</p>
                <p className="text-resort-muted text-sm">{item.desc}</p>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, [item.key]: !f[item.key] }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${form[item.key] ? 'bg-resort-accent' : 'bg-resort-slate'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Report Frequency</label>
            <select className="luxury-select" value={form.reportFreq} onChange={e => setForm({...form, reportFreq: e.target.value})}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="luxury-btn flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
