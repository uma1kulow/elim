import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConversation } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatRoomProps {
  conversationId: string;
  onBack: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ conversationId, onBack }) => {
  const { messages, loading, sendMessage } = useConversation(conversationId);
  const { profile } = useAuth();
  const { language } = useLanguage();
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOtherUser();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOtherUser = async () => {
    if (!profile?.id) return;
    
    const { data } = await supabase
      .from('conversation_participants')
      .select(`
        profile:profiles(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .neq('profile_id', profile.id)
      .maybeSingle();
    
    if (data?.profile) {
      setOtherUser(data.profile as { full_name: string | null; avatar_url: string | null });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const message = newMessage;
    setNewMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 border-b border-border"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">
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
        
        <div>
          <h3 className="font-semibold">
            {otherUser?.full_name || (language === 'kg' ? 'Колдонуучу' : 'Пользователь')}
          </h3>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-sm">
              {language === 'kg' ? 'Билдирүү жазыңыз' : 'Напишите сообщение'}
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender_id === profile?.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    isOwn
                      ? 'bg-foreground text-background rounded-br-md'
                      : 'bg-secondary rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'kg' ? 'Билдирүү жазыңыз...' : 'Напишите сообщение...'}
            className="flex-1 bg-secondary/50 rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
