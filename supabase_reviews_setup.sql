-- The reviews table already exists. Add the new columns needed for this feature.
alter table public.reviews add column if not exists title text default '';
alter table public.reviews add column if not exists photo_url text;
alter table public.reviews add column if not exists status text default 'pending';

-- Attempt to add a check constraint for status (may fail if it already exists, which is fine)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_status_check'
  ) then
    alter table public.reviews add constraint reviews_status_check check (status in ('pending', 'approved', 'rejected'));
  end if;
end
$$;

-- Enable RLS for reviews
alter table public.reviews enable row level security;

-- Policy: Anyone can read approved reviews
create policy "Enable read access for approved reviews"
  on public.reviews
  for select
  using (status = 'approved');

-- Policy: Anyone can insert a review (pending by default)
create policy "Enable insert for anyone"
  on public.reviews
  for insert
  with check (true);

-- Policy: Anyone can update reviews (for admin approval)
create policy "Enable update for anyone"
  on public.reviews
  for update
  using (true)
  with check (true);

-- Policy: Anyone can delete reviews (for admin management)
create policy "Enable delete for anyone"
  on public.reviews
  for delete
  using (true);


-- Storage Bucket for review photos
insert into storage.buckets (id, name, public) 
values ('review_photos', 'review_photos', true)
on conflict (id) do nothing;

-- Policy: Anyone can view review photos
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Access' and tablename = 'objects') then
    create policy "Public Access" 
      on storage.objects for select 
      using ( bucket_id = 'review_photos' );
  end if;
end
$$;

-- Policy: Anyone can insert review photos
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Insert' and tablename = 'objects') then
    create policy "Public Insert" 
      on storage.objects for insert 
      with check ( bucket_id = 'review_photos' );
  end if;
end
$$;
