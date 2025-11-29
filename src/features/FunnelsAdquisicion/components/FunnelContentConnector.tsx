import { useState, useEffect, useCallback } from 'react';
import {
  Video,
  MessageSquare,
  Star,
  ThumbsUp,
  Eye,
  Link as LinkIcon,
  Check,
  X,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button, Card, Badge, Input, Select } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelContentConnectionRequest,
  FunnelContentConnectionResponse,
  FunnelContent,
  FunnelContentRecommendation,
  SocialMediaReel,
  TestimonialContent,
  ContentType,
} from '../types';

interface FunnelContentConnectorProps {
  funnelId: string;
  stageId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: FunnelContentConnectionResponse) => void;
}

const placementOptions: { value: FunnelContent['placement']; label: string }[] = [
  { value: 'hero', label: 'Hero (Principal)' },
  { value: 'social_proof', label: 'Prueba Social' },
  { value: 'testimonials', label: 'Testimonios' },
  { value: 'features', label: 'Características' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'sidebar', label: 'Barra Lateral' },
];

export function FunnelContentConnector({
  funnelId,
  stageId,
  isOpen,
  onClose,
  onSuccess,
}: FunnelContentConnectorProps) {
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('reel');
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [placement, setPlacement] = useState<FunnelContent['placement']>('social_proof');
  const [reels, setReels] = useState<SocialMediaReel[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialContent[]>([]);
  const [recommendations, setRecommendations] = useState<FunnelContentRecommendation[]>([]);
  const [connectedContent, setConnectedContent] = useState<FunnelContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoSelect, setAutoSelect] = useState(false);
  const [minEngagement, setMinEngagement] = useState<number>(8);
  const [minScore, setMinScore] = useState<number>(4);

  useEffect(() => {
    if (isOpen) {
      loadContent();
      loadRecommendations();
      loadConnectedContent();
    }
  }, [isOpen, funnelId, stageId]);

  const loadContent = useCallback(async () => {
    try {
      const [reelsData, testimonialsData] = await Promise.all([
        FunnelsAdquisicionService.getTopReels(20),
        FunnelsAdquisicionService.getTopTestimonials(20),
      ]);
      setReels(reelsData);
      setTestimonials(testimonialsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contenidos');
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    setLoadingRecommendations(true);
    try {
      const recs = await FunnelsAdquisicionService.getFunnelContentRecommendations(funnelId, stageId);
      setRecommendations(recs);
    } catch (err: any) {
      console.error('Error cargando recomendaciones:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [funnelId, stageId]);

  const loadConnectedContent = useCallback(async () => {
    try {
      const content = await FunnelsAdquisicionService.getFunnelConnectedContent(funnelId, stageId);
      setConnectedContent(content);
    } catch (err: any) {
      console.error('Error cargando contenidos conectados:', err);
    }
  }, [funnelId, stageId]);

  const handleToggleContent = useCallback((contentId: string) => {
    setSelectedContentIds((prev) =>
      prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId],
    );
  }, []);

  const handleSelectRecommendations = useCallback(() => {
    const topRecommendations = recommendations
      .filter((rec) => {
        if (rec.contentType === 'reel' && 'metrics' in rec.contentData) {
          return rec.contentData.metrics.engagementRate >= minEngagement;
        }
        if (rec.contentType === 'testimonial' && 'score' in rec.contentData) {
          return (rec.contentData.score || 0) >= minScore;
        }
        return true;
      })
      .slice(0, 5)
      .map((rec) => rec.contentId);
    setSelectedContentIds(topRecommendations);
  }, [recommendations, minEngagement, minScore]);

  const handleConnect = useCallback(async () => {
    if (selectedContentIds.length === 0) {
      setError('Selecciona al menos un contenido para conectar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: FunnelContentConnectionRequest = {
        funnelId,
        stageId,
        contentType: selectedContentType,
        contentIds: selectedContentIds,
        placement,
        autoSelect,
        criteria: autoSelect
          ? {
              minEngagement: minEngagement || undefined,
              minScore: minScore || undefined,
            }
          : undefined,
      };

      const result = await FunnelsAdquisicionService.connectContentToFunnel(request);
      if (onSuccess) {
        onSuccess(result);
      }
      await loadConnectedContent();
      setSelectedContentIds([]);
    } catch (err: any) {
      setError(err.message || 'Error al conectar contenidos');
    } finally {
      setLoading(false);
    }
  }, [funnelId, stageId, selectedContentType, selectedContentIds, placement, autoSelect, minEngagement, minScore, onSuccess, loadConnectedContent]);

  const handleDisconnect = useCallback(
    async (contentConnectionId: string) => {
      try {
        await FunnelsAdquisicionService.disconnectContentFromFunnel(funnelId, contentConnectionId);
        await loadConnectedContent();
      } catch (err: any) {
        setError(err.message || 'Error al desconectar contenido');
      }
    },
    [funnelId, loadConnectedContent],
  );

  if (!isOpen) return null;

  const currentContent = selectedContentType === 'reel' ? reels : testimonials;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-6xl w-full mx-4 p-6 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Conectar Contenidos al Funnel
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-medium text-red-800 dark:text-red-200">Error</div>
              <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Columna 1: Tipo de contenido y recomendaciones */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tipo de contenido
              </label>
              <div className="flex gap-2">
                <Button
                  variant={selectedContentType === 'reel' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedContentType('reel')}
                  className="flex-1"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Reels
                </Button>
                <Button
                  variant={selectedContentType === 'testimonial' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedContentType('testimonial')}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Testimonios
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Ubicación en el funnel
              </label>
              <Select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as FunnelContent['placement'])}
                options={placementOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
              />
            </div>

            {recommendations.length > 0 && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Recomendaciones IA
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  Basado en el engagement y conversiones, te recomendamos estos contenidos:
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={minEngagement}
                      onChange={(e) => setMinEngagement(parseInt(e.target.value) || 0)}
                      placeholder="Min engagement"
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  {selectedContentType === 'testimonial' && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={minScore}
                        onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                        placeholder="Min score"
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500">estrellas</span>
                    </div>
                  )}
                </div>
                <Button variant="secondary" size="sm" onClick={handleSelectRecommendations} className="w-full">
                  Seleccionar recomendados
                </Button>
              </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoSelect}
                  onChange={(e) => setAutoSelect(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  Selección automática por IA
                </span>
              </label>
            </div>
          </div>

          {/* Columna 2: Lista de contenidos */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-slate-100">
              {selectedContentType === 'reel' ? 'Reels Top' : 'Testimonios Top'}
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {currentContent.map((content) => {
                const isSelected = selectedContentIds.includes(content.id);
                const isReel = 'platform' in content;
                const engagement = isReel
                  ? ('metrics' in content && content.metrics ? content.metrics.engagementRate : 0)
                  : ('metrics' in content && content.metrics ? (content.metrics.engagement || 0) : 0);
                const score = isReel ? undefined : 'score' in content ? content.score : undefined;

                return (
                  <Card
                    key={content.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleToggleContent(content.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {isReel ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="blue" size="sm">
                                {content.platform}
                              </Badge>
                              <span className="text-xs text-gray-500">{content.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                              {content.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {engagement.toFixed(1)}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {content.engagement.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {content.engagement.likes.toLocaleString()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              {score !== undefined && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < score
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300 dark:text-slate-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                {content.customerName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-3">
                              {content.quote}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="purple" size="sm">
                                {content.channel}
                              </Badge>
                              {content.metrics?.conversions && (
                                <span className="text-xs text-gray-500">
                                  {content.metrics.conversions} conversiones
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Columna 3: Contenidos conectados */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-slate-100">
              Contenidos conectados ({connectedContent.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {connectedContent.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No hay contenidos conectados todavía
                </p>
              ) : (
                connectedContent.map((connection) => {
                  const content = connection.contentData;
                  const isReel = connection.contentType === 'reel';

                  return (
                    <Card key={connection.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={isReel ? 'blue' : 'purple'} size="sm">
                              {isReel ? 'Reel' : 'Testimonial'}
                            </Badge>
                            <Badge variant="gray" size="sm">
                              {connection.placement}
                            </Badge>
                          </div>
                          {isReel && 'title' in content ? (
                            <p className="text-sm text-gray-900 dark:text-slate-100">{content.title}</p>
                          ) : !isReel && 'customerName' in content ? (
                            <p className="text-sm text-gray-900 dark:text-slate-100">{content.customerName}</p>
                          ) : null}
                          {!isReel && 'quote' in content && (
                            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mt-1">
                              {content.quote}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(connection.id)}
                          className="flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
            {selectedContentIds.length > 0 && (
              <span>{selectedContentIds.length} contenido(s) seleccionado(s)</span>
            )}
          </div>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleConnect} disabled={loading || selectedContentIds.length === 0}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                Conectar contenidos
                <LinkIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

