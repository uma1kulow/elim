import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Reply, Trash2, CornerDownRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useComments, Comment } from '@/hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

interface PostCommentsProps {
  postId: string;
  onBack: () => void;
}

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  language: string;
  depth?: number;
}> = ({ comment, onReply, onDelete, currentUserId, language, depth = 0 }) => {
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: false,
      locale: language === 'kg' ? ru : enUS
    });
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {comment.author?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">
                {comment.author?.full_name || 'Колдонуучу'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(comment.created_at)}
              </span>
            </div>
            <p className="text-sm mt-1 break-words">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3 h-3" />
                {language === 'kg' ? 'Жооп' : 'Ответить'}
              </button>
              {currentUserId === comment.author_id && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  {language === 'kg' ? 'Өчүрүү' : 'Удалить'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
              language={language}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostComments: React.FC<PostCommentsProps> = ({ postId, onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !profile) {
      if (!profile) {
        toast.error(language === 'kg' ? 'Адегенде кириңиз' : 'Сначала войдите');
      }
      return;
    }

    setSubmitting(true);
    const { error } = await addComment(newComment, replyingTo || undefined);
    setSubmitting(false);

    if (error) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Ошибка');
    } else {
      setNewComment('');
      setReplyingTo(null);
      toast.success(language === 'kg' ? 'Комментарий кошулду' : 'Комментарий добавлен');
    }
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await deleteComment(commentId);
    if (error) {
      toast.error(language === 'kg' ? 'Ката кетти' : 'Ошибка');
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const replyingToComment = replyingTo 
    ? comments.find(c => c.id === replyingTo) || 
      comments.flatMap(c => c.replies || []).find(r => r.id === replyingTo)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {language === 'kg' ? 'Комментарийлер' : 'Комментарии'}
          </h1>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-1/4 mb-2" />
                  <div className="h-3 bg-secondary rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'kg' ? 'Комментарийлер жок' : 'Комментариев пока нет'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'kg' ? 'Биринчи болуп жазыңыз!' : 'Будьте первым!'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 divide-y divide-border">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                currentUserId={profile?.id}
                language={language}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-bottom">
        <AnimatePresence>
          {replyingTo && replyingToComment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CornerDownRight className="w-4 h-4" />
              <span>
                {language === 'kg' ? 'Жооп:' : 'Ответ:'} {replyingToComment.author?.full_name}
              </span>
              <button
                onClick={cancelReply}
                className="ml-auto text-xs text-primary hover:underline"
              >
                {language === 'kg' ? 'Жокко чыгаруу' : 'Отмена'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={language === 'kg' ? 'Комментарий жазуу...' : 'Написать комментарий...'}
            className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostComments;
