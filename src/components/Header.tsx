import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  onVillageClick?: () => void;
  onSecretAdminAccess?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onVillageClick, onSecretAdminAccess }) => {
  const { language, setLanguage } = useLanguage();
  const { selectedVillage } = useVillage();
  const { theme, toggleTheme } = useTheme();
  
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // Reset tap count after 2 seconds of no taps
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }
    tapTimer.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    // 5 taps = secret admin access
    if (newCount >= 5) {
      setTapCount(0);
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }
      onSecretAdminAccess?.();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center justify-between px-5 h-12">
        {/* Logo - Secret Admin Access */}
        <button
          onClick={handleLogoClick}
          className="text-lg font-semibold tracking-tight select-none active:opacity-70 transition-opacity"
        >
          elim.
        </button>

        {/* Village - Center */}
        {selectedVillage && (
          <button
            onClick={onVillageClick}
            className="absolute left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-foreground bg-secondary/80 hover:bg-secondary rounded-full border border-border/50 transition-all active:scale-95"
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