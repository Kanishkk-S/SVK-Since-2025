-- SVK — Since 2025
-- Run this once in the Supabase SQL editor for your project.

create extension if not exists "uuid-ossp";

-- 1. Historical amount already spent before this app existed.
create table if not exists app_settings (
  id uuid primary key default uuid_generate_v4(),
  previous_total numeric not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Members. No link to spending — membership is purely a roster.
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

-- 3. Anonymous spending entries. No member_id / user_id / owner column, by design.
create table if not exists spending_entries (
  id uuid primary key default uuid_generate_v4(),
  date date not null default current_date,
  amount numeric not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists spending_entries_date_idx on spending_entries (date);

-- Row Level Security: this is a trusted-link, no-login app.
-- Anyone with the anon key (i.e. anyone with the link) may read and write
-- the operations the app needs — nothing else.
alter table app_settings enable row level security;
alter table members enable row level security;
alter table spending_entries enable row level security;

-- app_settings: readable by anyone with the link; writable only once via setup.
create policy "app_settings_select" on app_settings for select using (true);
create policy "app_settings_insert" on app_settings for insert with check (true);

-- members: full CRUD for the group (no delete of spending is possible via this table).
create policy "members_select" on members for select using (true);
create policy "members_insert" on members for insert with check (true);
create policy "members_delete" on members for delete using (true);

-- spending_entries: insert and delete only — never update, so history can't be
-- silently altered, only added or removed via the confirmed UI flows.
create policy "spending_select" on spending_entries for select using (true);
create policy "spending_insert" on spending_entries for insert with check (amount > 0);
create policy "spending_delete" on spending_entries for delete using (true);

-- Enable Realtime on the tables the dashboard listens to.
alter publication supabase_realtime add table spending_entries;
alter publication supabase_realtime add table members;
alter publication supabase_realtime add table app_settings;

-- Seed the previous total (edit the value, then run once).
-- insert into app_settings (previous_total) values (6000);
