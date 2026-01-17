import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, Home, Plus, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'map', icon: Map, label: t('map') },
    { id: 'add', icon: Plus, label: '', isAction: true },
    { id: 'chat', icon: MessageCircle, label: 'Чат' },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
    >
      <div className="mx-4 mb-4">
        <div className="glass-card rounded-2xl flex items-center justify-around py-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                tab.isAction
                  ? 'bg-primary text-primary-foreground w-14 h-14 -mt-6 rounded-full shadow-lg hover:scale-105'
                  : activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className={tab.isAction ? 'w-6 h-6' : 'w-5 h-5'} />
              {!tab.isAction && (
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              )}
              {activeTab === tab.id && !tab.isAction && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-foreground rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;
