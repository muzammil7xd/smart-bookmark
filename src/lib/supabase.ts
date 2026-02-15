import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

// Factory function to create Supabase client safely
function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate that both URL and key are strings
  if (!url || !key || typeof url !== 'string' || typeof key !== 'string') {
    // Return a client with dummy values to allow the app to load
    // Real auth won't work until env vars are set, but app won't crash
    return createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
  }

  return createClient(url, key, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

// Check if credentials are properly configured
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && typeof url === 'string' && typeof key === 'string');
};

// Lazy-load Supabase client only when needed
function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
}

// Export proxy to Supabase client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
}) as SupabaseClient;

