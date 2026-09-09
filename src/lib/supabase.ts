import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently breaking the dashboard.
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Member = {
  id: string
  name: string
  created_at: string
}

export type SpendingEntry = {
  id: string
  date: string // 'YYYY-MM-DD'
  amount: number
  created_at: string
}

export type AppSettings = {
  id: string
  previous_total: number
  created_at: string
}
