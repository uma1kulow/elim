import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import elimLogo from '@/assets/elim-logo.jpg';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(language === 'kg' ? 'Email жана сырсөздү толтуруңуз' : 'Заполните email и пароль');
      return;
    }

    if (password.length < 6) {
      toast.error(language === 'kg' ? 'Сырсөз 6 белгиден кем болбошу керек' : 'Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(language === 'kg' ? 'Email же сырсөз туура эмес' : 'Неверный email или пароль');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(language === 'kg' ? 'Ийгиликтүү!' : 'Успешно!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(language === 'kg' ? 'Бул email катталган' : 'Этот email уже зарегистрирован');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(language === 'kg' ? 'Аккаунт түзүлдү!' : 'Аккаунт создан!');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-12 pb-4"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{language === 'kg' ? 'Артка' : 'Назад'}</span>
        </button>
      </motion.header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <img 
            src={elimLogo} 
            alt="ELIM"
            className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-bold tracking-tight">
            {isLogin 
              ? (language === 'kg' ? 'Кирүү' : 'Вход')
              : (language === 'kg' ? 'Катталуу' : 'Регистрация')
            }
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin 
              ? (language === 'kg' ? 'Аккаунтуңузга кириңиз' : 'Войдите в свой аккаунт')
              : (language === 'kg' ? 'Жаңы аккаунт түзүңүз' : 'Создайте новый аккаунт')
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Full Name (signup only) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'kg' ? 'Толук ат' : 'Полное имя'}
                className="w-full bg-secondary/50 rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-secondary/50 rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'kg' ? 'Сырсөз' : 'Пароль'}
              className="w-full bg-secondary/50 rounded-2xl pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-foreground text-background rounded-2xl py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting 
              ? '...'
              : isLogin 
                ? (language === 'kg' ? 'Кирүү' : 'Войти')
                : (language === 'kg' ? 'Катталуу' : 'Зарегистрироваться')
            }
          </motion.button>
        </motion.form>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin 
              ? (language === 'kg' ? 'Аккаунт жокпу? Катталуу' : 'Нет аккаунта? Регистрация')
              : (language === 'kg' ? 'Аккаунт барбы? Кирүү' : 'Есть аккаунт? Войти')
            }
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
