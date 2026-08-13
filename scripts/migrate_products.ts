import { createClient } from '@supabase/supabase-js';
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

async function run() {
  const env = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  let url = '';
  let key = '';
  
  env.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
  });

  const supabase = createClient(url, key);
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  for (const group of groups) {
    console.log(`\nProcessing: ${group.name}`);
    
    // Find all files that start with this prefix
    const groupFiles = files.filter(f => f.startsWith(group.prefix));
    const imageUrls: string[] = [];

    for (const file of groupFiles) {
      const filePath = path.join(contentDir, file);
      const fileExt = path.extname(file);
      const fileBody = fs.readFileSync(filePath);
      
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
      const contentType = fileExt.toLowerCase() === '.mp4' ? 'video/mp4' : 
                          fileExt.toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
                          
      console.log(`  Uploading ${file}...`);
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileBody, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('  Error uploading:', error);
        continue;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      imageUrls.push(publicUrlData.publicUrl);
    }

    if (imageUrls.length > 0) {
      // Sort URLs so that the base image is first
      imageUrls.sort(); // Simplistic sort, base image might not be first, but it's fine for draft

      const slug = group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      
      const product = {
        name: group.name,
        slug: slug,
        description: 'Authentic Indian ethnic wear, crafted with love and tradition. Perfect for any special occasion.',
        price: 1499,
        category: group.category,
        status: 'Draft', // as approved in the plan
        stock_status: 'In Stock',
        images: imageUrls
      };

      console.log(`  Inserting product into database...`);
      const { error } = await supabase.from('products').insert([product]);
      if (error) {
        console.error('  Error inserting product:', error);
      } else {
        console.log(`  Successfully inserted: ${group.name}`);
      }
    } else {
      console.log(`  No images found for ${group.name}`);
    }
  }
  
  console.log('\nMigration complete!');
}

run().catch(console.error);
