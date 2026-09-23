import React from 'react'
import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'No records found', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-resort-slate rounded-2xl mb-4">
        <Icon className="w-10 h-10 text-resort-muted" />
      </div>
      <p className="text-resort-text font-medium text-lg">{title}</p>
      {description && <p className="text-resort-muted text-sm mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
