import { useState, useEffect } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { getContentLeadAnalytics } from '../api/contentAnalytics';
import type { PostLeadAnalytics, ContentPattern } from '../api/contentAnalytics';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Copy,
  ExternalLink,
  Filter,
  RefreshCw,
  Eye,
  Target
} from 'lucide-react';

interface ContentLeadAnalyticsProps {
  loading?: boolean;
  period?: '7d' | '30d' | '90d';
}

export function ContentLeadAnalytics({ loading: externalLoading, period = '30d' }: ContentLeadAnalyticsProps) {
  const [analytics, setAnalytics] = useState<{
    postsWithLeads: PostLeadAnalytics[];
    patterns: ContentPattern[];
    summary: {
      totalPosts: number;
      postsWithLeads: number;
      totalLeads: number;
      totalConsultations: number;
      totalInterestMessages: number;
      averageConversionRate: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostLeadAnalytics | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'consultations' | 'messages' | 'converted'>('all');

  useEffect(() => {
    if (!externalLoading) {
      loadAnalytics();
    }
  }, [externalLoading, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90));
      
      const data = await getContentLeadAnalytics(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics de leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      case 'tiktok':
        return '🎵';
      case 'twitter':
        return '🐦';
      default:
        return '📱';
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      post: 'Post',
      reel: 'Reel',
      story: 'Story',
      video: 'Video',
      carousel: 'Carrusel',
    };
    return labels[type] || type;
  };

  const filteredPosts = analytics?.postsWithLeads.filter(post => {
    if (filterType === 'all') return true;
    if (filterType === 'consultations') return post.leadsGenerated.consultations > 0;
    if (filterType === 'messages') return post.leadsGenerated.interestMessages > 0;
    if (filterType === 'converted') return post.leadsGenerated.converted > 0;
    return true;
  }) || [];

  if (loading || externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics de Leads por Contenido
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Identifica qué posts, reels o stories generaron leads reales
            </p>
          </div>
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Posts con Leads</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {analytics.summary.postsWithLeads}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              de {analytics.summary.totalPosts} posts
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {analytics.summary.totalLeads}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {analytics.summary.totalConsultations} consultas
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Mensajes de Interés</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {analytics.summary.totalInterestMessages}
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Tasa de Conversión</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
              {analytics.summary.averageConversionRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            Todos
          </Button>
          <Button
            variant={filterType === 'consultations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('consultations')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Consultas
          </Button>
          <Button
            variant={filterType === 'messages' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('messages')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Mensajes
          </Button>
          <Button
            variant={filterType === 'converted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('converted')}
          >
            <Target className="w-4 h-4 mr-2" />
            Convertidos
          </Button>
        </div>

        {/* Lista de Posts */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay posts que generaron leads con estos filtros
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.postId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getPlatformIcon(post.platform)}</span>
                      <Badge variant="outline">{getContentTypeLabel(post.contentType)}</Badge>
                      <Badge variant="outline">{post.pattern?.topic || 'General'}</Badge>
                      {post.pattern && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.pattern.dayOfWeek} {post.pattern.timeOfDay}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {post.postContent}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{post.leadsGenerated.total} leads</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Calendar className="w-4 h-4" />
                        <span>{post.leadsGenerated.consultations} consultas</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.leadsGenerated.interestMessages} mensajes</span>
                      </div>
                      {post.leadsGenerated.converted > 0 && (
                        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <Target className="w-4 h-4" />
                          <span>{post.leadsGenerated.converted} convertidos</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{post.engagement.reach.toLocaleString()} alcance</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {post.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">conversión</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Patrones identificados */}
        {analytics.patterns.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Patrones Identificados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analytics.patterns.slice(0, 4).map((pattern, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge>{getContentTypeLabel(pattern.contentType)}</Badge>
                      <Badge variant="outline">{pattern.topic}</Badge>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {pattern.averageLeads.toFixed(1)} leads/post
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {pattern.dayOfWeek} {pattern.timeOfDay} • {pattern.postsCount} posts
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {pattern.conversionRate.toFixed(1)}% tasa de conversión
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal de detalles del post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalles del Post
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getPlatformIcon(selectedPost.platform)}</span>
                  <Badge>{getContentTypeLabel(selectedPost.contentType)}</Badge>
                  <Badge variant="outline">{selectedPost.pattern?.topic || 'General'}</Badge>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedPost.postContent}
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Publicado: {new Date(selectedPost.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engagement</div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {selectedPost.engagement.likes + selectedPost.engagement.comments + selectedPost.engagement.shares}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Alcance</div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {selectedPost.engagement.reach.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Leads Generados ({selectedPost.leadsGenerated.total})
                </h4>
                <div className="space-y-2">
                  {selectedPost.leadDetails.map((lead) => (
                    <div
                      key={lead.leadId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {lead.leadName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.type === 'consultation' && '📅 Consulta agendada'}
                          {lead.type === 'interest_message' && '💬 Mensaje de interés'}
                          {lead.type === 'converted' && '✅ Cliente convertido'}
                        </div>
                      </div>
                      <Badge variant={lead.status === 'converted' ? 'default' : 'outline'}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPost.pattern && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Patrón Identificado
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tipo:</span>{' '}
                      <span className="font-medium">{getContentTypeLabel(selectedPost.pattern.contentType)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tema:</span>{' '}
                      <span className="font-medium">{selectedPost.pattern.topic}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Día:</span>{' '}
                      <span className="font-medium">{selectedPost.pattern.dayOfWeek}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Hora:</span>{' '}
                      <span className="font-medium">{selectedPost.pattern.timeOfDay}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

