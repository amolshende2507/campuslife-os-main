// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Environment variables are accessed via import.meta.env in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic check for environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables. Please check your .env file.');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);