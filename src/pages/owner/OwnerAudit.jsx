import React, { useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import { auditLogs } from '../../data/mockData'
import { ClipboardList, ShieldAlert, KeyRound, CreditCard, Sliders, Search, Filter, ShieldCheck } from 'lucide-react'

const ADDITIONAL_LOGS = [
  { id: 101, timestamp: '2026-09-23 14:10:05', user: 'Rajiv Mehta', role: 'owner', category: 'config', action: 'Update Tax Configuration', module: 'Resort Setup', description: 'Updated GST rate for Deluxe Rooms to 12% across Serenity Goa', ip: '192.168.1.10' },
  { id: 102, timestamp: '2026-09-23 13:45:22', user: 'Priya Sharma', role: 'management', category: 'payment', action: 'Process Folio Refund', module: 'Billing', description: 'Issued refund of ₹5,000 for Reservation #RES-002 (Cancellation Policy applied)', ip: '192.168.1.45' },
  { id: 103, timestamp: '2026-09-23 12:30:00', user: 'Rajiv Mehta', role: 'owner', category: 'login', action: 'Owner Login Successful', module: 'Security', description: '2FA authentication verified via Authenticator App', ip: '192.168.1.10' },
  { id: 104, timestamp: '2026-09-23 11:15:10', user: 'Suresh Nair', role: 'staff', category: 'activity', action: 'Update Maintenance Ticket', module: 'Maintenance', description: 'Marked Ticket #MNT-001 as In-Progress (Refrigerant repair)', ip: '192.168.1.78' },
  { id: 105, timestamp: '2026-09-23 10:05:40', user: 'Priya Sharma', role: 'management', category: 'config', action: 'Role Permissions Modified', module: 'Role Management', description: 'Granted Housekeeping Supervisor access to Inventory reports', ip: '192.168.1.45' },
  { id: 106, timestamp: '2026-09-22 18:20:15', user: 'Arjun Patel', role: 'staff', category: 'payment', action: 'Collect Advance Payment', module: 'Front Desk', description: 'Processed UPI Payment ₹37,500 for Reservation #RES-002', ip: '192.168.1.22' },
  { id: 107, timestamp: '2026-09-22 16:11:00', user: 'System Sentinel', role: 'system', category: 'security', action: 'Failed Login Attempt', module: 'Security', description: '3 failed password attempts for user guest@serenityresorts.com from IP 103.45.12.8', ip: '103.45.12.8' },
]

const baseLogs = (auditLogs || []).map(l => ({
  ...l,
  category: l.category || (l.module === 'Auth' ? 'login' : l.module === 'Billing' ? 'payment' : l.module === 'Settings' ? 'config' : 'activity')
}))

const COMBINED_AUDIT_LOGS = [...ADDITIONAL_LOGS, ...baseLogs]

export default function OwnerAudit() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all') // all, login, activity, payment, config, security

  const categories = [
    { id: 'all', label: 'All Event Logs', icon: ClipboardList },
    { id: 'login', label: 'Login History', icon: KeyRound },
    { id: 'activity', label: 'User Activities', icon: ShieldCheck },
    { id: 'payment', label: 'Payment Activities', icon: CreditCard },
    { id: 'config', label: 'Config Changes', icon: Sliders },
    { id: 'security', label: 'Security Alerts', icon: ShieldAlert },
  ]

  const filteredLogs = COMBINED_AUDIT_LOGS.filter(log => {
    const matchesSearch = (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
                          (log.user || '').toLowerCase().includes(search.toLowerCase()) ||
                          (log.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'all' || log.category === activeTab
    return matchesSearch && matchesTab
  })

  const loginCount = COMBINED_AUDIT_LOGS.filter(l => l.category === 'login').length
  const paymentCount = COMBINED_AUDIT_LOGS.filter(l => l.category === 'payment').length
  const configCount = COMBINED_AUDIT_LOGS.filter(l => l.category === 'config').length
  const alertCount = COMBINED_AUDIT_LOGS.filter(l => l.category === 'security').length

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Audit Logs" value={COMBINED_AUDIT_LOGS.length} subtitle="30-day Retention" icon={ClipboardList} color="blue" />
        <StatCard title="Login Events" value={loginCount} subtitle="Authenticated Sessions" icon={KeyRound} color="gold" />
        <StatCard title="Payment Audits" value={paymentCount} subtitle="Transactions & Refunds" icon={CreditCard} color="green" />
        <StatCard title="Config Updates" value={configCount} subtitle="System Rules Changed" icon={Sliders} color="purple" />
      </div>

      {/* Main Section */}
      <div className="luxury-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-border pb-4">
          <div>
            <h3 className="font-serif text-lg text-resort-text font-semibold">Audit Trail & Security Log</h3>
            <p className="text-resort-muted text-xs mt-0.5">Immutable record of system activity, user actions, financial events & configuration updates</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-resort-muted" />
            <input
              type="text"
              placeholder="Search logs by user, action..."
              className="luxury-input pl-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-resort-border/60">
          {categories.map(cat => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-resort-accent text-resort-dark shadow-md'
                    : 'bg-resort-slate/80 text-resort-muted hover:text-resort-text hover:bg-resort-slate'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Subject</th>
                <th>Category</th>
                <th>Action Performed</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Event Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-resort-muted text-xs whitespace-nowrap">{log.timestamp}</td>
                  <td>
                    <p className="font-medium text-resort-text text-sm">{log.user}</p>
                    <p className="text-resort-muted text-[11px] capitalize">{log.role}</p>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      log.category === 'login' ? 'bg-blue-500/20 text-blue-400' :
                      log.category === 'payment' ? 'bg-emerald-500/20 text-emerald-400' :
                      log.category === 'config' ? 'bg-purple-500/20 text-purple-400' :
                      log.category === 'security' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {(log.category || 'general').toUpperCase()}
                    </span>
                  </td>
                  <td className="font-medium text-resort-text text-sm">{log.action}</td>
                  <td className="text-resort-muted text-xs">{log.module}</td>
                  <td className="font-mono text-resort-muted text-xs">{log.ip}</td>
                  <td className="text-resort-muted text-xs max-w-xs truncate">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
