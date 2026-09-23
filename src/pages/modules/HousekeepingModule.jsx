import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { SprayCan, Plus, CheckCircle, Clock, AlertCircle, User } from 'lucide-react'
import { housekeepingApi } from '../../api/client'

export default function HousekeepingModule() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  // Form State
  const [room, setRoom] = useState('')
  const [type, setType] = useState('Daily Cleaning')
  const [assignee, setAssignee] = useState('Lakshmi P')
  const [priority, setPriority] = useState('medium')
  const [notes, setNotes] = useState('')

  async function fetchTasks() {
    try {
      const data = await housekeepingApi.getAll({ status: filterStatus, priority: filterPriority, search })
      setTasks(data)
    } catch (err) {
      console.error('Failed to load HK tasks:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filterStatus, filterPriority, search])

  const handleAssignTask = async () => {
    if (!room) return
    try {
      await housekeepingApi.create({ room, type, assignee, priority, notes })
      setShowAdd(false)
      setRoom('')
      setNotes('')
      fetchTasks()
    } catch (err) {
      alert(err.message || 'Failed to assign task')
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await housekeepingApi.updateStatus(taskId, newStatus)
      setSelected(null)
      fetchTasks()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const completed  = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const urgent     = tasks.filter(t => t.priority === 'high').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={tasks.length} icon={SprayCan} color="purple" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="green" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="blue" />
        <StatCard title="Urgent Tasks" value={urgent} icon={AlertCircle} color="red" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." className="w-56" />
        <select className="luxury-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="luxury-select w-36" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Assign Task
        </button>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => setSelected(task)}
            className="luxury-card p-5 cursor-pointer hover:border-resort-accent/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-resort-text text-lg">Room {task.room}</p>
                <p className="text-resort-accent font-medium text-sm">{task.type}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {statusBadge(task.status)}
                {statusBadge(task.priority)}
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-resort-muted">
                <User className="w-3.5 h-3.5" />
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-2 text-resort-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.scheduled}</span>
              </div>
            </div>
            {task.notes && (
              <p className="mt-3 text-resort-muted text-xs bg-resort-slate p-2 rounded-lg">{task.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Task — Room ${selected?.room}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Task Type', value: selected.type },
                { label: 'Resort', value: selected.resort },
                { label: 'Assignee', value: selected.assignee },
                { label: 'Scheduled', value: selected.scheduled },
                { label: 'Status', value: statusBadge(selected.status) },
                { label: 'Priority', value: statusBadge(selected.priority) },
              ].map(item => (
                <div key={item.label} className="bg-resort-slate rounded-xl p-3">
                  <p className="text-resort-muted text-xs uppercase tracking-wider">{item.label}</p>
                  <div className="text-resort-text font-medium mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div className="p-3 bg-resort-slate rounded-xl">
                <p className="text-resort-muted text-xs uppercase tracking-wider mb-1">Notes</p>
                <p className="text-resort-text text-sm">{selected.notes}</p>
              </div>
            )}
            <div className="flex gap-3">
              {selected.status === 'pending' && (
                <button onClick={() => handleUpdateStatus(selected.id, 'in-progress')} className="luxury-btn flex-1 py-2 text-sm">Start Cleaning</button>
              )}
              {selected.status === 'in-progress' && (
                <button onClick={() => handleUpdateStatus(selected.id, 'completed')} className="luxury-btn flex-1 py-2 text-sm">Mark Complete</button>
              )}
              {selected.status === 'completed' && (
                <p className="text-emerald-400 text-sm font-medium w-full text-center py-2">✓ Task Completed & Room Ready</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Assign Housekeeping Task">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Room Number</label>
              <input className="luxury-input" value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. 101" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Task Type</label>
              <select className="luxury-select" value={type} onChange={e => setType(e.target.value)}>
                <option>Daily Cleaning</option>
                <option>Turndown Service</option>
                <option>Deep Cleaning</option>
                <option>Inspection</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Assignee</label>
              <select className="luxury-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option>Lakshmi P</option>
                <option>Raju M</option>
                <option>Meena K</option>
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
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Notes</label>
              <textarea className="luxury-input h-20 resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional instructions..." />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleAssignTask} className="luxury-btn px-4 py-2">Assign Task</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
