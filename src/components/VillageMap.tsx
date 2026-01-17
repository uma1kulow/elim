import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useVillage } from '@/contexts/VillageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThumbsUp, MessageCircle, Share2, X } from 'lucide-react';

export type MarkerStatus = 'problem' | 'solved' | 'progress' | 'event' | 'construction' | 'celebration';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  status: MarkerStatus;
  title: string;
  description: string;
  votes: number;
  comments: number;
  image?: string;
}

const mockMarkers: MapMarker[] = [
  {
    id: '1',
    lat: 42.4538,
    lng: 78.3922,
    status: 'problem',
    title: 'Жол бузулган',
    description: 'Борбордук көчөдөгү жол оңдоо талап кылат',
    votes: 45,
    comments: 12,
  },
  {
    id: '2',
    lat: 42.4518,
    lng: 78.3892,
    status: 'solved',
    title: 'Жарык орнотулду',
    description: 'Жаңы көчө жарыктары орнотулду',
    votes: 78,
    comments: 23,
  },
  {
    id: '3',
    lat: 42.4548,
    lng: 78.3942,
    status: 'progress',
    title: 'Мектеп оңдолуп жатат',
    description: 'Айыл мектебинин ремонту башталды',
    votes: 120,
    comments: 45,
  },
  {
    id: '4',
    lat: 42.4508,
    lng: 78.3882,
    status: 'event',
    title: 'Спорт мелдеши',
    description: 'Жума күнү волейбол турнири',
    votes: 34,
    comments: 8,
  },
  {
    id: '5',
    lat: 42.4558,
    lng: 78.3952,
    status: 'construction',
    title: 'Жаңы көпүрө',
    description: 'Дарыянын үстүндө көпүрө курулуп жатат',
    votes: 89,
    comments: 31,
  },
];

const statusColors: Record<MarkerStatus, string> = {
  problem: '#ef4444',
  solved: '#22c55e',
  progress: '#eab308',
  event: '#3b82f6',
  construction: '#a855f7',
  celebration: '#a16207',
};

const VillageMap: React.FC = () => {
  const { selectedVillage } = useVillage();
  const { t } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filter, setFilter] = useState<MarkerStatus | 'all'>('all');

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

  const filteredMarkers = filter === 'all' 
    ? mockMarkers 
    : mockMarkers.filter(m => m.status === filter);

  const filters: { id: MarkerStatus | 'all'; label: string; color?: string }[] = [
    { id: 'all', label: 'Баары' },
    { id: 'problem', label: t('problem'), color: statusColors.problem },
    { id: 'solved', label: t('solved'), color: statusColors.solved },
    { id: 'progress', label: t('inProgress'), color: statusColors.progress },
    { id: 'event', label: t('event'), color: statusColors.event },
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

      <Map
        initialViewState={viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="bottom-right" />
        
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.lng}
            latitude={marker.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker(marker);
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
                style={{ backgroundColor: statusColors[marker.status] }}
              />
              <div
                className="absolute w-6 h-6 rounded-full animate-ping opacity-50"
                style={{ backgroundColor: statusColors[marker.status] }}
              />
            </motion.div>
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.lng}
            latitude={selectedMarker.lat}
            anchor="bottom"
            onClose={() => setSelectedMarker(null)}
            closeButton={false}
            className="!p-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-72 bg-card rounded-xl overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[selectedMarker.status] }}
                    />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {t(selectedMarker.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedMarker(null)}
                    className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg mt-2">{selectedMarker.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedMarker.description}
                </p>
              </div>

              {/* Actions */}
              <div className="p-3 flex items-center justify-around">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedMarker.votes}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{selectedMarker.comments}</span>
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
