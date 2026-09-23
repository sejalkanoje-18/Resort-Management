import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { monthlyRevenue } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-resort-card border border-resort-border rounded-xl p-3 shadow-luxury">
        <p className="text-resort-accent font-semibold mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="text-sm" style={{ color: p.color }}>
            {p.name}: ₹{(p.value / 100000).toFixed(1)}L
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  return (
    <div className="luxury-card p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-resort-text font-semibold">Revenue Overview</h3>
        <p className="text-resort-muted text-sm">Apr–Sep 2026 (in Lakhs ₹)</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={monthlyRevenue}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3558" />
          <XAxis dataKey="month" stroke="#8892b0" fontSize={12} />
          <YAxis stroke="#8892b0" fontSize={12} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#d4af37" fill="url(#revGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fill="url(#profGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="transparent" strokeDasharray="4 4" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
