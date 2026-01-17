import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFollow = (targetProfileId: string | undefined) => {
  const { profile } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (targetProfileId) {
      checkFollowStatus();
      fetchCounts();
    }
  }, [targetProfileId, profile?.id]);

  const checkFollowStatus = async () => {
    if (!profile?.id || !targetProfileId) return;
    
    const { data } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', profile.id)
      .eq('following_id', targetProfileId)
      .maybeSingle();
    
    setIsFollowing(!!data);
  };

  const fetchCounts = async () => {
    if (!targetProfileId) return;
    
    // Followers count
    const { count: followers } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetProfileId);
    
    // Following count
    const { count: following } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', targetProfileId);
    
    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const toggleFollow = async () => {
    if (!profile?.id || !targetProfileId || loading) return;
    
    setLoading(true);
    
    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', profile.id)
          .eq('following_id', targetProfileId);
        
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await supabase
          .from('followers')
          .insert({
            follower_id: profile.id,
            following_id: targetProfileId
          });
        
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    followingCount,
    toggleFollow,
    loading,
    refetch: fetchCounts
  };
};
