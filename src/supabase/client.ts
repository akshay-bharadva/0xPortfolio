import { createClient, Session, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  console.warn('Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL.');
}
if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_ANON_KEY') {
  console.warn('Supabase Anon Key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)

export type { Session, User };
