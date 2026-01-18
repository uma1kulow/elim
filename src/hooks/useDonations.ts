import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Donation {
  id: string;
  title: string;
  title_kg: string | null;
  description: string | null;
  description_kg: string | null;
  target_amount: number;
  current_amount: number;
  image_url: string | null;
  is_active: boolean;
  ends_at: string | null;
  created_at: string;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  };
  contributors_count: number;
}

export const useDonations = () => {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      setLoading(false);
      return;
    }

    // Get contributors count for each donation
    const donationsWithCounts = await Promise.all(
      (data || []).map(async (donation) => {
        const { count } = await supabase
          .from('donation_contributions')
          .select('*', { count: 'exact', head: true })
          .eq('donation_id', donation.id);

        return {
          ...donation,
          contributors_count: count || 0
        };
      })
    );

    setDonations(donationsWithCounts);
    setLoading(false);
  };

  const contribute = async (donationId: string, amount: number, message?: string, isAnonymous?: boolean, onMissionProgress?: (type: string) => void) => {
    if (!profile) {
      toast.error('Донат берүү үчүн кириңиз');
      return false;
    }

    const { error } = await supabase
      .from('donation_contributions')
      .insert({
        donation_id: donationId,
        user_id: profile.id,
        amount,
        message,
        is_anonymous: isAnonymous || false
      });

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    // Update user score
    await supabase.rpc('add_user_score', { p_user_id: profile.id, p_points: 25 });
    
    // Trigger mission progress
    if (onMissionProgress) {
      onMissionProgress('donations');
    }
    
    toast.success(`Донат берилди! +25 балл`);
    fetchDonations();
    return true;
  };

  const createDonation = async (
    title: string,
    description: string,
    targetAmount: number,
    imageUrl?: string,
    endsAt?: Date
  ) => {
    if (!profile) return null;

    const { data, error } = await supabase
      .from('donations')
      .insert({
        title,
        title_kg: title,
        description,
        description_kg: description,
        target_amount: targetAmount,
        author_id: profile.id,
        image_url: imageUrl,
        ends_at: endsAt?.toISOString()
      })
      .select()
      .single();

    if (error) {
      toast.error('Ката кетти');
      return null;
    }

    toast.success('Донат кампаниясы түзүлдү!');
    fetchDonations();
    return data;
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return { donations, loading, contribute, createDonation, refetch: fetchDonations };
};
