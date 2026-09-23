import React, { useState } from 'react'
import RevenueChart from '../../components/charts/RevenueChart'
import OccupancyChart from '../../components/charts/OccupancyChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import RevenueCategoryChart from '../../components/charts/RevenueCategoryChart'
import StatCard from '../../components/ui/StatCard'
import { BarChart2, Download, TrendingUp, TrendingDown, Users, Star } from 'lucide-react'
import { weeklyOccupancy } from '../../data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState('revenue')

  const tabs = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'occupancy', label: 'Occupancy' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'guests', label: 'Guests' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Sep Revenue" value="₹48.5L" trend={12.4} trendLabel="vs Aug" icon={TrendingUp} color="gold" />
        <StatCard title="Avg. Occupancy" value="79%" trend={3.2} trendLabel="vs Aug" icon={BarChart2} color="blue" />
        <StatCard title="Reservations" value="156" trend={8.1} trendLabel="vs Aug" icon={Users} color="green" />
        <StatCard title="Avg. Rating" value="4.75" trend={0.2} trendLabel="vs Aug" icon={Star} color="purple" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-resort-slate rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-resort-accent text-resort-dark'
                : 'text-resort-muted hover:text-resort-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <RevenueCategoryChart />
        </div>
      )}
      {activeTab === 'occupancy' && (
        <div className="space-y-6">
          <OccupancyChart />
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Weekly Room Usage (Serenity Goa)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyOccupancy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3558" />
                <XAxis dataKey="day" stroke="#8892b0" fontSize={12} />
                <YAxis stroke="#8892b0" fontSize={12} domain={[0, 120]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e2340', border: '1px solid #2e3558', borderRadius: '12px' }}
                  labelStyle={{ color: '#d4af37' }}
                />
                <Bar dataKey="rooms" name="Rooms Occupied" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingSourceChart />
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Reservations', value: 156, change: '+12%' },
                { label: 'Check-ins This Month', value: 98, change: '+8%' },
                { label: 'Check-outs This Month', value: 94, change: '+6%' },
                { label: 'Cancellations', value: 7, change: '-3%' },
                { label: 'No-shows', value: 2, change: '-1%' },
                { label: 'Average Stay Duration', value: '4.2 nights', change: '+0.3' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-resort-slate rounded-xl">
                  <span className="text-resort-muted text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-resort-text">{item.value}</span>
                    <span className={`text-xs ${item.change.startsWith('+') ? 'text-emerald-400' : item.change.startsWith('-') && item.label !== 'Cancellations' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'guests' && (
        <div className="luxury-card p-6">
          <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Guest Analytics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'New Guests', value: 42, pct: '27%' },
              { label: 'Returning Guests', value: 114, pct: '73%' },
              { label: 'Platinum Members', value: 18, pct: '12%' },
              { label: 'Gold Members', value: 35, pct: '22%' },
            ].map(item => (
              <div key={item.label} className="bg-resort-slate rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-resort-accent font-serif">{item.value}</p>
                <p className="text-resort-muted text-sm mt-1">{item.label}</p>
                <p className="text-resort-text text-xs mt-0.5">{item.pct} of total</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <h4 className="text-resort-text font-medium">Guest Satisfaction</h4>
            {[
              { category: 'Overall Experience', score: 4.8 },
              { category: 'Room Cleanliness', score: 4.9 },
              { category: 'Food Quality', score: 4.6 },
              { category: 'Staff Service', score: 4.7 },
              { category: 'Value for Money', score: 4.4 },
            ].map(item => (
              <div key={item.category} className="flex items-center gap-4">
                <span className="text-resort-muted text-sm w-40">{item.category}</span>
                <div className="flex-1 bg-resort-slate rounded-full h-2">
                  <div
                    className="bg-resort-accent rounded-full h-2"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-resort-text font-semibold text-sm w-8">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-resort-text font-semibold">Export Reports</h3>
            <p className="text-resort-muted text-sm mt-1">Download reports in various formats</p>
          </div>
          <div className="flex gap-3">
            <button className="luxury-btn-outline flex items-center gap-2 text-sm px-4 py-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="luxury-btn flex items-center gap-2 text-sm px-4 py-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
