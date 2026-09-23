import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resorts, rooms } from '../../data/mockData'
import { getResortImage, resortImages } from '../../data/resortVisuals'
import { MapPin, Star, BedDouble, Search, SlidersHorizontal, ArrowRight, Wifi, Wind, Coffee, Waves, X } from 'lucide-react'
import clsx from 'clsx'

const CATEGORIES = ['All', 'Beach', 'Hill Station', 'Mountain', 'Heritage']
const PRICE_RANGES = [
  { label: 'Any Price', min: 0,     max: Infinity },
  { label: 'Under Rs. 8K', min: 0,     max: 8000 },
  { label: 'Rs. 8K-15K',  min: 8000,  max: 15000 },
  { label: 'Rs. 15K+',     min: 15000, max: Infinity },
]

const AMENITIES = ['Pool', 'Spa', 'Beach Access', 'Free WiFi', 'Restaurant', 'Gym', 'Butler Service', 'Kids Club']

const RESORT_DETAILS = {
  1: { startPrice: 7500,  highlights: ['Private Beach', 'Infinity Pool', 'Ayurvedic Spa', 'Water Sports'],        about: 'Nestled along the shores of Calangute, Serenity Goa offers unparalleled beach luxury.' },
  2: { startPrice: 6500,  highlights: ['Coffee Plantation Walks', 'Jungle Spa', 'Bonfire Evenings', 'Trekking'], about: 'Tucked in the verdant hills of Coorg, surrounded by coffee and spice plantations.' },
  3: { startPrice: 9000,  highlights: ['Snow Views', 'Adventure Sports', 'Mountain Spa', 'Bonfire Lounge'],       about: 'Perched at 7,500 ft in the Kullu valley — where the Himalayas meet luxury.' },
  4: { startPrice: 12000, highlights: ['Palace Architecture', 'Lake Views', 'Heritage Tours', 'Royal Dining'],   about: 'A masterpiece of Rajput heritage overlooking Lake Pichola in the Pink City.' },
}

