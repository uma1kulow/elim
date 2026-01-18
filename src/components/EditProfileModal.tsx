import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useVillage } from '@/contexts/VillageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { profile, refreshProfile } = useAuth();
  const { villages } = useVillage();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [villageId, setVillageId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVillageSelect, setShowVillageSelect] = useState(false);
  const [villageSearch, setVillageSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && isOpen) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setVillageId(profile.village_id || '');
      setAvatarUrl(profile.avatar_url || null);
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile, isOpen]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'kg' ? 'Сүрөт 5MB ден чоң болбоосу керек' : 'Фото не должно превышать 5MB');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !profile?.user_id) return avatarUrl;

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Avatar upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!profile?.id) return;

    setIsSubmitting(true);

    let newAvatarUrl = avatarUrl;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (!uploadedUrl && avatarFile) {
        toast.error(language === 'kg' ? 'Сүрөт жүктөөдө ката' : 'Ошибка загрузки фото');
        setIsSubmitting(false);
        return;
      }
      newAvatarUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        village_id: villageId || null,
        avatar_url: newAvatarUrl
      })
      .eq('id', profile.id);

    if (error) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Произошла ошибка');
      console.error('Update error:', error);
    } else {
      toast.success(language === 'kg' ? 'Профиль сакталды!' : 'Профиль сохранен!');
      await refreshProfile();
      onClose();
    }

    setIsSubmitting(false);
  };

  const selectedVillage = villages.find(v => v.id === villageId);
  const filteredVillages = villages.filter(v => 
    v.name.kg.toLowerCase().includes(villageSearch.toLowerCase()) ||
    v.name.ru.toLowerCase().includes(villageSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="flex items-center justify-between px-5 pb-4">
              <button onClick={onClose} className="p-2 -ml-2">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-semibold">
                {language === 'kg' ? 'Профилди оңдоо' : 'Редактирование'}
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            <div className="px-5 pb-8 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      fullName?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarSelect}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {language === 'kg' ? 'Толук ысым' : 'Полное имя'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'kg' ? 'Ысымыңыз' : 'Ваше имя'}
                  className="w-full bg-secondary/50 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {language === 'kg' ? 'Колдонуучу аты' : 'Имя пользователя'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username"
                  className="w-full bg-secondary/50 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {language === 'kg' ? 'Өзүңүз жөнүндө' : 'О себе'}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={language === 'kg' ? 'Кыскача жазыңыз...' : 'Расскажите о себе...'}
                  rows={3}
                  className="w-full bg-secondary/50 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              {/* Village */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {language === 'kg' ? 'Айыл' : 'Село'}
                </label>
                <button
                  onClick={() => setShowVillageSelect(true)}
                  className="w-full bg-secondary/50 rounded-xl p-3 text-left text-foreground"
                >
                  {selectedVillage 
                    ? (language === 'kg' ? selectedVillage.name.kg : selectedVillage.name.ru)
                    : (language === 'kg' ? 'Айылды тандаңыз' : 'Выберите село')
                  }
                </button>
              </div>
            </div>

            {/* Village Select Modal */}
            <AnimatePresence>
              {showVillageSelect && (
                <motion.div
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="absolute inset-0 bg-background rounded-t-3xl z-10"
                >
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                  </div>
                  
                  <div className="flex items-center justify-between px-5 pb-4">
                    <button onClick={() => setShowVillageSelect(false)} className="p-2 -ml-2">
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold">
                      {language === 'kg' ? 'Айылды тандаңыз' : 'Выберите село'}
                    </h2>
                    <div className="w-9" />
                  </div>

                  <div className="px-5 pb-4">
                    <input
                      type="text"
                      value={villageSearch}
                      onChange={(e) => setVillageSearch(e.target.value)}
                      placeholder={language === 'kg' ? 'Издөө...' : 'Поиск...'}
                      className="w-full bg-secondary/50 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>

                  <div className="px-5 pb-8 max-h-[50vh] overflow-y-auto space-y-1">
                    {filteredVillages.map((village) => (
                      <button
                        key={village.id}
                        onClick={() => {
                          setVillageId(village.id);
                          setShowVillageSelect(false);
                          setVillageSearch('');
                        }}
                        className={`w-full p-3 rounded-xl text-left transition-colors ${
                          villageId === village.id 
                            ? 'bg-foreground text-background' 
                            : 'bg-secondary/30 hover:bg-secondary'
                        }`}
                      >
                        <p className="font-medium">{language === 'kg' ? village.name.kg : village.name.ru}</p>
                        <p className="text-xs opacity-70">{village.region}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;