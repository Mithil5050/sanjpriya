'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', category: 'kurtis', price: '', originalPrice: '',
    description: '', fabric: '', care: '',
    sizes: 'XS,S,M,L,XL,XXL',
    colors: '',
    images: '',
    badge: '',
    inStock: true,
    featured: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm(f => ({ ...f, [target.name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    // reset input so same file can be selected again if removed
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        // We need to upload using the frontend supabase client which requires the session
        const { supabase } = await import('@/lib/supabase');
        
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      }

      const body = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: imageUrls,
        badge: form.badge || null,
      };

      const res = await fetch('/api/products', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create product in database');
      
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin/products" style={{ color: 'var(--outline)', fontSize: 14 }}>← Back</Link>
          <h1>Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
          <div style={{ gridColumn: '1 / -1', background: 'white', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 20 }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="input-field">
                <input type="text" name="name" id="name" placeholder=" " value={form.name} onChange={handleChange} required />
                <label htmlFor="name">Product Name *</label>
              </div>
              <div className="input-field">
                <select name="category" id="category" value={form.category} onChange={handleChange} required>
                  <option value="kurtis">Kurtis</option>
                  <option value="blouses">Blouses</option>
                  <option value="dresses">Dresses</option>
                </select>
                <label htmlFor="category">Category *</label>
              </div>
              <div className="input-field">
                <input type="number" name="price" id="price" placeholder=" " value={form.price} onChange={handleChange} required min={0} />
                <label htmlFor="price">Price (₹) *</label>
              </div>
              <div className="input-field">
                <input type="number" name="originalPrice" id="originalPrice" placeholder=" " value={form.originalPrice} onChange={handleChange} min={0} />
                <label htmlFor="originalPrice">Original Price (₹)</label>
              </div>
            </div>
            <div className="input-field">
              <textarea name="description" id="description" placeholder=" " value={form.description} onChange={handleChange} rows={4} required style={{ resize: 'vertical' }} />
              <label htmlFor="description">Description *</label>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 20 }}>
              Fabric & Care
            </h3>
            <div className="input-field">
              <input type="text" name="fabric" id="fabric" placeholder=" " value={form.fabric} onChange={handleChange} />
              <label htmlFor="fabric">Fabric / Material</label>
            </div>
            <div className="input-field">
              <input type="text" name="care" id="care" placeholder=" " value={form.care} onChange={handleChange} />
              <label htmlFor="care">Care Instructions</label>
            </div>
            <div className="input-field">
              <input type="text" name="sizes" id="sizes" placeholder=" " value={form.sizes} onChange={handleChange} />
              <label htmlFor="sizes">Sizes (comma-separated)</label>
            </div>
            <div className="input-field">
              <input type="text" name="colors" id="colors" placeholder=" " value={form.colors} onChange={handleChange} />
              <label htmlFor="colors">Colors (comma-separated)</label>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--outline)', marginBottom: 20 }}>
              Images & Labels
            </h3>
            <div className="input-field" style={{ border: '2px dashed var(--outline-variant)', padding: 20, textAlign: 'center', borderRadius: 'var(--radius)' }}>
              <label htmlFor="image" style={{ display: 'block', fontWeight: 600, marginBottom: 12 }}>Product Images (Upload Multiple)</label>
              <input type="file" id="image" accept="image/*" multiple onChange={handleFileChange} />
              
              {imageFiles.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
                  {imageFiles.map((file, i) => (
                    <div key={i} style={{ position: 'relative', width: 60, height: 80 }}>
                      <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                      <button 
                        type="button" 
                        onClick={() => removeFile(i)}
                        style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="input-field">
              <select name="badge" id="badge" value={form.badge} onChange={handleChange}>
                <option value="">No Badge</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Heritage Collection">Heritage Collection</option>
                <option value="Festive">Festive</option>
                <option value="Premium">Premium</option>
              </select>
              <label htmlFor="badge">Badge</label>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} style={{ accentColor: 'var(--primary-energetic)' }} />
                In Stock
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: 'var(--primary-energetic)' }} />
                Featured
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
