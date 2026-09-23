import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Star, CheckCircle, Sparkles, ThumbsUp, MessageSquare, Send } from 'lucide-react'
import clsx from 'clsx'

const CATEGORIES = [
  { key: 'overall',    label: 'Overall Experience', icon: '🏨' },
  { key: 'room',       label: 'Room & Cleanliness',  icon: '🛏️' },
  { key: 'food',       label: 'Food & Dining',       icon: '🍽️' },
  { key: 'service',    label: 'Staff & Service',      icon: '👨‍💼' },
  { key: 'spa',        label: 'Spa & Wellness',       icon: '💆' },
  { key: 'value',      label: 'Value for Money',      icon: '💰' },
]

const PAST_REVIEWS = [
  {
    resort: 'Serenity Coorg',   image: '🌿', date: '2026-08-14',
    overall: 5, comment: 'Absolutely stunning property! The coffee plantation walks were a highlight. Staff was incredibly warm and attentive. Will definitely return.',
    helpful: 24, tags: ['Excellent Staff', 'Beautiful Views', 'Great Food'],
  },
  {
    resort: 'Serenity Goa',     image: '🏖️', date: '2026-06-25',
    overall: 4, comment: 'Lovely beachside resort. The spa treatments were world-class. Room could have been slightly bigger but overall a 5-star experience.',
    helpful: 18, tags: ['Amazing Spa', 'Beach Access', 'Recommend'],
  },
]

function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0)
  const sz = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none transition-transform hover:scale-110">
          <Star className={clsx(sz, 'transition-colors',
            n <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-resort-border')} />
        </button>
      ))}
    </div>
  )
}

const LABEL = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }
const TAG_OPTIONS = ['Excellent Service', 'Beautiful Property', 'Amazing Food', 'Great Spa', 'Clean Rooms', 'Friendly Staff', 'Good Value', 'Scenic Views', 'Would Recommend', 'Perfect for Couples', 'Great for Families']

