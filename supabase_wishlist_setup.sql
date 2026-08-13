-- Create the wishlist table
create table public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id bigint references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure a user can only favorite a specific product once
  unique(user_id, product_id)
);

-- Set up Row Level Security (RLS)
alter table public.wishlist enable row level security;

-- Create policies so users can only see and manage their own wishlist
create policy "Users can view their own wishlist"
  on public.wishlist for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own wishlist"
  on public.wishlist for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from their own wishlist"
  on public.wishlist for delete
  using ( auth.uid() = user_id );
