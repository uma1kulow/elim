import React from 'react';
import { motion } from 'framer-motion';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';

const VillageStats: React.FC = () => {
  const { selectedVillage } = useVillage();
  const { t } = useLanguage();

  if (!selectedVillage) return null;

  const stats = [
    {
      label: t('population'),
      value: selectedVillage.population.toLocaleString(),
      suffix: '',
    },
    {
      label: t('activityIndex'),
      value: selectedVillage.activityIndex,
      suffix: '%',
    },
    {
      label: t('problemsSolved'),
      value: selectedVillage.problemsSolved,
      suffix: '',
    },
    {
      label: t('rating'),
      value: selectedVillage.rating.toFixed(1),
      suffix: '★',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-4 gap-2"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="text-center py-3"
        >
          <p className="text-lg font-bold tracking-tight">
            {stat.value}
            <span className="text-muted-foreground text-sm">{stat.suffix}</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VillageStats;
