import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Plus, Target, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDonations } from '@/hooks/useDonations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface DonationsViewProps {
  onBack: () => void;
}

const DonationsView: React.FC<DonationsViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { donations, loading, contribute, createDonation } = useDonations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionMessage, setContributionMessage] = useState('');
  const [newDonation, setNewDonation] = useState({
    title: '',
    description: '',
    targetAmount: ''
  });

  const handleContribute = async () => {
    if (!showContributeModal || !contributionAmount) return;
    
    await contribute(
      showContributeModal,
      parseFloat(contributionAmount),
      contributionMessage || undefined
    );
    
    setShowContributeModal(null);
    setContributionAmount('');
    setContributionMessage('');
  };

  const handleCreateDonation = async () => {
    if (!newDonation.title || !newDonation.targetAmount) return;
    
    await createDonation(
      newDonation.title,
      newDonation.description,
      parseFloat(newDonation.targetAmount)
    );
    
    setShowCreateModal(false);
    setNewDonation({ title: '', description: '', targetAmount: '' });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
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
                <Heart className="w-5 h-5 text-red-500" />
                {language === 'kg' ? 'Донаттар' : 'Пожертвования'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Долбоорлорду колдоңуз' : 'Поддержите проекты'}
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
        ) : donations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'kg' ? 'Донаттар жок' : 'Нет пожертвований'}
          </div>
        ) : (
          donations.map((donation, index) => {
            const progress = (donation.current_amount / donation.target_amount) * 100;
            
            return (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden border border-border/50"
              >
                {donation.image_url && (
                  <img 
                    src={donation.image_url} 
                    alt="" 
                    className="w-full h-40 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {language === 'kg' ? donation.title_kg || donation.title : donation.title}
                  </h3>
                  
                  {donation.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {language === 'kg' ? donation.description_kg || donation.description : donation.description}
                    </p>
                  )}

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-primary">
                        {formatAmount(donation.current_amount)}
                      </span>
                      <span className="text-muted-foreground">
                        {language === 'kg' ? 'максат:' : 'цель:'} {formatAmount(donation.target_amount)}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {donation.contributors_count} {language === 'kg' ? 'адам' : 'человек'}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {Math.round(progress)}%
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => setShowContributeModal(donation.id)}
                      disabled={!profile}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {language === 'kg' ? 'Колдоо' : 'Поддержать'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Contribute Modal */}
      <AnimatePresence>
        {showContributeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowContributeModal(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-background rounded-t-3xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                {language === 'kg' ? 'Донат берүү' : 'Сделать пожертвование'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Сумма (сом)' : 'Сумма (сом)'}
                  </label>
                  <Input
                    type="number"
                    value={contributionAmount}
                    onChange={e => setContributionAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>

                <div className="flex gap-2">
                  {[100, 500, 1000, 5000].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setContributionAmount(amount.toString())}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Билдирүү (милдеттүү эмес)' : 'Сообщение (необязательно)'}
                  </label>
                  <Textarea
                    value={contributionMessage}
                    onChange={e => setContributionMessage(e.target.value)}
                    placeholder={language === 'kg' ? 'Каалоолоруңузду жазыңыз' : 'Ваши пожелания'}
                  />
                </div>

                <Button className="w-full" onClick={handleContribute}>
                  {language === 'kg' ? 'Донат берүү' : 'Пожертвовать'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Donation Modal */}
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
                {language === 'kg' ? 'Донат кампаниясы түзүү' : 'Создать кампанию'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Аталышы' : 'Название'}
                  </label>
                  <Input
                    value={newDonation.title}
                    onChange={e => setNewDonation({ ...newDonation, title: e.target.value })}
                    placeholder={language === 'kg' ? 'Долбоордун аталышы' : 'Название проекта'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Сүрөттөмө' : 'Описание'}
                  </label>
                  <Textarea
                    value={newDonation.description}
                    onChange={e => setNewDonation({ ...newDonation, description: e.target.value })}
                    placeholder={language === 'kg' ? 'Долбоор жөнүндө' : 'О проекте'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Максат суммасы (сом)' : 'Целевая сумма (сом)'}
                  </label>
                  <Input
                    type="number"
                    value={newDonation.targetAmount}
                    onChange={e => setNewDonation({ ...newDonation, targetAmount: e.target.value })}
                    placeholder="100000"
                  />
                </div>

                <Button className="w-full" onClick={handleCreateDonation}>
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

export default DonationsView;
