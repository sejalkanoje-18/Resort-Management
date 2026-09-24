import React, { useState, useEffect } from 'react'
import { statusBadge } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import SearchBar from '../../components/ui/SearchBar'
import { Tag, Plus, CheckCircle, Percent, Calendar, Copy, Sparkles } from 'lucide-react'
import { offersApi } from '../../api/client'

export default function OffersModule() {
  const [offers, setOffers] = useState([])
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)

  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [discountVal, setDiscountVal] = useState(15)
  const [validFrom, setValidFrom] = useState('2026-09-24')
  const [validTo, setValidTo] = useState('2026-12-31')
  const [minSpend, setMinSpend] = useState(5000)

  async function fetchOffers() {
    try {
      const data = await offersApi.getAll()
      setOffers(data || [])
    } catch (err) {
      console.error('Failed to fetch offers:', err)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleCreateOffer = async () => {
    if (!code || !title) {
      alert('Please fill in Code and Title')
      return
    }

    try {
      await offersApi.create({
        code: code.toUpperCase(),
        title,
        discountPercent: discountType === 'percent' ? Number(discountVal) : 0,
        discountAmount: discountType === 'amount' ? Number(discountVal) : 0,
        validFrom,
        validTo,
        minSpend: Number(minSpend),
        isActive: 1,
      })
      setShowAdd(false)
      setCode('')
      setTitle('')
      fetchOffers()
    } catch (err) {
      alert(err.message || 'Failed to create offer')
    }
  }

  const handleCopyCode = (promoCode) => {
    navigator.clipboard.writeText(promoCode)
    setCopiedCode(promoCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filtered = offers.filter(o => {
    const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) || o.title.toLowerCase().includes(search.toLowerCase())
    const matchActive = filterActive === 'all' ? true : filterActive === 'active' ? o.isActive === 1 : o.isActive === 0
    return matchSearch && matchActive
  })

  const activeCount = offers.filter(o => o.isActive === 1).length

  return (
    <div className="space-y-6">
      <div className="luxury-card p-6 bg-gradient-to-r from-amber-500/10 via-resort-navy to-resort-navy border border-amber-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h2 className="font-serif text-2xl text-resort-text font-bold">Offers, Packages & Seasonal Pricing</h2>
        </div>
        <p className="text-resort-muted text-sm max-w-2xl">
          Manage promotional packages, discount coupons, and seasonal offers applied by Receptionists during reservation creation or front-desk check-in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Promotions" value={activeCount} icon={Tag} color="gold" />
        <StatCard title="Total Offers Created" value={offers.length} icon={Sparkles} color="purple" />
        <StatCard title="Applied Discounts" value="₹1.4L" icon={Percent} color="green" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search coupon code or package title..." className="w-64" />
        <select className="luxury-select w-40" value={filterActive} onChange={e => setFilterActive(e.target.value)}>
          <option value="all">All Offers</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="luxury-btn flex items-center gap-2 text-sm ml-auto">
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(offer => (
          <div key={offer.id} className="luxury-card p-5 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-amber-500">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {offer.code}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-resort-text mt-2">{offer.title}</h3>
                </div>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="p-1.5 rounded-lg bg-resort-slate hover:bg-resort-slate/80 text-resort-muted hover:text-resort-accent transition-colors flex items-center gap-1 text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCode === offer.code ? <span className="text-emerald-400 font-medium">Copied!</span> : <span>Copy</span>}
                </button>
              </div>

              <div className="bg-resort-slate p-3 rounded-xl space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-resort-muted">Discount</span>
                  <span className="font-bold text-emerald-400 text-base">
                    {offer.discountPercent > 0 ? `${offer.discountPercent}% OFF` : `₹${offer.discountAmount.toLocaleString()} OFF`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-resort-muted">
                  <span>Min Spend</span>
                  <span className="text-resort-text">₹{offer.minSpend ? offer.minSpend.toLocaleString() : 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-resort-muted">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Validity</span>
                  <span className="text-resort-text">{offer.validFrom || 'Immediate'} → {offer.validTo || 'Ongoing'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-resort-border text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${offer.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {offer.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-resort-muted">Applicable at booking</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create New Offer / Promo Package">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Promo Code *</label>
              <input
                className="luxury-input font-mono uppercase"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. SUMMER25"
              />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Discount Type</label>
              <select className="luxury-select" value={discountType} onChange={e => setDiscountType(e.target.value)}>
                <option value="percent">Percentage (%)</option>
                <option value="amount">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-resort-muted text-sm mb-1.5">Offer Title *</label>
              <input
                className="luxury-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Summer Getaway 15% Special Discount"
              />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">
                {discountType === 'percent' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
              </label>
              <input
                className="luxury-input"
                type="number"
                value={discountVal}
                onChange={e => setDiscountVal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Minimum Spend (₹)</label>
              <input
                className="luxury-input"
                type="number"
                value={minSpend}
                onChange={e => setMinSpend(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Valid From</label>
              <input className="luxury-input" type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-resort-muted text-sm mb-1.5">Valid Until</label>
              <input className="luxury-input" type="date" value={validTo} onChange={e => setValidTo(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="luxury-btn-outline px-4 py-2">Cancel</button>
            <button onClick={handleCreateOffer} className="luxury-btn px-4 py-2">Create & Activate Offer</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
