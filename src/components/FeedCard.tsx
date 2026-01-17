import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, MapPin } from 'lucide-react';
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
  problem: { bg: 'bg-status-problem', label: 'problem' },
  solved: { bg: 'bg-status-solved', label: 'solved' },
  progress: { bg: 'bg-status-progress', label: 'inProgress' },
  event: { bg: 'bg-status-event', label: 'event' },
  construction: { bg: 'bg-status-construction', label: 'construction' },
  celebration: { bg: 'bg-status-celebration', label: 'celebration' },
};

const FeedCard: React.FC<FeedCardProps> = ({
  title,
  description,
  status,
  votes,
  comments,
  timeAgo,
  author,
  index,
}) => {
  const { t } = useLanguage();
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 active:scale-[0.98] transition-transform duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold">
                {author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{author}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <span className={`${config.bg} px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex-shrink-0`}>
            {t(config.label)}
          </span>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-[15px] leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Борбор</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-muted-foreground active:scale-95 transition-transform">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs font-medium">{votes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-foreground active:scale-95 transition-transform">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{comments}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedCard;
