import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Calendar, CheckCircle2, Clock, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillageFuture } from '@/hooks/useVillageFuture';

interface VillageFutureViewProps {
  onBack: () => void;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: { kg: string; ru: string } }> = {
  planned: {
    icon: <Target className="w-4 h-4" />,
    color: 'bg-blue-500/10 text-blue-500',
    label: { kg: 'Пландалган', ru: 'Запланировано' }
  },
  in_progress: {
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-yellow-500/10 text-yellow-500',
    label: { kg: 'Жүрүп жатат', ru: 'В процессе' }
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-green-500/10 text-green-500',
    label: { kg: 'Аткарылды', ru: 'Завершено' }
  }
};

const VillageFutureView: React.FC<VillageFutureViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { plans, loading } = useVillageFuture();

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
              {language === 'kg' ? 'Айыл келечекте' : 'Будущее села'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'kg' ? 'Биздин максаттар' : 'Наши цели'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 text-center"
        >
          <Rocket className="w-12 h-12 mx-auto text-primary mb-3" />
          <h2 className="font-bold text-lg mb-2">
            {language === 'kg' ? 'Биздин көз караш' : 'Наше видение'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === 'kg' 
              ? 'Биз жакшы келечек үчүн чогуу иштейбиз. Бул жерде биздин айыл үчүн пландалган долбоорлор.'
              : 'Мы работаем вместе для лучшего будущего. Здесь запланированные проекты для нашего села.'}
          </p>
        </motion.div>

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
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <Rocket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'kg' ? 'Пландар жок' : 'Планов нет'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, index) => {
              const title = language === 'kg' ? plan.title_kg || plan.title : plan.title;
              const description = language === 'kg' ? plan.description_kg || plan.description : plan.description;
              const status = statusConfig[plan.status] || statusConfig.planned;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                        {status.icon}
                        {language === 'kg' ? status.label.kg : status.label.ru}
                      </div>
                    </div>
                    {plan.target_year && (
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {plan.target_year} {language === 'kg' ? 'ж.' : 'г.'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {plan.image_url && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                      <img src={plan.image_url} alt={title} className="w-full h-40 object-cover" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageFutureView;
