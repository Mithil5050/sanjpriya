'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ToastProvider';
import { Review } from '@/lib/types';

export default function CustomerReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let photoUrl = null;
      
      // Upload photo if present
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('review_photos')
          .upload(filePath, photo);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('review_photos')
          .getPublicUrl(filePath);
          
        photoUrl = publicUrl;
      }
      
      // Submit review
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName: name,
          rating,
          title,
          comment,
          photoUrl
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      
      showToast('Review submitted successfully! It will appear once approved.', 'success');
      setShowForm(false);
      setName('');
      setTitle('');
      setComment('');
      setRating(5);
      setPhoto(null);
      
    } catch (err: any) {
      showToast(err.message || 'Error submitting review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (num: number, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '4px', cursor: interactive ? 'pointer' : 'default' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            onClick={() => interactive && setRating(star)}
            style={{ 
              color: star <= (interactive ? rating : num) ? 'var(--heritage-gold)' : 'var(--outline-variant)',
              fontSize: '24px'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="customer-reviews-section" style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid var(--outline-variant)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 className="headline-md">Customer Reviews</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--surface-container-low)', padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '40px' }}>
          <h3 className="title-md" style={{ marginBottom: '24px' }}>Write Your Review</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Rating</label>
            {renderStars(rating, true)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Your Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--outline)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Review Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--outline)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Detailed Feedback</label>
            <textarea 
              required 
              rows={4}
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--outline)' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Optional Photo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setPhoto(e.target.files?.[0] || null)} 
              style={{ padding: '8px 0' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface-cream)', borderRadius: 'var(--radius-lg)' }}>
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {reviews.map(review => (
            <div key={review.id} style={{ padding: '24px', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  {renderStars(review.rating)}
                  <h4 style={{ margin: '8px 0', fontSize: '18px', fontWeight: 600 }}>{review.title}</h4>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--outline)' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p style={{ marginBottom: '16px', color: 'var(--on-surface-variant)' }}>{review.comment}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>- {review.customerName}</span>
                {review.photoUrl && (
                  <img src={review.photoUrl} alt="Review photo" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
