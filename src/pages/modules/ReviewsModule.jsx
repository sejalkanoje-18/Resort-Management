import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { MessageSquare, Star, Plus, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react'
import { reviewsApi } from '../../api/client'

export default function ReviewsModule() {
  const [reviews, setReviews] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Resolution state
  const [assignee, setAssignee] = useState('Arjun Patel (Front Desk)')
  const [resStatus, setResStatus] = useState('in-progress')
  const [resNotes, setResNotes] = useState('')

  // New Complaint state
  const [guest, setGuest] = useState('')
  const [resort, setResort] = useState('Serenity Goa')
  const [type, setType] = useState('Complaint')
  const [category, setCategory] = useState('Room Maintenance')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('high')

  async function fetchReviews() {
    try {
      const data = await reviewsApi.getAll()
      setReviews(data || [])
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleUpdateResolution = async () => {
    if (!selected) return
    try {
      await reviewsApi.update(selected.id, {
        status: resStatus,
        assignee,
        resolutionNotes: resNotes,
      })
      setSelected(null)
      fetchReviews()
    } catch (err) {
      alert(err.message || 'Failed to update complaint resolution')
    }
  }

  const handleCreateComplaint = async () => {
    if (!guest || !subject) {
      alert('Please enter Guest Name and Subject')
      return
    }

    try {
      await reviewsApi.create({
        guest,
        resort,
        type,
        rating: type === 'Review' ? 5 : null,
        category,
        subject,
        description,
        priority,
      })
      setShowAdd(false)
      setGuest('')
      setSubject('')
      setDescription('')
      fetchReviews()
    } catch (err) {
      alert(err.message || 'Failed to file issue')
    }
  }

  const filtered = reviews.filter(r => {
    const matchSearch = (r.guest || '').toLowerCase().includes(search.toLowerCase()) ||
                        (r.subject || '').toLowerCase().includes(search.toLowerCase()) ||
                        (r.category || '').toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || r.type === filterType
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const complaintsCount = reviews.filter(r => r.type === 'Complaint').length
  const pendingCount = reviews.filter(r => r.status === 'pending' || r.status === 'in-progress').length
  const resolvedCount = reviews.filter(r => r.status === 'resolved').length

  return (
    <div className="space-y-6">
      <div className="luxury-card p-6 bg-gradient-to-r from-red-500/10 via-resort-navy to-resort-navy border border-red-500/30">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-6 h-6 text-red-400" />
          <h2 className="font-serif text-2xl text-resort-text font-bold">Guest Reviews & Complaints Resolution</h2>
        </div>
        <p className="text-resort-muted text-sm max-w-2xl">
          Step 13 in operational flow: Receive guest feedback, assign complaints to specific staff members/roles, track resolution lifecycle, and log guest satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Open Complaints" value={pendingCount} icon={AlertTriangle} color="red" />
        <StatCard title="Resolved Issues" value={resolvedCount} icon={CheckCircle} color="green" />
        <StatCard title="Total Feedback Logged" value={reviews.length} icon={MessageSquare} color="blue" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search guest name or subject..." className="w-64" />
        <select className="luxury-select w-36" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Complaint">Complaints</option>
          <option value="Review">Reviews</option>
        </select>
        <select className="luxury-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Log Complaint / Feedback
        </button>
      </div>

      {/* Reviews Table */}
      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Resort</th>
                <th>Type</th>
                <th>Category</th>
                <th>Subject & Description</th>
                <th>Assigned Staff</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-resort-accent">#{r.id}</td>
                  <td className="font-medium text-resort-text">{r.guest}</td>
                  <td className="text-resort-muted text-xs">{r.resort}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.type === 'Complaint' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="text-resort-muted text-xs">{r.category}</td>
                  <td>
                    <p className="font-medium text-resort-text">{r.subject}</p>
                    <p className="text-resort-muted text-xs max-w-xs truncate">{r.description}</p>
                  </td>
                  <td className="text-resort-text text-xs">{r.assignee || 'Unassigned'}</td>
                  <td>{statusBadge(r.priority || 'medium')}</td>
                  <td>{statusBadge(r.status || 'pending')}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelected(r)
                        setAssignee(r.assignee || 'Arjun Patel (Front Desk)')
                        setResStatus(r.status || 'in-progress')
                        setResNotes(r.resolutionNotes || '')
                      }}
                      className="luxury-btn-outline px-3 py-1 text-xs"
                    >
                      Assign / Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Resolve Complaint / Feedback #${selected?.id}`}>
        {selected && (
          <div className="space-y-4">
            <div className="bg-resort-slate p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-resort-text text-base">{selected.guest} ({selected.resort})</span>
                {statusBadge(selected.status || 'pending')}
              </div>
              <p className="text-sm font-semibold text-resort-accent">{selected.subject}</p>
              <p className="text-resort-muted text-sm">{selected.description}</p>
            </div>

            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Assign Staff / Role *</label>
              <select className="luxury-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option>Arjun Patel (Front Desk Manager)</option>
                <option>Priya Sharma (General Manager)</option>
                <option>Meena Krishnan (Housekeeping Supervisor)</option>
                <option>Suresh Nair (Maintenance Lead)</option>
                <option>Chef Ramesh (F&B Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Update Resolution Status</label>
              <select className="luxury-select" value={resStatus} onChange={e => setResStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Resolution Notes & Actions Taken</label>
              <textarea
                className="luxury-input h-24 resize-none"
                value={resNotes}
                onChange={e => setResNotes(e.target.value)}
                placeholder="Details of resolution offered to guest..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setSelected(null)} className="luxury-btn-outline px-4 py-2">Cancel</button>
              <button onClick={handleUpdateResolution} className="luxury-btn px-4 py-2">Save Resolution</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Log Complaint Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Log Guest Complaint or Review">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Guest Name *</label>
              <input className="luxury-input" value={guest} onChange={e => setGuest(e.target.value)} placeholder="Full guest name" />
            </div>
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
              <label className="block text-resort-muted text-sm mb-1.5">Entry Type</label>
              <select className="luxury-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="Complaint">Complaint</option>
                <option value="Review">Guest Review</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Category</label>
              <select className="luxury-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option>Room Maintenance</option>
                <option>Housekeeping Cleanliness</option>
                <option>Food & Beverage</option>
                <option>Front Desk Staff</option>
                <option>Spa Service</option>
                <option>Billing Issue</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Subject *</label>
              <input className="luxury-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. AC noise in Room 103" />
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Detailed Description</label>
              <textarea className="luxury-input h-20 resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Explain the feedback..." />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Priority</label>
              <select className="luxury-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateComplaint} className="luxury-btn px-4 py-2">Log Entry</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
