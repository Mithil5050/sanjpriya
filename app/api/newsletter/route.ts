import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    // Using upsert with onConflict handles the "INSERT OR IGNORE" equivalent for unique constraints
    const { error } = await supabase.from('newsletter_subscribers').upsert({ email }, { onConflict: 'email' });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
