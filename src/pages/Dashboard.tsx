import { useState } from 'react'
import { useSVKData } from '../hooks/useSVKData'
import { StatCard, formatRupees } from '../components/StatCard'
import { AddExpenseDialog } from '../components/AddExpenseDialog'
import { TodayEntriesDialog } from '../components/TodayEntriesDialog'
import { MembersDialog } from '../components/MembersDialog'
import { SetupScreen } from '../components/SetupScreen'

export function Dashboard() {
  const {
    loading,
    error,
    members,
    todaysEntries,
    totalSpent,
    todaysSpending,
    highest,
    needsSetup,
    addSpending,
    removeSpending,
    addMember,
    removeMember,
    savePreviousTotal,
  } = useSVKData()

  const [addOpen, setAddOpen] = useState(false)
  const [todayOpen, setTodayOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-ink/45">Loading SVK…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="max-w-xs text-center text-sm text-[#8C3B2B]">{error}</p>
      </div>
    )
  }

  if (needsSetup) {
    return <SetupScreen onSave={savePreviousTotal} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="signboard relative overflow-hidden bg-pine-700 pb-9 pt-8 text-center shadow-card">
        <span className="signboard-pin left-6" />
        <span className="signboard-pin right-6" />
        <p className="font-display text-5xl font-medium tracking-tight text-paper">SVK</p>
        <p className="mt-0.5 text-lg font-medium tracking-[0.04em] text-turmeric-400">Since 2025</p>
      </header>

      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-8 sm:max-w-lg">
        <div className="space-y-4">
          <StatCard
            icon="👥"
            label="Members"
            value={String(members.length)}
            hint="Tap to manage"
            onClick={() => setMembersOpen(true)}
          />

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon="💰" label="Total" value={formatRupees(totalSpent)} />
            <StatCard icon="🏆" label="Highest" value={formatRupees(highest)} tone="accent" />
          </div>

          <StatCard
            icon="🍴"
            label="Today's spending"
            value={formatRupees(todaysSpending)}
            hint={todaysEntries.length > 0 ? `${todaysEntries.length} entries — tap to view` : undefined}
            size="lg"
            onClick={() => setTodayOpen(true)}
          />
        </div>

        <p className="mt-8 text-center text-xs text-ink/30">
          Updates instantly for everyone with the link
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-paper via-paper/90 to-transparent px-4 pb-14 pt-10">
        <button
          onClick={() => setAddOpen(true)}
          className="w-full max-w-md rounded-chip bg-pine-600 px-6 py-3.5 text-center text-sm font-semibold text-paper shadow-pop transition hover:bg-pine-700 active:scale-[0.98] sm:max-w-lg"
        >
          + Add today
        </button>
      </div>

      <AddExpenseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        todaysSpending={todaysSpending}
        onAdd={addSpending}
      />
      <TodayEntriesDialog
        open={todayOpen}
        onClose={() => setTodayOpen(false)}
        entries={todaysEntries}
        todaysSpending={todaysSpending}
        onRemove={removeSpending}
      />
      <MembersDialog
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        members={members}
        onAdd={addMember}
        onRemove={removeMember}
      />
    </div>
  )
}