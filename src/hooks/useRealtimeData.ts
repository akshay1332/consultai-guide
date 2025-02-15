
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription<T extends { id: string }>(
  table: string,
  userId: string,
  column: string = 'user_id'
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchInitialData() {
      try {
        setLoading(true);
        const { data: initialData, error: queryError } = await supabase
          .from(table)
          .select('*')
          .eq(column, userId);

        if (queryError) throw queryError;
        setData(initialData || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }

    async function setupSubscription() {
      channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `${column}=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setData((current) => [...current, payload.new as T]);
            } else if (payload.eventType === 'UPDATE') {
              setData((current) =>
                current.map((item) =>
                  item.id === (payload.new as T).id ? (payload.new as T) : item
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setData((current) =>
                current.filter((item) => item.id !== (payload.old as T).id)
              );
            }
          }
        )
        .subscribe();
    }

    fetchInitialData();
    setupSubscription();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [table, userId, column]);

  return { data, loading, error };
}
