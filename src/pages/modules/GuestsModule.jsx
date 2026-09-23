import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { Users, Plus, Eye, Star, Crown, Award } from 'lucide-react'
import { guestsApi } from '../../api/client'

const TIER_ICONS = { Platinum: Crown, Gold: Star, Silver: Award, Bronze: Award }

export default function GuestsModule() {
  const [guestsList, setGuestsList] = useState([])
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Add form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [idType, setIdType] = useState('Passport')
  const [idNumber, setIdNumber] = useState('')

  async function fetchGuests() {
    try {
      const data = await guestsApi.getAll(search)
      setGuestsList(data)
    } catch (err) {
      console.error('Failed to load guests:', err)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [search])

  const handleAddGuest = async () => {
    if (!name || !email) return
    try {
      await guestsApi.create({ name, email, phone, idType, idNumber })
      setShowAdd(false)
      setName('')
      setEmail('')
      setPhone('')
      setIdNumber('')
      fetchGuests()
    } catch (err) {
      alert(err.message || 'Failed to create guest')
    }
  }

  const filtered = guestsList.filter(g => {
    const matchTier = filterTier === 'all' || g.tier === filterTier
    return matchTier
  })

  const totalSpend = guestsList.reduce((s, g) => s + (g.totalSpend || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Guests" value={guestsList.length} icon={Users} color="blue" />
        <StatCard title="Platinum Members" value={guestsList.filter(g=>g.tier==='Platinum').length} icon={Crown} color="purple" />
        <StatCard title="Gold Members" value={guestsList.filter(g=>g.tier==='Gold').length} icon={Star} color="gold" />
        <StatCard title="Total Spend" value={`₹${(totalSpend/100000).toFixed(1)}L`} icon={Users} color="green" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search guests..." className="w-64" />
        <select className="luxury-select w-36" value={filterTier} onChange={e => setFilterTier(e.target.value)}>
          <option value="all">All Tiers</option>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Add Guest
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Nationality</th>
                <th>ID Proof</th>
                <th>Tier</th>
                <th>Visits</th>
                <th>Total Spend</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const TierIcon = TIER_ICONS[g.tier] || Star
                return (
                  <tr key={g.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-resort-accent font-semibold text-xs">
                            {g.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-resort-text">{g.name}</p>
                          {g.notes && <p className="text-resort-muted text-xs truncate max-w-32">{g.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm">{g.email}</p>
                        <p className="text-resort-muted text-xs">{g.phone}</p>
                      </div>
                    </td>
                    <td className="text-resort-muted">{g.nationality}</td>
                    <td>
                      <div>
                        <p className="text-xs text-resort-text">{g.idType}</p>
                        <p className="text-resort-muted text-xs font-mono">{g.idNumber}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <TierIcon className={`w-3.5 h-3.5 ${g.tier === 'Platinum' ? 'text-purple-400' : g.tier === 'Gold' ? 'text-yellow-400' : 'text-gray-400'}`} />
                        {statusBadge(g.tier)}
                      </div>
                    </td>
                    <td className="text-center font-semibold">{g.visits}</td>
                    <td className="text-resort-accent font-semibold">₹{g.totalSpend ? g.totalSpend.toLocaleString() : 0}</td>
                    <td className="text-resort-muted">{g.lastVisit}</td>
                    <td>
                      <button onClick={() => setSelected(g)} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Guest Profile">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-resort-slate rounded-xl">
              <div className="w-16 h-16 rounded-full bg-resort-accent/20 border-2 border-resort-accent/40 flex items-center justify-center">
                <span className="text-resort-accent font-bold text-xl">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-resort-text font-semibold">{selected.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {statusBadge(selected.tier)}
                  <span className="text-resort-muted text-sm">{selected.visits} visits · ₹{selected.totalSpend ? selected.totalSpend.toLocaleString() : 0} total</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Nationality', value: selected.nationality },
                { label: 'Date of Birth', value: selected.dob },
                { label: 'ID Type', value: selected.idType },
                { label: 'ID Number', value: selected.idNumber },
                { label: 'Last Visit', value: selected.lastVisit },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-resort-text font-medium mt-1 break-all">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.preferences && selected.preferences.length > 0 && (
              <div>
                <p className="text-resort-muted text-sm mb-2">Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {selected.preferences.map(p => (
                    <span key={p} className="px-3 py-1 bg-resort-accent/10 border border-resort-accent/30 rounded-full text-resort-accent text-xs">{p}</span>
                  ))}
                </div>
              </div>
            )}
            {selected.notes && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-400 text-xs font-medium uppercase tracking-wider mb-1">Note</p>
                <p className="text-resort-text text-sm">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Guest Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Guest">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Full Name</label>
              <input className="luxury-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Email</label>
              <input className="luxury-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Phone</label>
              <input className="luxury-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 00000" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">ID Type</label>
              <select className="luxury-select" value={idType} onChange={e => setIdType(e.target.value)}>
                <option>Passport</option>
                <option>Aadhaar</option>
                <option>PAN</option>
                <option>Driving License</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">ID Number</label>
              <input className="luxury-input" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID Number" />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleAddGuest} className="luxury-btn px-4 py-2">Add Guest</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
