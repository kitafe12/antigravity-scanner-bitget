-- Create table for master traders
create table if not exists public.master_traders (
  id uuid default gen_random_uuid() primary key,
  exchange_name text not null default 'BITGET',
  exchange_uid text not null,
  nickname text,
  avatar_url text,
  roi_90d float8,
  max_drawdown float8,
  win_rate float8,
  aum float8,
  trading_type text check (trading_type = 'SPOT'),
  profile_url text,
  last_updated timestamptz default now(),
  
  -- Unique constraint for upserting
  unique(exchange_name, exchange_uid)
);

-- Enable Row Level Security (RLS)
alter table public.master_traders enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.master_traders
  for select
  to anon
  using (true);

-- Create policy to allow service role write access (for Cron jobs)
create policy "Allow service role write access"
  on public.master_traders
  for all
  to service_role
  using (true)
  with check (true);
