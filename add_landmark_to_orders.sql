-- Run this SQL in your Supabase SQL Editor to add the missing landmark column
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS landmark TEXT;
