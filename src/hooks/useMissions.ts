import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Mission {
  id: string;
  title: string;
  title_kg: string | null;
  description: string | null;
  description_kg: string | null;
  target_count: number;
  reward_points: number;
  mission_type: string;
  village_id: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface MissionProgress {
  id: string;
  user_id: string;
  mission_id: string;
  current_progress: number;
  is_completed: boolean;
  completed_at: string | null;
}

export interface MissionWithProgress extends Mission {
  progress: MissionProgress | null;
}

export const useMissions = () => {
  const { profile, refreshProfile } = useAuth();
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {
      // Fetch active missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('weekly_missions')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', new Date().toISOString())
        .gte('ends_at', new Date().toISOString());

      if (missionsError) throw missionsError;

      // Fetch user progress for these missions
      const { data: progressData, error: progressError } = await supabase
        .from('user_mission_progress')
        .select('*')
        .eq('user_id', profile.id);

      if (progressError) throw progressError;

      // Combine missions with progress
      const missionsWithProgress: MissionWithProgress[] = (missionsData || []).map(mission => ({
        ...mission,
        progress: progressData?.find(p => p.mission_id === mission.id) || null
      }));

      setMissions(missionsWithProgress);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const incrementProgress = async (missionType: string) => {
    if (!profile) return;

    // Find matching mission
    const mission = missions.find(m => m.mission_type === missionType && !m.progress?.is_completed);
    if (!mission) return;

    try {
      const currentProgress = mission.progress?.current_progress || 0;
      const newProgress = currentProgress + 1;
      const isCompleted = newProgress >= mission.target_count;

      if (mission.progress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_mission_progress')
          .update({
            current_progress: newProgress,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          })
          .eq('id', mission.progress.id);

        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('user_mission_progress')
          .insert({
            user_id: profile.id,
            mission_id: mission.id,
            current_progress: newProgress,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          });

        if (error) throw error;
      }

      // If completed, award points
      if (isCompleted) {
        const { error: scoreError } = await supabase.rpc('add_user_score', {
          p_user_id: profile.id,
          p_points: mission.reward_points
        });

        if (scoreError) throw scoreError;

        toast.success(`🎉 Миссия аткарылды! +${mission.reward_points} балл`);
        refreshProfile();
      }

      fetchMissions();
    } catch (error) {
      console.error('Error updating mission progress:', error);
    }
  };

  const getDaysLeft = (endsAt: string) => {
    const end = new Date(endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return {
    missions,
    loading,
    incrementProgress,
    getDaysLeft,
    refetch: fetchMissions
  };
};
