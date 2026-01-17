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
import { ChevronRight } from 'lucide-react';
import type { MarkerStatus } from '@/components/VillageMap';

const mockFeedItems = [
  {
    id: '1',
    title: 'Борбор көчөдөгү жол бузулган',
    description: 'Жамгырдан кийин чуңкурлар пайда болду. Машинелер өтө албай жатат, өзгөчө түнкүсүн кооптуу.',
    status: 'problem' as MarkerStatus,
    votes: 45,
    comments: 12,
    timeAgo: '2 саат мурун',
    author: 'Асан Бекович',
  },
  {
    id: '2',
    title: 'Парктагы жарык орнотулду',
    description: 'Айыл кеңешинин колдоосу менен борбордук паркта жаңы LED жарыктары орнотулду.',
    status: 'solved' as MarkerStatus,
    votes: 78,
    comments: 23,
    timeAgo: '5 саат мурун',
    author: 'Гүлнара Маматова',
  },
  {
    id: '3',
    title: 'Мектептин ремонту башталды',
    description: 'Айыл мектебинин чатырын оңдоо иштери башталды. 2 айда бүтөт деп күтүлүүдө.',
    status: 'progress' as MarkerStatus,
    votes: 120,
    comments: 45,
    timeAgo: 'Кечээ',
    author: 'Мектеп администрациясы',
  },
  {
    id: '4',
    title: 'Волейбол турнири',
    description: 'Жума күнү саат 15:00дө спорт аянтчасында волейбол турнири өткөрүлөт. Баарыңарды чакырабыз!',
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
    <div className="min-h-screen bg-background pb-28">
      <Header />

      <main className="pt-20 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Village Stats */}
              <VillageStats />

              {/* Weekly Mission */}
              <WeeklyMission />

              {/* Map Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card overflow-hidden"
              >
                <div className="h-48 md:h-64">
                  <VillageMap />
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="w-full p-3 flex items-center justify-between border-t border-border hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm font-medium">Картаны толук көрүү</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Feed Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t('whatsHappening')}</h2>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    {t('viewAll')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[calc(100vh-10rem)] -mx-4"
            >
              <VillageMap />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Чаттар</h2>
              <p className="text-muted-foreground">Жакында ишке киргизилет</p>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <div className="glass-card p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">А</span>
                </div>
                <h2 className="text-xl font-bold">Асан Бекович</h2>
                <p className="text-muted-foreground">
                  {language === 'kg' ? selectedVillage?.name.kg : selectedVillage?.name.ru}
                </p>

                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">256</p>
                    <p className="text-xs text-muted-foreground">Балл</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Бейдж</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">#4</p>
                    <p className="text-xs text-muted-foreground">Рейтинг</p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="glass-card p-4">
                <h3 className="font-semibold mb-3">Бейджтер</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {['🌟', '🏆', '💪', '🎯', '🔥'].map((badge, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl flex-shrink-0"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="glass-card p-4">
                <h3 className="font-semibold mb-3">Акыркы активдүүлүк</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Добуш берди', target: 'Жол оңдоо', time: '2 саат' },
                    { action: 'Комментарий', target: 'Мектеп ремонту', time: '5 саат' },
                    { action: 'Көйгөй билдирди', target: 'Суу көйгөйү', time: '1 күн' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.target}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
