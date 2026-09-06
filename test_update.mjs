const slug = 'elegant-floral-embroidered-kurti-set';

async function test() {
  const r1 = await fetch(`http://localhost:3000/api/products/${slug}`);
  if (!r1.ok) {
     console.log("Server not running on 3000, skipping test.");
     return;
  }
  const d = await r1.json();
  console.log("Fetched existing images:", d.images);
  
  const body = {
     name: d.name,
     category: d.category,
     price: d.price,
     originalPrice: d.originalPrice,
     description: d.description,
     fabric: d.fabric,
     care: d.care,
     sizes: d.sizes,
     colors: d.colors,
     images: [...d.images, "https://example.com/test-image.jpg"],
     badge: d.badge,
     inStock: d.inStock,
     featured: d.featured
  };
  
  const r2 = await fetch(`http://localhost:3000/api/products/${slug}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(body)
  });
  
  const d2 = await r2.json();
  console.log("Update response:", d2);
  
  const r3 = await fetch(`http://localhost:3000/api/products/${slug}`);
  const d3 = await r3.json();
  console.log("Fetched updated images:", d3.images);
}
test();
