import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Star, Crown, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GamificationViewProps {
  onBack: () => void;
}

const GamificationView: React.FC<GamificationViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { badges, userBadges, leaderboard, loading } = useGamification();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-amber-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center text-sm text-muted-foreground">{index + 1}</span>;
  };

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-4 pt-16"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 -ml-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              {language === 'kg' ? 'Геймификация' : 'Геймификация'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'kg' ? 'Балл, бейдж, рейтинг' : 'Баллы, бейджи, рейтинг'}
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-4 py-4 space-y-6">
          {/* User Stats */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-amber-500">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-xl bg-amber-500 text-white">
                      {profile.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                    <Flame className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{profile.full_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">{profile.score || 0}</span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'kg' ? 'балл' : 'баллов'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Badges */}
          <div>
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" />
              {language === 'kg' ? 'Бейджилер' : 'Бейджи'}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge, index) => {
                const isEarned = earnedBadgeIds.has(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-2xl text-center transition-all ${
                      isEarned
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                        : 'bg-secondary/50 opacity-50'
                    }`}
                  >
                    <span className="text-3xl block mb-1">{badge.icon}</span>
                    <p className="text-xs font-medium line-clamp-1">
                      {language === 'kg' ? badge.name_kg || badge.name : badge.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {badge.points_required} {language === 'kg' ? 'балл' : 'баллов'}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              {language === 'kg' ? 'Рейтинг' : 'Рейтинг'}
            </h2>
            <div className="space-y-2">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    user.id === profile?.id 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-secondary/50'
                  }`}
                >
                  <div className="w-6 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {user.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 font-medium text-sm truncate">
                    {user.full_name || 'Колдонуучу'}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold">{user.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationView;
