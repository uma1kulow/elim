import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const WeeklyMission: React.FC = () => {
  const mission = {
    title: 'Жумалык миссия',
    description: '5 көйгөйдү чечүү',
    progress: 3,
    total: 5,
    reward: '+50 балл',
    daysLeft: 4,
  };

  const percentage = (mission.progress / mission.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-event/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-status-event" />
          </div>
          <div>
            <h3 className="font-semibold">{mission.title}</h3>
            <p className="text-sm text-muted-foreground">{mission.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{mission.daysLeft} күн</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Прогресс</span>
          <span className="font-medium">{mission.progress}/{mission.total}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-status-celebration" />
          <span className="text-status-celebration font-medium">{mission.reward}</span>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
          Катышуу
        </button>
      </div>
    </motion.div>
  );
};

export default WeeklyMission;
