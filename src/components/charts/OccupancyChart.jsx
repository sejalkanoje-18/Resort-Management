import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { occupancyData } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-resort-card border border-resort-border rounded-xl p-3 shadow-luxury">
        <p className="text-resort-accent font-semibold mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-sm" style={{ color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    )
  }
  return null
}

export default function OccupancyChart() {
  return (
    <div className="luxury-card p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-resort-text font-semibold">Occupancy Trends</h3>
        <p className="text-resort-muted text-sm">By resort — Apr–Sep 2026 (%)</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={occupancyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3558" />
          <XAxis dataKey="month" stroke="#8892b0" fontSize={12} />
          <YAxis stroke="#8892b0" fontSize={12} tickFormatter={v => `${v}%`} domain={[40, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="goa"     name="Goa"     stroke="#d4af37" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="coorg"   name="Coorg"   stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="manali"  name="Manali"  stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="udaipur" name="Udaipur" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
