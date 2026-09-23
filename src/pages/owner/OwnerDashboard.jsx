import React from 'react'
import StatCard from '../../components/ui/StatCard'
import RevenueChart from '../../components/charts/RevenueChart'
import OccupancyChart from '../../components/charts/OccupancyChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import { resorts, reservations, guests } from '../../data/mockData'
import { getResortImage, resortImages } from '../../data/resortVisuals'
import { Building2, BedDouble, Users, TrendingUp, Star, Calendar, DollarSign, Activity } from 'lucide-react'
import { statusBadge } from '../../components/ui/Badge'

export default function OwnerDashboard() {
  const totalRooms = resorts.reduce((s, r) => s + r.rooms, 0)
  const totalRevenue = resorts.reduce((s, r) => s + r.revenue, 0)
  const avgOccupancy = Math.round(resorts.reduce((s, r) => s + r.occupancy, 0) / resorts.length)
  const checkedIn = reservations.filter(r => r.status === 'checked-in').length
  const recentBookings = reservations.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="image-panel min-h-[220px] p-6 lg:p-8 flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${resortImages.lobby})` }}>
        <div className="relative z-10 max-w-3xl">
          <p className="text-resort-accent text-sm uppercase tracking-[0.24em] mb-2">Portfolio Snapshot</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-bold">Resort performance with dining and stay operations in one view</h2>
          <p className="text-white/75 mt-3 max-w-2xl">Track occupancy, revenue, guest flow and property health across every Serenity destination.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (Sep)" value={`Rs. ${(totalRevenue/100000).toFixed(1)}L`} subtitle="Across all properties" icon={DollarSign} trend={12.4} trendLabel="vs Aug" color="gold" />
        <StatCard title="Avg. Occupancy" value={`${avgOccupancy}%`} subtitle="All resorts combined" icon={BedDouble} trend={3.2} trendLabel="vs Aug" color="blue" />
        <StatCard title="Active Properties" value={resorts.filter(r => r.status === 'active').length} subtitle={`${resorts.length} total resorts`} icon={Building2} color="green" />
        <StatCard title="Guests In-House" value={checkedIn * 2} subtitle={`${checkedIn} active reservations`} icon={Users} trend={8.1} trendLabel="vs last week" color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>

      {/* Resort Performance + Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resort Performance */}
        <div className="lg:col-span-2 luxury-card p-6">
          <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Resort Performance</h3>
          <div className="overflow-x-auto">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Resort</th>
                  <th>Location</th>
                  <th>Rooms</th>
                  <th>Occupancy</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resorts.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <img src={getResortImage(r)} alt={r.name} className="w-10 h-10 rounded-lg object-cover border border-resort-border" />
                        <span className="font-medium text-resort-text">{r.name}</span>
                      </div>
                    </td>
                    <td className="text-resort-muted">{r.location}</td>
                    <td>{r.rooms}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-resort-slate rounded-full h-1.5 w-16">
                          <div
                            className="bg-resort-accent h-1.5 rounded-full"
                            style={{ width: `${r.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm">{r.occupancy}%</span>
                      </div>
                    </td>
                    <td className="text-resort-accent font-medium">Rs. {(r.revenue/100000).toFixed(1)}L</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">{r.rating}</span>
                      </div>
                    </td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Source */}
        <BookingSourceChart />
      </div>

      {/* Recent Bookings */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Recent Reservations</h3>
          <span className="text-resort-muted text-sm">{reservations.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Resort</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-resort-muted text-xs">{r.id}</td>
                  <td className="font-medium text-resort-text">{r.guest}</td>
                  <td className="text-resort-muted">{r.resort}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td className="text-resort-accent font-medium">Rs. {r.amount.toLocaleString()}</td>
                  <td>{statusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
