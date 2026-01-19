import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Secret admin credentials
const ADMIN_ACCESS_CODE = 'uma1kulov';
const ADMIN_ACCESS_PIN = '2026';

const AdminAccessModal: React.FC<AdminAccessModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const [accessCode, setAccessCode] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate credentials
    setTimeout(() => {
      if (accessCode === ADMIN_ACCESS_CODE && pin === ADMIN_ACCESS_PIN) {
        toast.success(language === 'kg' ? 'Кирүү ийгиликтүү!' : 'Доступ разрешен!');
        setAccessCode('');
        setPin('');
        onSuccess();
      } else {
        toast.error(language === 'kg' ? 'Туура эмес маалыматтар' : 'Неверные данные');
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleClose = () => {
    setAccessCode('');
    setPin('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {language === 'kg' ? 'Админ кирүү' : 'Доступ администратора'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {language === 'kg' ? 'Маалыматтарды киргизиңиз' : 'Введите данные'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Access Code */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  {language === 'kg' ? 'Кирүү коду' : 'Код доступа'}
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  autoComplete="off"
                />
              </div>

              {/* PIN */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-secondary/50 rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !accessCode || !pin}
                className="w-full bg-foreground text-background rounded-xl py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity active:scale-[0.98]"
              >
                {isSubmitting 
                  ? '...' 
                  : (language === 'kg' ? 'Кирүү' : 'Войти')
                }
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminAccessModal;
