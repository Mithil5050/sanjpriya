-- Fix RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for all users on products" ON public.products;
CREATE POLICY "Enable all access for all users on products"
  ON public.products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Fix RLS for storage (product-images bucket)
-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the product-images bucket
DROP POLICY IF EXISTS "Give public read access to product-images" ON storage.objects;
CREATE POLICY "Give public read access to product-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow public uploads to product-images" ON storage.objects;
CREATE POLICY "Allow public uploads to product-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow public updates to product-images" ON storage.objects;
CREATE POLICY "Allow public updates to product-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow public deletes to product-images" ON storage.objects;
CREATE POLICY "Allow public deletes to product-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');
