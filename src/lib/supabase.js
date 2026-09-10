import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

// If env vars are missing, export null and let the app show a friendly
// "not configured" message instead of crashing at import time.
export const supabase = supabaseConfigured ? createClient(url, anonKey) : null;
