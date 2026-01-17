import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, MapPin, Clock } from 'lucide-react';
import { MarkerStatus } from './VillageMap';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeedCardProps {
  id: string;
  title: string;
  description: string;
  status: MarkerStatus;
  votes: number;
  comments: number;
  timeAgo: string;
  author: string;
  image?: string;
  index: number;
}

const statusConfig: Record<MarkerStatus, { bg: string; label: string }> = {
  problem: { bg: 'status-problem', label: 'problem' },
  solved: { bg: 'status-solved', label: 'solved' },
  progress: { bg: 'status-progress', label: 'inProgress' },
  event: { bg: 'status-event', label: 'event' },
  construction: { bg: 'status-construction', label: 'construction' },
  celebration: { bg: 'status-celebration', label: 'celebration' },
};

const FeedCard: React.FC<FeedCardProps> = ({
  title,
  description,
  status,
  votes,
  comments,
  timeAgo,
  author,
  image,
  index,
}) => {
  const { t } = useLanguage();
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="feed-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-semibold">
              {author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{author}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}>
          {t(config.label)}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Image */}
      {image && (
        <div className="rounded-xl overflow-hidden bg-secondary aspect-video">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>Борбор көчө</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{votes} {t('votes')}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default FeedCard;
