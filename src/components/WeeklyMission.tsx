import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMissions, MissionWithProgress } from '@/hooks/useMissions';

interface WeeklyMissionProps {
  mission?: MissionWithProgress;
  showSingle?: boolean;
  onClick?: () => void;
}

const WeeklyMission: React.FC<WeeklyMissionProps> = ({ mission: propMission, showSingle = true, onClick }) => {
  const { language } = useLanguage();
  const { missions, loading, getDaysLeft } = useMissions();

  // Use prop mission or first active mission
  const displayMissions = propMission ? [propMission] : (showSingle ? missions.slice(0, 1) : missions);

  if (loading) {
    return (
      <div className="bg-foreground text-background rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-background/20 rounded w-1/2 mb-3" />
        <div className="h-3 bg-background/20 rounded w-3/4 mb-3" />
        <div className="h-1.5 bg-background/20 rounded-full" />
      </div>
    );
  }

  if (displayMissions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {displayMissions.map((mission, index) => {
        const progress = mission.progress?.current_progress || 0;
        const percentage = (progress / mission.target_count) * 100;
        const daysLeft = getDaysLeft(mission.ends_at);
        const isCompleted = mission.progress?.is_completed || false;
        const title = language === 'kg' ? mission.title_kg || mission.title : mission.title;
        const description = language === 'kg' ? mission.description_kg || mission.description : mission.description;

        return (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className={`rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform ${
              isCompleted 
                ? 'bg-green-600 text-white' 
                : 'bg-foreground text-background'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Target className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {language === 'kg' ? 'Жумалык миссия' : 'Недельная миссия'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs opacity-70">
                <Clock className="w-3 h-3" />
                <span>{daysLeft} {language === 'kg' ? 'күн' : 'дней'}</span>
              </div>
            </div>

            <p className="text-xs opacity-70 mb-3">{description}</p>

            {/* Progress bar */}
            <div className={`relative h-1.5 rounded-full overflow-hidden mb-3 ${
              isCompleted ? 'bg-white/20' : 'bg-background/20'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className={`absolute h-full rounded-full ${
                  isCompleted ? 'bg-white' : 'bg-background'
                }`}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                {progress}/{mission.target_count}
              </span>
              <span className={`text-xs font-bold ${isCompleted ? 'line-through opacity-70' : ''}`}>
                +{mission.reward_points} {language === 'kg' ? 'балл' : 'баллов'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WeeklyMission;
