'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
};

export const useBookmarks = (userId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch initial bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setBookmarks(data || []);
      setError(null);
      console.log('Bookmarks fetched:', data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Error fetching bookmarks');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      return;
    }

    fetchBookmarks();

    // Subscribe to changes
    const channel = supabase
      .channel(`bookmarks:${userId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time event received:', payload.eventType, payload);

          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark;
            console.log('Adding new bookmark:', newBookmark);
            setBookmarks((prev) => {
              // Check if bookmark already exists to avoid duplicates
              const exists = prev.some((b) => b.id === newBookmark.id);
              if (exists) {
                return prev;
              }
              return [newBookmark, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedBookmark = payload.old as Bookmark;
            console.log('Deleting bookmark:', deletedBookmark.id);
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== deletedBookmark.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark;
            console.log('Updating bookmark:', updatedBookmark.id);
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('Unsubscribing from channel');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, fetchBookmarks]);

  const addBookmark = async (url: string, title: string) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      console.log('Adding bookmark:', { url, title, userId });
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, url, title }])
        .select();

      if (insertError) throw insertError;

      console.log('Bookmark added successfully:', data);
    } catch (err) {
      console.error('Error adding bookmark:', err);
      throw err;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      console.log('Deleting bookmark:', id);
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      console.log('Bookmark deleted successfully');
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      throw err;
    }
  };

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
  };
};

