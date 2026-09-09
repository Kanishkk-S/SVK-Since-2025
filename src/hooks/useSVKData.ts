import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, Member, SpendingEntry, AppSettings } from '../lib/supabase'

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function useSVKData() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [entries, setEntries] = useState<SpendingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [today, setToday] = useState(todayISO())

  const loadAll = useCallback(async () => {
    setError(null)
    const [settingsRes, membersRes, entriesRes] = await Promise.all([
      supabase.from('app_settings').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('spending_entries').select('*').order('created_at', { ascending: false }),
    ])

    if (settingsRes.error || membersRes.error || entriesRes.error) {
      setError('Unable to load SVK data. Please try again.')
      setLoading(false)
      return
    }

    setSettings(settingsRes.data ?? null)
    setMembers(membersRes.data ?? [])
    setEntries(entriesRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Keep "today" correct if the tab stays open across midnight.
  useEffect(() => {
    const id = setInterval(() => setToday(todayISO()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Realtime subscriptions — individual entries are the source of truth.
  useEffect(() => {
    const channel = supabase
      .channel('svk-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spending_entries' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => loadAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () => loadAll())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadAll])

  const previousTotal = settings?.previous_total ?? 0

  const newSpendingSum = useMemo(
    () => entries.reduce((sum, e) => sum + Number(e.amount), 0),
    [entries]
  )

  const totalSpent = previousTotal + newSpendingSum

  const todaysEntries = useMemo(
    () => entries.filter((e) => e.date === today),
    [entries, today]
  )

  const todaysSpending = useMemo(
    () => todaysEntries.reduce((sum, e) => sum + Number(e.amount), 0),
    [todaysEntries]
  )

  const highest = useMemo(() => {
    const byDate = new Map<string, number>()
    for (const e of entries) {
      byDate.set(e.date, (byDate.get(e.date) ?? 0) + Number(e.amount))
    }
    let max = 0
    for (const v of byDate.values()) if (v > max) max = v
    return max
  }, [entries])

  const addSpending = useCallback(async (amount: number) => {
    const { error: insertError } = await supabase
      .from('spending_entries')
      .insert({ amount, date: todayISO() })
    if (insertError) throw insertError
    await loadAll()
  }, [loadAll])

  const removeSpending = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('spending_entries').delete().eq('id', id)
    if (deleteError) throw deleteError
    await loadAll()
  }, [loadAll])

  const addMember = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Name cannot be empty.')
    const { error: insertError } = await supabase.from('members').insert({ name: trimmed })
    if (insertError) throw insertError
    await loadAll()
  }, [loadAll])

  const removeMember = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('members').delete().eq('id', id)
    if (deleteError) throw deleteError
    await loadAll()
  }, [loadAll])

  const savePreviousTotal = useCallback(async (amount: number) => {
    const { error: insertError } = await supabase.from('app_settings').insert({ previous_total: amount })
    if (insertError) throw insertError
    await loadAll()
  }, [loadAll])

  return {
    loading,
    error,
    settings,
    members,
    entries,
    todaysEntries,
    totalSpent,
    todaysSpending,
    highest,
    needsSetup: settings === null && !loading,
    addSpending,
    removeSpending,
    addMember,
    removeMember,
    savePreviousTotal,
    refresh: loadAll,
  }
}
