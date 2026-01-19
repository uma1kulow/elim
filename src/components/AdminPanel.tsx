import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, FileText, AlertTriangle, Map, 
  Shield, ShieldCheck, Trash2, Check, Clock, XCircle,
  BarChart3, Settings, Eye, RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useIssues, Issue } from '@/hooks/useIssues';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import AdminMapView from './AdminMapView';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { 
    stats, users, makeAdmin, removeAdmin, deleteIssue, 
    updateIssueStatus, deletePost, refetchUsers, refetchStats 
  } = useAdmin();
  const { issues, refetch: refetchIssues } = useIssues();
  const { posts, refetch: refetchPosts } = usePosts();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMap, setShowMap] = useState(false);

  const handleRefresh = () => {
    refetchUsers();
    refetchStats();
    refetchIssues();
    refetchPosts();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    'in-progress': 'bg-blue-500/20 text-blue-500',
    resolved: 'bg-green-500/20 text-green-500'
  };

  const statusLabels: Record<string, { kg: string; ru: string }> = {
    pending: { kg: 'Күтүүдө', ru: 'Ожидает' },
    'in-progress': { kg: 'Иш жүрүүдө', ru: 'В работе' },
    resolved: { kg: 'Чечилди', ru: 'Решено' }
  };

  if (showMap) {
    return <AdminMapView onBack={() => setShowMap(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">
                {language === 'kg' ? 'Админ панель' : 'Панель администратора'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Башкаруу тутуму' : 'Система управления'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Обзор' : 'Обзор'}
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-xs">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Маселелер' : 'Проблемы'}
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Колдонуучулар' : 'Пользователи'}
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs">
              <FileText className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Посттор' : 'Посты'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'kg' ? 'Колдонуучулар' : 'Пользователи'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'kg' ? 'Посттор' : 'Посты'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPosts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'kg' ? 'Маселелер' : 'Проблемы'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIssues}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">{stats.resolvedIssues}</span> {language === 'kg' ? 'чечилди' : 'решено'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'kg' ? 'Жардам' : 'Донаты'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDonations}</div>
                </CardContent>
              </Card>
            </div>

            {/* Map Management Button */}
            <Card className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setShowMap(true)}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {language === 'kg' ? 'Картаны башкаруу' : 'Управление картой'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'kg' 
                      ? 'Маселелерди картада көрүү жана башкаруу' 
                      : 'Просмотр и управление проблемами на карте'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Issues Quick View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  {language === 'kg' ? 'Күтүүдөгү маселелер' : 'Ожидающие проблемы'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {issues.filter(i => i.status === 'pending').slice(0, 3).map(issue => (
                    <div key={issue.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">{issue.category}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => updateIssueStatus(issue.id, 'in-progress').then(() => refetchIssues())}
                        >
                          <Clock className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-green-500"
                          onClick={() => updateIssueStatus(issue.id, 'resolved').then(() => refetchIssues())}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {stats.pendingIssues === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {language === 'kg' ? 'Күтүүдөгү маселелер жок' : 'Нет ожидающих проблем'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {issues.map(issue => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary/30 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{issue.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.author?.full_name || 'Белгисиз'} • {formatDistanceToNow(new Date(issue.created_at), { locale: ru, addSuffix: true })}
                        </p>
                      </div>
                      <Badge className={statusColors[issue.status]}>
                        {statusLabels[issue.status]?.[language] || issue.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>
                    
                    {issue.image_url && (
                      <img src={issue.image_url} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                      {issue.latitude && issue.longitude && (
                        <Badge variant="outline" className="text-xs">
                          <Map className="w-3 h-3 mr-1" />
                          GPS
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      {issue.status !== 'in-progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateIssueStatus(issue.id, 'in-progress').then(() => refetchIssues())}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {language === 'kg' ? 'Иш жүрүүдө' : 'В работу'}
                        </Button>
                      )}
                      {issue.status !== 'resolved' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-500"
                          onClick={() => updateIssueStatus(issue.id, 'resolved').then(() => refetchIssues())}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {language === 'kg' ? 'Чечилди' : 'Решено'}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-destructive ml-auto"
                        onClick={() => deleteIssue(issue.id).then(() => refetchIssues())}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {users.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                        {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{user.full_name || user.username || 'Колдонуучу'}</h4>
                          {user.role === 'admin' && (
                            <Badge className="bg-primary/20 text-primary text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Админ
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.score} {language === 'kg' ? 'балл' : 'баллов'}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {user.role === 'admin' ? (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => removeAdmin(user.user_id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-primary"
                            onClick={() => makeAdmin(user.user_id)}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {posts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary/30 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-semibold text-xs">
                          {post.author?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{post.author?.full_name || 'Колдонуучу'}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { locale: ru, addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deletePost(post.id).then(() => refetchPosts())}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm line-clamp-3">{post.content}</p>
                    
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="w-full h-24 object-cover rounded-lg mt-2" />
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>❤️ {post.likes_count}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
