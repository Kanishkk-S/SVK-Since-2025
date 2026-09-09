import { ReactNode, useEffect, useRef } from 'react'

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="w-full max-w-sm animate-[slideUp_0.18s_ease-out] rounded-t-card border border-line bg-white p-6 shadow-pop sm:rounded-card"
      >
        {children}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-title">
      <h2 id="confirm-title" className="font-display text-xl font-medium text-ink">
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-ink/70">{description}</div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-paper"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 rounded-chip px-4 py-2.5 text-sm font-semibold text-paper transition
            ${destructive ? 'bg-[#8C3B2B] hover:bg-[#762F22]' : 'bg-pine-600 hover:bg-pine-700'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
