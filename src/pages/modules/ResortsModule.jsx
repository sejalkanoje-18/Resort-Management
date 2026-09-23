import React, { useState, useEffect } from 'react'
import { getResortImage } from '../../data/resortVisuals'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { Building2, Plus, MapPin, Star, BedDouble, Edit2, Eye, Phone, User } from 'lucide-react'
import { resortsApi } from '../../api/client'

export default function ResortsModule() {
  const [resortsList, setResortsList] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('Beach')
  const [rooms, setRooms] = useState(50)
  const [manager, setManager] = useState('')
  const [contact, setContact] = useState('')

  async function fetchResorts() {
    try {
      const data = await resortsApi.getAll()
      setResortsList(data)
    } catch (err) {
      console.error('Failed to load resorts:', err)
    }
  }

  useEffect(() => {
    fetchResorts()
  }, [])

  const handleAddResort = async () => {
    if (!name || !location) return
    try {
      await resortsApi.create({ name, location, category, rooms: Number(rooms), manager, contact })
      setShowAdd(false)
      setName('')
      setLocation('')
      setManager('')
      fetchResorts()
    } catch (err) {
      alert(err.message || 'Failed to add resort')
    }
  }

  const filtered = resortsList.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  )

  const totalRooms = resortsList.reduce((s, r) => s + (r.rooms || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Resorts" value={resortsList.length} icon={Building2} color="gold" />
        <StatCard title="Active" value={resortsList.filter(r=>r.status==='active').length} icon={Building2} color="green" />
        <StatCard title="Under Maintenance" value={resortsList.filter(r=>r.status==='maintenance').length} icon={Building2} color="orange" />
        <StatCard title="Total Rooms" value={totalRooms} icon={BedDouble} color="blue" />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search resorts..." className="w-64" />
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Resort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(resort => (
          <div key={resort.id} className="luxury-card p-6 hover:border-resort-accent/40 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={getResortImage(resort)} alt={resort.name} className="w-14 h-14 rounded-xl object-cover border border-resort-border flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-lg text-resort-text font-semibold">{resort.name}</h3>
                  <div className="flex items-center gap-1 text-resort-muted text-sm">
                    <MapPin className="w-3.5 h-3.5" />{resort.location}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-medium text-sm">{resort.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(resort.status)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center bg-resort-slate rounded-xl p-3">
                <p className="text-2xl font-bold text-resort-accent">{resort.rooms}</p>
                <p className="text-resort-muted text-xs">Rooms</p>
              </div>
              <div className="text-center bg-resort-slate rounded-xl p-3">
                <p className="text-2xl font-bold text-resort-text">{resort.occupancy}%</p>
                <p className="text-resort-muted text-xs">Occupancy</p>
              </div>
              <div className="text-center bg-resort-slate rounded-xl p-3">
                <p className="text-xl font-bold text-resort-accent">₹{((resort.revenue || 0)/100000).toFixed(1)}L</p>
                <p className="text-resort-muted text-xs">Revenue</p>
              </div>
            </div>

            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-resort-muted flex items-center gap-1"><User className="w-3 h-3" />Manager</span>
                <span className="text-resort-text">{resort.manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-resort-muted flex items-center gap-1"><Phone className="w-3 h-3" />Contact</span>
                <span className="text-resort-text">{resort.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-resort-muted">Category</span>
                <span className="text-resort-text">{resort.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-resort-muted">Established</span>
                <span className="text-resort-text">{resort.established}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSelected(resort)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-resort-border hover:bg-resort-slate text-resort-muted hover:text-resort-text text-sm transition-colors">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={getResortImage(selected)} alt={selected.name} className="w-20 h-20 rounded-xl object-cover border border-resort-border flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(selected.status)}
                  <span className="text-resort-muted text-sm">{selected.category}</span>
                </div>
                <div className="flex items-center gap-1 text-resort-muted text-sm">
                  <MapPin className="w-3.5 h-3.5" />{selected.location}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Rooms', value: selected.rooms },
                { label: 'Occupancy', value: `${selected.occupancy}%` },
                { label: 'Revenue', value: `₹${((selected.revenue || 0)/100000).toFixed(1)}L` },
                { label: 'Rating', value: `${selected.rating}` },
                { label: 'Manager', value: selected.manager },
                { label: 'Established', value: selected.established },
                { label: 'Contact', value: selected.contact },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-resort-text font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Resort Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Resort">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Resort Name</label>
              <input className="luxury-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Serenity Shimla" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Location</label>
              <input className="luxury-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Category</label>
              <select className="luxury-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option>Beach</option>
                <option>Hill Station</option>
                <option>Mountain</option>
                <option>Heritage</option>
                <option>City</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Total Rooms</label>
              <input className="luxury-input" type="number" value={rooms} onChange={e => setRooms(e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Manager</label>
              <input className="luxury-input" value={manager} onChange={e => setManager(e.target.value)} placeholder="Manager Name" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Contact</label>
              <input className="luxury-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="+91 98765 00000" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleAddResort} className="luxury-btn px-4 py-2">Add Resort</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
