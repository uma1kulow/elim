import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useFollow } from '@/hooks/useFollow';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Settings, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  village_id: string | null;
  score: number;
}

interface UserProfileProps {
  profileId?: string;
  onBack?: () => void;
  onOpenChat?: (conversationId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profileId, onBack, onOpenChat }) => {
  const { profile: currentProfile, signOut } = useAuth();
  const { language } = useLanguage();
  const { selectedVillage } = useVillage();
  const navigate = useNavigate();
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);
  const [postsCount, setPostsCount] = useState(0);
  
  const isOwnProfile = !profileId || profileId === currentProfile?.id;
  const targetProfileId = isOwnProfile ? currentProfile?.id : profileId;
  
  const { isFollowing, followersCount, followingCount, toggleFollow, loading: followLoading } = useFollow(targetProfileId);
  const { startConversation } = useMessages();

  useEffect(() => {
    if (profileId && profileId !== currentProfile?.id) {
      fetchProfile(profileId);
    }
    if (targetProfileId) {
      fetchPostsCount(targetProfileId);
    }
  }, [profileId, currentProfile?.id, targetProfileId]);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (data) {
      setViewedProfile(data);
    }
  };

  const fetchPostsCount = async (id: string) => {
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', id);
    
    setPostsCount(count || 0);
  };

  const handleMessage = async () => {
    if (!targetProfileId || isOwnProfile) return;
    
    const conversationId = await startConversation(targetProfileId);
    if (conversationId && onOpenChat) {
      onOpenChat(conversationId);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(language === 'kg' ? 'Чыктыңыз' : 'Вы вышли');
  };

  const profile = isOwnProfile ? currentProfile : viewedProfile;
  
  if (!profile && !isOwnProfile) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!currentProfile && isOwnProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center px-6"
      >
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-xl font-bold mb-2">
          {language === 'kg' ? 'Кирүү керек' : 'Необходимо войти'}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {language === 'kg' 
            ? 'Профилди көрүү үчүн системага кириңиз' 
            : 'Войдите в систему для просмотра профиля'
          }
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/auth')}
          className="px-8 py-3 bg-foreground text-background rounded-full font-semibold"
        >
          {language === 'kg' ? 'Кирүү' : 'Войти'}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 pt-4"
    >
      {/* Header */}
      {onBack && (
        <div className="flex items-center justify-between -mt-4 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {isOwnProfile && (
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4 text-3xl font-bold overflow-hidden">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="" 
              className="w-full h-full object-cover"
            />
          ) : (
            profile?.full_name?.[0]?.toUpperCase() || '?'
          )}
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold">{profile?.full_name || (language === 'kg' ? 'Колдонуучу' : 'Пользователь')}</h2>
        {profile?.username && (
          <p className="text-muted-foreground text-sm">@{profile.username}</p>
        )}
        
        {/* Village */}
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'kg' ? selectedVillage?.name.kg : selectedVillage?.name.ru}
        </p>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-sm mt-3 px-6">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-xl font-bold">{postsCount}</p>
            <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Пост' : 'Постов'}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{followersCount}</p>
            <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Жазылуучу' : 'Подписчики'}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{followingCount}</p>
            <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Жазылган' : 'Подписки'}</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwnProfile && currentProfile && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleFollow}
              disabled={followLoading}
              className={`flex-1 max-w-[140px] py-2.5 rounded-xl font-medium transition-colors ${
                isFollowing
                  ? 'bg-secondary text-foreground'
                  : 'bg-foreground text-background'
              }`}
            >
              {isFollowing 
                ? (language === 'kg' ? 'Жазылган' : 'Подписан')
                : (language === 'kg' ? 'Жазылуу' : 'Подписаться')
              }
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleMessage}
              className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {/* Own Profile Actions */}
        {isOwnProfile && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 bg-secondary rounded-xl font-medium"
            >
              {language === 'kg' ? 'Профилди оңдоо' : 'Редактировать'}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Score & Badges (own profile only) */}
      {isOwnProfile && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/50 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{language === 'kg' ? 'Балл жана рейтинг' : 'Баллы и рейтинг'}</h3>
              <span className="text-2xl font-bold">{profile?.score || 0}</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((profile?.score || 0) / 5, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-secondary/50 rounded-2xl p-4"
          >
            <h3 className="font-medium text-sm mb-3">{language === 'kg' ? 'Бейджтер' : 'Значки'}</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['🌟', '🏆', '💪', '🎯', '🔥', '⭐', '🚀'].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-11 h-11 rounded-full bg-background flex items-center justify-center text-lg flex-shrink-0"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default UserProfile;
