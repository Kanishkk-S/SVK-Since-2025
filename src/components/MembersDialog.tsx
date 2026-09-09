import { useState } from 'react'
import { Modal, ConfirmDialog } from './ConfirmDialog'
import { useToast } from './Toast'
import { Member } from '../lib/supabase'

export function MembersDialog({
  open,
  onClose,
  members,
  onAdd,
  onRemove,
}: {
  open: boolean
  onClose: () => void
  members: Member[]
  onAdd: (name: string) => Promise<void>
  onRemove: (id: string) => Promise<void>
}) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [confirmAddName, setConfirmAddName] = useState<string | null>(null)
  const [pendingRemove, setPendingRemove] = useState<Member | null>(null)
  const [busy, setBusy] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const { show } = useToast()

  const startAdd = () => {
    setAdding(true)
    setName('')
    setNameError(null)
  }

  const requestAddConfirm = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError('Name is required.')
      return
    }
    setConfirmAddName(trimmed)
  }

  const confirmAdd = async () => {
    if (!confirmAddName) return
    setBusy(true)
    try {
      await onAdd(confirmAddName)
      show(`✓ ${confirmAddName} added to members`)
      setConfirmAddName(null)
      setAdding(false)
      setName('')
    } catch {
      show('Unable to add member. Please try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const confirmRemove = async () => {
    if (!pendingRemove) return
    setBusy(true)
    try {
      await onRemove(pendingRemove.id)
      show(`✓ ${pendingRemove.name} removed from members`)
      setPendingRemove(null)
    } catch {
      show('Unable to remove member. Please try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} labelledBy="members-title">
        <div className="flex items-baseline justify-between">
          <h2 id="members-title" className="font-display text-xl font-medium text-ink">
            SVK members
          </h2>
          <span className="text-sm text-ink/45">{members.length}</span>
        </div>

        <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
          {members.length === 0 && (
            <p className="rounded-card border border-dashed border-line bg-paper p-4 text-center text-sm text-ink/50">
              No members yet. Add the first one below.
            </p>
          )}
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-card border border-line bg-paper px-4 py-2.5"
            >
              <span className="text-sm font-medium text-ink">{m.name}</span>
              <button
                onClick={() => setPendingRemove(m)}
                aria-label={`Remove ${m.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-[#8C3B2B]"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="mt-4 rounded-card border border-line bg-paper p-4">
            <label htmlFor="member-name" className="text-sm text-ink/60">
              Name
            </label>
            <input
              id="member-name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && requestAddConfirm()}
              placeholder="Rahul"
              className="mt-1.5 w-full rounded-chip border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-pine-600"
            />
            {nameError && <p className="mt-1.5 text-xs text-[#8C3B2B]">{nameError}</p>}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 rounded-chip border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70 hover:bg-paper"
              >
                Cancel
              </button>
              <button
                onClick={requestAddConfirm}
                className="flex-1 rounded-chip bg-pine-600 px-4 py-2 text-sm font-semibold text-paper hover:bg-pine-700"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={startAdd}
            className="mt-4 w-full rounded-chip border border-dashed border-pine-400 bg-pine-50 px-4 py-2.5 text-sm font-semibold text-pine-700 transition hover:bg-pine-100"
          >
            + Add member
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-paper"
        >
          Close
        </button>
      </Modal>

      <ConfirmDialog
        open={confirmAddName !== null}
        title="Add member?"
        description={<>Add "{confirmAddName}" to SVK members?</>}
        confirmLabel="Confirm"
        onConfirm={confirmAdd}
        onCancel={() => !busy && setConfirmAddName(null)}
      />

      <ConfirmDialog
        open={pendingRemove !== null}
        title={`Remove "${pendingRemove?.name}" from SVK?`}
        description="This will not affect spending records."
        confirmLabel="Remove"
        destructive
        onConfirm={confirmRemove}
        onCancel={() => !busy && setPendingRemove(null)}
      />
    </>
  )
}
