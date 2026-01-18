import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  village_id: string | null;
}

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (conversationId: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ isOpen, onClose, onStartChat }) => {
  const { language } = useLanguage();
  const { profile: currentProfile } = useAuth();
  const { startConversation } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, username, full_name, avatar_url, village_id')
      .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
      .neq('id', currentProfile?.id || '')
      .limit(20);

    if (!error && data) {
      setResults(data);
    }
    setLoading(false);
  };

  const handleStartChat = async (profileId: string) => {
    setStartingChat(profileId);
    const conversationId = await startConversation(profileId);
    if (conversationId) {
      onStartChat(conversationId);
      onClose();
    }
    setStartingChat(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-0 bg-background z-50"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <button 
              onClick={onClose}
              className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'kg' ? 'Адам издөө...' : 'Поиск людей...'}
                autoFocus
                className="w-full bg-secondary/50 rounded-xl pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="px-5 py-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-lg flex-shrink-0 overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.full_name?.[0]?.toUpperCase() || '?'
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {user.full_name || (language === 'kg' ? 'Колдонуучу' : 'Пользователь')}
                      </p>
                      {user.username && (
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      )}
                    </div>

                    {/* Message Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStartChat(user.id)}
                      disabled={startingChat === user.id}
                      className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0"
                    >
                      {startingChat === user.id ? (
                        <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : searchQuery.length > 1 ? (
              <div className="text-center text-muted-foreground py-8">
                {language === 'kg' ? 'Эч ким табылган жок' : 'Никого не найдено'}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                {language === 'kg' 
                  ? 'Адамдарды издөө үчүн ысым жазыңыз' 
                  : 'Введите имя для поиска людей'
                }
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserSearch;