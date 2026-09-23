import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { revenueByCategory } from '../../data/mockData'

const COLORS = ['#d4af37', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-resort-card border border-resort-border rounded-xl p-3 shadow-luxury">
        <p className="text-resort-accent font-semibold">{label}</p>
        <p className="text-resort-text text-sm">₹{(payload[0].value / 100000).toFixed(1)}L</p>
      </div>
    )
  }
  return null
}

export default function RevenueCategoryChart() {
  return (
    <div className="luxury-card p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-resort-text font-semibold">Revenue by Category</h3>
        <p className="text-resort-muted text-sm">Current month breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={revenueByCategory} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3558" horizontal={false} />
          <XAxis type="number" stroke="#8892b0" fontSize={12} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
          <YAxis type="category" dataKey="category" stroke="#8892b0" fontSize={12} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
            {revenueByCategory.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
