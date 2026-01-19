import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Bell, 
  Briefcase, 
  Vote, 
  AlertTriangle, 
  Heart,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureCardsProps {
  onOpenGamification: () => void;
  onOpenNotifications: () => void;
  onOpenEconomy: () => void;
  onOpenVoting: () => void;
  onOpenIssues: () => void;
  onOpenDonations: () => void;
  onOpenZapier?: () => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  onOpenGamification,
  onOpenNotifications,
  onOpenEconomy,
  onOpenVoting,
  onOpenIssues,
  onOpenDonations,
  onOpenZapier
}) => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Trophy,
      title: language === 'kg' ? 'Геймификация' : 'Геймификация',
      subtitle: language === 'kg' ? 'Балл, бейдж, рейтинг' : 'Баллы, бейджи, рейтинг',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      onClick: onOpenGamification
    },
    {
      icon: Bell,
      title: language === 'kg' ? 'Билдирүүлөр' : 'Уведомления',
      subtitle: language === 'kg' ? 'Шашылыш жаңылыктар' : 'Срочные новости',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      onClick: onOpenNotifications
    },
    {
      icon: Briefcase,
      title: language === 'kg' ? 'Экономика' : 'Экономика',
      subtitle: language === 'kg' ? 'Ишкерлер, жумуштар' : 'Бизнес, вакансии',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      onClick: onOpenEconomy
    },
    {
      icon: Vote,
      title: language === 'kg' ? 'Добуш берүү' : 'Голосование',
      subtitle: language === 'kg' ? 'Чечимдерге катышыңыз' : 'Участвуйте в решениях',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      onClick: onOpenVoting
    },
    {
      icon: AlertTriangle,
      title: language === 'kg' ? 'Жалоба' : 'Жалобы',
      subtitle: language === 'kg' ? 'Көйгөйлөрдү билдириңиз' : 'Сообщите о проблемах',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      onClick: onOpenIssues
    },
    {
      icon: Heart,
      title: language === 'kg' ? 'Донат' : 'Донаты',
      subtitle: language === 'kg' ? 'Долбоорлорду колдоңуз' : 'Поддержите проекты',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      onClick: onOpenDonations
    },
    ...(onOpenZapier ? [{
      icon: Zap,
      title: 'Zapier',
      subtitle: language === 'kg' ? 'Автоматташтыруу' : 'Автоматизация',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      onClick: onOpenZapier
    }] : [])
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 gap-3"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.button
            key={feature.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            onClick={feature.onClick}
            className={`${feature.bgColor} rounded-2xl p-4 text-left active:scale-[0.98] transition-all duration-200 hover:shadow-md`}
          >
            <Icon className={`w-6 h-6 ${feature.color} mb-2`} />
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{feature.subtitle}</p>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FeatureCards;
