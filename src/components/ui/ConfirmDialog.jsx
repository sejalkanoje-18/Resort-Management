import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Action', message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4 items-start mb-6">
        <div className={`p-2 rounded-lg ${danger ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
          <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-yellow-400'}`} />
        </div>
        <p className="text-resort-muted text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="luxury-btn-outline px-4 py-2">Cancel</button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'luxury-btn'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