export default function GuestDiscover() {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [selectedRes, setSelectedRes] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [checkIn, setCheckIn]   = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests]     = useState(2)

  const filtered = resorts.filter(r => {
    const details = RESORT_DETAILS[r.id]
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || r.category === category
    const matchPrice = !details || (details.startPrice >= priceRange.min && details.startPrice <= priceRange.max)
    return matchSearch && matchCat && matchPrice && r.status !== 'maintenance'
  })

  const selectedDetail = selectedRes ? RESORT_DETAILS[selectedRes.id] : null
  const resortRooms = selectedRes
    ? rooms.filter(r => r.resort === selectedRes.name && r.status === 'available')
    : []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Search Hero ─────────────────────────────────── */}
      <div className="image-panel p-6 lg:p-8 border border-resort-border bg-cover bg-center"
        style={{ backgroundImage: `url(${resortImages.coorg})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-resort-dark/95 via-resort-dark/75 to-resort-dark/20" />
        <div className="relative z-10">
          <h2 className="font-serif text-2xl lg:text-3xl text-white font-bold mb-1">Find Your Perfect Resort</h2>
          <p className="text-resort-muted mb-6">Handpicked luxury properties across India's most beautiful destinations</p>
          {/* Quick search bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-resort-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Resort or location..." className="luxury-input pl-9" />
            </div>
            <div>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                className="luxury-input" placeholder="Check-in" />
            </div>
            <div>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                className="luxury-input" placeholder="Check-out" />
            </div>
            <div className="flex gap-2">
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="luxury-select flex-1">
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
              <button className="luxury-btn px-4 py-2 flex items-center gap-1">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ─────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-resort-slate rounded-xl p-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={clsx('px-4 py-1.5 rounded-lg text-sm font-medium transition-all', category === c ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text')}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(v => !v)}
          className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all', showFilters ? 'border-resort-accent text-resort-accent bg-resort-accent/10' : 'border-resort-border text-resort-muted hover:text-resort-text')}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <span className="text-resort-muted text-sm ml-auto">{filtered.length} resort{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Price filter drawer */}
      {showFilters && (
        <div className="luxury-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-resort-text">Filter by starting price</p>
            <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-resort-muted" /></button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {PRICE_RANGES.map(pr => (
              <button key={pr.label} onClick={() => setPriceRange(pr)}
                className={clsx('px-4 py-2 rounded-xl border text-sm transition-all', priceRange.label === pr.label ? 'border-resort-accent bg-resort-accent/10 text-resort-accent' : 'border-resort-border text-resort-muted hover:text-resort-text')}>
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Resort Cards Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map(resort => {
          const detail = RESORT_DETAILS[resort.id]
          return (
            <div key={resort.id}
              className="luxury-card overflow-hidden group cursor-pointer hover:border-resort-accent/50 transition-all hover:shadow-gold"
              onClick={() => setSelectedRes(resort)}>
              {/* Hero */}
              <div className="relative h-48 bg-resort-slate overflow-hidden">
                <img src={getResortImage(resort)} alt={resort.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-resort-dark/80 via-transparent to-transparent" />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-resort-accent text-xs font-medium border border-resort-accent/30">
                    {resort.category}
                  </span>
                  {resort.occupancy > 85 && (
                    <span className="px-2.5 py-1 bg-red-500/40 backdrop-blur-sm rounded-full text-red-300 text-xs font-medium">
                      High Demand
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-yellow-400 text-xs font-medium">
                    <Star className="w-3 h-3 fill-yellow-400" /> {resort.rating}
                  </span>
                </div>
                {/* Bottom info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-xl text-white font-bold">{resort.name}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{resort.location}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {detail && (
                  <p className="text-resort-muted text-sm mb-4 leading-relaxed line-clamp-2">{detail.about}</p>
                )}
                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {detail?.highlights.slice(0, 3).map(h => (
                    <span key={h} className="text-xs px-2.5 py-1 bg-resort-slate rounded-full text-resort-muted border border-resort-border">{h}</span>
                  ))}
                  {detail?.highlights.length > 3 && (
                    <span className="text-xs px-2.5 py-1 bg-resort-slate rounded-full text-resort-muted border border-resort-border">+{detail.highlights.length - 3} more</span>
                  )}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-resort-muted text-xs">Starting from</p>
                    <p className="text-resort-accent font-bold text-xl font-serif">Rs. {detail?.startPrice.toLocaleString()}<span className="text-resort-muted font-normal text-sm">/night</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-resort-muted text-xs">{resort.rooms} rooms</span>
                    <button className="luxury-btn text-xs px-4 py-2 flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Resort Detail Drawer / Modal ─────────────────── */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRes(null)} />
          <div className="relative w-full max-w-xl bg-resort-navy border-l border-resort-border flex flex-col h-full overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="relative h-56 bg-resort-slate flex-shrink-0 overflow-hidden">
              <img src={getResortImage(selectedRes)} alt={selectedRes.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-resort-dark/80 to-transparent" />
              <button onClick={() => setSelectedRes(null)} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <h3 className="font-serif text-2xl text-white font-bold">{selectedRes.name}</h3>
                <p className="text-white/70 text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedRes.location}</p>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* Rating + Occupancy */}
              <div className="flex gap-4">
                <div className="flex-1 bg-resort-slate rounded-xl p-4 text-center">
                  <p className="text-yellow-400 font-bold text-2xl flex items-center justify-center gap-1"><Star className="w-5 h-5 fill-yellow-400" /> {selectedRes.rating}</p>
                  <p className="text-resort-muted text-xs mt-0.5">Guest Rating</p>
                </div>
                <div className="flex-1 bg-resort-slate rounded-xl p-4 text-center">
                  <p className="text-resort-text font-bold text-2xl">{selectedRes.occupancy}%</p>
                  <p className="text-resort-muted text-xs mt-0.5">Occupancy</p>
                </div>
                <div className="flex-1 bg-resort-slate rounded-xl p-4 text-center">
                  <p className="text-resort-accent font-bold text-2xl">{selectedRes.rooms}</p>
                  <p className="text-resort-muted text-xs mt-0.5">Total Rooms</p>
                </div>
              </div>

              {/* About */}
              {selectedDetail && (
                <div>
                  <h4 className="font-serif text-resort-text font-semibold mb-2">About</h4>
                  <p className="text-resort-muted text-sm leading-relaxed">{selectedDetail.about}</p>
                </div>
              )}

              {/* Highlights */}
              {selectedDetail && (
                <div>
                  <h4 className="font-serif text-resort-text font-semibold mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetail.highlights.map(h => (
                      <span key={h} className="px-3 py-1.5 bg-resort-slate border border-resort-border rounded-full text-resort-text text-sm">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Rooms */}
              <div>
                <h4 className="font-serif text-resort-text font-semibold mb-3">Available Rooms</h4>
                {resortRooms.length > 0 ? (
                  <div className="space-y-3">
                    {resortRooms.map(room => (
                      <div key={room.id} className="flex items-center justify-between p-4 bg-resort-slate rounded-xl border border-resort-border hover:border-resort-accent/40 transition-colors">
                        <div>
                          <p className="font-medium text-resort-text">{room.type}</p>
                          <p className="text-resort-muted text-xs mt-0.5">
                            Room {room.number} - {room.view} - {room.bedType} - {room.capacity} guests
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.amenities.slice(0, 3).map(a => (
                              <span key={a} className="text-xs text-resort-muted bg-resort-border px-1.5 py-0.5 rounded">{a}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <p className="text-resort-accent font-bold">Rs. {room.price.toLocaleString()}</p>
                          <p className="text-resort-muted text-xs">/night</p>
                          <button
                            onClick={() => navigate('/guest/book', { state: { room, resort: selectedRes, checkIn, checkOut, guests } })}
                            className="luxury-btn text-xs px-3 py-1.5">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-resort-muted">
                    <BedDouble className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No rooms available right now for this resort</p>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-serif text-resort-text font-semibold mb-3">Resort Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(a => (
                    <div key={a} className="flex items-center gap-2 text-resort-muted text-sm">
                      <span className="text-resort-accent text-xs">✦</span>{a}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/guest/book', { state: { resort: selectedRes, checkIn, checkOut, guests } })}
                className="luxury-btn w-full py-3 text-sm">
                Book This Resort <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
