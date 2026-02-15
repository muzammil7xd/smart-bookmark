import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

// Hardcoded credentials for testing
const SUPABASE_URL = 'https://qgroqtisexkepqphdxzq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_b0fFh0XR9p7rBRVDASB2JA_KrnRBDIn';

// Factory function to create Supabase client safely
function createSupabaseClient(): SupabaseClient {
  // Use hardcoded values for now
  const url = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;

  // Validate that both URL and key are strings
  if (!url || !key || typeof url !== 'string' || typeof key !== 'string') {
    throw new Error('Supabase credentials are not valid strings');
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
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
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

