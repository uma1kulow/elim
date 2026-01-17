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
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setTimeout(onComplete, 800);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute top-6 right-6 z-10"
      >
        <div className="glass-card flex p-1 gap-1">
          <button
            onClick={() => setLanguage('kg')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              language === 'kg'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Кыргызча
          </button>
          <button
            onClick={() => setLanguage('ru')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              language === 'ru'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Русский
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* 3D Logo Animation */}
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1000 }}
            >
              <motion.h1
                className="text-7xl md:text-9xl font-bold tracking-tight"
                animate={{
                  textShadow: [
                    '0 0 0px hsl(var(--foreground))',
                    '0 20px 40px hsl(var(--foreground) / 0.2)',
                    '0 0 0px hsl(var(--foreground))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                elim.
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 text-muted-foreground text-lg"
            >
              {t('welcomeSubtitle')}
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-foreground"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
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
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">elim.</h1>
              <p className="text-xl text-muted-foreground">{t('selectVillage')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {villages.map((village, index) => (
                <motion.button
                  key={village.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  onClick={() => handleVillageSelect(village)}
                  onMouseEnter={() => setHoveredVillage(village.id)}
                  onMouseLeave={() => setHoveredVillage(null)}
                  className="w-full glass-card p-4 flex items-center justify-between group transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">
                        {language === 'kg' ? village.name.kg : village.name.ru}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {village.population.toLocaleString()} {t('population').toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: hoveredVillage === village.id ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroScreen;
