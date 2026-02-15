import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const getSupabaseCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url, key };
};

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseCredentials();
  return !!(url && key && typeof url === 'string' && typeof key === 'string');
};

let supabaseClient: SupabaseClient | null = null;

// Lazy initialize client only when credentials are available
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const { url, key } = getSupabaseCredentials();

    // Use credentials if available, otherwise use placeholders for build
    const supabaseUrl = (url && typeof url === 'string') ? url : 'https://placeholder.supabase.co';
    const supabaseAnonKey = (key && typeof key === 'string') ? key : 'placeholder-key';

    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      // Return a dummy client to allow page rendering
      supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
  }

  return supabaseClient;
};

// Export default for convenience - will use lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    try {
      const client = getSupabaseClient();
      return (client as any)[prop];
    } catch (error) {
      console.error('Error accessing Supabase:', error);
      return undefined;
    }
  },
}) as SupabaseClient;

