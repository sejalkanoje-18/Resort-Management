import React, { useState } from 'react'
import OccupancyChart from '../../components/charts/OccupancyChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import RevenueCategoryChart from '../../components/charts/RevenueCategoryChart'
import RevenueChart from '../../components/charts/RevenueChart'
import { BarChart2, Download, Calendar, Filter, FileText, CheckCircle2 } from 'lucide-react'

const REPORT_TEMPLATES = [
  { id: 'rep-1', label: 'Executive Financial Summary', period: 'Monthly / YTD', category: 'Revenue', icon: '💰' },
  { id: 'rep-2', label: 'Occupancy & ADR Analysis', period: 'Weekly / Monthly', category: 'Occupancy', icon: '🏨' },
  { id: 'rep-3', label: 'Guest Demographics & Retention', period: 'Monthly', category: 'Guests', icon: '👥' },
  { id: 'rep-4', label: 'Cancellation & Refund Report', period: 'Monthly', category: 'Financial', icon: '🔄' },
  { id: 'rep-5', label: 'Service Revenue Breakdown (F&B/Spa)', period: 'Weekly', category: 'Services', icon: '🍷' },
  { id: 'rep-6', label: 'Tax Collection & Filing Report', period: 'Quarterly', category: 'Compliance', icon: '📄' },
]

export default function OwnerReports() {
  const [period, setPeriod] = useState('monthly') // daily, weekly, monthly, yearly
  const [downloading, setDownloading] = useState(null)
  const [notification, setNotification] = useState('')

  const handleExport = (title) => {
    setDownloading(title)
    setTimeout(() => {
      setDownloading(null)
      setNotification(`Report "${title}" successfully generated and downloaded as CSV!`)
      setTimeout(() => setNotification(''), 4000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="luxury-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-resort-text font-bold">Business Intelligence & Analytics Reports</h3>
          <p className="text-resort-muted text-xs mt-0.5">Filter trends across daily, weekly, monthly, and yearly historical operational periods</p>
        </div>

        {/* Time Period Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-resort-slate p-1 rounded-xl border border-resort-border self-start sm:self-auto">
          {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-resort-accent text-resort-dark shadow'
                  : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingSourceChart />
        <RevenueCategoryChart />
      </div>

      {/* Report Templates Grid */}
      <div className="luxury-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-resort-border pb-3">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Available Exportable Reports</h3>
          <button
            onClick={() => handleExport('Complete Owner Portfolio Package')}
            className="luxury-btn flex items-center gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Full Audit Package
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map(r => (
            <div
              key={r.id}
              className="bg-resort-slate/80 border border-resort-border rounded-xl p-4 flex items-start justify-between hover:border-resort-accent/40 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="text-resort-text font-medium text-sm">{r.label}</p>
                  <p className="text-resort-muted text-xs mt-0.5">{r.period} • {period.toUpperCase()} view</p>
                </div>
              </div>

              <button
                onClick={() => handleExport(r.label)}
                disabled={downloading === r.label}
                className="p-2 bg-resort-navy rounded-lg border border-resort-border text-resort-muted hover:text-resort-accent hover:border-resort-accent transition-all text-xs flex items-center gap-1"
              >
                {downloading === r.label ? (
                  <span className="w-3.5 h-3.5 border-2 border-resort-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
