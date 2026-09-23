import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { bookingSourceData } from '../../data/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-resort-card border border-resort-border rounded-xl p-3 shadow-luxury">
        <p style={{ color: payload[0].payload.color }} className="font-semibold">{payload[0].name}</p>
        <p className="text-resort-text text-sm">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function BookingSourceChart() {
  return (
    <div className="luxury-card p-6">
      <div className="mb-4">
        <h3 className="font-serif text-lg text-resort-text font-semibold">Booking Sources</h3>
        <p className="text-resort-muted text-sm">Distribution by channel</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={bookingSourceData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {bookingSourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#8892b0', fontSize: '12px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
