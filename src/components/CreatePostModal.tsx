import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Video, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useMissions } from '@/hooks/useMissions';
import { supabase } from '@/integrations/supabase/client';
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
  const { profile } = useAuth();
  const { incrementProgress } = useMissions();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error(language === 'kg' ? 'Файл 50MB ден чоң болбоосу керек' : 'Файл не должен превышать 50MB');
      return;
    }

    setMediaFile(file);
    setMediaType(type);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const uploadMedia = async (): Promise<string | null> => {
    if (!mediaFile || !profile?.user_id) return null;

    const fileExt = mediaFile.name.split('.').pop();
    const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;

    setUploadProgress(10);

    const { error } = await supabase.storage
      .from('post-media')
      .upload(fileName, mediaFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    setUploadProgress(90);

    const { data: { publicUrl } } = supabase.storage
      .from('post-media')
      .getPublicUrl(fileName);

    setUploadProgress(100);
    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error(language === 'kg' ? 'Текст же сүрөт кошуңуз' : 'Добавьте текст или фото');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    let mediaUrl: string | undefined;
    
    if (mediaFile) {
      const uploadedUrl = await uploadMedia();
      if (!uploadedUrl) {
        toast.error(language === 'kg' ? 'Файл жүктөөдө ката кетти' : 'Ошибка загрузки файла');
        setIsSubmitting(false);
        return;
      }
      mediaUrl = uploadedUrl;
    }
    
    const { error } = await createPost(content, mediaUrl, category, incrementProgress);
    
    if (error) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Произошла ошибка');
    } else {
      toast.success(language === 'kg' ? 'Пост жарыяланды!' : 'Пост опубликован!');
      setContent('');
      setCategory('general');
      removeMedia();
      onClose();
    }
    
    setIsSubmitting(false);
    setUploadProgress(0);
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
                disabled={(!content.trim() && !mediaFile) || isSubmitting}
                className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-5 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
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

              {/* Media Preview */}
              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden">
                  {mediaType === 'image' ? (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <video 
                      src={mediaPreview} 
                      className="w-full max-h-64 object-cover"
                      controls
                    />
                  )}
                  <button 
                    onClick={removeMedia}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Media Buttons */}
              {!mediaFile && (
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'image')}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'video')}
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm">
                      {language === 'kg' ? 'Сүрөт' : 'Фото'}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm">
                      {language === 'kg' ? 'Видео' : 'Видео'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;