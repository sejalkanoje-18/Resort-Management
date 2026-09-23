import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { Receipt, Plus, Eye, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { billingApi, reservationsApi } from '../../api/client'

export default function BillingModule() {
  const [invoicesList, setInvoicesList] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [folioData, setFolioData] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [payAmount, setPayAmount] = useState(0)
  const [payMethod, setPayMethod] = useState('Card')

  // Form State for manual folio charge
  const [activeRes, setActiveRes] = useState([])
  const [targetResId, setTargetResId] = useState('')
  const [chargeCat, setChargeCat] = useState('Dining')
  const [chargeDesc, setChargeDesc] = useState('')
  const [chargeAmt, setChargeAmt] = useState(1000)

  async function fetchInvoices() {
    try {
      const data = await billingApi.getInvoices(search)
      setInvoicesList(data)
    } catch (err) {
      console.error('Failed to load invoices:', err)
    }
  }

  useEffect(() => {
    fetchInvoices()
    reservationsApi.getAll().then(res => {
      setActiveRes(res)
      if (res.length > 0) setTargetResId(res[0].id)
    }).catch(() => {})
  }, [search])

  const openFolioModal = async (inv) => {
    setSelected(inv)
    try {
      const folio = await billingApi.getFolio(inv.reservationId)
      setFolioData(folio)
      setPayAmount(folio.breakdown.balance)
    } catch (err) {
      setFolioData(null)
    }
  }

  const handleRecordPayment = async () => {
    if (!selected || !payAmount) return
    try {
      await billingApi.payFolio(selected.reservationId, payAmount, payMethod)
      setShowPayModal(false)
      setSelected(null)
      fetchInvoices()
    } catch (err) {
      alert(err.message || 'Failed to record payment')
    }
  }

  const handleAddFolioCharge = async () => {
    if (!targetResId || !chargeDesc || !chargeAmt) return
    try {
      await billingApi.addCharge(targetResId, { category: chargeCat, description: chargeDesc, amount: Number(chargeAmt) })
      setShowCreate(false)
      setChargeDesc('')
      fetchInvoices()
    } catch (err) {
      alert(err.message || 'Failed to add charge')
    }
  }

  const filtered = invoicesList.filter(inv => {
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus
    return matchStatus
  })

  const totalRevenue = invoicesList.reduce((s, i) => s + (i.total || 0), 0)
  const totalPaid = invoicesList.reduce((s, i) => s + (i.paid || 0), 0)
  const totalPending = Math.max(0, totalRevenue - totalPaid)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Invoiced" value={`₹${(totalRevenue/100000).toFixed(1)}L`} icon={Receipt} color="gold" />
        <StatCard title="Collected" value={`₹${(totalPaid/100000).toFixed(1)}L`} icon={CheckCircle} color="green" />
        <StatCard title="Outstanding" value={`₹${(totalPending/100000).toFixed(1)}L`} icon={AlertCircle} color="red" />
        <StatCard title="Invoices" value={invoicesList.length} icon={Receipt} color="blue" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." className="w-60" />
        <select className="luxury-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={() => setShowCreate(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Add Folio Charge
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Guest</th>
                <th>Resort</th>
                <th>Stay Period</th>
                <th>Room Charges</th>
                <th>Extras</th>
                <th>Discount</th>
                <th>Taxes</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono text-resort-accent text-xs font-medium">{inv.id}</td>
                  <td className="font-medium">{inv.guest}</td>
                  <td className="text-resort-muted">{inv.resort}</td>
                  <td>
                    <p className="text-xs">{inv.checkIn}</p>
                    <p className="text-xs text-resort-muted">→ {inv.checkOut}</p>
                  </td>
                  <td className="text-resort-text">₹{inv.roomCharges ? inv.roomCharges.toLocaleString() : 0}</td>
                  <td className="text-resort-text">
                    ₹{((inv.diningCharges || 0) + (inv.spaCharges || 0) + (inv.otherCharges || 0)).toLocaleString()}
                  </td>
                  <td className="text-emerald-400">-₹{inv.discount ? inv.discount.toLocaleString() : 0}</td>
                  <td className="text-resort-muted">₹{inv.taxes ? inv.taxes.toLocaleString() : 0}</td>
                  <td className="font-bold text-resort-accent">₹{inv.total ? inv.total.toLocaleString() : 0}</td>
                  <td>
                    <div>
                      <p className="text-emerald-400 font-medium">₹{inv.paid ? inv.paid.toLocaleString() : 0}</p>
                      {inv.paid < inv.total && (
                        <p className="text-red-400 text-xs">Due: ₹{(inv.total - inv.paid).toLocaleString()}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-resort-muted text-xs">{inv.method || '—'}</td>
                  <td>{statusBadge(inv.status)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openFolioModal(inv)} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.print()} className="p-1.5 hover:bg-resort-slate rounded-lg text-resort-muted hover:text-resort-accent transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Folio Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Guest Folio — ${selected?.reservationId}`}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-resort-slate rounded-xl">
              <div>
                <p className="font-serif text-lg font-bold text-resort-text">{selected.guest}</p>
                <p className="text-resort-muted text-sm">{selected.resort} · Room {folioData?.room}</p>
                <p className="text-resort-muted text-sm">{selected.checkIn} → {selected.checkOut}</p>
              </div>
              {statusBadge(selected.status)}
            </div>

            {/* Folio Items */}
            {folioData && (
              <div className="space-y-2">
                <p className="text-resort-muted text-xs uppercase tracking-wider font-semibold">Folio Itemization</p>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {folioData.charges.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 bg-resort-slate rounded-lg text-sm">
                      <div>
                        <p className="text-resort-text font-medium">{c.description}</p>
                        <p className="text-resort-muted text-xs">{c.category} · {c.date}</p>
                      </div>
                      <span className="text-resort-accent font-semibold">₹{c.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-resort-border">
                  <div className="flex justify-between text-sm text-resort-muted">
                    <span>Subtotal</span>
                    <span>₹{folioData.breakdown.subtotal.toLocaleString()}</span>
                  </div>
                  {folioData.breakdown.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{folioData.breakdown.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-resort-muted">
                    <span>Taxes (GST 12%)</span>
                    <span>₹{folioData.breakdown.taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-resort-accent pt-2 border-t border-resort-border">
                    <span>Total Amount</span>
                    <span>₹{folioData.breakdown.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Amount Paid</span>
                    <span>₹{folioData.breakdown.paid.toLocaleString()}</span>
                  </div>
                  {folioData.breakdown.balance > 0 && (
                    <div className="flex justify-between text-sm font-bold text-red-400">
                      <span>Balance Due</span>
                      <span>₹{folioData.breakdown.balance.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => window.print()} className="luxury-btn flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                <Download className="w-4 h-4" /> Print / PDF Invoice
              </button>
              {folioData && folioData.breakdown.balance > 0 && (
                <button onClick={() => setShowPayModal(true)} className="luxury-btn-outline flex-1 py-2 text-sm">Record Payment</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Record Payment Modal */}
      <Modal open={showPayModal} onClose={() => setShowPayModal(false)} title="Record Guest Payment">
        <div className="space-y-4">
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Payment Amount (₹)</label>
            <input className="luxury-input" type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-resort-muted text-sm mb-1.5">Payment Method</label>
            <select className="luxury-select" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
              <option>Card</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowPayModal(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleRecordPayment} className="luxury-btn px-4 py-2">Confirm Payment</button>
          </div>
        </div>
      </Modal>

      {/* Generate / Add Folio Charge Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Charge to Guest Folio">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Select Reservation</label>
              <select className="luxury-select" value={targetResId} onChange={e => setTargetResId(e.target.value)}>
                {activeRes.map(r => (
                  <option key={r.id} value={r.id}>{r.id} — {r.guest} (Room {r.room})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Category</label>
              <select className="luxury-select" value={chargeCat} onChange={e => setChargeCat(e.target.value)}>
                <option>Dining</option>
                <option>Spa</option>
                <option>Laundry</option>
                <option>Excursion</option>
                <option>Other Services</option>
              </select>
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Amount (₹)</label>
              <input className="luxury-input" type="number" value={chargeAmt} onChange={e => setChargeAmt(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Description</label>
              <input className="luxury-input" value={chargeDesc} onChange={e => setChargeDesc(e.target.value)} placeholder="e.g. Express Laundry Service" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowCreate(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleAddFolioCharge} className="luxury-btn px-4 py-2">Post Charge</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
