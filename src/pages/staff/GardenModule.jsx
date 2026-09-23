import React from 'react'
import { Leaf, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'

const TASKS = [
  { id: 1, area: 'Main Garden', task: 'Watering & Fertilization', assignee: 'Raman K', time: '07:00', status: 'completed', priority: 'high' },
  { id: 2, area: 'Pool Surroundings', task: 'Trim hedges and flower beds', assignee: 'Govind P', time: '09:00', status: 'in-progress', priority: 'medium' },
  { id: 3, area: 'Entrance Pathway', task: 'Sweep and maintain flower pots', assignee: 'Raman K', time: '10:30', status: 'pending', priority: 'medium' },
  { id: 4, area: 'Villa Grounds', task: 'Lawn mowing', assignee: 'Govind P', time: '13:00', status: 'pending', priority: 'low' },
  { id: 5, area: 'Outdoor Seating', task: 'Clean and arrange garden furniture', assignee: 'Raman K', time: '15:00', status: 'pending', priority: 'low' },
]

export default function GardenModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={TASKS.length} icon={Leaf} color="green" />
        <StatCard title="Completed" value={TASKS.filter(t=>t.status==='completed').length} icon={CheckCircle} color="green" />
        <StatCard title="In Progress" value={TASKS.filter(t=>t.status==='in-progress').length} icon={Clock} color="blue" />
        <StatCard title="Pending" value={TASKS.filter(t=>t.status==='pending').length} icon={AlertCircle} color="yellow" />
      </div>

      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Today's Ground Tasks</h3>
        <div className="space-y-3">
          {TASKS.map(task => (
            <div key={task.id} className="flex items-start justify-between p-4 bg-resort-slate rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-resort-text">{task.task}</p>
                  <p className="text-resort-muted text-sm">{task.area} · {task.assignee} · {task.time}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {statusBadge(task.status)}
                {statusBadge(task.priority)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
