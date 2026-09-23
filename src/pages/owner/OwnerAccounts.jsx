import React, { useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import { resorts } from '../../data/mockData'
import { Users, UserPlus, UserCheck, UserX, Shield, Search, Filter, CheckCircle2, RefreshCw } from 'lucide-react'

const INITIAL_ACCOUNTS = [
  { id: 101, name: 'Rajiv Mehta', email: 'owner@serenityresorts.com', role: 'owner', title: 'Resort Group Owner', resort: 'All Properties', department: 'Executive', phone: '+91 98765 00000', status: 'active', joined: '2020-01-01' },
  { id: 102, name: 'Priya Sharma', email: 'manager@serenityresorts.com', role: 'management', title: 'General Manager', resort: 'Serenity Goa', department: 'Management', phone: '+91 98765 43210', status: 'active', joined: '2021-03-15' },
  { id: 103, name: 'Anil Kumar', email: 'anil.coorg@serenityresorts.com', role: 'management', title: 'Resort Manager', resort: 'Serenity Coorg', department: 'Management', phone: '+91 98765 43211', status: 'active', joined: '2022-05-10' },
  { id: 104, name: 'Rohit Singh', email: 'rohit.manali@serenityresorts.com', role: 'management', title: 'Resort Manager', resort: 'Serenity Manali', department: 'Management', phone: '+91 98765 43212', status: 'active', joined: '2023-01-20' },
  { id: 105, name: 'Arjun Patel', email: 'staff@serenityresorts.com', role: 'staff', title: 'Front Desk Lead', resort: 'Serenity Goa', department: 'Front Desk', phone: '+91 98765 43211', status: 'active', joined: '2023-06-01' },
  { id: 106, name: 'Meena Krishnan', email: 'housekeeper@serenityresorts.com', role: 'staff', title: 'Head Housekeeper', resort: 'Serenity Goa', department: 'Housekeeping', phone: '+91 98765 43212', status: 'active', joined: '2023-08-15' },
  { id: 107, name: 'Suresh Nair', email: 'maintenance@serenityresorts.com', role: 'staff', title: 'Maintenance Supervisor', resort: 'Serenity Goa', department: 'Maintenance', phone: '+91 98765 43213', status: 'active', joined: '2024-02-10' },
  { id: 108, name: 'Kavitha Reddy', email: 'kavitha.udaipur@serenityresorts.com', role: 'management', title: 'Acting Manager', resort: 'Serenity Udaipur', department: 'Management', phone: '+91 98765 43214', status: 'deactivated', joined: '2024-11-01' },
]

export default function OwnerAccounts() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
  const [search, setSearch] = useState('')
  const [filterResort, setFilterResort] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    role: 'management',
    title: '',
    resort: 'Serenity Goa',
    department: 'Management',
    phone: '',
    password: ''
  })
  const [notification, setNotification] = useState('')

  const activeCount = accounts.filter(a => a.status === 'active').length
  const deactivatedCount = accounts.filter(a => a.status === 'deactivated').length

  const toggleAccountStatus = (id) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        if (acc.role === 'owner') return acc // Prevent deactivating group owner
        const nextStatus = acc.status === 'active' ? 'deactivated' : 'active'
        setNotification(`Account for ${acc.name} updated to ${nextStatus.toUpperCase()}`)
        setTimeout(() => setNotification(''), 3000)
        return { ...acc, status: nextStatus }
      }
      return acc
    }))
  }

  const handleCreateAccount = (e) => {
    e.preventDefault()
    if (!newAccount.name || !newAccount.email) return

    const created = {
      id: Date.now(),
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      title: newAccount.title || (newAccount.role === 'management' ? 'Resort Manager' : 'Staff Officer'),
      resort: newAccount.resort,
      department: newAccount.department,
      phone: newAccount.phone || '+91 98765 00000',
      status: 'active',
      joined: new Date().toISOString().split('T')[0]
    }

    setAccounts([created, ...accounts])
    setShowAddModal(false)
    setNewAccount({ name: '', email: '', role: 'management', title: '', resort: 'Serenity Goa', department: 'Management', phone: '', password: '' })
    setNotification(`New ${created.role} account created for ${created.name}!`)
    setTimeout(() => setNotification(''), 4000)
  }

  const filtered = accounts.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
    const matchesResort = filterResort === 'all' || a.resort === filterResort
    const matchesRole = filterRole === 'all' || a.role === filterRole
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus
    return matchesSearch && matchesResort && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Accounts" value={accounts.length} subtitle="Management & Staff" icon={Users} color="blue" />
        <StatCard title="Active Accounts" value={activeCount} subtitle="Authorized Users" icon={UserCheck} color="green" />
        <StatCard title="Deactivated" value={deactivatedCount} subtitle="Suspended / Inactive" icon={UserX} color="red" />
        <StatCard title="Management Tier" value={accounts.filter(a => a.role === 'management' || a.role === 'owner').length} subtitle="Executive & Managers" icon={Shield} color="gold" />
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="luxury-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-serif text-lg text-resort-text font-semibold">System Accounts & Access Governance</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="luxury-btn flex items-center gap-2 text-sm self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" /> Create Account
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative col-span-1 sm:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-resort-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="luxury-input pl-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="luxury-select text-sm"
            value={filterResort}
            onChange={e => setFilterResort(e.target.value)}
          >
            <option value="all">All Resorts</option>
            <option value="All Properties">All Properties (Executive)</option>
            {resorts.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <select
            className="luxury-select text-sm"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="management">Management</option>
            <option value="staff">Staff</option>
          </select>

          <select
            className="luxury-select text-sm"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role</th>
                <th>Title & Dept</th>
                <th>Property</th>
                <th>Joined</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(acc => (
                <tr key={acc.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center">
                        <span className="text-resort-accent font-semibold text-xs">
                          {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-resort-text">{acc.name}</p>
                        <p className="text-resort-muted text-xs">{acc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      acc.role === 'owner' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      acc.role === 'management' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {acc.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <p className="text-resort-text text-sm font-medium">{acc.title}</p>
                    <p className="text-resort-muted text-xs">{acc.department}</p>
                  </td>
                  <td className="text-resort-muted">{acc.resort}</td>
                  <td className="text-resort-muted text-xs">{acc.joined}</td>
                  <td>{statusBadge(acc.status)}</td>
                  <td className="text-right">
                    {acc.role !== 'owner' ? (
                      <button
                        onClick={() => toggleAccountStatus(acc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          acc.status === 'active'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {acc.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-xs text-resort-muted italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="luxury-card max-w-lg w-full p-6 space-y-5 animate-scale-in">
            <h3 className="font-serif text-xl text-resort-text font-bold">Create New User Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Full Name</label>
                  <input
                    required
                    placeholder="e.g. Ramesh Chandra"
                    className="luxury-input"
                    value={newAccount.name}
                    onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="ramesh@serenityresorts.com"
                    className="luxury-input"
                    value={newAccount.email}
                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Account Role</label>
                  <select
                    className="luxury-select"
                    value={newAccount.role}
                    onChange={e => setNewAccount({ ...newAccount, role: e.target.value })}
                  >
                    <option value="management">Management</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Job Title</label>
                  <input
                    placeholder="e.g. Assistant General Manager"
                    className="luxury-input"
                    value={newAccount.title}
                    onChange={e => setNewAccount({ ...newAccount, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Assigned Property</label>
                  <select
                    className="luxury-select"
                    value={newAccount.resort}
                    onChange={e => setNewAccount({ ...newAccount, resort: e.target.value })}
                  >
                    <option value="All Properties">All Properties</option>
                    {resorts.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-resort-muted text-sm mb-1.5">Department</label>
                  <select
                    className="luxury-select"
                    value={newAccount.department}
                    onChange={e => setNewAccount({ ...newAccount, department: e.target.value })}
                  >
                    <option value="Management">Management</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="F&B">Food & Beverage</option>
                    <option value="Spa">Spa & Wellness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-resort-muted text-sm mb-1.5">Phone Number</label>
                <input
                  placeholder="+91 98765 00000"
                  className="luxury-input"
                  value={newAccount.phone}
                  onChange={e => setNewAccount({ ...newAccount, phone: e.target.value })}
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
                  Save & Activate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
