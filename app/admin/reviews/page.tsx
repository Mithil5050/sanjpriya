'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete review');
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert('Error deleting review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="headline-lg">Manage Reviews</h1>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-container-high)' }}>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Date</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Product</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Customer</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Rating</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Review</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Status</th>
                <th style={{ padding: '16px 8px', color: 'var(--outline)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} style={{ borderBottom: '1px solid var(--surface-container)' }}>
                  <td style={{ padding: '16px 8px' }}>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 8px' }}>{review.products?.name || 'Unknown'}</td>
                  <td style={{ padding: '16px 8px' }}>{review.customer_name}</td>
                  <td style={{ padding: '16px 8px', color: 'var(--heritage-gold)', fontSize: '18px' }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </td>
                  <td style={{ padding: '16px 8px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{review.title}</div>
                    <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {review.comment}
                    </div>
                    {review.photo_url && (
                      <a href={review.photo_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'underline' }}>
                        View Photo
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 'var(--radius)', 
                      fontSize: '12px',
                      fontWeight: 600,
                      background: review.status === 'approved' ? '#e6f5f0' : review.status === 'rejected' ? '#ffdad6' : '#fff3e0',
                      color: review.status === 'approved' ? '#0d4734' : review.status === 'rejected' ? '#ba1a1a' : '#e65100'
                    }}>
                      {review.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {review.status !== 'approved' && (
                        <button 
                          onClick={() => updateStatus(review.id, 'approved')}
                          style={{ background: 'var(--tertiary)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                        >
                          Approve
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button 
                          onClick={() => updateStatus(review.id, 'rejected')}
                          style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => deleteReview(review.id)}
                        style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
