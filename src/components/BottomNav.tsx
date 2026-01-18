import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, Home, Plus, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t, language } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: language === 'kg' ? 'Башкы' : 'Главная' },
    { id: 'map', icon: Map, label: language === 'kg' ? 'Карта' : 'Карта' },
    { id: 'add', icon: Plus, label: '', isAction: true },
    { id: 'chat', icon: MessageCircle, label: language === 'kg' ? 'Чат' : 'Чат' },
    { id: 'profile', icon: User, label: language === 'kg' ? 'Профиль' : 'Профиль' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      <div className="relative px-6 pb-8 pt-2">
        <div className="bg-foreground/5 backdrop-blur-2xl rounded-2xl border border-border/50 flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center justify-center py-2 px-5 rounded-xl transition-all duration-300 ${
                tab.isAction
                  ? 'bg-foreground text-background -mt-8 w-14 h-14 rounded-full shadow-2xl'
                  : ''
              }`}
            >
              <motion.div
                animate={{
                  scale: activeTab === tab.id && !tab.isAction ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <tab.icon 
                  className={`${tab.isAction ? 'w-6 h-6' : 'w-5 h-5'} ${
                    activeTab === tab.id && !tab.isAction 
                      ? 'text-foreground' 
                      : !tab.isAction 
                        ? 'text-muted-foreground' 
                        : ''
                  }`} 
                  strokeWidth={activeTab === tab.id ? 2.5 : 1.5}
                />
              </motion.div>
              {!tab.isAction && (
                <span className={`text-[10px] mt-1 font-medium transition-colors ${
                  activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {tab.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;
