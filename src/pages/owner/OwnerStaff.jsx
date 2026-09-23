import React from 'react'
import { staff } from '../../data/mockData'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import { Users, UserCheck, Clock, Building2 } from 'lucide-react'

const DEPARTMENTS = {
  management:  { label: 'Management',  color: 'bg-blue-500/20 text-blue-400' },
  front_desk:  { label: 'Front Desk',  color: 'bg-green-500/20 text-green-400' },
  housekeeping:{ label: 'Housekeeping',color: 'bg-purple-500/20 text-purple-400' },
  maintenance: { label: 'Maintenance', color: 'bg-orange-500/20 text-orange-400' },
  fnb:         { label: 'F&B',         color: 'bg-red-500/20 text-red-400' },
  spa:         { label: 'Spa',         color: 'bg-teal-500/20 text-teal-400' },
}

export default function OwnerStaff() {
  const active = staff.filter(s => s.status === 'active').length
  const onLeave = staff.filter(s => s.status === 'on-leave').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={Users} color="blue" />
        <StatCard title="Active Today" value={active} icon={UserCheck} color="green" />
        <StatCard title="On Leave" value={onLeave} icon={Clock} color="yellow" />
        <StatCard title="Resorts Covered" value={4} icon={Building2} color="gold" />
      </div>

      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Staff Overview</h3>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Title</th>
                <th>Department</th>
                <th>Resort</th>
                <th>Shift</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-resort-accent/20 border border-resort-accent/30 flex items-center justify-center">
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
                  <td>{s.title}</td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENTS[s.department]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                      {DEPARTMENTS[s.department]?.label || s.department}
                    </span>
                  </td>
                  <td className="text-resort-muted">{s.resort}</td>
                  <td>{s.shift}</td>
                  <td className="text-resort-muted">{s.joinDate}</td>
                  <td>{statusBadge(s.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
