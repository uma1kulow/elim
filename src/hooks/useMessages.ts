import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  }[];
  lastMessage?: Message;
  unreadCount?: number;
}

export const useMessages = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchConversations();
      subscribeToMessages();
    }
  }, [profile?.id]);

  const fetchConversations = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    
    // Get conversations where the current user is a participant
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('profile_id', profile.id);
    
    if (!participations?.length) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const conversationIds = participations.map(p => p.conversation_id);
    
    // Get full conversation data with participants
    const { data: convs } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });
    
    if (!convs) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Get all participants for these conversations
    const { data: allParticipants } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        profile:profiles(id, full_name, avatar_url, username)
      `)
      .in('conversation_id', conversationIds);

    // Get last message for each conversation
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    // Build conversation objects
    const conversationsWithDetails = convs.map(conv => {
      const participants = allParticipants
        ?.filter(p => p.conversation_id === conv.id && p.profile)
        .map(p => p.profile as {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          username: string | null;
        })
        .filter(p => p.id !== profile.id) || [];

      const convMessages = messages?.filter(m => m.conversation_id === conv.id) || [];
      const lastMessage = convMessages[0];
      const unreadCount = convMessages.filter(m => 
        m.sender_id !== profile.id && !m.read_at
      ).length;

      return {
        ...conv,
        participants,
        lastMessage,
        unreadCount
      };
    });

    setConversations(conversationsWithDetails);
    setLoading(false);
  };

  const subscribeToMessages = () => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const startConversation = async (otherProfileId: string) => {
    if (!profile?.id) return null;
    
    // Check if conversation already exists
    const { data: existingParticipations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('profile_id', profile.id);

    if (existingParticipations) {
      for (const p of existingParticipations) {
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select('profile_id')
          .eq('conversation_id', p.conversation_id)
          .eq('profile_id', otherProfileId)
          .maybeSingle();
        
        if (otherParticipant) {
          return p.conversation_id;
        }
      }
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError || !newConv) return null;

    // Add participants
    await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, profile_id: profile.id },
        { conversation_id: newConv.id, profile_id: otherProfileId }
      ]);

    await fetchConversations();
    return newConv.id;
  };

  return {
    conversations,
    loading,
    startConversation,
    refetch: fetchConversations
  };
};

export const useConversation = (conversationId: string | null) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId && profile?.id) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [conversationId, profile?.id]);

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    setLoading(true);
    
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, username)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data as Message[]);
    }
    setLoading(false);
  };

  const subscribeToMessages = () => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    if (!profile?.id || !conversationId || !content.trim()) return;
    
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: profile.id,
        content: content.trim()
      });

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
