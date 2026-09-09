import { useState } from 'react'
import { Modal } from './ConfirmDialog'
import { formatRupees } from './StatCard'
import { useToast } from './Toast'

export function AddExpenseDialog({
  open,
  onClose,
  todaysSpending,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  todaysSpending: number
  onAdd: (amount: number) => Promise<void>
}) {
  const [amount, setAmount] = useState('')
  const [stage, setStage] = useState<'input' | 'confirm'>('input')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { show } = useToast()

  const reset = () => {
    setAmount('')
    setStage('input')
    setValidationError(null)
    setSubmitting(false)
  }

  const close = () => {
    reset()
    onClose()
  }

  const parsed = Math.round(Number(amount))
  const isValid = amount.trim() !== '' && !Number.isNaN(parsed) && parsed > 0

  const handleContinue = () => {
    if (!isValid) {
      setValidationError('Enter a whole number greater than ₹0.')
      return
    }
    setValidationError(null)
    setStage('confirm')
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onAdd(parsed)
      show(`✓ ${formatRupees(parsed)} added to today's spending`)
      close()
    } catch {
      show('Unable to save the expense. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={close} labelledBy="add-expense-title">
      {stage === 'input' ? (
        <>
          <h2 id="add-expense-title" className="font-display text-xl font-medium text-ink">
            Add today's spending
          </h2>
          <div className="mt-5">
            <label htmlFor="amount" className="text-sm text-ink/60">
              Amount
            </label>
            <div className="mt-1.5 flex items-center rounded-card border border-line bg-paper px-4 py-3 focus-within:border-pine-600">
              <span className="mr-2 font-display text-xl text-ink/50">₹</span>
              <input
                id="amount"
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="100"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/[^0-9]/g, ''))
                  setValidationError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                className="w-full bg-transparent font-display text-xl text-ink outline-none"
              />
            </div>
            {validationError && <p className="mt-2 text-xs text-[#8C3B2B]">{validationError}</p>}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={close}
              className="flex-1 rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-paper"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 rounded-chip bg-pine-600 px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-pine-700"
            >
              Add
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 id="add-expense-title" className="font-display text-xl font-medium text-ink">
            Confirm addition
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Add {formatRupees(parsed)} to today's spending?
          </p>
          <dl className="mt-4 space-y-1.5 rounded-card border border-dashed border-line bg-paper p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Current</dt>
              <dd className="tabular-nums text-ink">{formatRupees(todaysSpending)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Adding</dt>
              <dd className="tabular-nums text-ink">{formatRupees(parsed)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-1.5 font-medium">
              <dt className="text-ink">New total</dt>
              <dd className="tabular-nums text-pine-700">{formatRupees(todaysSpending + parsed)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStage('input')}
              disabled={submitting}
              className="flex-1 rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-paper disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 rounded-chip bg-pine-600 px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-pine-700 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
