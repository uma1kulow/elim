import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Poll {
  id: string;
  title: string;
  title_kg: string | null;
  description: string | null;
  description_kg: string | null;
  ends_at: string;
  is_active: boolean;
  created_at: string;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  };
  options: PollOption[];
  user_voted: boolean;
  total_votes: number;
}

export interface PollOption {
  id: string;
  text: string;
  text_kg: string | null;
  votes_count: number;
}

export const useVoting = () => {
  const { profile } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    setLoading(true);
    
    const { data: pollsData, error } = await supabase
      .from('voting_polls')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url),
        options:poll_options(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      setLoading(false);
      return;
    }

    // Check if user has voted on each poll
    if (profile) {
      const { data: userVotes } = await supabase
        .from('votes')
        .select('poll_id')
        .eq('user_id', profile.id);

      const votedPollIds = new Set(userVotes?.map(v => v.poll_id) || []);

      const enrichedPolls = pollsData?.map(poll => ({
        ...poll,
        user_voted: votedPollIds.has(poll.id),
        total_votes: poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes_count || 0), 0) || 0
      })) || [];

      setPolls(enrichedPolls);
    } else {
      setPolls(pollsData?.map(poll => ({
        ...poll,
        user_voted: false,
        total_votes: poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes_count || 0), 0) || 0
      })) || []);
    }

    setLoading(false);
  };

  const vote = async (pollId: string, optionId: string, onMissionProgress?: (type: string) => void) => {
    if (!profile) {
      toast.error('Добуш берүү үчүн кириңиз');
      return false;
    }

    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: profile.id
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Сиз буга чейин добуш бердиңиз');
      } else {
        toast.error('Ката кетти');
      }
      return false;
    }

    // Update user score
    await supabase.rpc('add_user_score', { p_user_id: profile.id, p_points: 10 });
    
    // Trigger mission progress
    if (onMissionProgress) {
      onMissionProgress('votes');
    }
    
    toast.success('Добуш берилди! +10 балл');
    fetchPolls();
    return true;
  };

  const createPoll = async (title: string, titleKg: string, description: string, options: string[], endsAt: Date) => {
    if (!profile) return null;

    const { data: poll, error } = await supabase
      .from('voting_polls')
      .insert({
        title,
        title_kg: titleKg,
        description,
        author_id: profile.id,
        ends_at: endsAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      toast.error('Ката кетти');
      return null;
    }

    // Add options
    const optionsToInsert = options.map(opt => ({
      poll_id: poll.id,
      text: opt,
      text_kg: opt
    }));

    await supabase.from('poll_options').insert(optionsToInsert);

    toast.success('Добуш берүү түзүлдү!');
    fetchPolls();
    return poll;
  };

  useEffect(() => {
    fetchPolls();
  }, [profile]);

  return { polls, loading, vote, createPoll, refetch: fetchPolls };
};
