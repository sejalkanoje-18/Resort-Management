import React, { useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import RevenueChart from '../../components/charts/RevenueChart'
import RevenueCategoryChart from '../../components/charts/RevenueCategoryChart'
import { monthlyRevenue, revenueByCategory } from '../../data/mockData'
import { DollarSign, TrendingUp, TrendingDown, BarChart2, CreditCard, RotateCcw, Receipt, PieChart } from 'lucide-react'

export default function OwnerRevenue() {
  const [activeView, setActiveView] = useState('summary') // summary, services, payments, taxes

  const latest = monthlyRevenue[monthlyRevenue.length - 1]
  const prev = monthlyRevenue[monthlyRevenue.length - 2]
  const revGrowth = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)

  // Financial Breakdown calculations
  const totalRoomRevenue = 2850000
  const totalFnBRevenue = 1120000
  const totalSpaRevenue = 530000
  const totalEventsRevenue = 350000

  const totalRefundsThisMonth = 42500
  const totalGstCollected = 642000
  const totalLuxuryTaxCollected = 185000

  const PAYMENT_GATEWAY_BREAKDOWN = [
    { method: 'UPI / NetBanking', percentage: 48, amount: 2328000, txns: 312 },
    { method: 'Credit / Debit Card', percentage: 38, amount: 1843000, txns: 194 },
    { method: 'OTA Auto-Collect', percentage: 10, amount: 485000, txns: 45 },
    { method: 'Cash (Front Desk)', percentage: 4, amount: 194000, txns: 28 },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sep Total Revenue" value={`₹${(latest.revenue/100000).toFixed(1)}L`} icon={DollarSign} trend={parseFloat(revGrowth)} trendLabel="vs Aug" color="gold" />
        <StatCard title="Sep Net Profit" value={`₹${(latest.profit/100000).toFixed(1)}L`} subtitle={`Margin: ${((latest.profit/latest.revenue)*100).toFixed(0)}%`} icon={TrendingUp} trend={8.2} trendLabel="vs Aug" color="green" />
        <StatCard title="Total Refunds Paid" value={`₹${(totalRefundsThisMonth/1000).toFixed(1)}K`} subtitle="Cancellation SLA" icon={RotateCcw} color="red" />
        <StatCard title="Taxes Collected" value={`₹${((totalGstCollected + totalLuxuryTaxCollected)/100000).toFixed(1)}L`} subtitle="GST & Luxury Tax" icon={Receipt} color="blue" />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="luxury-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-border pb-4">
          <div>
            <h3 className="font-serif text-xl text-resort-text font-bold">Financial Visibility & P&L Analysis</h3>
            <p className="text-resort-muted text-xs mt-0.5">Comprehensive oversight of Room vs Service revenue, Gateway payments, Refunds, and Tax obligations</p>
          </div>

          <div className="flex items-center gap-2 bg-resort-slate p-1 rounded-xl border border-resort-border overflow-x-auto">
            <button
              onClick={() => setActiveView('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeView === 'summary' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              P&L Overview
            </button>
            <button
              onClick={() => setActiveView('services')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeView === 'services' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Room vs Service Revenue
            </button>
            <button
              onClick={() => setActiveView('payments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeView === 'payments' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Gateways & Payments
            </button>
            <button
              onClick={() => setActiveView('taxes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeView === 'taxes' ? 'bg-resort-accent text-resort-dark shadow' : 'text-resort-muted hover:text-resort-text'
              }`}
            >
              Tax Breakdown
            </button>
          </div>
        </div>

        {/* View 1: Summary Charts & P&L Table */}
        {activeView === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <RevenueCategoryChart />
            </div>

            {/* P&L Table */}
            <div className="space-y-4 pt-2">
              <h4 className="font-serif text-lg text-resort-text font-semibold">Profit & Loss Statement (Apr–Sep 2026)</h4>
              <div className="overflow-x-auto">
                <table className="table-luxury">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Gross Revenue</th>
                      <th>Operating Expenses</th>
                      <th>Net Profit</th>
                      <th>Profit Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRevenue.map(m => (
                      <tr key={m.month}>
                        <td className="font-medium text-resort-text text-sm">{m.month} 2026</td>
                        <td className="text-resort-accent font-semibold">₹{(m.revenue/100000).toFixed(1)}L</td>
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
                            <span className="text-xs text-resort-text">{((m.profit/m.revenue)*100).toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Room vs Service Revenue */}
        {activeView === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-2">
              <p className="text-resort-muted text-xs uppercase tracking-wider">Room Revenue</p>
              <p className="text-2xl font-serif text-resort-accent font-bold">₹{(totalRoomRevenue/100000).toFixed(1)}L</p>
              <p className="text-xs text-resort-muted">58.7% of total earnings</p>
            </div>
            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-2">
              <p className="text-resort-muted text-xs uppercase tracking-wider">Food & Beverage</p>
              <p className="text-2xl font-serif text-blue-400 font-bold">₹{(totalFnBRevenue/100000).toFixed(1)}L</p>
              <p className="text-xs text-resort-muted">23.1% of total earnings</p>
            </div>
            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-2">
              <p className="text-resort-muted text-xs uppercase tracking-wider">Spa & Wellness</p>
              <p className="text-2xl font-serif text-purple-400 font-bold">₹{(totalSpaRevenue/100000).toFixed(1)}L</p>
              <p className="text-xs text-resort-muted">10.9% of total earnings</p>
            </div>
            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-2">
              <p className="text-resort-muted text-xs uppercase tracking-wider">Events & Banquets</p>
              <p className="text-2xl font-serif text-emerald-400 font-bold">₹{(totalEventsRevenue/100000).toFixed(1)}L</p>
              <p className="text-xs text-resort-muted">7.3% of total earnings</p>
            </div>
          </div>
        )}

        {/* View 3: Gateways & Payment Breakdown */}
        {activeView === 'payments' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-resort-text font-semibold">Payment Channel Distribution</h4>
            <div className="overflow-x-auto">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Share %</th>
                    <th>Processed Amount</th>
                    <th>Total Transactions</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_GATEWAY_BREAKDOWN.map(p => (
                    <tr key={p.method}>
                      <td className="font-medium text-resort-text text-sm">{p.method}</td>
                      <td>{p.percentage}%</td>
                      <td className="text-resort-accent font-semibold">₹{p.amount.toLocaleString()}</td>
                      <td className="text-resort-muted">{p.txns} txns</td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          Active & Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 4: Tax Breakdown */}
        {activeView === 'taxes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-3">
              <h4 className="font-serif text-base text-resort-text font-semibold">GST Collected (Goods & Services Tax)</h4>
              <p className="text-3xl font-serif text-gold-400 font-bold">₹{totalGstCollected.toLocaleString()}</p>
              <div className="text-xs text-resort-muted space-y-1">
                <p>CGST (9%): ₹{(totalGstCollected/2).toLocaleString()}</p>
                <p>SGST (9%): ₹{(totalGstCollected/2).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-resort-slate/80 border border-resort-border rounded-xl p-5 space-y-3">
              <h4 className="font-serif text-base text-resort-text font-semibold">State Luxury Tax</h4>
              <p className="text-3xl font-serif text-blue-400 font-bold">₹{totalLuxuryTaxCollected.toLocaleString()}</p>
              <div className="text-xs text-resort-muted space-y-1">
                <p>Assessed on Premium Suites & Villas</p>
                <p>Remitted to State Revenue Authority</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
