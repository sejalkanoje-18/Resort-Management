import React, { useState } from 'react'
import { resorts as initialResortsList } from '../../data/mockData'
import { getResortImage } from '../../data/resortVisuals'
import { resortsApi } from '../../api/client'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import { Building2, BedDouble, Star, TrendingUp, MapPin, Phone, User, Plus, Save, CheckCircle2, X } from 'lucide-react'

export default function OwnerResorts() {
  const [resortList, setResortList] = useState(initialResortsList)
  const [activeTab, setActiveTab] = useState('profiles') // profiles, policies, taxes, rules
  const [saveSuccess, setSaveSuccess] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // New Resort Form State
  const [newResort, setNewResort] = useState({
    name: '',
    location: '',
    category: 'Beach',
    rooms: 60,
    rating: 4.8,
    status: 'active',
    image: '🏖️',
    established: new Date().getFullYear().toString(),
    manager: '',
    contact: '',
    revenue: 2500000,
    occupancy: 80
  })

  // Configuration States
  const [policies, setPolicies] = useState({
    cancellationWindow: '48',
    cancellationFee: '50',
    noShowPenalty: '100',
    housekeepingPolicy: 'daily',
    refundProcessingDays: '5-7',
    petsAllowed: false,
    smokingPolicy: 'Strictly Non-Smoking inside suites'
  })

  const [taxes, setTaxes] = useState({
    gstStandard: '18',
    gstEconomy: '12',
    luxuryTax: '5',
    serviceTax: '2.5',
    taxIncludedInTariff: false
  })

  const [rules, setRules] = useState({
    checkInTime: '14:00',
    checkOutTime: '11:00',
    earlyCheckInFee: '1500',
    lateCheckOutGraceMinutes: '60',
    lateCheckOutHourlyFee: '1000',
    mandatoryIdTypes: ['Passport', 'Aadhaar', 'Driving License', 'PAN Card'],
    minAgeCheckIn: '18'
  })

  const handleSaveConfig = () => {
    setSaveSuccess('Configuration settings saved successfully!')
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  const handleAddResort = async (e) => {
    e.preventDefault()
    if (!newResort.name || !newResort.location) return

    const createdResort = {
      id: Date.now(),
      ...newResort,
      rooms: Number(newResort.rooms),
      revenue: Number(newResort.revenue),
      occupancy: Number(newResort.occupancy),
      rating: Number(newResort.rating)
    }

    // Try calling backend API
    try {
      await resortsApi.create(createdResort)
    } catch (err) {
      console.log('Backend sync offline, adding to local state:', err)
    }

    setResortList([createdResort, ...resortList])
    setShowAddModal(false)
    setNewResort({
      name: '',
      location: '',
      category: 'Beach',
      rooms: 60,
      rating: 4.8,
      status: 'active',
      image: '🏖️',
      established: new Date().getFullYear().toString(),
      manager: '',
      contact: '',
      revenue: 2500000,
      occupancy: 80
    })
    setSaveSuccess(`New property "${createdResort.name}" added successfully to your resort portfolio!`)
    setTimeout(() => setSaveSuccess(''), 4000)
  }

  const totalRevenue = resortList.reduce((s, r) => s + r.revenue, 0)
  const totalRooms = resortList.reduce((s, r) => s + r.rooms, 0)
  const avgRating = (resortList.reduce((s, r) => s + r.rating, 0) / (resortList.length || 1)).toFixed(1)
  const avgOccupancy = Math.round(resortList.reduce((s, r) => s + r.occupancy, 0) / (resortList.length || 1))

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Active Properties" value={resortList.length} subtitle="Managed Destinations" icon={Building2} color="gold" />
        <StatCard title="Total Capacity" value={totalRooms} subtitle="Suites & Villas" icon={BedDouble} color="blue" />
        <StatCard title="Avg. Guest Rating" value={avgRating} subtitle="Across all reviews" icon={Star} color="purple" />
        <StatCard title="Portfolio Occupancy" value={`${avgOccupancy}%`} subtitle="Current month" icon={TrendingUp} color="green" />
      </div>

      {/* Resort Setup Container */}
      <div className="luxury-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-border pb-4">
          <div>
            <h3 className="font-serif text-xl text-resort-text font-bold">Resort Setup & Operational Governance</h3>
            <p className="text-resort-muted text-xs mt-0.5">Configure property profiles, cancellation policies, tax slabs, and check-in / check-out rules</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="luxury-btn flex items-center gap-2 text-xs py-2 px-3.5"
            >
              <Plus className="w-4 h-4" /> Add Resort
            </button>

            <div className="flex items-center gap-1 bg-resort-slate p-1 rounded-xl border border-resort-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('profiles')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'profiles' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
                }`}
              >
                Resort Profiles ({resortList.length})
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'policies' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
                }`}
              >
                Operational Policies
              </button>
              <button
                onClick={() => setActiveTab('taxes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'taxes' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
                }`}
              >
                Tax Configuration
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'rules' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
                }`}
              >
                Check-in / Check-out Rules
              </button>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Tab 1: Resort Profiles */}
        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resortList.map(resort => (
              <div key={resort.id} className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 hover:border-resort-accent/40 transition-colors space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {resort.image && resort.image.startsWith('http') ? (
                      <img src={resort.image} alt={resort.name} className="w-14 h-14 rounded-xl object-cover border border-resort-border flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center text-2xl flex-shrink-0">
                        {resort.image || '🏖️'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-lg text-resort-text font-semibold">{resort.name}</h3>
                      <div className="flex items-center gap-1 text-resort-muted text-xs mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{resort.location}</span>
                      </div>
                    </div>
                  </div>
                  {statusBadge(resort.status)}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-resort-navy/60 border border-resort-border/60 rounded-lg p-3">
                    <p className="text-resort-muted text-[10px] uppercase tracking-wider">Monthly Revenue</p>
                    <p className="text-resort-accent font-bold text-base mt-0.5">₹{(resort.revenue/100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-resort-navy/60 border border-resort-border/60 rounded-lg p-3">
                    <p className="text-resort-muted text-[10px] uppercase tracking-wider">Occupancy Rate</p>
                    <p className="text-resort-text font-bold text-base mt-0.5">{resort.occupancy}%</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-resort-border/40 pt-3">
                  <div className="flex justify-between">
                    <span className="text-resort-muted">Category</span>
                    <span className="text-resort-text font-medium">{resort.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-resort-muted">Capacity</span>
                    <span className="text-resort-text font-medium">{resort.rooms} Rooms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-resort-muted">General Manager</span>
                    <span className="text-resort-text font-medium">{resort.manager || 'Not Assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-resort-muted">Direct Contact</span>
                    <span className="text-resort-text font-medium">{resort.contact || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Operational & Cancellation Policies */}
        {activeTab === 'policies' && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Free Cancellation Window (Hours)</label>
                <input
                  className="luxury-input"
                  value={policies.cancellationWindow}
                  onChange={e => setPolicies({ ...policies, cancellationWindow: e.target.value })}
                />
                <p className="text-resort-muted text-[11px] mt-1">Free cancellation permitted before check-in</p>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Late Cancellation Charge (%)</label>
                <input
                  className="luxury-input"
                  value={policies.cancellationFee}
                  onChange={e => setPolicies({ ...policies, cancellationFee: e.target.value })}
                />
                <p className="text-resort-muted text-[11px] mt-1">Deduction fee if cancelled within 24 hours</p>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">No-Show Penalty (%)</label>
                <input
                  className="luxury-input"
                  value={policies.noShowPenalty}
                  onChange={e => setPolicies({ ...policies, noShowPenalty: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Refund Processing SLA (Days)</label>
                <input
                  className="luxury-input"
                  value={policies.refundProcessingDays}
                  onChange={e => setPolicies({ ...policies, refundProcessingDays: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Housekeeping & Sanitization Standard</label>
              <select
                className="luxury-select"
                value={policies.housekeepingPolicy}
                onChange={e => setPolicies({ ...policies, housekeepingPolicy: e.target.value })}
              >
                <option value="daily">Daily Full Turndown & Cleaning Service</option>
                <option value="alternate">Alternate Day Deep Cleaning</option>
                <option value="on-demand">On-Demand Guest Request Only</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveConfig} className="luxury-btn flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Policies
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tax Configuration */}
        {activeTab === 'taxes' && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">GST Rate — Luxury Suites & Villas (&gt; ₹7,500/night)</label>
                <div className="relative">
                  <input
                    className="luxury-input pr-8"
                    value={taxes.gstStandard}
                    onChange={e => setTaxes({ ...taxes, gstStandard: e.target.value })}
                  />
                  <span className="absolute right-3 top-2.5 text-resort-muted font-bold text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">GST Rate — Standard Rooms (&lt; ₹7,500/night)</label>
                <div className="relative">
                  <input
                    className="luxury-input pr-8"
                    value={taxes.gstEconomy}
                    onChange={e => setTaxes({ ...taxes, gstEconomy: e.target.value })}
                  />
                  <span className="absolute right-3 top-2.5 text-resort-muted font-bold text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">State Luxury Tax Rate (%)</label>
                <div className="relative">
                  <input
                    className="luxury-input pr-8"
                    value={taxes.luxuryTax}
                    onChange={e => setTaxes({ ...taxes, luxuryTax: e.target.value })}
                  />
                  <span className="absolute right-3 top-2.5 text-resort-muted font-bold text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Resort Service Surcharge (%)</label>
                <div className="relative">
                  <input
                    className="luxury-input pr-8"
                    value={taxes.serviceTax}
                    onChange={e => setTaxes({ ...taxes, serviceTax: e.target.value })}
                  />
                  <span className="absolute right-3 top-2.5 text-resort-muted font-bold text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveConfig} className="luxury-btn flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Tax Slabs
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Check-in / Check-out Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Default Check-In Time</label>
                <input
                  type="time"
                  className="luxury-input"
                  value={rules.checkInTime}
                  onChange={e => setRules({ ...rules, checkInTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Default Check-Out Time</label>
                <input
                  type="time"
                  className="luxury-input"
                  value={rules.checkOutTime}
                  onChange={e => setRules({ ...rules, checkOutTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Early Check-In Surcharge (₹)</label>
                <input
                  className="luxury-input"
                  value={rules.earlyCheckInFee}
                  onChange={e => setRules({ ...rules, earlyCheckInFee: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Late Check-Out Grace Period (Minutes)</label>
                <input
                  className="luxury-input"
                  value={rules.lateCheckOutGraceMinutes}
                  onChange={e => setRules({ ...rules, lateCheckOutGraceMinutes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveConfig} className="luxury-btn flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Rules
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Resort Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="luxury-card max-w-lg w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-resort-border pb-3">
              <h3 className="font-serif text-xl text-resort-text font-bold">Add New Resort Property</h3>
              <button onClick={() => setShowAddModal(false)} className="text-resort-muted hover:text-resort-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResort} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Resort Name</label>
                  <input
                    required
                    placeholder="e.g. Serenity Kovalam"
                    className="luxury-input"
                    value={newResort.name}
                    onChange={e => setNewResort({ ...newResort, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Location / City</label>
                  <input
                    required
                    placeholder="e.g. Kovalam, Kerala"
                    className="luxury-input"
                    value={newResort.location}
                    onChange={e => setNewResort({ ...newResort, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Category</label>
                  <select
                    className="luxury-select"
                    value={newResort.category}
                    onChange={e => setNewResort({ ...newResort, category: e.target.value })}
                  >
                    <option value="Beach">Beach Resort</option>
                    <option value="Hill Station">Hill Station</option>
                    <option value="Mountain">Mountain Retreat</option>
                    <option value="Heritage">Heritage Palace</option>
                    <option value="Wellness">Wellness & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Total Room Capacity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 75"
                    className="luxury-input"
                    value={newResort.rooms}
                    onChange={e => setNewResort({ ...newResort, rooms: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">General Manager Name</label>
                  <input
                    placeholder="e.g. Sanjay Verma"
                    className="luxury-input"
                    value={newResort.manager}
                    onChange={e => setNewResort({ ...newResort, manager: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Contact Phone</label>
                  <input
                    placeholder="+91 98765 99999"
                    className="luxury-input"
                    value={newResort.contact}
                    onChange={e => setNewResort({ ...newResort, contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Est. Monthly Revenue (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3500000"
                    className="luxury-input"
                    value={newResort.revenue}
                    onChange={e => setNewResort({ ...newResort, revenue: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Visual Icon / Emoji</label>
                  <select
                    className="luxury-select"
                    value={newResort.image}
                    onChange={e => setNewResort({ ...newResort, image: e.target.value })}
                  >
                    <option value="🏖️">🏖️ Beach Palm</option>
                    <option value="🌿">🌿 Green Hill</option>
                    <option value="🏔️">🏔️ Snow Mountain</option>
                    <option value="🏰">🏰 Heritage Castle</option>
                    <option value="🌴">🌴 Tropical Villa</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-resort-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-resort-muted hover:text-resort-text text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="luxury-btn text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Save & Publish Resort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
