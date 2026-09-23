import React from 'react'
import clsx from 'clsx'

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'gold', className }) {
  const colorMap = {
    gold:    { bg: 'bg-yellow-500/10',  icon: 'text-yellow-400',  border: 'border-yellow-500/20' },
    green:   { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20' },
    purple:  { bg: 'bg-purple-500/10',  icon: 'text-purple-400',  border: 'border-purple-500/20' },
    red:     { bg: 'bg-red-500/10',     icon: 'text-red-400',     border: 'border-red-500/20' },
    orange:  { bg: 'bg-orange-500/10',  icon: 'text-orange-400',  border: 'border-orange-500/20' },
  }
  const c = colorMap[color] || colorMap.gold

  return (
    <div className={clsx('luxury-card p-6 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-resort-muted text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-resort-text mt-2 font-serif">{value}</p>
          {subtitle && <p className="text-resort-muted text-sm mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={clsx(
                'text-xs font-medium',
                trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-resort-muted'
              )}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-resort-muted text-xs">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-xl border', c.bg, c.border)}>
            <Icon className={clsx('w-6 h-6', c.icon)} />
          </div>
        )}
      </div>
    </div>
  )
}
