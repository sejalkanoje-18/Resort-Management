import React, { useState } from 'react'
import { staff } from '../../data/mockData'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { UserCog, Plus, Edit2, Trash2, Shield, Users, Crown, Briefcase, UserCheck } from 'lucide-react'

const ROLES = [
  { value: 'owner', label: 'Owner', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { value: 'management', label: 'Management', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: 'staff', label: 'Staff', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
]

const PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard Access' },
  { key: 'resorts', label: 'Resort Management' },
  { key: 'rooms', label: 'Room Management' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'guests', label: 'Guest Management' },
  { key: 'housekeeping', label: 'Housekeeping' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'billing', label: 'Billing & Payments' },
  { key: 'reports', label: 'Reports & Analytics' },
  { key: 'users', label: 'User Management' },
  { key: 'settings', label: 'Settings' },
  { key: 'audit', label: 'Audit Logs' },
]

const ROLE_PERMISSIONS = {
  owner:      PERMISSIONS.map(p => p.key),
  management: ['dashboard','resorts','rooms','reservations','guests','housekeeping','maintenance','billing','reports','settings'],
  staff:      ['dashboard','reservations','guests','housekeeping'],
}

export default function UsersModule() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showPerms, setShowPerms] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedRole, setSelectedRole] = useState('staff')
  const [customPerms, setCustomPerms] = useState(ROLE_PERMISSIONS.staff)

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={staff.length} icon={Users} color="blue" />
        <StatCard title="Owners" value={0} icon={Crown} color="gold" />
        <StatCard title="Managers" value={1} icon={Briefcase} color="purple" />
        <StatCard title="Staff" value={staff.filter(s=>s.role==='staff').length} icon={UserCheck} color="green" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="w-64" />
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex gap-3 flex-wrap">
        {ROLES.map(role => (
          <div key={role.value} className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-resort-border ${role.bg}`}>
            <role.icon className={`w-4 h-4 ${role.color}`} />
            <span className={`text-sm font-medium ${role.color}`}>{role.label}</span>
          </div>
        ))}
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Resort</th>
                <th>Shift</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const role = ROLES.find(r => r.value === s.role) || ROLES[2]
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center">
                          <span className="text-resort-accent font-semibold text-xs">
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-resort-text">{s.name}</p>
                          <p className="text-resort-muted text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role.bg} ${role.color}`}>
                        <role.icon className="w-3 h-3" />
                        {role.label}
                      </div>
                    </td>
                    <td className="capitalize">{s.department?.replace('_', ' ')}</td>
                    <td className="text-resort-muted">{s.resort}</td>
                    <td>{s.shift}</td>
                    <td className="text-resort-muted">{s.joinDate}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setShowPerms(s); setCustomPerms(ROLE_PERMISSIONS[s.role] || []) }}
                          className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors"
                          title="Manage Permissions"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-text transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-resort-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New User">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Full Name</label>
              <input className="luxury-input" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Email</label>
              <input className="luxury-input" type="email" placeholder="user@serenityresorts.com" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Temporary Password</label>
              <input className="luxury-input" type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Role</label>
              <select
                className="luxury-select"
                value={selectedRole}
                onChange={e => { setSelectedRole(e.target.value); setCustomPerms(ROLE_PERMISSIONS[e.target.value] || []) }}
              >
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Department</label>
              <select className="luxury-select">
                <option value="management">Management</option>
                <option value="front_desk">Front Desk</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="maintenance">Maintenance</option>
                <option value="fnb">F&B</option>
                <option value="spa">Spa</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Assigned Resort</label>
              <select className="luxury-select">
                <option>Serenity Goa</option>
                <option>Serenity Coorg</option>
                <option>Serenity Manali</option>
                <option>Serenity Udaipur</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-resort-muted text-sm mb-2">Default Permissions ({selectedRole})</p>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map(p => (
                <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customPerms.includes(p.key)}
                    onChange={e => {
                      if (e.target.checked) setCustomPerms([...customPerms, p.key])
                      else setCustomPerms(customPerms.filter(k => k !== p.key))
                    }}
                    className="accent-resort-accent w-4 h-4"
                  />
                  <span className="text-resort-text text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={() => setShowAdd(false)} className="luxury-btn px-4 py-2">Create User</button>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal */}
      <Modal open={!!showPerms} onClose={() => setShowPerms(null)} title={`Permissions — ${showPerms?.name}`}>
        {showPerms && (
          <div className="space-y-4">
            <p className="text-resort-muted text-sm">Manage module access for this user</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERMISSIONS.map(p => (
                <label key={p.key} className="flex items-center justify-between p-3 bg-resort-slate rounded-xl cursor-pointer hover:bg-resort-slate/80">
                  <span className="text-resort-text text-sm">{p.label}</span>
                  <input
                    type="checkbox"
                    checked={customPerms.includes(p.key)}
                    onChange={e => {
                      if (e.target.checked) setCustomPerms([...customPerms, p.key])
                      else setCustomPerms(customPerms.filter(k => k !== p.key))
                    }}
                    className="accent-resort-accent w-4 h-4"
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowPerms(null)} className="luxury-btn-outline px-4 py-2">Cancel</button>
              <button onClick={() => setShowPerms(null)} className="luxury-btn px-4 py-2">Save Permissions</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {}}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${deleteTarget?.name}? They will lose access to the portal immediately.`}
        confirmLabel="Deactivate"
        danger={true}
      />
    </div>
  )
}
