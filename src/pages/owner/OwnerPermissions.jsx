import React, { useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import { Shield, Lock, CheckCircle2, XCircle, Plus, Edit2, Save } from 'lucide-react'

const INITIAL_ROLES = [
  {
    id: 'role-owner',
    name: 'Owner',
    description: 'Full administrative access and executive oversight across all properties',
    userCount: 1,
    isSystem: true,
    permissions: {
      dashboard: true,
      resorts: true,
      rooms: true,
      reservations: true,
      guests: true,
      housekeeping: true,
      maintenance: true,
      billing: true,
      reports: true,
      users: true,
      permissions: true,
      audit: true,
      settings: true
    }
  },
  {
    id: 'role-management',
    name: 'General Manager / Management',
    description: 'Property operational management, room assignment, staff oversight & billing',
    userCount: 4,
    isSystem: true,
    permissions: {
      dashboard: true,
      resorts: true,
      rooms: true,
      reservations: true,
      guests: true,
      housekeeping: true,
      maintenance: true,
      billing: true,
      reports: true,
      users: true,
      permissions: false,
      audit: false,
      settings: true
    }
  },
  {
    id: 'role-frontdesk',
    name: 'Front Desk Officer',
    description: 'Guest check-in/check-out, room reservations, and guest interaction',
    userCount: 6,
    isSystem: false,
    permissions: {
      dashboard: true,
      resorts: false,
      rooms: true,
      reservations: true,
      guests: true,
      housekeeping: true,
      maintenance: true,
      billing: true,
      reports: false,
      users: false,
      permissions: false,
      audit: false,
      settings: false
    }
  },
  {
    id: 'role-housekeeping',
    name: 'Head Housekeeper',
    description: 'Room cleaning schedules, inspection, status updates, and supply requests',
    userCount: 8,
    isSystem: false,
    permissions: {
      dashboard: true,
      resorts: false,
      rooms: true,
      reservations: false,
      guests: false,
      housekeeping: true,
      maintenance: false,
      billing: false,
      reports: false,
      users: false,
      permissions: false,
      audit: false,
      settings: false
    }
  },
  {
    id: 'role-maintenance',
    name: 'Maintenance Supervisor',
    description: 'Property maintenance tickets, HVAC/plumbing repairs, and asset status',
    userCount: 5,
    isSystem: false,
    permissions: {
      dashboard: true,
      resorts: false,
      rooms: true,
      reservations: false,
      guests: false,
      housekeeping: false,
      maintenance: true,
      billing: false,
      reports: false,
      users: false,
      permissions: false,
      audit: false,
      settings: false
    }
  }
]

const PERMISSION_MODULES = [
  { id: 'dashboard', label: 'Executive & Ops Dashboard' },
  { id: 'resorts', label: 'Resort Setup & Profile' },
  { id: 'rooms', label: 'Room Management & Pricing' },
  { id: 'reservations', label: 'Reservations & Bookings' },
  { id: 'guests', label: 'Guest Directory & Profiles' },
  { id: 'housekeeping', label: 'Housekeeping Tasks' },
  { id: 'maintenance', label: 'Maintenance & Repairs' },
  { id: 'billing', label: 'Billing & Folio Invoices' },
  { id: 'reports', label: 'Financial & Business Reports' },
  { id: 'users', label: 'Account Management' },
  { id: 'permissions', label: 'Roles & Access Control' },
  { id: 'audit', label: 'Audit Logs & Security Trail' },
  { id: 'settings', label: 'System & Gateway Settings' },
]

export default function OwnerPermissions() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [selectedRole, setSelectedRole] = useState(INITIAL_ROLES[1])
  const [editingPermissions, setEditingPermissions] = useState({ ...INITIAL_ROLES[1].permissions })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', description: '' })

  const handleSelectRole = (role) => {
    setSelectedRole(role)
    setEditingPermissions({ ...role.permissions })
  }

  const togglePermission = (modId) => {
    if (selectedRole.isSystem && selectedRole.id === 'role-owner') return
    setEditingPermissions(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }))
  }

  const handleSavePermissions = () => {
    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, permissions: { ...editingPermissions } } : r))
    setSelectedRole(prev => ({ ...prev, permissions: { ...editingPermissions } }))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCreateRole = (e) => {
    e.preventDefault()
    if (!newRole.name) return
    const created = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description || 'Custom role with defined permissions',
      userCount: 0,
      isSystem: false,
      permissions: { ...PERMISSION_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: false }), {}) }
    }
    setRoles([...roles, created])
    setSelectedRole(created)
    setEditingPermissions(created.permissions)
    setNewRole({ name: '', description: '' })
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Defined System Roles" value={roles.length} subtitle="System & Custom" icon={Shield} color="gold" />
        <StatCard title="Active Modules" value={PERMISSION_MODULES.length} subtitle="Granular Access Points" icon={Lock} color="blue" />
        <StatCard title="Access Policy" value="RBAC Enforced" subtitle="Role-Based Access Control" icon={CheckCircle2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="luxury-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-resort-border pb-3">
            <h3 className="font-serif text-lg text-resort-text font-semibold">Roles List</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="luxury-btn py-1.5 px-3 text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          <div className="space-y-2">
            {roles.map(r => (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedRole.id === r.id
                    ? 'bg-resort-accent/10 border-resort-accent text-resort-text'
                    : 'bg-resort-slate border-resort-border hover:border-resort-border/80 text-resort-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-resort-text text-sm">{r.name}</span>
                  {r.isSystem && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                      System
                    </span>
                  )}
                </div>
                <p className="text-xs text-resort-muted line-clamp-2">{r.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-resort-muted border-t border-resort-border/40 pt-2">
                  <span>{r.userCount} Accounts Assigned</span>
                  <span>{Object.values(r.permissions).filter(Boolean).length} / {PERMISSION_MODULES.length} Modules</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Grid for Selected Role */}
        <div className="lg:col-span-2 luxury-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl text-resort-text font-bold">{selectedRole.name}</h3>
                {selectedRole.isSystem && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                    System Protected
                  </span>
                )}
              </div>
              <p className="text-resort-muted text-sm mt-1">{selectedRole.description}</p>
            </div>

            <button
              onClick={handleSavePermissions}
              disabled={selectedRole.isSystem && selectedRole.id === 'role-owner'}
              className={`luxury-btn flex items-center gap-2 text-sm ${
                selectedRole.isSystem && selectedRole.id === 'role-owner' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              {saveSuccess ? 'Permissions Saved!' : 'Save Permissions'}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Role permissions updated successfully. Changes applied to all users under this role.
            </div>
          )}

          {selectedRole.id === 'role-owner' && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-xl text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              The Owner role possesses non-revokable super-administrative privileges across all system modules.
            </div>
          )}

          {/* Module Grid */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-resort-muted font-semibold">Module Access Rules</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERMISSION_MODULES.map(mod => {
                const isEnabled = editingPermissions[mod.id]
                return (
                  <div
                    key={mod.id}
                    onClick={() => togglePermission(mod.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all select-none ${
                      selectedRole.id === 'role-owner' ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      isEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-resort-text'
                        : 'bg-resort-slate/60 border-resort-border text-resort-muted'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-resort-text">{mod.label}</p>
                      <p className="text-xs text-resort-muted mt-0.5">
                        {isEnabled ? 'Full Access Granted' : 'Access Restricted'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={selectedRole.id === 'role-owner'}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          isEnabled ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="luxury-card max-w-md w-full p-6 space-y-5 animate-scale-in">
            <h3 className="font-serif text-xl text-resort-text font-bold">Create New Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Role Name</label>
                <input
                  required
                  placeholder="e.g. Spa Manager"
                  className="luxury-input"
                  value={newRole.name}
                  onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe scope of responsibility..."
                  className="luxury-input"
                  value={newRole.description}
                  onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-resort-muted hover:text-resort-text text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="luxury-btn text-sm">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
