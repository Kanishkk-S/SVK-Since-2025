import { useState } from 'react'
import { useToast } from './Toast'

export function SetupScreen({ onSave }: { onSave: (amount: number) => Promise<void> }) {
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { show } = useToast()

  const parsed = Math.round(Number(amount))
  const isValid = amount.trim() === '' || (!Number.isNaN(parsed) && parsed >= 0)

  const handleSave = async () => {
    const value = amount.trim() === '' ? 0 : parsed
    if (Number.isNaN(value) || value < 0) {
      setError('Enter a valid amount, or leave blank for ₹0.')
      return
    }
    setSubmitting(true)
    try {
      await onSave(value)
    } catch {
      show('Unable to save. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-7 shadow-card">
        <p className="font-display text-2xl text-ink">SVK</p>
        <p className="-mt-1 text-sm tracking-wide text-pine-600">Since 2025</p>

        <h1 className="mt-6 font-display text-xl font-medium text-ink">Initial setup</h1>
        <label htmlFor="prev-total" className="mt-4 block text-sm text-ink/60">
          Previous total spent
        </label>
        <div className="mt-1.5 flex items-center rounded-card border border-line bg-paper px-4 py-3 focus-within:border-pine-600">
          <span className="mr-2 font-display text-xl text-ink/50">₹</span>
          <input
            id="prev-total"
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="6000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^0-9]/g, ''))
              setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && isValid && handleSave()}
            className="w-full bg-transparent font-display text-xl text-ink outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-ink/45">
          This is the amount already spent before using this app. Leave blank to start from ₹0.
        </p>
        {error && <p className="mt-2 text-xs text-[#8C3B2B]">{error}</p>}

        <button
          onClick={handleSave}
          disabled={submitting}
          className="mt-6 w-full rounded-chip bg-pine-600 px-4 py-3 text-sm font-semibold text-paper transition hover:bg-pine-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save and continue'}
        </button>
      </div>
    </div>
  )
}
