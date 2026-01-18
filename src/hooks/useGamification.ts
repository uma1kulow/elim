import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Badge {
  id: string;
  name: string;
  name_kg: string | null;
  description: string | null;
  description_kg: string | null;
  icon: string;
  points_required: number;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  score: number;
  village_id: string | null;
}

export const useGamification = () => {
  const { profile } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    const { data } = await supabase
      .from('badges')
      .select('*')
      .order('points_required', { ascending: true });

    setBadges(data || []);
  };

  const fetchUserBadges = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', profile.id);

    setUserBadges(data || []);
  };

  const fetchLeaderboard = async (villageId?: string) => {
    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, score, village_id')
      .order('score', { ascending: false })
      .limit(20);

    if (villageId) {
      query = query.eq('village_id', villageId);
    }

    const { data } = await query;
    setLeaderboard(data || []);
  };

  const checkAndAwardBadges = async () => {
    if (!profile) return;

    const userScore = profile.score || 0;
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    for (const badge of badges) {
      if (userScore >= badge.points_required && !earnedBadgeIds.has(badge.id)) {
        await supabase.from('user_badges').insert({
          user_id: profile.id,
          badge_id: badge.id
        });
      }
    }

    fetchUserBadges();
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBadges(), fetchUserBadges(), fetchLeaderboard()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [profile]);

  useEffect(() => {
    if (badges.length > 0 && profile) {
      checkAndAwardBadges();
    }
  }, [badges, profile?.score]);

  return { 
    badges, 
    userBadges, 
    leaderboard, 
    loading, 
    fetchLeaderboard,
    refetch: fetchAll 
  };
};
