-- FluentPath: one row per user holding their whole progress as JSON.
create table if not exists public.fluentpath_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null,
  updated_at timestamptz not null default now()
);

alter table public.fluentpath_state enable row level security;

create policy "read own state"   on public.fluentpath_state for select using (auth.uid() = user_id);
create policy "insert own state" on public.fluentpath_state for insert with check (auth.uid() = user_id);
create policy "update own state" on public.fluentpath_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own state" on public.fluentpath_state for delete using (auth.uid() = user_id);
