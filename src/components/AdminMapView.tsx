import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, MapPin, Check, Clock, Trash2, RefreshCw, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
import { useIssues, Issue } from '@/hooks/useIssues';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminMapViewProps {
  onBack: () => void;
}

const categories = [
  { id: 'road', kg: 'Жол', ru: 'Дороги' },
  { id: 'water', kg: 'Суу', ru: 'Вода' },
  { id: 'electricity', kg: 'Электр', ru: 'Электричество' },
  { id: 'garbage', kg: 'Таштанды', ru: 'Мусор' },
  { id: 'safety', kg: 'Коопсуздук', ru: 'Безопасность' },
  { id: 'other', kg: 'Башка', ru: 'Другое' },
];

const AdminMapView: React.FC<AdminMapViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { selectedVillage } = useVillage();
  const { issues, refetch: refetchIssues, createIssue } = useIssues();
  const { updateIssueStatus, deleteIssue } = useAdmin();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showList, setShowList] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', category: 'other' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<any>(null);

  const issuesWithLocation = issues.filter(i => i.latitude && i.longitude);

  const handleMapClick = (e: any) => {
    if (isAddingMode) {
      setNewMarkerCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      setShowCreateForm(true);
    }
  };

  const handleCreateIssue = async () => {
    if (!newMarkerCoords || !newIssue.title.trim() || !newIssue.description.trim()) return;
    
    setIsSubmitting(true);
    await createIssue(
      newIssue.title,
      newIssue.description,
      newIssue.category,
      undefined,
      newMarkerCoords.lat,
      newMarkerCoords.lng
    );
    setIsSubmitting(false);
    setShowCreateForm(false);
    setNewMarkerCoords(null);
    setIsAddingMode(false);
    setNewIssue({ title: '', description: '', category: 'other' });
    refetchIssues();
  };

  const cancelAdding = () => {
    setIsAddingMode(false);
    setNewMarkerCoords(null);
    setShowCreateForm(false);
    setNewIssue({ title: '', description: '', category: 'other' });
  };

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
            {isAddingMode ? (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={cancelAdding}
              >
                <X className="w-4 h-4 mr-1" />
                {language === 'kg' ? 'Жокко чыгаруу' : 'Отмена'}
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsAddingMode(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === 'kg' ? 'Кошуу' : 'Добавить'}
              </Button>
            )}
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
        {/* Adding Mode Banner */}
        {isAddingMode && !showCreateForm && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
            {language === 'kg' ? 'Картадан жер тандаңыз' : 'Нажмите на карту для выбора места'}
          </div>
        )}

        {/* Map */}
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: selectedVillage?.coordinates.lng || 74.5,
            latitude: selectedVillage?.coordinates.lat || 42.8,
            zoom: 13
          }}
          style={{ width: '100%', height: '100%', cursor: isAddingMode ? 'crosshair' : 'grab' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          mapLib={maplibregl}
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" />

          {/* New Marker Preview */}
          {newMarkerCoords && (
            <Marker
              longitude={newMarkerCoords.lng}
              latitude={newMarkerCoords.lat}
              anchor="bottom"
            >
              <div className="animate-bounce">
                <MapPin className="w-10 h-10 text-primary" fill="currentColor" />
              </div>
            </Marker>
          )}
          
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

        {/* Create Issue Form Modal */}
        <AnimatePresence>
          {showCreateForm && newMarkerCoords && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && cancelAdding()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    {language === 'kg' ? 'Жаңы маселе кошуу' : 'Добавить проблему'}
                  </h3>
                  <button onClick={cancelAdding} className="p-2 hover:bg-secondary rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'kg' ? 'Категория' : 'Категория'}
                    </label>
                    <Select
                      value={newIssue.category}
                      onValueChange={(value) => setNewIssue(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {language === 'kg' ? cat.kg : cat.ru}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'kg' ? 'Аталышы' : 'Название'}
                    </label>
                    <Input
                      value={newIssue.title}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={language === 'kg' ? 'Маселенин аталышы...' : 'Название проблемы...'}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'kg' ? 'Сүрөттөмө' : 'Описание'}
                    </label>
                    <Textarea
                      value={newIssue.description}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={language === 'kg' ? 'Толук маалымат...' : 'Подробное описание...'}
                      rows={3}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">
                    📍 {newMarkerCoords.lat.toFixed(6)}, {newMarkerCoords.lng.toFixed(6)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={cancelAdding}>
                      {language === 'kg' ? 'Жокко чыгаруу' : 'Отмена'}
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleCreateIssue}
                      disabled={isSubmitting || !newIssue.title.trim() || !newIssue.description.trim()}
                    >
                      {isSubmitting 
                        ? (language === 'kg' ? 'Сакталууда...' : 'Сохранение...') 
                        : (language === 'kg' ? 'Кошуу' : 'Добавить')
                      }
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
