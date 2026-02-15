'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setError('Supabase is not configured. Please check your environment variables.');
          setLoading(false);
          return;
        }

        try {
          const { data } = await supabase.auth.getSession();
          setUser(data?.session?.user ?? null);
        } catch (authError) {
          console.error('Error getting session:', authError);
          setError('Unable to connect to Supabase');
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err.message : 'Error initializing auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    try {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please add environment variables.');
      }

      // Use the actual origin from the browser
      let redirectUrl = '/auth/callback';
      if (typeof window !== 'undefined') {
        // Get the full URL including protocol and domain
        redirectUrl = `${window.location.origin}/auth/callback`;
      }

      console.log('Redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error signing in with Google';
      setError(errorMsg);
      console.error('Error signing in with Google:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error signing out';
      setError(errorMsg);
      console.error('Error signing out:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

