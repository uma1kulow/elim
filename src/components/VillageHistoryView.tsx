import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, History, Calendar, School, Zap, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillageHistory } from '@/hooks/useVillageHistory';

interface VillageHistoryViewProps {
  onBack: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  founding: <Building2 className="w-5 h-5" />,
  construction: <School className="w-5 h-5" />,
  event: <Zap className="w-5 h-5" />,
  person: <History className="w-5 h-5" />,
  general: <History className="w-5 h-5" />,
};

const VillageHistoryView: React.FC<VillageHistoryViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { history, loading } = useVillageHistory();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {language === 'kg' ? 'Айылдын тарыхы' : 'История села'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'kg' ? 'Биздин мурас' : 'Наше наследие'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-secondary/30 rounded-2xl p-4 animate-pulse">
                <div className="h-6 bg-secondary rounded w-1/3 mb-3" />
                <div className="h-4 bg-secondary rounded w-full mb-2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'kg' ? 'Тарых жок' : 'История отсутствует'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {history.map((item, index) => {
              const title = language === 'kg' ? item.title_kg || item.title : item.title;
              const description = language === 'kg' ? item.description_kg || item.description : item.description;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14 pb-6"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background" />
                  </div>

                  <div className="bg-secondary/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {categoryIcons[item.category] || categoryIcons.general}
                      </div>
                      {item.year && (
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.year} {language === 'kg' ? 'ж.' : 'г.'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    {item.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={item.image_url} alt={title} className="w-full h-40 object-cover" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageHistoryView;
