import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useVillage } from '@/contexts/VillageContext';

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  village_id: string | null;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  isLiked?: boolean;
}

export const usePosts = () => {
  const { profile } = useAuth();
  const { selectedVillage } = useVillage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [selectedVillage?.id, profile?.id]);

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, full_name, avatar_url, username)
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (selectedVillage?.id) {
      query = query.eq('village_id', selectedVillage.id);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    // Check which posts are liked by current user
    if (profile?.id && data) {
      const postIds = data.map(p => p.id);
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', profile.id)
        .in('post_id', postIds);
      
      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      
      setPosts(data.map(post => ({
        ...post,
        author: post.author as Post['author'],
        isLiked: likedPostIds.has(post.id)
      })));
    } else {
      setPosts(data?.map(post => ({
        ...post,
        author: post.author as Post['author'],
        isLiked: false
      })) || []);
    }
    
    setLoading(false);
  };

  const createPost = async (content: string, imageUrl?: string, category: string = 'general') => {
    if (!profile?.id) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: profile.id,
        content,
        image_url: imageUrl || null,
        village_id: selectedVillage?.id || null,
        category
      });
    
    if (!error) {
      await fetchPosts();
    }
    
    return { error };
  };

  const likePost = async (postId: string) => {
    if (!profile?.id) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.isLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', profile.id);
      
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isLiked: false, likes_count: p.likes_count - 1 }
          : p
      ));
    } else {
      await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: profile.id
        });
      
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isLiked: true, likes_count: p.likes_count + 1 }
          : p
      ));
    }
  };

  const deletePost = async (postId: string) => {
    if (!profile?.id) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', profile.id);
    
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
    
    return { error };
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    deletePost,
    refetch: fetchPosts
  };
};
