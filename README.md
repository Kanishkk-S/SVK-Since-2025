# SVK — Since 2025

A shared, anonymous canteen-spending tracker for a friend group. React + Vite + TypeScript + Tailwind, backed by Supabase with realtime sync.

## What's included

- `src/pages/Dashboard.tsx` — the main (almost only) screen
- `src/components/` — StatCard, AddExpenseDialog, TodayEntriesDialog, MembersDialog, SetupScreen, ConfirmDialog/Modal, Toast
- `src/hooks/useSVKData.ts` — all data loading, realtime subscriptions, and the Total/Today/Highest calculations, in one place
- `src/lib/supabase.ts` — Supabase client + types
- `supabase/schema.sql` — tables, RLS policies, and Realtime setup

The design intentionally leans into the *canteen chit / token board* idea: a warm paper background with a fine dot-grid (like graph paper on a counter), a pine-green + turmeric palette instead of the usual cream/terracotta AI look, and Fraunces (a warm display serif) for the big numbers against Inter for everything else.

## 1. Create the Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in `supabase/schema.sql`.
3. At the bottom of that file there's a commented seed line — uncomment and run it with your real historical amount, **or** just leave it out and use the in-app Setup screen on first load (it does the same insert).
4. Under Project Settings → API, copy the **Project URL** and **anon public key**. Never use the service-role key here.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run it

```bash
npm install
npm run dev
```

Open the printed local URL. If no `app_settings` row exists yet, you'll land on the one-time Setup screen to enter the previous total (e.g. ₹6,000) — after that, everyone sees the normal dashboard.

## 4. Deploy

Push this folder to a GitHub repo, import it into Vercel, and add the two `VITE_SUPABASE_*` env vars in the Vercel project settings. Share the resulting URL with the group — there's no login, so the link is the access control.

## Using this with Antigravity / Gemini

This codebase is already a complete, working implementation of the spec — you can hand the whole project as-is. If you want Antigravity to extend it (e.g. add a feature later), give it:

1. This project folder as context.
2. `supabase/schema.sql` so it knows the exact schema and RLS rules already in place.
3. A pointer to `src/hooks/useSVKData.ts` — that file is the single source of truth for Total/Today/Highest math, so any new feature should read from it rather than recompute totals elsewhere.

Ask Antigravity to preserve the constraints called out in comments throughout the code (anonymous entries, no balance, previous_total kept out of `spending_entries`, etc.) rather than re-deriving them from scratch.

## Design tokens (for reference)

- **Colors**: paper `#FBF8F3`, ink `#20291F`, pine `#2F6844` (primary/actions), turmeric `#C77B2E` (highest/money accent)
- **Type**: Fraunces (display numbers, headings), Inter (UI text)
- **Shape**: 18px card radius, pill buttons, dashed rules on receipt-style summaries
