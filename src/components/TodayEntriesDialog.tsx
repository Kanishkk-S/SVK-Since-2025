import { useState } from 'react'
import { Modal, ConfirmDialog } from './ConfirmDialog'
import { formatRupees } from './StatCard'
import { useToast } from './Toast'
import { SpendingEntry } from '../lib/supabase'

export function TodayEntriesDialog({
  open,
  onClose,
  entries,
  todaysSpending,
  onRemove,
}: {
  open: boolean
  onClose: () => void
  entries: SpendingEntry[]
  todaysSpending: number
  onRemove: (id: string) => Promise<void>
}) {
  const [pending, setPending] = useState<SpendingEntry | null>(null)
  const [removing, setRemoving] = useState(false)
  const { show } = useToast()

  const handleRemove = async () => {
    if (!pending) return
    setRemoving(true)
    try {
      await onRemove(pending.id)
      show(`✓ ${formatRupees(Number(pending.amount))} removed`)
      setPending(null)
    } catch {
      show('Unable to remove the entry. Please try again.', 'error')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} labelledBy="today-entries-title">
        <div className="flex items-baseline justify-between">
          <h2 id="today-entries-title" className="font-display text-xl font-medium text-ink">
            Today's entries
          </h2>
          <span className="text-sm text-ink/45">{entries.length} added</span>
        </div>

        <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
          {entries.length === 0 && (
            <p className="rounded-card border border-dashed border-line bg-paper p-4 text-center text-sm text-ink/50">
              Nothing added today yet.
            </p>
          )}
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-card border border-line bg-paper px-4 py-2.5"
            >
              <span className="font-display text-lg tabular-nums text-ink">{formatRupees(Number(e.amount))}</span>
              <button
                onClick={() => setPending(e)}
                aria-label={`Remove ${formatRupees(Number(e.amount))} entry`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-[#8C3B2B]"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-line pt-3 text-sm font-medium">
          <span className="text-ink/60">Today's total</span>
          <span className="tabular-nums text-ink">{formatRupees(todaysSpending)}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-paper"
        >
          Close
        </button>
      </Modal>

      <ConfirmDialog
        open={pending !== null}
        title={`Remove ${pending ? formatRupees(Number(pending.amount)) : ''}?`}
        description={
          pending && (
            <>
              Today's spending will change:
              <br />
              <span className="tabular-nums">
                {formatRupees(todaysSpending)} → {formatRupees(todaysSpending - Number(pending.amount))}
              </span>
            </>
          )
        }
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemove}
        onCancel={() => !removing && setPending(null)}
      />
    </>
  )
}
