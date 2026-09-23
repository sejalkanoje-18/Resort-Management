import React from 'react'
import StatCard from '../../components/ui/StatCard'
import RevenueChart from '../../components/charts/RevenueChart'
import RevenueCategoryChart from '../../components/charts/RevenueCategoryChart'
import { monthlyRevenue, revenueByCategory } from '../../data/mockData'
import { DollarSign, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'

export default function OwnerRevenue() {
  const latest = monthlyRevenue[monthlyRevenue.length - 1]
  const prev = monthlyRevenue[monthlyRevenue.length - 2]
  const revGrowth = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sep Revenue" value={`₹${(latest.revenue/100000).toFixed(1)}L`} icon={DollarSign} trend={parseFloat(revGrowth)} trendLabel="vs Aug" color="gold" />
        <StatCard title="Sep Profit" value={`₹${(latest.profit/100000).toFixed(1)}L`} subtitle={`Margin: ${((latest.profit/latest.revenue)*100).toFixed(0)}%`} icon={TrendingUp} trend={8.2} trendLabel="vs Aug" color="green" />
        <StatCard title="Sep Expenses" value={`₹${(latest.expenses/100000).toFixed(1)}L`} icon={TrendingDown} color="red" />
        <StatCard title="YTD Revenue" value={`₹${(monthlyRevenue.reduce((s,m)=>s+m.revenue,0)/100000).toFixed(0)}L`} subtitle="Apr–Sep 2026" icon={BarChart2} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RevenueCategoryChart />
      </div>

      {/* P&L Table */}
      <div className="luxury-card p-6">
        <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Profit & Loss Summary</h3>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Margin %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map(m => (
                <tr key={m.month}>
                  <td className="font-medium">{m.month} 2026</td>
                  <td className="text-resort-accent">₹{(m.revenue/100000).toFixed(1)}L</td>
                  <td className="text-red-400">₹{(m.expenses/100000).toFixed(1)}L</td>
                  <td className="text-emerald-400 font-semibold">₹{(m.profit/100000).toFixed(1)}L</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-resort-slate rounded-full h-1.5 w-16">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${((m.profit/m.revenue)*100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="text-sm text-resort-text">{((m.profit/m.revenue)*100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
