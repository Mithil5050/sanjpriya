'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // If email confirmation is disabled in Supabase, data.session will exist.
      if (data.session) {
        router.refresh();
        router.push('/account');
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      paddingTop: 'calc(var(--nav-height) + 40px)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-soft)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '32px', 
            color: 'var(--on-surface)',
            marginBottom: '8px'
          }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px' }}>
            Join Sanjpriya for faster checkout and order tracking
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--error-container)',
            color: 'var(--on-error-container)',
            padding: '12px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✉️</div>
            <h3 style={{ marginBottom: '8px' }}>Check your email!</h3>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              We've sent a confirmation link to {email}. Please click the link to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="input-field">
              <input
                type="text"
                id="name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="name">Full Name</label>
            </div>

            <div className="input-field">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="input-field">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label htmlFor="password">Password</label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-energetic)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
