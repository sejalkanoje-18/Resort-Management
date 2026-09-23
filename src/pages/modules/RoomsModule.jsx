import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { BedDouble, Plus, Wifi, Wind, Tv, Coffee, Waves, Users } from 'lucide-react'
import { roomsApi } from '../../api/client'

const STATUS_COLORS = {
  available:    'border-emerald-500/40 bg-emerald-500/5',
  occupied:     'border-blue-500/40 bg-blue-500/5',
  housekeeping: 'border-purple-500/40 bg-purple-500/5',
  maintenance:  'border-orange-500/40 bg-orange-500/5',
}

const AMENITY_ICONS = { WiFi: Wifi, AC: Wind, TV: Tv, Minibar: Coffee, 'Private Pool': Waves }

export default function RoomsModule() {
  const [rooms, setRooms] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form fields for Add Room
  const [newNum, setNewNum] = useState('')
  const [newType, setNewType] = useState('Deluxe Room')
  const [newFloor, setNewFloor] = useState(1)
  const [newBed, setNewBed] = useState('King')
  const [newPrice, setNewPrice] = useState(8500)
  const [newCap, setNewCap] = useState(2)

  async function fetchRooms() {
    setLoading(true)
    try {
      const data = await roomsApi.getAll()
      setRooms(data)
    } catch (err) {
      console.error('Failed to load rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleAddRoom = async () => {
    if (!newNum) return
    try {
      await roomsApi.create({
        number: newNum,
        type: newType,
        floor: Number(newFloor),
        bedType: newBed,
        price: Number(newPrice),
        capacity: Number(newCap),
        resort: 'Serenity Goa',
        view: 'Garden View',
        amenities: ['WiFi', 'AC', 'TV'],
      })
      setShowAdd(false)
      setNewNum('')
      fetchRooms()
    } catch (err) {
      alert(err.message || 'Failed to add room')
    }
  }

  const types = [...new Set(rooms.map(r => r.type))]
  const filtered = rooms.filter(r => {
    const matchSearch = r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchType = filterType === 'all' || r.type === filterType
    return matchSearch && matchStatus && matchType
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={rooms.length} icon={BedDouble} color="gold" />
        <StatCard title="Available" value={rooms.filter(r=>r.status==='available').length} icon={BedDouble} color="green" />
        <StatCard title="Occupied" value={rooms.filter(r=>r.status==='occupied').length} icon={Users} color="blue" />
        <StatCard title="Out of Service" value={rooms.filter(r=>['housekeeping','maintenance'].includes(r.status)).length} icon={BedDouble} color="orange" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search rooms..." className="w-56" />
        <select className="luxury-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select className="luxury-select w-44" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(room => (
          <div
            key={room.id}
            onClick={() => setSelected(room)}
            className={`luxury-card p-4 cursor-pointer hover:border-resort-accent/50 transition-all ${STATUS_COLORS[room.status] || ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xl text-resort-text">{room.number}</span>
              {statusBadge(room.status)}
            </div>
            <p className="text-resort-muted text-xs mb-1">{room.type}</p>
            <p className="text-resort-muted text-xs">{room.view}</p>
            <div className="mt-3 pt-3 border-t border-resort-border/50 flex items-center justify-between">
              <span className="text-resort-accent font-semibold text-sm">₹{room.price ? room.price.toLocaleString() : 0}</span>
              <span className="text-resort-muted text-xs">/night</span>
            </div>
            {room.guest && (
              <p className="text-resort-text text-xs mt-2 truncate">{room.guest}</p>
            )}
          </div>
        ))}
      </div>

      {/* Room Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Room ${selected?.number} — ${selected?.type}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-resort-slate rounded-xl p-4 text-center">
                <p className="text-resort-muted text-xs uppercase tracking-wider">Status</p>
                <div className="mt-2 flex justify-center">{statusBadge(selected.status)}</div>
              </div>
              <div className="bg-resort-slate rounded-xl p-4 text-center">
                <p className="text-resort-muted text-xs uppercase tracking-wider">Rate</p>
                <p className="text-resort-accent font-bold text-lg mt-1">₹{selected.price ? selected.price.toLocaleString() : 0}/night</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Floor', value: `Floor ${selected.floor}` },
                { label: 'View', value: selected.view },
                { label: 'Bed Type', value: selected.bedType },
                { label: 'Capacity', value: `${selected.capacity} Guests` },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-resort-text font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.guest && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 font-medium mb-2">Current Guest</p>
                <p className="text-resort-text">{selected.guest}</p>
                <p className="text-resort-muted text-sm mt-1">{selected.checkIn} → {selected.checkOut}</p>
              </div>
            )}
            <div>
              <p className="text-resort-muted text-sm mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {(selected.amenities || []).map(a => {
                  const Icon = AMENITY_ICONS[a] || Coffee
                  return (
                    <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-resort-slate rounded-lg text-resort-text text-sm border border-resort-border">
                      <Icon className="w-3.5 h-3.5 text-resort-accent" />{a}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Room Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Room">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Room Number</label>
              <input className="luxury-input" value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="e.g. 301" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Room Type</label>
              <select className="luxury-select" value={newType} onChange={e => setNewType(e.target.value)}>
                <option>Deluxe Room</option>
                <option>Premium Suite</option>
                <option>Presidential Villa</option>
                <option>Heritage Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Floor</label>
              <input className="luxury-input" type="number" value={newFloor} onChange={e => setNewFloor(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Capacity</label>
              <input className="luxury-input" type="number" value={newCap} onChange={e => setNewCap(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Bed Type</label>
              <select className="luxury-select" value={newBed} onChange={e => setNewBed(e.target.value)}>
                <option>King</option>
                <option>Queen</option>
                <option>Twin</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Price per Night (₹)</label>
              <input className="luxury-input" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleAddRoom} className="luxury-btn px-4 py-2">Add Room</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
