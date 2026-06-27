import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Local fallback active.");
}

export const supabase = createClient(
  supabaseUrl || 'https://ciysvuxxxsqkpbgugcyi.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);
