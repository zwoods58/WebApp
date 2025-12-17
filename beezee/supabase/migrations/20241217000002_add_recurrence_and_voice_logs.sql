-- Add recurrence fields to bookings and tasks
alter table if exists public.bookings
  add column if not exists recurrence_frequency text check (recurrence_frequency in ('none','daily','weekly','monthly')) default 'none',
  add column if not exists recurrence_until date;

alter table if exists public.tasks
  add column if not exists recurrence_frequency text check (recurrence_frequency in ('none','daily','weekly','monthly')) default 'none',
  add column if not exists recurrence_until date;

-- Voice analytics logging
create table if not exists public.voice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  type text check (type in ('booking','task')),
  success boolean default false,
  confidence numeric,
  error text,
  raw_response text,
  created_at timestamptz default now()
);

create index if not exists voice_logs_user_id_idx on public.voice_logs(user_id);

-- RLS (allow user to read/write own logs)
alter table public.voice_logs enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'voice_logs' and policyname = 'voice_logs_select_own') then
    create policy voice_logs_select_own on public.voice_logs
      for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'voice_logs' and policyname = 'voice_logs_insert_own') then
    create policy voice_logs_insert_own on public.voice_logs
      for insert with check (auth.uid() = user_id);
  end if;
end $$;


