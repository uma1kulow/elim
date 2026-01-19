import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIssues } from '@/hooks/useIssues';
import { ThumbsUp, MessageCircle, Share2, X, MapPin } from 'lucide-react';

export type MarkerStatus = 'problem' | 'solved' | 'progress' | 'event' | 'construction' | 'celebration';

const statusColors: Record<string, string> = {
  pending: '#ef4444',       // problem - red
  resolved: '#22c55e',      // solved - green
  'in-progress': '#eab308', // progress - yellow
  problem: '#ef4444',
  solved: '#22c55e',
  progress: '#eab308',
  event: '#3b82f6',
  construction: '#a855f7',
  celebration: '#a16207',
};

const statusMapping: Record<string, MarkerStatus> = {
  pending: 'problem',
  resolved: 'solved',
  'in-progress': 'progress',
};

const VillageMap: React.FC = () => {
  const { selectedVillage } = useVillage();
  const { t, language } = useLanguage();
  const { issues, loading } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const viewState = selectedVillage
    ? {
        longitude: selectedVillage.coordinates.lng,
        latitude: selectedVillage.coordinates.lat,
        zoom: 14,
      }
    : {
        longitude: 74.5698,
        latitude: 42.8746,
        zoom: 7,
      };

  // Filter issues that have coordinates
  const issuesWithLocation = issues.filter(i => i.latitude && i.longitude);
  
  const filteredIssues = filter === 'all' 
    ? issuesWithLocation 
    : issuesWithLocation.filter(i => {
        if (filter === 'problem') return i.status === 'pending';
        if (filter === 'solved') return i.status === 'resolved';
        if (filter === 'progress') return i.status === 'in-progress';
        return true;
      });

  const filters: { id: string; label: string; color?: string }[] = [
    { id: 'all', label: language === 'kg' ? 'Баары' : 'Все' },
    { id: 'problem', label: language === 'kg' ? 'Көйгөй' : 'Проблема', color: statusColors.pending },
    { id: 'solved', label: language === 'kg' ? 'Чечилди' : 'Решено', color: statusColors.resolved },
    { id: 'progress', label: language === 'kg' ? 'Иш жүрүүдө' : 'В работе', color: statusColors['in-progress'] },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              filter === f.id
                ? 'bg-primary text-primary-foreground'
                : 'glass-card hover:bg-secondary'
            }`}
          >
            {f.color && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: f.color }}
              />
            )}
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-lg rounded-full px-4 py-2 text-sm">
          {language === 'kg' ? 'Жүктөлүүдө...' : 'Загрузка...'}
        </div>
      )}

      {/* No issues message */}
      {!loading && filteredIssues.length === 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-lg rounded-xl px-4 py-3 text-sm text-center">
          <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          {language === 'kg' ? 'Маселе табылган жок' : 'Проблемы не найдены'}
        </div>
      )}

      <Map
        initialViewState={viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="bottom-right" />
        
        {filteredIssues.map((issue) => (
          <Marker
            key={issue.id}
            longitude={issue.longitude!}
            latitude={issue.latitude!}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIssue(issue);
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: statusColors[issue.status] || statusColors.pending }}
              />
              <div
                className="absolute w-6 h-6 rounded-full animate-ping opacity-50"
                style={{ backgroundColor: statusColors[issue.status] || statusColors.pending }}
              />
            </motion.div>
          </Marker>
        ))}

        {selectedIssue && selectedIssue.latitude && selectedIssue.longitude && (
          <Popup
            longitude={selectedIssue.longitude}
            latitude={selectedIssue.latitude}
            anchor="bottom"
            onClose={() => setSelectedIssue(null)}
            closeButton={false}
            className="!p-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-72 bg-card rounded-xl overflow-hidden shadow-xl"
            >
              {/* Image if available */}
              {selectedIssue.image_url && (
                <img 
                  src={selectedIssue.image_url} 
                  alt="" 
                  className="w-full h-32 object-cover"
                />
              )}
              
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[selectedIssue.status] || statusColors.pending }}
                    />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {selectedIssue.status === 'pending' && (language === 'kg' ? 'Күтүүдө' : 'Ожидает')}
                      {selectedIssue.status === 'in-progress' && (language === 'kg' ? 'Иш жүрүүдө' : 'В работе')}
                      {selectedIssue.status === 'resolved' && (language === 'kg' ? 'Чечилди' : 'Решено')}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg mt-2">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {selectedIssue.description}
                </p>
                {selectedIssue.author && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedIssue.author.full_name || (language === 'kg' ? 'Белгисиз' : 'Неизвестно')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 flex items-center justify-around">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedIssue.votes_count || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default VillageMap;
