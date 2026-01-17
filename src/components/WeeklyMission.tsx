import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock } from 'lucide-react';

const WeeklyMission: React.FC = () => {
  const mission = {
    title: 'Жумалык миссия',
    description: '5 көйгөйдү чечүү',
    progress: 3,
    total: 5,
    reward: '+50',
    daysLeft: 4,
  };

  const percentage = (mission.progress / mission.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-foreground text-background rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="text-sm font-semibold">{mission.title}</span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-70">
          <Clock className="w-3 h-3" />
          <span>{mission.daysLeft} күн</span>
        </div>
      </div>

      <p className="text-xs opacity-70 mb-3">{mission.description}</p>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-background/20 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="absolute h-full bg-background rounded-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{mission.progress}/{mission.total}</span>
        <span className="text-xs font-bold">{mission.reward} балл</span>
      </div>
    </motion.div>
  );
};

export default WeeklyMission;
