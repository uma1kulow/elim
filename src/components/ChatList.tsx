import React from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/useMessages';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';

interface ChatListProps {
  onSelectConversation: (conversationId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectConversation }) => {
  const { conversations, loading } = useMessages();
  const { language } = useLanguage();

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: false,
      locale: language === 'kg' ? ru : enUS
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-48 text-center px-6"
      >
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
          <MessageCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">
          {language === 'kg' ? 'Билдирүүлөр жок' : 'Нет сообщений'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'kg' 
            ? 'Адамдардын профилине барып жазышыңыз мүмкүн' 
            : 'Вы можете написать людям через их профиль'
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv, index) => {
        const otherUser = conv.participants[0];
        
        return (
          <motion.button
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectConversation(conv.id)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 active:scale-[0.98] transition-all text-left"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-lg flex-shrink-0">
              {otherUser?.avatar_url ? (
                <img 
                  src={otherUser.avatar_url} 
                  alt="" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                otherUser?.full_name?.[0]?.toUpperCase() || '?'
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">
                  {otherUser?.full_name || otherUser?.username || language === 'kg' ? 'Колдонуучу' : 'Пользователь'}
                </span>
                {conv.lastMessage && (
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {formatTime(conv.lastMessage.created_at)}
                  </span>
                )}
              </div>
              
              {conv.lastMessage && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {conv.lastMessage.content}
                </p>
              )}
            </div>

            {/* Unread Badge */}
            {conv.unreadCount && conv.unreadCount > 0 && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium flex-shrink-0">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChatList;
