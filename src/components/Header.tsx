import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { MapPin, Bell, User, Search } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { selectedVillage } = useVillage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass-card rounded-none border-x-0 border-t-0"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Village */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">elim.</h1>
          {selectedVillage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'kg' ? selectedVillage.name.kg : selectedVillage.name.ru}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="hidden md:flex bg-secondary rounded-full p-1 gap-0.5">
            <button
              onClick={() => setLanguage('kg')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                language === 'kg'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              KG
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                language === 'ru'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              RU
            </button>
          </div>

          {/* Search */}
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-status-problem rounded-full" />
          </button>

          {/* Profile */}
          <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
