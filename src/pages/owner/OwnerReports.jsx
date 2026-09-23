import React from 'react'
import OccupancyChart from '../../components/charts/OccupancyChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import RevenueCategoryChart from '../../components/charts/RevenueCategoryChart'
import RevenueChart from '../../components/charts/RevenueChart'
import { BarChart2, Download, FileText } from 'lucide-react'

const REPORT_TYPES = [
  { label: 'Monthly Revenue Report', period: 'September 2026', icon: '📊' },
  { label: 'Occupancy Analysis', period: 'Q2 2026', icon: '🏨' },
  { label: 'Guest Satisfaction Report', period: 'Sep 2026', icon: '⭐' },
  { label: 'Staff Performance Overview', period: 'Sep 2026', icon: '👥' },
  { label: 'Maintenance Cost Analysis', period: 'Sep 2026', icon: '🔧' },
  { label: 'Revenue by Category', period: 'Sep 2026', icon: '💰' },
]

export default function OwnerReports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingSourceChart />
        <RevenueCategoryChart />
      </div>

      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Available Reports</h3>
          <button className="luxury-btn flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map(r => (
            <div key={r.label} className="bg-resort-slate border border-resort-border rounded-xl p-4 flex items-start justify-between hover:border-resort-accent/40 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="text-resort-text font-medium text-sm">{r.label}</p>
                  <p className="text-resort-muted text-xs mt-0.5">{r.period}</p>
                </div>
              </div>
              <button className="p-1.5 text-resort-muted hover:text-resort-accent opacity-0 group-hover:opacity-100 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