export default function GuestFeedback() {
  const { user } = useAuth()
  const location = useLocation()
  const preRes = location.state?.reservation

  const [submitted, setSubmitted] = useState(false)
  const [ratings, setRatings] = useState({ overall: 0, room: 0, food: 0, service: 0, spa: 0, value: 0 })
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedResort, setSelectedResort] = useState(preRes?.resort || 'Serenity Goa')
  const [activeTab, setActiveTab] = useState('write')

  const setRating = k => v => setRatings(r => ({ ...r, [k]: v }))
  const toggleTag = t => setSelectedTags(tt => tt.includes(t) ? tt.filter(x => x !== t) : [...tt, t])
  const avgRating = Object.values(ratings).filter(v => v > 0)
  const avg = avgRating.length ? (avgRating.reduce((s, v) => s + v, 0) / avgRating.length).toFixed(1) : 0

  const handleSubmit = e => {
    e.preventDefault()
    if (ratings.overall === 0) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="luxury-card p-10 text-center">
          <div className="w-20 h-20 bg-resort-accent/10 border-2 border-resort-accent/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-resort-accent" />
          </div>
          <h2 className="font-serif text-3xl text-resort-text font-bold mb-2">Thank You!</h2>
          <p className="text-resort-muted mb-2">Your review has been submitted successfully.</p>
          <p className="text-resort-muted text-sm mb-6">Your feedback helps us continuously improve the Serenity experience for all guests.</p>
          <div className="flex items-center justify-center gap-2 p-4 bg-resort-accent/10 border border-resort-accent/30 rounded-xl mb-6">
            <Sparkles className="w-5 h-5 text-resort-accent" />
            <p className="text-resort-accent font-semibold">You earned <strong>100 bonus loyalty points</strong> for your review!</p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => { setSubmitted(false); setRatings({ overall: 0, room: 0, food: 0, service: 0, spa: 0, value: 0 }); setComment(''); setSelectedTags([]) }}
              className="luxury-btn-outline px-6 py-2.5 text-sm">Write Another Review</button>
            <button onClick={() => setActiveTab('history')} className="luxury-btn px-6 py-2.5 text-sm">View My Reviews</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1 bg-resort-slate rounded-xl p-1 w-fit">
        {[
          { id: 'write',   label: 'Write a Review', icon: MessageSquare },
          { id: 'history', label: 'My Reviews',      icon: Star },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.id ? 'bg-resort-accent text-resort-dark' : 'text-resort-muted hover:text-resort-text')}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* ── Write Review ──────────────────────────────────── */}
      {activeTab === 'write' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resort selector */}
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-4">Which resort are you reviewing?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Serenity Goa',     img: '🏖️' },
                { name: 'Serenity Coorg',   img: '🌿' },
                { name: 'Serenity Manali',  img: '🏔️' },
                { name: 'Serenity Udaipur', img: '🏰' },
              ].map(r => (
                <button type="button" key={r.name} onClick={() => setSelectedResort(r.name)}
                  className={clsx('p-4 rounded-xl border text-center transition-all',
                    selectedResort === r.name ? 'border-resort-accent bg-resort-accent/10' : 'border-resort-border hover:border-resort-border/80')}>
                  <span className="text-3xl block mb-2">{r.img}</span>
                  <p className={clsx('text-xs font-medium leading-tight', selectedResort === r.name ? 'text-resort-accent' : 'text-resort-muted')}>
                    {r.name.replace('Serenity ', '')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="luxury-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-resort-text font-semibold">Rate Your Experience</h3>
              {Number(avg) > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-resort-text text-lg">{avg}</span>
                  <span className="text-resort-muted text-sm">{LABEL[Math.round(Number(avg))]}</span>
                </div>
              )}
            </div>
            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 w-44">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-resort-text text-sm font-medium">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={ratings[cat.key]} onChange={setRating(cat.key)} />
                    {ratings[cat.key] > 0 && (
                      <span className="text-resort-muted text-xs w-16">{LABEL[ratings[cat.key]]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {ratings.overall === 0 && (
              <p className="text-resort-muted text-xs mt-4">* Overall rating is required</p>
            )}
          </div>

          {/* Tags */}
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-2">Quick Tags</h3>
            <p className="text-resort-muted text-sm mb-4">Select all that apply to your stay</p>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button type="button" key={tag} onClick={() => toggleTag(tag)}
                  className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm transition-all',
                    selectedTags.includes(tag) ? 'border-resort-accent bg-resort-accent/10 text-resort-accent' : 'border-resort-border text-resort-muted hover:text-resort-text')}>
                  {selectedTags.includes(tag) && <CheckCircle className="w-3 h-3" />}
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div className="luxury-card p-6">
            <h3 className="font-serif text-lg text-resort-text font-semibold mb-2">Tell us more</h3>
            <p className="text-resort-muted text-sm mb-4">Share your experience in detail — it helps future guests make the right choice</p>
            <textarea
              className="luxury-input h-36 resize-none"
              placeholder="Describe your stay — what stood out, what could be better, and who you'd recommend this resort to..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-resort-muted text-xs">{comment.length} / 1000 characters</span>
              {comment.length >= 50 && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Good length</span>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-resort-muted text-sm">
              <Sparkles className="w-4 h-4 text-resort-accent" />
              <span>Earn <strong className="text-resort-accent">100 bonus points</strong> for submitting a review</span>
            </div>
            <button type="submit" disabled={ratings.overall === 0}
              className={clsx('luxury-btn flex items-center gap-2 px-7 py-3', ratings.overall === 0 && 'opacity-50 cursor-not-allowed')}>
              <Send className="w-4 h-4" /> Submit Review
            </button>
          </div>
        </form>
      )}

      {/* ── My Review History ─────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {PAST_REVIEWS.map((rev, i) => (
            <div key={i} className="luxury-card p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rev.image}</span>
                  <div>
                    <p className="font-serif text-resort-text font-semibold">{rev.resort}</p>
                    <p className="text-resort-muted text-xs">Stay ended {rev.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={clsx('w-5 h-5', n <= rev.overall ? 'text-yellow-400 fill-yellow-400' : 'text-resort-border')} />
                  ))}
                  <span className="text-resort-muted text-sm ml-1">({rev.overall}/5)</span>
                </div>
              </div>
              <p className="text-resort-text text-sm leading-relaxed mb-4">{rev.comment}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {rev.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-resort-accent/10 border border-resort-accent/30 rounded-full text-resort-accent text-xs">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-resort-muted text-sm">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{rev.helpful} guests found this helpful</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
