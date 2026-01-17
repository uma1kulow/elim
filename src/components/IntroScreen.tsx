import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage, Village } from '@/contexts/VillageContext';
import { ChevronRight, MapPin } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'select'>('logo');
  const { language, setLanguage, t } = useLanguage();
  const { villages, setSelectedVillage } = useVillage();
  const [hoveredVillage, setHoveredVillage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('select');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setTimeout(onComplete, 600);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Language Toggle - Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-10"
      >
        <button
          onClick={() => setLanguage(language === 'kg' ? 'ru' : 'kg')}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          {language === 'kg' ? 'Русский' : 'Кыргызча'}
        </button>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Logo Animation */}
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-6xl md:text-8xl font-bold tracking-tight"
              >
                elim.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-4 text-muted-foreground text-sm"
              >
                {t('welcomeSubtitle')}
              </motion.p>

              {/* Minimal loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-10 flex gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-foreground/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {phase === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold tracking-tight">elim.</h1>
                <p className="text-muted-foreground text-sm mt-2">{t('selectVillage')}</p>
              </motion.div>

              <div className="space-y-2">
                {villages.map((village, index) => (
                  <motion.button
                    key={village.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
                    onClick={() => handleVillageSelect(village)}
                    onMouseEnter={() => setHoveredVillage(village.id)}
                    onMouseLeave={() => setHoveredVillage(null)}
                    className="w-full bg-secondary/60 hover:bg-secondary p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-sm">
                          {language === 'kg' ? village.name.kg : village.name.ru}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {village.population.toLocaleString()} адам
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: hoveredVillage === village.id ? 3 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntroScreen;
