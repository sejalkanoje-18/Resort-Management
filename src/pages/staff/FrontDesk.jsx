import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { UserCheck, LogIn, LogOut, BedDouble, RefreshCw } from 'lucide-react'
import { reservationsApi, roomsApi } from '../../api/client'

export default function FrontDesk() {
  const [activeTab, setActiveTab] = useState('arrivals')
  const [search, setSearch] = useState('')
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [selected, setSelected] = useState(null)
  const [transferRoomNumber, setTransferRoomNumber] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
  const [extendNights, setExtendNights] = useState(1)
  const [showExtend, setShowExtend] = useState(false)

  async function loadData() {
    try {
      const [resData, roomData] = await Promise.all([
        reservationsApi.getAll(),
        roomsApi.getAll(),
      ])
      setReservations(resData)
      setRooms(roomData)
    } catch (err) {
      console.error('Failed to load front desk data:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCheckIn = async (resId) => {
    try {
      await reservationsApi.checkIn(resId)
      setSelected(null)
      loadData()
    } catch (err) {
      alert(err.message || 'Check-in failed')
    }
  }

  const handleCheckOut = async (resId) => {
    try {
      await reservationsApi.checkOut(resId)
      setSelected(null)
      loadData()
    } catch (err) {
      alert(err.message || 'Check-out failed')
    }
  }

  const handleTransfer = async () => {
    if (!selected || !transferRoomNumber) return
    try {
      await reservationsApi.transfer(selected.id, transferRoomNumber)
      setShowTransfer(false)
      setSelected(null)
      loadData()
    } catch (err) {
      alert(err.message || 'Room transfer failed')
    }
  }

  const handleExtend = async () => {
    if (!selected) return
    try {
      await reservationsApi.extend(selected.id, Number(extendNights))
      setShowExtend(false)
      setSelected(null)
      loadData()
    } catch (err) {
      alert(err.message || 'Extend stay failed')
    }
  }

  const arrivals   = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending')
  const departures = reservations.filter(r => r.status === 'checked-in')
  const inHouse    = reservations.filter(r => r.status === 'checked-in')

  const filtered = (activeTab === 'arrivals' ? arrivals :
                    activeTab === 'departures' ? departures : inHouse)
    .filter(r => r.guest.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Expected Arrivals" value={arrivals.length} icon={LogIn} color="green" />
        <StatCard title="Expected Departures" value={departures.length} icon={LogOut} color="blue" />
        <StatCard title="In-House Guests" value={inHouse.length} icon={UserCheck} color="gold" />
        <StatCard title="Available Rooms" value={rooms.filter(r=>r.status==='available').length} icon={BedDouble} color="purple" />
      </div>

      <div className="luxury-card p-6">
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="flex gap-1 bg-resort-slate rounded-xl p-1">
            {[
              { id: 'arrivals', label: 'Arrivals' },
              { id: 'departures', label: 'Departures' },
              { id: 'inhouse', label: 'In-House' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search guests..." className="w-56" />
        </div>

        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Res. ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-resort-accent">{r.id}</td>
                  <td className="font-medium">{r.guest}</td>
                  <td>
                    <div>
                      <p>{r.room}</p>
                      <p className="text-xs text-resort-muted">{r.roomType}</p>
                    </div>
                  </td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>{r.adults + r.children}</td>
                  <td className="text-resort-accent">₹{r.amount ? r.amount.toLocaleString() : 0}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="flex gap-1">
                      {['confirmed', 'pending'].includes(r.status) && (
                        <button onClick={() => handleCheckIn(r.id)} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30">
                          Check In
                        </button>
                      )}
                      {r.status === 'checked-in' && (
                        <>
                          <button onClick={() => handleCheckOut(r.id)} className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30">
                            Check Out
                          </button>
                          <button onClick={() => { setSelected(r); setShowTransfer(true); }} className="px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30">
                            Transfer
                          </button>
                          <button onClick={() => { setSelected(r); setShowExtend(true); }} className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30">
                            Extend
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Status Grid */}
      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Room Status Overview</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {rooms.map(room => (
            <div
              key={room.id}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                room.status === 'available'    ? 'border-emerald-500/40 bg-emerald-500/10' :
                room.status === 'occupied'     ? 'border-blue-500/40 bg-blue-500/10' :
                room.status === 'housekeeping' ? 'border-purple-500/40 bg-purple-500/10' :
                'border-orange-500/40 bg-orange-500/10'
              }`}
            >
              <p className={`font-bold text-lg ${
                room.status === 'available'    ? 'text-emerald-400' :
                room.status === 'occupied'     ? 'text-blue-400' :
                room.status === 'housekeeping' ? 'text-purple-400' :
                'text-orange-400'
              }`}>{room.number}</p>
              <p className="text-resort-muted text-xs mt-0.5 leading-tight">
                {room.status === 'available' ? 'Free' : room.status === 'occupied' ? 'Guest' : room.status === 'housekeeping' ? 'HK' : 'Maint.'}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { label: 'Available', color: 'bg-emerald-500' },
            { label: 'Occupied', color: 'bg-blue-500' },
            { label: 'Housekeeping', color: 'bg-purple-500' },
            { label: 'Maintenance', color: 'bg-orange-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-resort-muted text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Room Modal */}
      <Modal open={showTransfer} onClose={() => setShowTransfer(false)} title={`Transfer Room — ${selected?.guest}`}>
        <div className="space-y-4">
          <p className="text-resort-muted text-sm">Current Room: <span className="text-resort-text font-medium">{selected?.room}</span></p>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Select New Available Room</label>
            <select className="luxury-select" value={transferRoomNumber} onChange={e => setTransferRoomNumber(e.target.value)}>
              <option value="">-- Choose Room --</option>
              {rooms.filter(r => r.status === 'available').map(r => (
                <option key={r.number} value={r.number}>Room {r.number} ({r.type})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowTransfer(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleTransfer} className="luxury-btn px-4 py-2">Transfer Guest</button>
          </div>
        </div>
      </Modal>

      {/* Extend Stay Modal */}
      <Modal open={showExtend} onClose={() => setShowExtend(false)} title={`Extend Stay — ${selected?.guest}`}>
        <div className="space-y-4">
          <p className="text-resort-muted text-sm">Current Check-Out: <span className="text-resort-text font-medium">{selected?.checkOut}</span></p>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Additional Nights</label>
            <input className="luxury-input" type="number" min={1} value={extendNights} onChange={e => setExtendNights(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowExtend(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleExtend} className="luxury-btn px-4 py-2">Confirm Extension</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
