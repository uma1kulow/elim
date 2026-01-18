import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/IntroScreen';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import VillageMap from '@/components/VillageMap';
import VillageStats from '@/components/VillageStats';
import WeeklyMission from '@/components/WeeklyMission';
import ChatList from '@/components/ChatList';
import ChatRoom from '@/components/ChatRoom';
import UserProfile from '@/components/UserProfile';
import CreatePostModal from '@/components/CreatePostModal';
import AllPostsView from '@/components/AllPostsView';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { ChevronRight, Bell, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const Index: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { hasSelectedVillage, selectedVillage } = useVillage();
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { posts, likePost } = usePosts();

  if (showIntro || !hasSelectedVillage) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: false,
      locale: language === 'kg' ? ru : enUS
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-14 pb-32 px-5">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && !showAllPosts && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                <h2 className="text-2xl font-bold tracking-tight">Салам! 👋</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {language === 'kg' ? selectedVillage?.name.kg : selectedVillage?.name.ru} айылы
                </p>
              </motion.div>

              <VillageStats />
              <WeeklyMission />

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full flex items-center gap-3 bg-status-event/10 text-status-event rounded-2xl p-4 active:scale-[0.98] transition-transform"
              >
                <Bell className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">3 жаңы билдирүү</p>
                  <p className="text-xs opacity-70">Көрүү үчүн басыңыз</p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl overflow-hidden bg-secondary/30"
              >
                <div className="h-40"><VillageMap /></div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Картаны ачуу</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{t('whatsHappening')}</h3>
                  <button 
                    onClick={() => setShowAllPosts(true)}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                  >
                    {t('viewAll')}<ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {posts.slice(0, 5).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-secondary/30 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">
                          {post.author?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{post.author?.full_name || 'Колдонуучу'}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(post.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      {post.image_url && (
                        <div className="mb-3 rounded-xl overflow-hidden">
                          <img src={post.image_url} alt="Post" className="w-full max-h-64 object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <button onClick={() => likePost(post.id)} className={`flex items-center gap-1.5 text-sm ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes_count}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_count}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'home' && showAllPosts && (
            <motion.div key="allposts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="-mx-5 -mt-14">
              <AllPostsView onBack={() => setShowAllPosts(false)} />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-8rem)] -mx-5 -mt-14 pt-14">
              <VillageMap />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedConversation ? (
                <ChatRoom conversationId={selectedConversation} onBack={() => setSelectedConversation(null)} />
              ) : (
                <ChatList onSelectConversation={setSelectedConversation} />
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UserProfile onOpenChat={(id) => { setSelectedConversation(id); setActiveTab('chat'); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* No FAB here - using the + in BottomNav */}

      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === 'add') {
            if (profile) {
              setShowCreatePost(true);
            } else {
              toast.error(language === 'kg' ? 'Адегенде кириңиз' : 'Сначала войдите');
            }
          } else {
            setActiveTab(tab);
          }
        }} 
      />
    </div>
  );
};

export default Index;
