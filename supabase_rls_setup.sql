-- Enable Row Level Security (RLS) for the tables
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Policies for newsletter_subscribers
-- Note: The application API uses upsert with the anon key
create policy "Enable insert/update for anon on newsletter_subscribers"
  on public.newsletter_subscribers
  for all
  using (true)
  with check (true);

-- Policies for orders
-- Note: The application API uses select, insert, and update with the anon key
create policy "Enable all access for anon on orders"
  on public.orders
  for all
  using (true)
  with check (true);

-- Policies for reviews
create policy "Enable read access for all users on reviews"
  on public.reviews
  for select
  using (true);

create policy "Enable insert for authenticated users on reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);
