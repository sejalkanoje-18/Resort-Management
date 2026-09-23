import React from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard'
import RevenueChart from '../../components/charts/RevenueChart'
import OccupancyChart from '../../components/charts/OccupancyChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import { resorts, reservations, monthlyRevenue } from '../../data/mockData'
import { getResortImage, resortImages } from '../../data/resortVisuals'
import { Building2, BedDouble, Users, TrendingUp, Star, DollarSign, Activity, XCircle, ArrowUpRight, Shield, CreditCard, Sliders, BarChart3, ClipboardList } from 'lucide-react'
import { statusBadge } from '../../components/ui/Badge'

export default function OwnerDashboard() {
  const totalRooms = resorts.reduce((s, r) => s + r.rooms, 0)
  const totalRevenue = resorts.reduce((s, r) => s + r.revenue, 0)
  const totalExpenses = monthlyRevenue.reduce((s, m) => s + m.expenses, 0) / monthlyRevenue.length
  const avgOccupancy = Math.round(resorts.reduce((s, r) => s + r.occupancy, 0) / resorts.length)
  const checkedIn = reservations.filter(r => r.status === 'checked-in').length
  const recentBookings = reservations.slice(0, 5)

  // Executive KPI Calculations
  const cancellationRate = 3.8 // 3.8%
  const adr = 9250 // Average Daily Rate (₹)
  const revPar = Math.round(adr * (avgOccupancy / 100)) // RevPAR

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="image-panel min-h-[200px] p-6 lg:p-8 flex items-end bg-cover bg-center rounded-2xl relative overflow-hidden"
        style={{ backgroundImage: `url(${resortImages.lobby})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-resort-accent text-xs font-semibold uppercase tracking-[0.24em] mb-1.5">Executive Oversight Portal</p>
          <h2 className="font-serif text-2xl lg:text-4xl text-white font-bold">Portfolio Performance & Group Management</h2>
          <p className="text-white/80 text-sm mt-2 max-w-2xl">
            Real-time control across financial visibility, resort configuration, account security, and operational KPIs.
          </p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (Sep)" value={`₹${(totalRevenue/100000).toFixed(1)}L`} subtitle="Across 4 properties" icon={DollarSign} trend={12.4} trendLabel="vs Aug" color="gold" />
        <StatCard title="Average Occupancy" value={`${avgOccupancy}%`} subtitle={`${totalRooms} total rooms`} icon={BedDouble} trend={3.2} trendLabel="vs Aug" color="blue" />
        <StatCard title="Cancellation Rate" value={`${cancellationRate}%`} subtitle="Low risk profile" icon={XCircle} trend={-1.2} trendLabel="vs Aug (Improved)" color="green" />
        <StatCard title="RevPAR / ADR" value={`₹${revPar.toLocaleString()}`} subtitle={`ADR: ₹${adr.toLocaleString()}`} icon={TrendingUp} trend={5.8} trendLabel="vs last month" color="purple" />
      </div>

      {/* Quick Access to 8 Oversights Modules */}
      <div className="luxury-card p-5">
        <h3 className="text-xs uppercase tracking-wider text-resort-muted font-semibold mb-3">Oversight Navigation & Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/owner/resorts" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <Building2 className="w-5 h-5 mx-auto text-resort-accent mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Resort Setup</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Policies & Taxes</p>
          </Link>

          <Link to="/owner/permissions" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <Shield className="w-5 h-5 mx-auto text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Roles & Access</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Permission Grid</p>
          </Link>

          <Link to="/owner/accounts" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <Users className="w-5 h-5 mx-auto text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Accounts</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Create & Activate</p>
          </Link>

          <Link to="/owner/revenue" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <CreditCard className="w-5 h-5 mx-auto text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Financial P&L</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Revenues & Taxes</p>
          </Link>

          <Link to="/owner/reports" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <BarChart3 className="w-5 h-5 mx-auto text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Business Reports</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Daily & Monthly</p>
          </Link>

          <Link to="/owner/audit" className="p-3 bg-resort-slate border border-resort-border rounded-xl hover:border-resort-accent/50 transition-all text-center group">
            <ClipboardList className="w-5 h-5 mx-auto text-teal-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-resort-text font-medium text-xs">Audit & Security</p>
            <p className="text-resort-muted text-[10px] mt-0.5">Logs & Trail</p>
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OccupancyChart />
      </div>

      {/* Property Performance + Booking Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resort Performance */}
        <div className="lg:col-span-2 luxury-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Resort Portfolio Performance</h3>
            <Link to="/owner/resorts" className="text-resort-accent text-xs hover:underline flex items-center gap-1">
              Configure Policies <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                        <img src={getResortImage(r)} alt={r.name} className="w-9 h-9 rounded-lg object-cover border border-resort-border" />
                        <span className="font-medium text-resort-text text-sm">{r.name}</span>
                      </div>
                    </td>
                    <td className="text-resort-muted text-xs">{r.location}</td>
                    <td>{r.rooms}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-resort-slate rounded-full h-1.5 w-14">
                          <div
                            className="bg-resort-accent h-1.5 rounded-full"
                            style={{ width: `${r.occupancy}%` }}
                          />
                        </div>
                        <span className="text-xs">{r.occupancy}%</span>
                      </div>
                    </td>
                    <td className="text-resort-accent font-medium">₹{(r.revenue/100000).toFixed(1)}L</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs">{r.rating}</span>
                      </div>
                    </td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Source Breakdown */}
        <BookingSourceChart />
      </div>

      {/* Recent Reservations */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-resort-text font-semibold">Live Reservation Stream</h3>
          <span className="text-resort-muted text-xs">{reservations.length} total active</span>
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
                  <td className="font-medium text-resort-text text-sm">{r.guest}</td>
                  <td className="text-resort-muted text-xs">{r.resort}</td>
                  <td className="text-xs">{r.checkIn}</td>
                  <td className="text-xs">{r.checkOut}</td>
                  <td className="text-resort-accent font-medium text-sm">₹{r.amount.toLocaleString()}</td>
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
