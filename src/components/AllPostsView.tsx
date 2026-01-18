import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePosts } from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AllPostsViewProps {
  onBack: () => void;
}

const AllPostsView: React.FC<AllPostsViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { posts, likePost } = usePosts();

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: language === 'kg' ? ru : enUS
    });
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return null;
    const categories: Record<string, { kg: string; ru: string }> = {
      news: { kg: 'Жаңылыктар', ru: 'Новости' },
      events: { kg: 'Иш-чаралар', ru: 'Мероприятия' },
      help: { kg: 'Жардам', ru: 'Помощь' },
      question: { kg: 'Суроо', ru: 'Вопрос' },
      other: { kg: 'Башка', ru: 'Другое' }
    };
    return categories[category]?.[language] || category;
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-500/10 text-blue-500',
      events: 'bg-purple-500/10 text-purple-500',
      help: 'bg-red-500/10 text-red-500',
      question: 'bg-amber-500/10 text-amber-500',
      other: 'bg-muted text-muted-foreground'
    };
    return colors[category || 'other'] || colors.other;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-4 pt-16"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 -ml-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">
              {language === 'kg' ? 'Бардык посттор' : 'Все посты'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {posts.length} {language === 'kg' ? 'пост' : 'постов'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="divide-y divide-border/30">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              {language === 'kg' ? 'Азырынча посттор жок' : 'Пока нет постов'}
            </p>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 hover:bg-secondary/20 transition-colors"
            >
              {/* Author Header */}
              <div className="flex items-start gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={post.author?.avatar_url || ''} />
                  <AvatarFallback className="bg-foreground text-background font-semibold">
                    {post.author?.full_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">
                      {post.author?.full_name || 'Колдонуучу'}
                    </span>
                    {post.author?.username && (
                      <span className="text-muted-foreground text-sm">
                        @{post.author.username}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">
                      {formatTime(post.created_at)}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  {post.category && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  )}

                  {/* Content */}
                  <p className="mt-2 text-sm whitespace-pre-wrap break-words">
                    {post.content}
                  </p>

                  {/* Image */}
                  {post.image_url && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-border/30">
                      <img
                        src={post.image_url}
                        alt="Post media"
                        className="w-full max-h-96 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 mt-3">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors active:scale-95 ${
                        post.isLiked 
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-[18px] h-[18px] ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors active:scale-95">
                      <MessageCircle className="w-[18px] h-[18px]" />
                      <span>{post.comments_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors active:scale-95">
                      <Share2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
};

export default AllPostsView;
