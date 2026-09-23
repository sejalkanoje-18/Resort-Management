import React, { useState, useEffect } from 'react'
import { Dumbbell, Clock, CheckCircle, Plus, Calendar } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { spaApi, reservationsApi } from '../../api/client'

const TREATMENTS = [
  { name: 'Ayurvedic Full Body Massage', duration: '90 min', price: 4500 },
  { name: 'Aromatherapy Facial', duration: '60 min', price: 3200 },
  { name: 'Hot Stone Therapy', duration: '75 min', price: 5000 },
  { name: 'Deep Tissue Massage', duration: '60 min', price: 3800 },
  { name: 'Couple Spa Package', duration: '120 min', price: 9000 },
  { name: 'Foot Reflexology', duration: '45 min', price: 2000 },
]

export default function SpaModule() {
  const [appointments, setAppointments] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [activeRes, setActiveRes] = useState([])

  // Form State
  const [selectedResId, setSelectedResId] = useState('')
  const [guest, setGuest] = useState('')
  const [service, setService] = useState('Ayurvedic Full Body Massage')
  const [therapist, setTherapist] = useState('Seetha V')
  const [time, setTime] = useState('11:00')
  const [amount, setAmount] = useState(4500)

  async function fetchAppointments() {
    try {
      const data = await spaApi.getAppointments()
      setAppointments(data)
    } catch (err) {
      console.error('Failed to load spa appointments:', err)
    }
  }

  useEffect(() => {
    fetchAppointments()
    reservationsApi.getAll({ status: 'checked-in' }).then(res => {
      setActiveRes(res)
      if (res.length > 0) {
        setSelectedResId(res[0].id)
        setGuest(res[0].guest)
      }
    }).catch(() => {})
  }, [])

  const handleBookAppointment = async () => {
    if (!guest || !service) return
    try {
      await spaApi.bookAppointment({ reservationId: selectedResId, guest, service, therapist, time, amount })
      setShowAdd(false)
      fetchAppointments()
    } catch (err) {
      alert(err.message || 'Failed to book spa appointment')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await spaApi.updateStatus(id, status)
      fetchAppointments()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const totalRev = appointments.reduce((s, a) => s + (a.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Today's Appts." value={appointments.length} icon={Calendar} color="teal" />
        <StatCard title="In Progress" value={appointments.filter(a=>a.status==='in-progress').length} icon={Dumbbell} color="blue" />
        <StatCard title="Confirmed" value={appointments.filter(a=>a.status==='confirmed').length} icon={Clock} color="gold" />
        <StatCard title="Revenue (Today)" value={`₹${totalRev.toLocaleString()}`} icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 luxury-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Today's Appointments</h3>
            <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> New Booking</button>
          </div>
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt.id} className="flex items-start justify-between p-4 bg-resort-slate rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <Dumbbell className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium text-resort-text">{appt.service}</p>
                    <p className="text-resort-muted text-sm">{appt.guest}</p>
                    <p className="text-resort-muted text-xs">{appt.time} · Therapist: {appt.therapist}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {statusBadge(appt.status)}
                  <span className="text-resort-accent font-semibold text-sm">₹{appt.amount ? appt.amount.toLocaleString() : 0}</span>
                  {appt.status === 'confirmed' && (
                    <button onClick={() => handleStatusUpdate(appt.id, 'in-progress')} className="mt-1 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Start</button>
                  )}
                  {appt.status === 'in-progress' && (
                    <button onClick={() => handleStatusUpdate(appt.id, 'completed')} className="mt-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">Complete & Bill</button>
                  )}
                  {appt.status === 'completed' && (
                    <span className="text-emerald-400 text-xs mt-1 font-medium">✓ Posted to Folio</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-card p-6">
          <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Treatments Menu</h3>
          <div className="space-y-3">
            {TREATMENTS.map(t => (
              <div key={t.name} className="p-3 bg-resort-slate rounded-xl">
                <p className="text-resort-text text-sm font-medium">{t.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-resort-muted text-xs">{t.duration}</span>
                  <span className="text-resort-accent font-semibold text-sm">₹{t.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Spa Appointment">
        <div className="space-y-4">
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Guest</label>
            <select
              className="luxury-select"
              value={selectedResId}
              onChange={e => {
                const res = activeRes.find(r => r.id === e.target.value)
                if (res) {
                  setSelectedResId(res.id)
                  setGuest(res.guest)
                }
              }}
            >
              {activeRes.map(r => (
                <option key={r.id} value={r.id}>{r.guest} (Room {r.room})</option>
              ))}
              <option value="">Walk-in Guest</option>
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Treatment / Service</label>
            <select
              className="luxury-select"
              value={service}
              onChange={e => {
                const s = e.target.value
                setService(s)
                const item = TREATMENTS.find(t => t.name === s)
                if (item) setAmount(item.price)
              }}
            >
              {TREATMENTS.map(t => (
                <option key={t.name} value={t.name}>{t.name} (₹{t.price})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Therapist</label>
            <select className="luxury-select" value={therapist} onChange={e => setTherapist(e.target.value)}>
              <option>Seetha V</option>
              <option>Preethi N</option>
              <option>Rajesh M</option>
            </select>
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Time</label>
            <input className="luxury-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleBookAppointment} className="luxury-btn px-4 py-2">Book Appointment</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
