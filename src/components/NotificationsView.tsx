import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Check, CheckCheck, AlertCircle, Info, MessageSquare, Heart, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NotificationsViewProps {
  onBack: () => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'like':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/10';
      case 'message':
        return 'bg-blue-500/10';
      case 'like':
        return 'bg-rose-500/10';
      case 'follow':
        return 'bg-emerald-500/10';
      default:
        return 'bg-primary/10';
    }
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
                <Bell className="w-5 h-5 text-blue-500" />
                {language === 'kg' ? 'Билдирүүлөр' : 'Уведомления'}
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Шашылыш жаңылыктар' : 'Срочные новости'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Баарын окуу' : 'Прочитать все'}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {language === 'kg' ? 'Билдирүүлөр жок' : 'Нет уведомлений'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                className={`flex gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
                  notification.is_read 
                    ? 'bg-secondary/30' 
                    : 'bg-card border border-border/50 shadow-sm'
                }`}
              >
                <div className={`p-2 rounded-xl ${getTypeBg(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium text-sm ${notification.is_read ? 'text-muted-foreground' : ''}`}>
                      {language === 'kg' ? notification.title_kg || notification.title : notification.title}
                    </h3>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {language === 'kg' ? notification.message_kg || notification.message : notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: ru
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
