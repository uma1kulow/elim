import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Plus, MapPin, Clock, CheckCircle, Circle, Loader } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIssues } from '@/hooks/useIssues';
import { useAuth } from '@/contexts/AuthContext';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface IssuesViewProps {
  onBack: () => void;
}

const categories = [
  { id: 'roads', label: 'Жолдор', labelRu: 'Дороги', icon: '🛣️' },
  { id: 'water', label: 'Суу', labelRu: 'Вода', icon: '💧' },
  { id: 'electricity', label: 'Электр', labelRu: 'Электричество', icon: '⚡' },
  { id: 'garbage', label: 'Таштанды', labelRu: 'Мусор', icon: '🗑️' },
  { id: 'safety', label: 'Коопсуздук', labelRu: 'Безопасность', icon: '🔒' },
  { id: 'other', label: 'Башка', labelRu: 'Другое', icon: '📋' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-500',
  rejected: 'bg-red-500'
};

const statusLabels: Record<string, { kg: string; ru: string }> = {
  pending: { kg: 'Күтүүдө', ru: 'На рассмотрении' },
  in_progress: { kg: 'Иштелүүдө', ru: 'В работе' },
  resolved: { kg: 'Чечилди', ru: 'Решено' },
  rejected: { kg: 'Кабыл алынган жок', ru: 'Отклонено' }
};

const IssuesView: React.FC<IssuesViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { issues, loading, createIssue, updateIssueStatus } = useIssues();
  const { incrementProgress } = useMissions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'other'
  });

  const handleCreateIssue = async () => {
    if (!newIssue.title || !newIssue.description) return;
    
    await createIssue(
      newIssue.title,
      newIssue.description,
      newIssue.category
    );
    
    setShowCreateModal(false);
    setNewIssue({ title: '', description: '', category: 'other' });
  };

  const handleResolveIssue = async (issueId: string) => {
    await updateIssueStatus(issueId, 'resolved', incrementProgress);
  };

  const filteredIssues = issues.filter(issue => 
    filter === 'all' || issue.status === filter
  );

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[5];
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
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {language === 'kg' ? 'Жалоба жана сунуш' : 'Жалобы и предложения'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Көйгөйлөрдү билдириңиз' : 'Сообщайте о проблемах'}
              </p>
            </div>
          </div>
          
          {profile && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Жөнөтүү' : 'Отправить'}
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {[
            { id: 'all', kg: 'Баары', ru: 'Все' },
            { id: 'pending', kg: 'Күтүүдө', ru: 'Ожидают' },
            { id: 'in_progress', kg: 'Иштелүүдө', ru: 'В работе' },
            { id: 'resolved', kg: 'Чечилди', ru: 'Решены' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {language === 'kg' ? f.kg : f.ru}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'kg' ? 'Жалобалар жок' : 'Нет жалоб'}
          </div>
        ) : (
          filteredIssues.map((issue, index) => {
            const category = getCategoryInfo(issue.category);
            
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                        {language === 'kg' ? category.label : category.labelRu}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusColors[issue.status]}`}>
                    {issue.status === 'pending' && <Circle className="w-3 h-3" />}
                    {issue.status === 'in_progress' && <Loader className="w-3 h-3 animate-spin" />}
                    {issue.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                    {statusLabels[issue.status]?.[language === 'kg' ? 'kg' : 'ru']}
                  </div>
                </div>

                <h3 className="font-semibold mb-2">
                  {language === 'kg' ? issue.title_kg || issue.title : issue.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {language === 'kg' ? issue.description_kg || issue.description : issue.description}
                </p>

                {issue.image_url && (
                  <img 
                    src={issue.image_url} 
                    alt="" 
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <img 
                        src={issue.author.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${issue.author.full_name}`}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      {issue.author.full_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(issue.created_at), {
                        addSuffix: true,
                        locale: language === 'kg' ? ru : ru
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Issue Modal */}
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
                {language === 'kg' ? 'Жалоба жөнөтүү' : 'Отправить жалобу'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Категория' : 'Категория'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewIssue({ ...newIssue, category: cat.id })}
                        className={`p-3 rounded-xl text-center transition-colors ${
                          newIssue.category === cat.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{cat.icon}</span>
                        <span className="text-xs">{language === 'kg' ? cat.label : cat.labelRu}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Аталышы' : 'Заголовок'}
                  </label>
                  <Input
                    value={newIssue.title}
                    onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
                    placeholder={language === 'kg' ? 'Кыскача сүрөттөңүз' : 'Кратко опишите'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Толук сүрөттөмө' : 'Подробное описание'}
                  </label>
                  <Textarea
                    value={newIssue.description}
                    onChange={e => setNewIssue({ ...newIssue, description: e.target.value })}
                    placeholder={language === 'kg' ? 'Көйгөйдү толук сүрөттөңүз' : 'Опишите проблему подробно'}
                    rows={4}
                  />
                </div>

                <Button className="w-full" onClick={handleCreateIssue}>
                  {language === 'kg' ? 'Жөнөтүү' : 'Отправить'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssuesView;
