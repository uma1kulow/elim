import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Vote, Plus, Clock, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoting, Poll } from '@/hooks/useVoting';
import { useAuth } from '@/contexts/AuthContext';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VotingViewProps {
  onBack: () => void;
}

const VotingView: React.FC<VotingViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { polls, loading, vote, createPoll } = useVoting();
  const { incrementProgress } = useMissions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  const handleVote = async (pollId: string, optionId: string) => {
    const success = await vote(pollId, optionId, incrementProgress);
  };

  const handleCreatePoll = async () => {
    if (!newPoll.title || newPoll.options.filter(o => o.trim()).length < 2) return;
    
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 7);
    
    await createPoll(
      newPoll.title,
      newPoll.title,
      newPoll.description,
      newPoll.options.filter(o => o.trim()),
      endsAt
    );
    
    setShowCreateModal(false);
    setNewPoll({ title: '', description: '', options: ['', ''] });
  };

  const getTimeRemaining = (endsAt: string) => {
    const end = new Date(endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${language === 'kg' ? 'күн' : 'дней'}`;
    if (hours > 0) return `${hours} ${language === 'kg' ? 'саат' : 'часов'}`;
    return language === 'kg' ? 'Аяктоо' : 'Завершается';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-4 pt-16"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 -ml-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                {language === 'kg' ? 'Добуш берүү' : 'Голосование'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Чечимдерге катышыңыз' : 'Участвуйте в решениях'}
              </p>
            </div>
          </div>
          
          {profile && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Түзүү' : 'Создать'}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'kg' ? 'Добуш берүүлөр жок' : 'Нет голосований'}
          </div>
        ) : (
          polls.map((poll, index) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    {language === 'kg' ? poll.title_kg || poll.title : poll.title}
                  </h3>
                  {poll.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'kg' ? poll.description_kg || poll.description : poll.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {getTimeRemaining(poll.ends_at)}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {poll.options.map((option) => {
                  const percentage = poll.total_votes > 0 
                    ? Math.round((option.votes_count / poll.total_votes) * 100) 
                    : 0;

                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !poll.user_voted && handleVote(poll.id, option.id)}
                      disabled={poll.user_voted || !profile}
                      className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                        poll.user_voted 
                          ? 'bg-secondary cursor-default' 
                          : 'bg-secondary/50 hover:bg-secondary active:scale-[0.98]'
                      }`}
                    >
                      {poll.user_voted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 bg-primary/20 rounded-xl"
                        />
                      )}
                      <div className="relative flex items-center justify-between">
                        <span className="font-medium">
                          {language === 'kg' ? option.text_kg || option.text : option.text}
                        </span>
                        {poll.user_voted && (
                          <span className="text-sm font-semibold">{percentage}%</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {poll.total_votes} {language === 'kg' ? 'добуш' : 'голосов'}
                </div>
                {poll.user_voted && (
                  <div className="flex items-center gap-1 text-green-500">
                    <Check className="w-3 h-3" />
                    {language === 'kg' ? 'Добуш берилди' : 'Проголосовано'}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Poll Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {language === 'kg' ? 'Добуш берүү түзүү' : 'Создать голосование'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Суроо' : 'Вопрос'}
                  </label>
                  <Input
                    value={newPoll.title}
                    onChange={e => setNewPoll({ ...newPoll, title: e.target.value })}
                    placeholder={language === 'kg' ? 'Суроону жазыңыз' : 'Введите вопрос'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Сүрөттөмө' : 'Описание'}
                  </label>
                  <Textarea
                    value={newPoll.description}
                    onChange={e => setNewPoll({ ...newPoll, description: e.target.value })}
                    placeholder={language === 'kg' ? 'Кошумча маалымат' : 'Дополнительная информация'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Варианттар' : 'Варианты ответов'}
                  </label>
                  <div className="space-y-2">
                    {newPoll.options.map((opt, i) => (
                      <Input
                        key={i}
                        value={opt}
                        onChange={e => {
                          const options = [...newPoll.options];
                          options[i] = e.target.value;
                          setNewPoll({ ...newPoll, options });
                        }}
                        placeholder={`${language === 'kg' ? 'Вариант' : 'Вариант'} ${i + 1}`}
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {language === 'kg' ? 'Кошуу' : 'Добавить'}
                    </Button>
                  </div>
                </div>

                <Button className="w-full" onClick={handleCreatePoll}>
                  {language === 'kg' ? 'Түзүү' : 'Создать'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingView;
