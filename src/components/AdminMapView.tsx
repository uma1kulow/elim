import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, MapPin, Check, Clock, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useIssues, Issue } from '@/hooks/useIssues';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminMapViewProps {
  onBack: () => void;
}

const AdminMapView: React.FC<AdminMapViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { selectedVillage } = useVillage();
  const { issues, refetch: refetchIssues } = useIssues();
  const { updateIssueStatus, deleteIssue } = useAdmin();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showList, setShowList] = useState(false);
  const mapRef = useRef<any>(null);

  const issuesWithLocation = issues.filter(i => i.latitude && i.longitude);

  const statusColors: Record<string, string> = {
    pending: '#EAB308',
    'in-progress': '#3B82F6',
    resolved: '#22C55E'
  };

  const statusLabels: Record<string, { kg: string; ru: string }> = {
    pending: { kg: 'Күтүүдө', ru: 'Ожидает' },
    'in-progress': { kg: 'Иш жүрүүдө', ru: 'В работе' },
    resolved: { kg: 'Чечилди', ru: 'Решено' }
  };

  const handleStatusChange = async (issueId: string, status: string) => {
    await updateIssueStatus(issueId, status);
    refetchIssues();
    setSelectedIssue(null);
  };

  const handleDelete = async (issueId: string) => {
    await deleteIssue(issueId);
    refetchIssues();
    setSelectedIssue(null);
  };

  const flyToIssue = (issue: Issue) => {
    if (mapRef.current && issue.latitude && issue.longitude) {
      mapRef.current.flyTo({
        center: [issue.longitude, issue.latitude],
        zoom: 16,
        duration: 1000
      });
      setSelectedIssue(issue);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">
                {language === 'kg' ? 'Картаны башкаруу' : 'Управление картой'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {issuesWithLocation.length} {language === 'kg' ? 'маселе картада' : 'проблем на карте'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => refetchIssues()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant={showList ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setShowList(!showList)}
            >
              {language === 'kg' ? 'Тизме' : 'Список'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Map */}
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: selectedVillage?.coordinates.lng || 74.5,
            latitude: selectedVillage?.coordinates.lat || 42.8,
            zoom: 13
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          mapLib={maplibregl}
        >
          <NavigationControl position="top-right" />
          
          {issuesWithLocation.map(issue => (
            <Marker
              key={issue.id}
              longitude={issue.longitude!}
              latitude={issue.latitude!}
              anchor="bottom"
              onClick={() => setSelectedIssue(issue)}
            >
              <div 
                className="cursor-pointer transform hover:scale-110 transition-transform"
                style={{ color: statusColors[issue.status] }}
              >
                <MapPin className="w-8 h-8" fill={statusColors[issue.status]} />
              </div>
            </Marker>
          ))}

          {selectedIssue && selectedIssue.latitude && selectedIssue.longitude && (
            <Popup
              longitude={selectedIssue.longitude}
              latitude={selectedIssue.latitude}
              anchor="bottom"
              onClose={() => setSelectedIssue(null)}
              closeButton={true}
              closeOnClick={false}
              className="admin-popup"
            >
              <div className="p-3 min-w-[250px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm pr-2">{selectedIssue.title}</h3>
                  <Badge 
                    className="text-xs shrink-0" 
                    style={{ 
                      backgroundColor: `${statusColors[selectedIssue.status]}20`,
                      color: statusColors[selectedIssue.status]
                    }}
                  >
                    {statusLabels[selectedIssue.status]?.[language] || selectedIssue.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {selectedIssue.description}
                </p>

                {selectedIssue.image_url && (
                  <img 
                    src={selectedIssue.image_url} 
                    alt="" 
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}

                <p className="text-xs text-muted-foreground mb-3">
                  {selectedIssue.author?.full_name || 'Белгисиз'}
                </p>

                <div className="flex flex-wrap gap-1">
                  {selectedIssue.status !== 'in-progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => handleStatusChange(selectedIssue.id, 'in-progress')}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {language === 'kg' ? 'Иш жүрүүдө' : 'В работу'}
                    </Button>
                  )}
                  {selectedIssue.status !== 'resolved' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs h-7 text-green-500"
                      onClick={() => handleStatusChange(selectedIssue.id, 'resolved')}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {language === 'kg' ? 'Чечилди' : 'Решено'}
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs h-7 text-destructive"
                    onClick={() => handleDelete(selectedIssue.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          )}
        </Map>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-lg rounded-xl p-3 shadow-lg">
          <p className="text-xs font-semibold mb-2">
            {language === 'kg' ? 'Статустар' : 'Статусы'}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>{language === 'kg' ? 'Күтүүдө' : 'Ожидает'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{language === 'kg' ? 'Иш жүрүүдө' : 'В работе'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>{language === 'kg' ? 'Чечилди' : 'Решено'}</span>
            </div>
          </div>
        </div>

        {/* Issues List Sidebar */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-background/95 backdrop-blur-lg border-l border-border shadow-xl"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">
                  {language === 'kg' ? 'Бардык маселелер' : 'Все проблемы'}
                </h3>
              </div>
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-3 space-y-2">
                  {issues.map(issue => (
                    <div
                      key={issue.id}
                      onClick={() => issue.latitude && issue.longitude && flyToIssue(issue)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedIssue?.id === issue.id 
                          ? 'bg-primary/10 border border-primary' 
                          : 'bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm truncate flex-1">{issue.title}</h4>
                        <div 
                          className="w-2 h-2 rounded-full shrink-0 ml-2 mt-1"
                          style={{ backgroundColor: statusColors[issue.status] }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                        {!issue.latitude && !issue.longitude && (
                          <span className="text-xs text-muted-foreground">
                            {language === 'kg' ? 'GPS жок' : 'Нет GPS'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminMapView;
