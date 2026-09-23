import React from 'react'
import { resorts } from '../../data/mockData'
import { getResortImage } from '../../data/resortVisuals'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import { Building2, BedDouble, Star, TrendingUp, MapPin, Phone, User } from 'lucide-react'

export default function OwnerResorts() {
  const totalRevenue = resorts.reduce((s, r) => s + r.revenue, 0)
  const totalRooms = resorts.reduce((s, r) => s + r.rooms, 0)
  const avgRating = (resorts.reduce((s, r) => s + r.rating, 0) / resorts.length).toFixed(1)
  const avgOccupancy = Math.round(resorts.reduce((s, r) => s + r.occupancy, 0) / resorts.length)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Properties" value={resorts.length} subtitle="Across India" icon={Building2} color="gold" />
        <StatCard title="Total Rooms" value={totalRooms} subtitle="Across all resorts" icon={BedDouble} color="blue" />
        <StatCard title="Avg. Rating" value={avgRating} subtitle="Guest satisfaction" icon={Star} color="purple" />
        <StatCard title="Avg. Occupancy" value={`${avgOccupancy}%`} subtitle="Current month" icon={TrendingUp} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resorts.map(resort => (
          <div key={resort.id} className="luxury-card p-6 hover:border-resort-accent/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={getResortImage(resort)} alt={resort.name} className="w-14 h-14 rounded-xl object-cover border border-resort-border flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-lg text-resort-text font-semibold">{resort.name}</h3>
                  <div className="flex items-center gap-1 text-resort-muted text-sm mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{resort.location}</span>
                  </div>
                </div>
              </div>
              {statusBadge(resort.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-resort-slate rounded-xl p-3">
                <p className="text-resort-muted text-xs uppercase tracking-wider">Revenue (Sep)</p>
                <p className="text-resort-accent font-bold text-lg mt-1">Rs. {(resort.revenue/100000).toFixed(1)}L</p>
              </div>
              <div className="bg-resort-slate rounded-xl p-3">
                <p className="text-resort-muted text-xs uppercase tracking-wider">Occupancy</p>
                <p className="text-resort-text font-bold text-lg mt-1">{resort.occupancy}%</p>
                <div className="w-full bg-resort-border rounded-full h-1 mt-1">
                  <div className="bg-resort-accent h-1 rounded-full" style={{ width: `${resort.occupancy}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-resort-muted">Category</span>
                <span className="text-resort-text">{resort.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-resort-muted">Total Rooms</span>
                <span className="text-resort-text">{resort.rooms} rooms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-resort-muted">Established</span>
                <span className="text-resort-text">{resort.established}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-resort-muted flex items-center gap-1"><User className="w-3 h-3" />Manager</span>
                <span className="text-resort-text">{resort.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-resort-muted flex items-center gap-1"><Star className="w-3 h-3" />Rating</span>
                <span className="text-yellow-400 font-semibold">{resort.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
