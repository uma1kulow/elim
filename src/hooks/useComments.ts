import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  replies?: Comment[];
}

export const useComments = (postId: string) => {
  const { profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:profiles!post_comments_author_id_fkey(id, full_name, avatar_url, username)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
      return;
    }

    // Organize comments into tree structure
    const commentsMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create all comment objects
    (data || []).forEach((comment: any) => {
      commentsMap.set(comment.id, {
        ...comment,
        author: comment.author,
        replies: []
      });
    });

    // Second pass: organize into tree
    (data || []).forEach((comment: any) => {
      const commentObj = commentsMap.get(comment.id)!;
      if (comment.parent_id && commentsMap.has(comment.parent_id)) {
        commentsMap.get(comment.parent_id)!.replies!.push(commentObj);
      } else {
        rootComments.push(commentObj);
      }
    });

    setComments(rootComments);
    setLoading(false);
  }, [postId]);

  const addComment = async (content: string, parentId?: string) => {
    if (!profile?.id || !content.trim()) return { error: new Error('Invalid input') };

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        author_id: profile.id,
        parent_id: parentId || null,
        content: content.trim()
      })
      .select(`
        *,
        author:profiles!post_comments_author_id_fkey(id, full_name, avatar_url, username)
      `)
      .single();

    if (!error && data) {
      await fetchComments();
    }

    return { error, data };
  };

  const deleteComment = async (commentId: string) => {
    if (!profile?.id) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', profile.id);

    if (!error) {
      await fetchComments();
    }

    return { error };
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
};
