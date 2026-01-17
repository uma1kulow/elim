import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage, Village } from '@/contexts/VillageContext';
import { ChevronRight, MapPin, Search, X, ChevronDown } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'select'>('logo');
  const { language, setLanguage, t } = useLanguage();
  const { villages, setSelectedVillage, searchVillages, regions } = useVillage();
  const [hoveredVillage, setHoveredVillage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('select');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const filteredVillages = useMemo(() => {
    let result = searchQuery ? searchVillages(searchQuery) : villages;
    if (selectedRegion) {
      result = result.filter(v => v.region === selectedRegion);
    }
    return result.slice(0, 20); // Limit to 20 for performance
  }, [searchQuery, selectedRegion, villages, searchVillages]);

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setTimeout(onComplete, 600);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedRegion(null);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Language Toggle */}
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

      <div className="flex-1 flex items-center justify-center px-5 py-6 overflow-hidden">
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
              className="w-full max-w-md flex flex-col h-full max-h-[85vh]"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-5 flex-shrink-0"
              >
                <h1 className="text-3xl font-bold tracking-tight">elim.</h1>
                <p className="text-muted-foreground text-sm mt-2">{t('selectVillage')}</p>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-3 flex-shrink-0"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'kg' ? 'Айыл издөө...' : 'Поиск села...'}
                    className="w-full bg-secondary/60 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  {(searchQuery || selectedRegion) && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Region Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-4 flex-shrink-0"
              >
                <div className="relative">
                  <button
                    onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                    className="w-full bg-secondary/40 rounded-xl px-4 py-3 text-sm flex items-center justify-between hover:bg-secondary/60 transition-colors"
                  >
                    <span className={selectedRegion ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedRegion || (language === 'kg' ? 'Область боюнча' : 'По области')}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showRegionDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-20 overflow-hidden"
                      >
                        <button
                          onClick={() => { setSelectedRegion(null); setShowRegionDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 transition-colors ${!selectedRegion ? 'bg-secondary/30 font-medium' : ''}`}
                        >
                          {language === 'kg' ? 'Баары' : 'Все'}
                        </button>
                        {regions.map((region) => (
                          <button
                            key={region}
                            onClick={() => { setSelectedRegion(region); setShowRegionDropdown(false); }}
                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 transition-colors ${selectedRegion === region ? 'bg-secondary/30 font-medium' : ''}`}
                          >
                            {region}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-2 flex-shrink-0"
              >
                <p className="text-xs text-muted-foreground">
                  {language === 'kg' 
                    ? `${filteredVillages.length} айыл табылды`
                    : `Найдено ${filteredVillages.length} сел`
                  }
                </p>
              </motion.div>

              {/* Village List */}
              <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                {filteredVillages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      {language === 'kg' ? 'Айыл табылган жок' : 'Село не найдено'}
                    </p>
                  </motion.div>
                ) : (
                  filteredVillages.map((village, index) => (
                    <motion.button
                      key={village.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(0.2 + index * 0.03, 0.6), duration: 0.3 }}
                      onClick={() => handleVillageSelect(village)}
                      onMouseEnter={() => setHoveredVillage(village.id)}
                      onMouseLeave={() => setHoveredVillage(null)}
                      className="w-full bg-secondary/50 hover:bg-secondary p-3.5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-sm">
                            {language === 'kg' ? village.name.kg : village.name.ru}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {village.region} · {village.population.toLocaleString()} {language === 'kg' ? 'адам' : 'чел.'}
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
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntroScreen;
