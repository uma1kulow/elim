import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Issue {
  id: string;
  title: string;
  title_kg: string | null;
  description: string;
  description_kg: string | null;
  category: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  votes_count: number;
  created_at: string;
  resolved_at: string | null;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useIssues = () => {
  const { profile } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        author:profiles!author_id(id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching issues:', error);
      setLoading(false);
      return;
    }

    setIssues(data || []);
    setLoading(false);
  };

  const createIssue = async (
    title: string,
    description: string,
    category: string,
    imageUrl?: string,
    latitude?: number,
    longitude?: number
  ) => {
    if (!profile) {
      toast.error('Жалоба берүү үчүн кириңиз');
      return null;
    }

    const { data, error } = await supabase
      .from('issues')
      .insert({
        title,
        title_kg: title,
        description,
        description_kg: description,
        category,
        author_id: profile.id,
        image_url: imageUrl,
        latitude,
        longitude
      })
      .select()
      .single();

    if (error) {
      toast.error('Ката кетти');
      return null;
    }

    // Update user score
    await supabase.rpc('add_user_score', { p_user_id: profile.id, p_points: 15 });
    
    toast.success('Жалоба жөнөтүлдү! +15 балл');
    fetchIssues();
    return data;
  };

  const updateIssueStatus = async (issueId: string, status: string) => {
    const { error } = await supabase
      .from('issues')
      .update({ 
        status,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null
      })
      .eq('id', issueId);

    if (error) {
      toast.error('Ката кетти');
      return false;
    }

    toast.success('Статус жаңыртылды');
    fetchIssues();
    return true;
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return { issues, loading, createIssue, updateIssueStatus, refetch: fetchIssues };
};
