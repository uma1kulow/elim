import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VillageFuturePlan {
  id: string;
  village_id: string | null;
  title: string;
  title_kg: string | null;
  description: string;
  description_kg: string | null;
  target_year: number | null;
  image_url: string | null;
  status: string;
  priority: number | null;
  created_at: string | null;
  author_id: string | null;
}

export const useVillageFuture = () => {
  const [plans, setPlans] = useState<VillageFuturePlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('village_future_plans')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching village future plans:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, refetch: fetchPlans };
};
