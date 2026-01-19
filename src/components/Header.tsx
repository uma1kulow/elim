import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  onVillageClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onVillageClick }) => {
  const { language, setLanguage } = useLanguage();
  const { selectedVillage } = useVillage();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center justify-between px-5 h-12">
        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-tight">elim.</h1>

        {/* Village - Center */}
        {selectedVillage && (
          <button
            onClick={onVillageClick}
            className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'kg' ? selectedVillage.name.kg : selectedVillage.name.ru}
          </button>
        )}

        {/* Controls - Right */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'kg' ? 'ru' : 'kg')}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            {language === 'kg' ? 'RU' : 'KG'}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;