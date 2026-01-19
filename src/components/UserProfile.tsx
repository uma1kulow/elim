import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useFollow } from '@/hooks/useFollow';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Settings, MessageCircle, LogOut, Grid3X3, Bookmark, Trash2, X } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EditProfileModal from './EditProfileModal';

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

interface Post {
  id: string;
  image_url: string | null;
  content: string;
}

interface UserProfileProps {
  profileId?: string;
  onBack?: () => void;
  onOpenChat?: (conversationId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profileId, onBack, onOpenChat }) => {
  const { profile: currentProfile, signOut, refreshProfile } = useAuth();
  const { language } = useLanguage();
  const { villages } = useVillage();
  const navigate = useNavigate();
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);
  const [postsCount, setPostsCount] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activePostTab, setActivePostTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  
  const { deletePost } = usePosts();
  
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
      fetchUserPosts(targetProfileId);
    }
  }, [profileId, currentProfile?.id, targetProfileId]);

  // Refresh when currentProfile changes (after edit)
  useEffect(() => {
    if (isOwnProfile && currentProfile?.id) {
      fetchPostsCount(currentProfile.id);
      fetchUserPosts(currentProfile.id);
    }
  }, [currentProfile]);

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

  const fetchUserPosts = async (id: string) => {
    const { data } = await supabase
      .from('posts')
      .select('id, image_url, content')
      .eq('author_id', id)
      .order('created_at', { ascending: false })
      .limit(30);
    
    if (data) {
      setUserPosts(data);
    }
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

  const handleEditClose = () => {
    setShowEditModal(false);
    refreshProfile();
  };

  const handleDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
    const { error } = await deletePost(postId);
    if (!error) {
      setUserPosts(prev => prev.filter(p => p.id !== postId));
      setPostsCount(prev => prev - 1);
      setSelectedPost(null);
      toast.success(language === 'kg' ? 'Пост өчүрүлдү' : 'Пост удален');
    } else {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Ошибка');
    }
    setDeletingPostId(null);
  };

  const profile = isOwnProfile ? currentProfile : viewedProfile;
  const profileVillage = villages.find(v => v.id === profile?.village_id);
  
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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 pt-2"
      >
        {/* Header */}
        {onBack && (
          <div className="flex items-center justify-between -mt-2 mb-2">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            {isOwnProfile && (
              <button 
                onClick={() => setShowEditModal(true)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
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
          <h2 className="text-xl font-bold">{profile?.full_name || profile?.username || (language === 'kg' ? 'Колдонуучу' : 'Пользователь')}</h2>
          {profile?.username && (
            <p className="text-muted-foreground text-sm">@{profile.username}</p>
          )}
          
          {/* Village */}
          {profileVillage && (
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'kg' ? profileVillage.name.kg : profileVillage.name.ru}
            </p>
          )}

          {/* Bio */}
          {profile?.bio && (
            <p className="text-sm mt-3 px-6 max-w-md mx-auto">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-5">
            <div className="text-center">
              <p className="text-lg font-bold">{postsCount}</p>
              <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Пост' : 'Постов'}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{followersCount}</p>
              <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Жазылуучу' : 'Подписчики'}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{followingCount}</p>
              <p className="text-xs text-muted-foreground">{language === 'kg' ? 'Жазылган' : 'Подписки'}</p>
            </div>
          </div>

          {/* Actions */}
          {!isOwnProfile && currentProfile && (
            <div className="flex items-center justify-center gap-3 mt-5 px-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFollow}
                disabled={followLoading}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
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
                className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          {/* Own Profile Actions */}
          {isOwnProfile && (
            <div className="flex items-center justify-center gap-3 mt-5 px-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="flex-1 py-2.5 bg-secondary rounded-xl font-medium"
              >
                {language === 'kg' ? 'Профилди оңдоо' : 'Редактировать'}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Score & Badges (own profile only) */}
        {isOwnProfile && (
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
        )}

        {/* Post Tabs */}
        <div className="border-t border-border">
          <div className="flex">
            <button
              onClick={() => setActivePostTab('posts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
                activePostTab === 'posts' 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePostTab('saved')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
                activePostTab === 'saved' 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {activePostTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 -mx-5">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-secondary/50 relative cursor-pointer group"
                >
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <p className="text-xs text-muted-foreground text-center line-clamp-3">
                        {post.content.slice(0, 50)}...
                      </p>
                    </div>
                  )}
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="w-8 h-8" />
                </div>
                <p className="font-semibold text-lg">
                  {language === 'kg' ? 'Пост жок' : 'Нет публикаций'}
                </p>
                {isOwnProfile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'kg' ? 'Биринчи постуңузду жарыялаңыз' : 'Опубликуйте свой первый пост'}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activePostTab === 'saved' && (
          <div className="py-12 text-center">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === 'kg' ? 'Сакталган посттор жок' : 'Нет сохраненных постов'}
            </p>
          </div>
        )}

      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={handleEditClose}
      />

      {/* Post Detail Modal */}
      {selectedPost && isOwnProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">{language === 'kg' ? 'Пост' : 'Публикация'}</h3>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="p-4">
              {selectedPost.image_url && (
                <img 
                  src={selectedPost.image_url} 
                  alt="" 
                  className="w-full rounded-xl mb-4 max-h-64 object-cover"
                />
              )}
              <p className="text-sm">{selectedPost.content}</p>
            </div>

            {/* Delete Button */}
            <div className="p-4 border-t border-border">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeletePost(selectedPost.id)}
                disabled={deletingPostId === selectedPost.id}
                className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl font-medium flex items-center justify-center gap-2"
              >
                {deletingPostId === selectedPost.id ? (
                  <div className="w-5 h-5 border-2 border-destructive-foreground/20 border-t-destructive-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    {language === 'kg' ? 'Постту өчүрүү' : 'Удалить пост'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UserProfile;