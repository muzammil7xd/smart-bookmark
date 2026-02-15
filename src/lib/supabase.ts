import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Validate and get environment variables as strings
const getSupabaseCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only return if both are valid strings
  if (typeof url === 'string' && typeof key === 'string' && url && key) {
    return { url, key, isValid: true };
  }

  return { url: '', key: '', isValid: false };
};

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  const { isValid } = getSupabaseCredentials();
  return isValid;
};

let supabaseClient: SupabaseClient | null = null;

// Lazy initialize client only when credentials are available
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    const { url, key, isValid } = getSupabaseCredentials();

    // If credentials are valid, use them; otherwise use safe placeholders
    const supabaseUrl = isValid ? url : 'https://placeholder.supabase.co';
    const supabaseAnonKey = isValid ? key : 'pk_placeholder_key_for_build';

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
      // Create with placeholder values if there's an error
      supabaseClient = createClient(
        'https://placeholder.supabase.co',
        'pk_placeholder_key_for_build'
      );
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

