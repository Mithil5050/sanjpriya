import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import fs from 'fs';
import path from 'path';

// Define the groups based on the plan
const groups = [
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.16', category: 'Kurtis', name: 'Teal Embroidery Kurti Set' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.17', category: 'Kurtis', name: 'Purple Rayon Kurti Set' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.18', category: 'Kurtis', name: 'Blue Bird Print Kurti Set' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.19', category: 'Dresses', name: 'Green Floral Kurti Set' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.20', category: 'Blouses', name: 'White & Red Dots Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.21', category: 'Blouses', name: 'Red Ethnic Pattern Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.22', category: 'Blouses', name: 'Red Leaf Embroidery Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.23', category: 'Blouses', name: 'Green Leaf Print Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.24', category: 'Blouses', name: 'Pink Embroidered Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.25', category: 'Blouses', name: 'Solid Red Smocked Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.26', category: 'Blouses', name: 'Solid Black Smocked Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.27', category: 'Blouses', name: 'White Embroidered Peacock Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.28', category: 'Blouses', name: 'Black & Red Pattern Blouse' },
  { prefix: 'WhatsApp Image 2026-08-10 at 23.18.29', category: 'Blouses', name: 'Olive Pattern Blouse' },
  { prefix: 'WhatsApp Image 2026-08-11 at 01.16.18', category: 'Blouses', name: 'Warli Art Black/Red Blouse' },
  { prefix: 'WhatsApp Image 2026-08-11 at 01.16.19', category: 'Blouses', name: 'Warli Art Black/Green Blouse' }
];

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentDir = path.join(process.cwd(), 'content');
    const files = fs.readdirSync(contentDir);
    const results = [];

    for (const group of groups) {
      console.log(`Processing: ${group.name}`);
      const groupFiles = files.filter(f => f.startsWith(group.prefix));
      const imageUrls: string[] = [];

      for (const file of groupFiles) {
        const filePath = path.join(contentDir, file);
        const fileExt = path.extname(file);
        const fileBody = fs.readFileSync(filePath);
        
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
        const contentType = fileExt.toLowerCase() === '.mp4' ? 'video/mp4' : 
                            fileExt.toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
                            
        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, fileBody, {
            contentType,
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error(`Error uploading ${file}:`, error);
          continue;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrlData.publicUrl);
      }

      if (imageUrls.length > 0) {
        imageUrls.sort();
        const slug = group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
        
        const product = {
          name: group.name,
          slug: slug,
          description: 'Authentic Indian ethnic wear, crafted with love and tradition. Perfect for any special occasion.',
          price: 1499,
          category: group.category.toLowerCase(),
          fabric: 'Cotton Blend',
          care: 'Hand Wash',
          in_stock: true,
          images: imageUrls
        };

        const { error } = await supabase.from('products').insert([product]);
        if (error) {
          console.error(`Error inserting ${group.name}:`, error);
          results.push({ name: group.name, status: 'Error DB Insert' });
        } else {
          results.push({ name: group.name, status: 'Success' });
        }
      } else {
        results.push({ name: group.name, status: 'No images found' });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
