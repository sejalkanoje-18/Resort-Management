import React, { useState, useEffect } from 'react'
import StatCard from '../../components/ui/StatCard'
import { resortImages } from '../../data/resortVisuals'
import { statusBadge } from '../../components/ui/Badge'
import RevenueChart from '../../components/charts/RevenueChart'
import BookingSourceChart from '../../components/charts/BookingSourceChart'
import { BedDouble, Users, Wrench, SprayCan, CheckCircle, AlertCircle } from 'lucide-react'
import { reportsApi, reservationsApi, housekeepingApi, maintenanceApi } from '../../api/client'

export default function ManagementDashboard() {
  const [stats, setStats] = useState(null)
  const [recentRes, setRecentRes] = useState([])
  const [urgentItems, setUrgentItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, resData, hkData, mntData] = await Promise.all([
          reportsApi.getDashboardStats().catch(() => null),
          reservationsApi.getAll().catch(() => []),
          housekeepingApi.getAll({ priority: 'high' }).catch(() => []),
          maintenanceApi.getAll({ priority: 'high' }).catch(() => []),
        ])

        setStats(statsData)
        setRecentRes(resData.slice(0, 6))

        const urgent = [
          ...hkData.filter(t => t.status !== 'completed').map(t => ({ type: 'Housekeeping', text: `Room ${t.room}: ${t.type}`, time: t.scheduled })),
          ...mntData.filter(t => t.status !== 'resolved').map(t => ({ type: 'Maintenance', text: `${t.location}: ${t.issue}`, time: t.ticketNo })),
        ]
        setUrgentItems(urgent)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const available = stats ? stats.availableRooms : 0
  const occupied = stats ? stats.occupiedRooms : 0
  const pendingHK = stats ? stats.pendingHousekeeping : 0
  const openMaint = stats ? stats.pendingMaintenance : 0
  const todayCheckins = stats ? stats.arrivalsToday : 0
  const todayCheckouts = stats ? stats.departuresToday : 0

  return (
    <div className="space-y-6">
      <div className="image-panel min-h-[200px] p-6 lg:p-8 flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${resortImages.restaurant})` }}>
        <div className="relative z-10 max-w-3xl">
          <p className="text-resort-accent text-sm uppercase tracking-[0.24em] mb-2">Today at the Property</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-bold">Coordinate arrivals, housekeeping, maintenance and restaurant service</h2>
          <p className="text-white/75 mt-3">A live operating view for the teams keeping guest experience smooth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Rooms Available" value={available} subtitle={`${occupied} occupied today`} icon={BedDouble} color="green" />
        <StatCard title="Guests In-House" value={occupied * 2} subtitle={`${todayCheckins} arriving today`} icon={Users} color="blue" />
        <StatCard title="Pending HK Tasks" value={pendingHK} subtitle="Housekeeping" icon={SprayCan} color="purple" />
        <StatCard title="Open Maintenance" value={openMaint} subtitle="Active tickets" icon={Wrench} color="orange" />
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="luxury-card p-6">
          <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Today's Activity</h3>
          <div className="space-y-3">
            {[
              { label: 'Arrivals Today', value: todayCheckins, icon: CheckCircle, color: 'text-emerald-400' },
              { label: 'Departures Today', value: todayCheckouts, icon: CheckCircle, color: 'text-blue-400' },
              { label: 'HK Tasks Pending', value: pendingHK, icon: SprayCan, color: 'text-purple-400' },
              { label: 'Maintenance Open', value: openMaint, icon: Wrench, color: 'text-orange-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-resort-slate rounded-xl">
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-resort-text text-sm">{item.label}</span>
                </div>
                <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Items */}
        <div className="luxury-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-serif text-lg text-resort-text font-semibold">Urgent Attention Required</h3>
          </div>
          <div className="space-y-3">
            {urgentItems.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div>
                  <p className="text-resort-text text-sm font-medium">{item.text}</p>
                  <p className="text-resort-muted text-xs mt-0.5">{item.type} · {item.time}</p>
                </div>
                <span className="text-red-400 text-xs border border-red-400/30 px-2 py-0.5 rounded-full">{item.type}</span>
              </div>
            ))}
            {urgentItems.length === 0 && (
              <p className="text-resort-muted text-sm text-center py-4">✓ No urgent items at this time</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <BookingSourceChart />
      </div>

      {/* Recent Reservations */}
      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Recent Reservations</h3>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead><tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recentRes.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-resort-muted text-xs">{r.id}</td>
                  <td className="font-medium">{r.guest}</td>
                  <td>{r.room} ({r.roomType})</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td className="text-resort-accent">₹{r.amount.toLocaleString()}</td>
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
