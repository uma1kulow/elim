import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/useMessages';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { MessageCircle, Search, Plus, Bot } from 'lucide-react';
import UserSearch from './UserSearch';

interface ChatListProps {
  onSelectConversation: (conversationId: string) => void;
  onOpenAIBot?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectConversation, onOpenAIBot }) => {
  const { conversations, loading } = useMessages();
  const { language } = useLanguage();
  const [showUserSearch, setShowUserSearch] = useState(false);

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: false,
      locale: language === 'kg' ? ru : enUS
    });
  };

  const handleStartChat = (conversationId: string) => {
    onSelectConversation(conversationId);
    setShowUserSearch(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {language === 'kg' ? 'Билдирүүлөр' : 'Сообщения'}
        </h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUserSearch(true)}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Search Bar */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowUserSearch(true)}
        className="w-full flex items-center gap-3 bg-secondary/50 rounded-2xl px-4 py-3 mb-4 text-muted-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">
          {language === 'kg' ? 'Адам издөө...' : 'Поиск людей...'}
        </span>
      </motion.button>

      {/* AI Bot Entry */}
      {onOpenAIBot && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={onOpenAIBot}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:bg-primary/15 active:scale-[0.98] transition-all text-left mb-3"
        >
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">ELIM AI</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {language === 'kg' ? 'Жардамчы' : 'Помощник'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {language === 'kg' ? 'Суроо берип, жардам алыңыз' : 'Задайте вопрос и получите помощь'}
            </p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
        </motion.button>
      )}

      {conversations.length === 0 ? (
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
              ? 'Жаңы чат баштоо үчүн + басыңыз' 
              : 'Нажмите + чтобы начать новый чат'
            }
          </p>
        </motion.div>
      ) : (
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
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-lg flex-shrink-0 overflow-hidden">
                  {otherUser?.avatar_url ? (
                    <img 
                      src={otherUser.avatar_url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    otherUser?.full_name?.[0]?.toUpperCase() || '?'
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {otherUser?.full_name || otherUser?.username || (language === 'kg' ? 'Колдонуучу' : 'Пользователь')}
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
      )}

      {/* User Search Modal */}
      <UserSearch 
        isOpen={showUserSearch} 
        onClose={() => setShowUserSearch(false)}
        onStartChat={handleStartChat}
      />
    </>
  );
};

export default ChatList;