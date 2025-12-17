-- Add due_time to tasks for optional time capture
alter table if exists public.tasks
  add column if not exists due_time text;

create index if not exists tasks_due_time_idx on public.tasks(due_time);

