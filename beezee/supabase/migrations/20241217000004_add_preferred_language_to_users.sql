alter table public.users
  add column if not exists preferred_language text;

-- Optional: default to English if null
update public.users set preferred_language = 'en' where preferred_language is null;

create index if not exists users_preferred_language_idx on public.users(preferred_language);

