import React from 'react'
import clsx from 'clsx'

const variants = {
  gold:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  green:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red:     'bg-red-500/20 text-red-400 border-red-500/30',
  blue:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  yellow:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  gray:    'bg-gray-500/20 text-gray-400 border-gray-500/30',
  orange:  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  teal:    'bg-teal-500/20 text-teal-400 border-teal-500/30',
}

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant] || variants.gray,
      className
    )}>
      {children}
    </span>
  )
}

export function statusBadge(status) {
  const map = {
    active:        { label: 'Active',        variant: 'green'  },
    inactive:      { label: 'Inactive',      variant: 'gray'   },
    maintenance:   { label: 'Maintenance',   variant: 'orange' },
    available:     { label: 'Available',     variant: 'green'  },
    occupied:      { label: 'Occupied',      variant: 'blue'   },
    housekeeping:  { label: 'Housekeeping',  variant: 'purple' },
    'checked-in':  { label: 'Checked In',    variant: 'green'  },
    'checked-out': { label: 'Checked Out',   variant: 'gray'   },
    confirmed:     { label: 'Confirmed',     variant: 'blue'   },
    pending:       { label: 'Pending',       variant: 'yellow' },
    cancelled:     { label: 'Cancelled',     variant: 'red'    },
    paid:          { label: 'Paid',          variant: 'green'  },
    partial:       { label: 'Partial',       variant: 'yellow' },
    unpaid:        { label: 'Unpaid',        variant: 'red'    },
    'in-progress': { label: 'In Progress',   variant: 'blue'   },
    completed:     { label: 'Completed',     variant: 'green'  },
    resolved:      { label: 'Resolved',      variant: 'teal'   },
    high:          { label: 'High',          variant: 'red'    },
    medium:        { label: 'Medium',        variant: 'yellow' },
    low:           { label: 'Low',           variant: 'blue'   },
    Platinum:      { label: 'Platinum',      variant: 'purple' },
    Gold:          { label: 'Gold',          variant: 'gold'   },
    Silver:        { label: 'Silver',        variant: 'gray'   },
    Bronze:        { label: 'Bronze',        variant: 'orange' },
    'on-leave':    { label: 'On Leave',      variant: 'yellow' },
  }
  const entry = map[status] || { label: status, variant: 'gray' }
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}
