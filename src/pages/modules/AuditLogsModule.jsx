import React, { useState } from 'react'
import { auditLogs } from '../../data/mockData'
import Badge from '../../components/ui/Badge'
import SearchBar from '../../components/ui/SearchBar'
import StatCard from '../../components/ui/StatCard'
import { ClipboardList, Download, Shield, Activity, User, Database } from 'lucide-react'

const ACTION_VARIANTS = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  VIEW:   'gray',
  LOGIN:  'purple',
  LOGOUT: 'yellow',
}

const ROLE_COLORS = {
  owner:      'text-yellow-400',
  management: 'text-blue-400',
  staff:      'text-emerald-400',
}

export default function AuditLogsModule() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterModule, setFilterModule] = useState('all')

  const modules = [...new Set(auditLogs.map(l => l.module))]
  const filtered = auditLogs.filter(l => {
    const matchSearch = l.description.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === 'all' || l.action === filterAction
    const matchModule = filterModule === 'all' || l.module === filterModule
    return matchSearch && matchAction && matchModule
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Logs" value={auditLogs.length} icon={ClipboardList} color="blue" />
        <StatCard title="Creates" value={auditLogs.filter(l=>l.action==='CREATE').length} icon={Activity} color="green" />
        <StatCard title="Updates" value={auditLogs.filter(l=>l.action==='UPDATE').length} icon={Activity} color="gold" />
        <StatCard title="Deletes" value={auditLogs.filter(l=>l.action==='DELETE').length} icon={Activity} color="red" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." className="w-64" />
        <select className="luxury-select w-36" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="VIEW">View</option>
          <option value="LOGIN">Login</option>
        </select>
        <select className="luxury-select w-40" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
          <option value="all">All Modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="luxury-btn-outline flex items-center gap-2 text-sm px-4 py-2 ml-auto">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-resort-muted whitespace-nowrap">{log.timestamp}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-resort-accent" />
                      </div>
                      <span className="font-medium text-resort-text text-sm">{log.user}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`text-xs font-medium capitalize ${ROLE_COLORS[log.role]}`}>{log.role}</span>
                  </td>
                  <td>
                    <Badge variant={ACTION_VARIANTS[log.action] || 'gray'}>{log.action}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-resort-muted" />
                      <span className="text-resort-text text-sm">{log.module}</span>
                    </div>
                  </td>
                  <td className="text-resort-muted max-w-xs">
                    <p className="truncate">{log.description}</p>
                  </td>
                  <td className="font-mono text-xs text-resort-muted">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
