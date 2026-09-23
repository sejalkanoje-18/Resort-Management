import React from 'react'
import { Shield, Check, X } from 'lucide-react'

const MODULES = [
  'Dashboard', 'Resort Mgmt', 'Room Mgmt', 'Reservations', 'Guests',
  'Housekeeping', 'Maintenance', 'Billing', 'Reports', 'Users & Roles',
  'Settings', 'Audit Logs'
]

const ROLES_MATRIX = {
  Owner:      [true, true, true, true, true, true, true, true, true, true, true, true],
  Management: [true, true, true, true, true, true, true, true, true, true, true, false],
  'Front Desk': [true, false, false, true, true, false, false, false, false, false, false, false],
  Housekeeping: [true, false, false, false, false, true, false, false, false, false, false, false],
  Maintenance:  [true, false, false, false, false, false, true, false, false, false, false, false],
  'F&B':        [true, false, false, true, false, false, false, false, false, false, false, false],
  Spa:          [true, false, false, true, false, false, false, false, false, false, false, false],
}

export default function PermissionsModule() {
  return (
    <div className="space-y-6">
      <div className="luxury-card p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-resort-border">
                <th className="text-left py-4 px-4 text-resort-muted font-medium uppercase tracking-wider text-xs sticky left-0 bg-resort-card">
                  Role
                </th>
                {MODULES.map(m => (
                  <th key={m} className="py-4 px-3 text-resort-muted font-medium text-xs text-center min-w-[100px]">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-resort-accent" />
                      <span className="leading-tight">{m}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(ROLES_MATRIX).map(([role, perms]) => (
                <tr key={role} className="border-b border-resort-border/50 hover:bg-resort-slate/30">
                  <td className="py-4 px-4 font-semibold text-resort-text sticky left-0 bg-resort-card">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        role === 'Owner' ? 'bg-yellow-400' :
                        role === 'Management' ? 'bg-blue-400' : 'bg-emerald-400'
                      }`} />
                      {role}
                    </div>
                  </td>
                  {perms.map((allowed, i) => (
                    <td key={i} className="py-4 px-3 text-center">
                      {allowed
                        ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        : <X className="w-4 h-4 text-red-400/40 mx-auto" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Permission Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { role: 'Owner', desc: 'Full access to all modules, settings, and sensitive data', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { role: 'Management', desc: 'Full operational access except user management and audit logs', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { role: 'Front Desk', desc: 'Reservations, guest management and basic check-in/out operations', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { role: 'Housekeeping', desc: 'View and update housekeeping task assignments', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { role: 'Maintenance', desc: 'View and update assigned maintenance tickets', color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { role: 'F&B / Spa', desc: 'Access to reservations for scheduling services', color: 'text-teal-400', bg: 'bg-teal-500/10' },
          ].map(item => (
            <div key={item.role} className={`p-4 rounded-xl border border-resort-border ${item.bg}`}>
              <p className={`font-semibold ${item.color}`}>{item.role}</p>
              <p className="text-resort-muted text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
