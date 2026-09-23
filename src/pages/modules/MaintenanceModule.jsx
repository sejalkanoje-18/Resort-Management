import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { Wrench, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { maintenanceApi } from '../../api/client'

export default function MaintenanceModule() {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Form State
  const [resort, setResort] = useState('Serenity Goa')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('HVAC')
  const [issue, setIssue] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignee, setAssignee] = useState('Suresh Nair')
  const [notes, setNotes] = useState('')

  async function fetchTickets() {
    try {
      const data = await maintenanceApi.getAll({ status: filterStatus, priority: filterPriority, search })
      setTickets(data)
    } catch (err) {
      console.error('Failed to load maintenance tickets:', err)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [filterStatus, filterPriority, search])

  const handleCreateTicket = async () => {
    if (!location || !issue) return
    try {
      await maintenanceApi.create({ resort, location, category, issue, priority, assignee, notes })
      setShowAdd(false)
      setLocation('')
      setIssue('')
      setNotes('')
      fetchTickets()
    } catch (err) {
      alert(err.message || 'Failed to create ticket')
    }
  }

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await maintenanceApi.updateStatus(ticketId, newStatus)
      setSelected(null)
      fetchTickets()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const open     = tickets.filter(t => t.status !== 'resolved').length
  const inProg   = tickets.filter(t => t.status === 'in-progress').length
  const urgent   = tickets.filter(t => t.priority === 'high').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  const CATEGORY_COLORS = {
    HVAC: 'bg-blue-500/20 text-blue-400',
    Plumbing: 'bg-cyan-500/20 text-cyan-400',
    Electrical: 'bg-yellow-500/20 text-yellow-400',
    General: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Open Tickets" value={open} icon={Wrench} color="orange" />
        <StatCard title="In Progress" value={inProg} icon={Clock} color="blue" />
        <StatCard title="High Priority" value={urgent} icon={AlertCircle} color="red" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="green" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." className="w-56" />
        <select className="luxury-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="luxury-select w-36" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Resort</th>
                <th>Location</th>
                <th>Category</th>
                <th>Issue</th>
                <th>Assignee</th>
                <th>Reported</th>
                <th>Scheduled</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-resort-accent text-xs font-medium">{t.ticketNo}</td>
                  <td className="text-resort-muted">{t.resort}</td>
                  <td>{t.location}</td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[t.category] || 'bg-gray-500/20 text-gray-400'}`}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <p className="text-resort-text max-w-48 truncate">{t.issue}</p>
                    {t.notes && <p className="text-resort-muted text-xs mt-0.5 truncate max-w-48">{t.notes}</p>}
                  </td>
                  <td>{t.assignee}</td>
                  <td className="text-resort-muted">{t.reported}</td>
                  <td className="text-resort-muted">{t.scheduled}</td>
                  <td>{statusBadge(t.priority)}</td>
                  <td>{statusBadge(t.status)}</td>
                  <td>
                    <button onClick={() => setSelected(t)} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors">
                      <Wrench className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Ticket ${selected?.ticketNo}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Resort', value: selected.resort },
                { label: 'Location', value: selected.location },
                { label: 'Category', value: selected.category },
                { label: 'Assignee', value: selected.assignee },
                { label: 'Reported', value: selected.reported },
                { label: 'Scheduled', value: selected.scheduled },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-resort-text font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-resort-slate rounded-xl p-4">
              <p className="text-resort-muted text-xs uppercase tracking-wider mb-1">Issue Description</p>
              <p className="text-resort-text">{selected.issue}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">{statusBadge(selected.priority)}</div>
              <div>{statusBadge(selected.status)}</div>
            </div>
            {selected.notes && (
              <div className="bg-resort-slate rounded-xl p-3">
                <p className="text-resort-muted text-xs uppercase tracking-wider mb-1">Notes</p>
                <p className="text-resort-text text-sm">{selected.notes}</p>
              </div>
            )}
            <div className="flex gap-3">
              {selected.status === 'pending' && (
                <button onClick={() => handleUpdateStatus(selected.id, 'in-progress')} className="luxury-btn flex-1 py-2 text-sm">Start Work</button>
              )}
              {selected.status !== 'resolved' && (
                <button onClick={() => handleUpdateStatus(selected.id, 'resolved')} className="luxury-btn flex-1 py-2 text-sm">Mark Resolved</button>
              )}
              {selected.status === 'resolved' && (
                <p className="text-emerald-400 text-sm font-medium w-full text-center py-2">✓ Issue Resolved & Room Available</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* New Ticket Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Maintenance Ticket">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Resort</label>
              <select className="luxury-select" value={resort} onChange={e => setResort(e.target.value)}>
                <option>Serenity Goa</option>
                <option>Serenity Coorg</option>
                <option>Serenity Manali</option>
                <option>Serenity Udaipur</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Location</label>
              <input className="luxury-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Room 103, Pool Area" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Category</label>
              <select className="luxury-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option>HVAC</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Priority</label>
              <select className="luxury-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Assignee</label>
              <select className="luxury-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option>Suresh Nair</option>
                <option>Ramesh B</option>
                <option>Deepak S</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Issue Description</label>
              <textarea className="luxury-input h-24 resize-none" value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe the issue in detail..." />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateTicket} className="luxury-btn px-4 py-2">Create Ticket</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
