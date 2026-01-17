import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePosts } from '@/hooks/usePosts';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: 'general', labelKg: 'Жалпы', labelRu: 'Общее' },
  { id: 'problem', labelKg: 'Көйгөй', labelRu: 'Проблема' },
  { id: 'suggestion', labelKg: 'Сунуш', labelRu: 'Предложение' },
  { id: 'event', labelKg: 'Иш-чара', labelRu: 'Мероприятие' },
  { id: 'help', labelKg: 'Жардам', labelRu: 'Помощь' },
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error(language === 'kg' ? 'Текст жазыңыз' : 'Введите текст');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await createPost(content, undefined, category);
    
    if (error) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Произошла ошибка');
    } else {
      toast.success(language === 'kg' ? 'Пост жарыяланды!' : 'Пост опубликован!');
      setContent('');
      setCategory('general');
      onClose();
    }
    
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <button onClick={onClose} className="p-2 -ml-2">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-semibold">
                {language === 'kg' ? 'Жаңы пост' : 'Новый пост'}
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium disabled:opacity-50"
              >
                {isSubmitting ? '...' : <Send className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-5 pb-8 space-y-4">
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      category === cat.id
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {language === 'kg' ? cat.labelKg : cat.labelRu}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === 'kg' ? 'Эмне жөнүндө жазасыз?' : 'О чем напишете?'}
                rows={5}
                className="w-full bg-secondary/50 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />

              {/* Image Button */}
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Image className="w-5 h-5" />
                <span className="text-sm">
                  {language === 'kg' ? 'Сүрөт кошуу' : 'Добавить фото'}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
