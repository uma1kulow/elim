import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/IntroScreen';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import VillageMap from '@/components/VillageMap';
import FeedCard from '@/components/FeedCard';
import VillageStats from '@/components/VillageStats';
import WeeklyMission from '@/components/WeeklyMission';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight, Bell } from 'lucide-react';
import type { MarkerStatus } from '@/components/VillageMap';

const mockFeedItems = [
  {
    id: '1',
    title: 'Борбор көчөдөгү жол бузулган',
    description: 'Жамгырдан кийин чуңкурлар пайда болду. Машинелер өтө албай жатат.',
    status: 'problem' as MarkerStatus,
    votes: 45,
    comments: 12,
    timeAgo: '2 саат',
    author: 'Асан Бекович',
  },
  {
    id: '2',
    title: 'Парктагы жарык орнотулду',
    description: 'Борбордук паркта жаңы LED жарыктары орнотулду.',
    status: 'solved' as MarkerStatus,
    votes: 78,
    comments: 23,
    timeAgo: '5 саат',
    author: 'Гүлнара М.',
  },
  {
    id: '3',
    title: 'Мектептин ремонту башталды',
    description: 'Айыл мектебинин чатырын оңдоо иштери башталды.',
    status: 'progress' as MarkerStatus,
    votes: 120,
    comments: 45,
    timeAgo: 'Кечээ',
    author: 'Мектеп',
  },
  {
    id: '4',
    title: 'Волейбол турнири',
    description: 'Жума күнү саат 15:00дө волейбол турнири өткөрүлөт.',
    status: 'event' as MarkerStatus,
    votes: 34,
    comments: 8,
    timeAgo: 'Кечээ',
    author: 'Спорт клубу',
  },
];

const Index: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const { hasSelectedVillage, selectedVillage } = useVillage();
  const { t, language } = useLanguage();

  if (showIntro || !hasSelectedVillage) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-14 pb-32 px-5">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <h2 className="text-2xl font-bold tracking-tight">Салам! 👋</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {language === 'kg' ? selectedVillage?.name.kg : selectedVillage?.name.ru} айылы
                </p>
              </motion.div>

              {/* Stats */}
              <VillageStats />

              {/* Weekly Mission */}
              <WeeklyMission />

              {/* Quick Alert */}
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

              {/* Map Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl overflow-hidden bg-secondary/30"
              >
                <div className="h-40">
                  <VillageMap />
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Картаны ачуу</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Feed */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{t('whatsHappening')}</h3>
                  <button className="text-xs text-muted-foreground flex items-center gap-1">
                    {t('viewAll')}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {mockFeedItems.map((item, index) => (
                    <FeedCard key={item.id} {...item} index={index} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-8rem)] -mx-5 -mt-14 pt-14"
            >
              <VillageMap />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4"
              >
                <span className="text-2xl">💬</span>
              </motion.div>
              <h2 className="text-lg font-semibold">Чаттар</h2>
              <p className="text-sm text-muted-foreground mt-1">Жакында ишке киргизилет</p>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5 pt-4"
            >
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">А</span>
                </div>
                <h2 className="text-xl font-bold">Асан Бекович</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'kg' ? selectedVillage?.name.kg : selectedVillage?.name.ru}
                </p>

                <div className="flex items-center justify-center gap-8 mt-6">
                  {[
                    { value: '256', label: 'Балл' },
                    { value: '12', label: 'Бейдж' },
                    { value: '#4', label: 'Рейтинг' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/50 rounded-2xl p-4"
              >
                <h3 className="font-medium text-sm mb-3">Бейджтер</h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['🌟', '🏆', '💪', '🎯', '🔥', '⭐', '🚀'].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="w-11 h-11 rounded-full bg-background flex items-center justify-center text-lg flex-shrink-0"
                    >
                      {badge}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/50 rounded-2xl p-4"
              >
                <h3 className="font-medium text-sm mb-3">Акыркы активдүүлүк</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Добуш берди', target: 'Жол оңдоо', time: '2 саат' },
                    { action: 'Комментарий', target: 'Мектеп ремонту', time: '5 саат' },
                    { action: 'Көйгөй билдирди', target: 'Суу көйгөйү', time: '1 күн' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.target}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
