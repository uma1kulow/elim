import React from 'react';
import { motion } from 'framer-motion';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Activity, CheckCircle2, Star, TrendingUp } from 'lucide-react';

const VillageStats: React.FC = () => {
  const { selectedVillage } = useVillage();
  const { t } = useLanguage();

  if (!selectedVillage) return null;

  const stats = [
    {
      icon: Users,
      label: t('population'),
      value: selectedVillage.population.toLocaleString(),
      color: 'text-status-event',
    },
    {
      icon: Activity,
      label: t('activityIndex'),
      value: `${selectedVillage.activityIndex}%`,
      color: 'text-status-progress',
    },
    {
      icon: CheckCircle2,
      label: t('problemsSolved'),
      value: selectedVillage.problemsSolved.toString(),
      color: 'text-status-solved',
    },
    {
      icon: Star,
      label: t('rating'),
      value: selectedVillage.rating.toFixed(1),
      color: 'text-status-celebration',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4 flex flex-col items-center text-center"
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
          <span className="text-2xl font-bold">{stat.value}</span>
          <span className="text-xs text-muted-foreground mt-1">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VillageStats;
