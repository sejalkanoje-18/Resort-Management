import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={clsx(
        'relative w-full luxury-card animate-fade-in max-h-[90vh] flex flex-col',
        sizeMap[size] || sizeMap.md
      )}>
        <div className="flex items-center justify-between p-6 border-b border-resort-border flex-shrink-0">
          <h2 className="font-serif text-xl text-resort-text font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-resort-slate rounded-lg transition-colors text-resort-muted hover:text-resort-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
