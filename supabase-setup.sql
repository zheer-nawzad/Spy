-- Run this once in your Supabase project's SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

create table if not exists rooms (
  code text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: this is a casual party game with no accounts, so we
-- allow anyone with the anon key (i.e. anyone using the site) to read and
-- write room rows. Anyone who knows a 4-letter room code can join that
-- room — same trust model as the room code itself.
alter table rooms enable row level security;

create policy "public can read rooms"
  on rooms for select
  using (true);

create policy "public can create rooms"
  on rooms for insert
  with check (true);

create policy "public can update rooms"
  on rooms for update
  using (true);

-- Enable Realtime so player devices sync instantly instead of polling.
alter publication supabase_realtime add table rooms;

-- Optional housekeeping: rooms older than a day are safe to delete manually,
-- or set up a scheduled Supabase Edge Function / cron job if you want this
-- automated. Not required for the app to work.
-- delete from rooms where updated_at < now() - interval '1 day';
