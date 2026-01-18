import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VillageHistoryItem {
  id: string;
  village_id: string | null;
  title: string;
  title_kg: string | null;
  description: string;
  description_kg: string | null;
  year: number | null;
  image_url: string | null;
  category: string;
  created_at: string | null;
  author_id: string | null;
}

export const useVillageHistory = () => {
  const [history, setHistory] = useState<VillageHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('village_history')
        .select('*')
        .order('year', { ascending: true });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching village history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, refetch: fetchHistory };
};
