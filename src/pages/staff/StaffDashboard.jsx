import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { housekeepingTasks, maintenanceTasks, reservations } from '../../data/mockData'
import StatCard from '../../components/ui/StatCard'
import { statusBadge } from '../../components/ui/Badge'
import { CheckCircle, Clock, AlertCircle, ClipboardList, User, BedDouble } from 'lucide-react'

const DEPT_WELCOME = {
  front_desk:   { title: 'Front Desk Operations', emoji: '🏨', desc: 'Manage check-ins, check-outs and guest requests' },
  housekeeping: { title: 'Housekeeping Dashboard', emoji: '✨', desc: 'View and manage your assigned room tasks' },
  maintenance:  { title: 'Maintenance Dashboard', emoji: '🔧', desc: 'View and update assigned work orders' },
  fnb:          { title: 'Food & Beverage', emoji: '🍽️', desc: 'Manage restaurant and room service orders' },
  spa:          { title: 'Spa & Wellness', emoji: '💆', desc: 'Manage spa bookings and treatment schedules' },
  garden:       { title: 'Garden & Grounds', emoji: '🌿', desc: 'View assigned grounds maintenance tasks' },
}

export default function StaffDashboard() {
  const { user } = useAuth()
  const dept = user?.department || 'front_desk'
  const deptInfo = DEPT_WELCOME[dept] || DEPT_WELCOME.front_desk

  const myHKTasks = housekeepingTasks.filter(t => t.assignee.toLowerCase().includes(user?.name?.split(' ')[0]?.toLowerCase() || ''))
  const myMTasks  = maintenanceTasks.filter(t => t.assignee.toLowerCase().includes(user?.name?.split(' ')[0]?.toLowerCase() || ''))
  const myTasks   = dept === 'housekeeping' ? myHKTasks : dept === 'maintenance' ? myMTasks : []

  const todayArrivals  = reservations.filter(r => r.checkIn === '2026-09-21')
  const todayDepartures = reservations.filter(r => r.checkOut === '2026-09-21')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="luxury-card p-6 bg-gradient-to-r from-resort-navy to-resort-slate">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-resort-accent/20 border border-resort-accent/40 flex items-center justify-center text-3xl">
            {deptInfo.emoji}
          </div>
          <div>
            <h2 className="font-serif text-2xl text-resort-text font-semibold">{deptInfo.title}</h2>
            <p className="text-resort-muted mt-1">{deptInfo.desc}</p>
            <p className="text-resort-accent text-sm mt-1 font-medium">
              Good morning, {user?.name?.split(' ')[0]}! Have a great shift.
            </p>
          </div>
        </div>
      </div>

      {dept === 'front_desk' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Today's Arrivals" value={todayArrivals.length} icon={User} color="green" />
            <StatCard title="Today's Departures" value={todayDepartures.length} icon={User} color="blue" />
            <StatCard title="Currently Checked In" value={reservations.filter(r=>r.status==='checked-in').length} icon={BedDouble} color="gold" />
            <StatCard title="Pending Requests" value={3} icon={Clock} color="purple" />
          </div>
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Today's Arrivals</h3>
            <div className="overflow-x-auto">
              <table className="table-luxury">
                <thead><tr><th>Res. ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Adults</th><th>Status</th></tr></thead>
                <tbody>
                  {reservations.filter(r => ['confirmed','checked-in'].includes(r.status)).slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td className="font-mono text-xs text-resort-accent">{r.id}</td>
                      <td className="font-medium">{r.guest}</td>
                      <td>{r.room}</td>
                      <td>{r.checkIn}</td>
                      <td>{r.adults}</td>
                      <td>{statusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(dept === 'housekeeping' || dept === 'maintenance') && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard title="My Tasks" value={myTasks.length} icon={ClipboardList} color="purple" />
            <StatCard title="Completed" value={myTasks.filter(t=>t.status==='completed'||t.status==='resolved').length} icon={CheckCircle} color="green" />
            <StatCard title="Pending" value={myTasks.filter(t=>t.status==='pending').length} icon={Clock} color="yellow" />
          </div>
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">My Assigned Tasks</h3>
            <div className="space-y-3">
              {myTasks.map((task, i) => (
                <div key={i} className="flex items-start justify-between p-4 bg-resort-slate rounded-xl">
                  <div>
                    <p className="font-medium text-resort-text">
                      {dept === 'housekeeping' ? `Room ${task.room} — ${task.type}` : `${task.ticketNo}: ${task.issue}`}
                    </p>
                    <p className="text-resort-muted text-sm mt-0.5">
                      {dept === 'housekeeping' ? task.scheduled : `${task.location} · ${task.scheduled}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(task.status)}
                    {statusBadge(task.priority)}
                  </div>
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="text-center py-8 text-resort-muted">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400 opacity-50" />
                  <p>No tasks assigned to you today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!['front_desk','housekeeping','maintenance'].includes(dept) && (
        <div className="luxury-card p-6 text-center">
          <div className="text-6xl mb-4">{deptInfo.emoji}</div>
          <p className="font-serif text-xl text-resort-text font-semibold">{deptInfo.title}</p>
          <p className="text-resort-muted mt-2">{deptInfo.desc}</p>
          <p className="text-resort-muted text-sm mt-4">Use the sidebar to navigate to your module.</p>
        </div>
      )}
    </div>
  )
}
