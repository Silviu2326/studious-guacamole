import { useState, useEffect } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Settings,
  Zap,
  TrendingUp,
} from 'lucide-react';
import {
  getEventChallengeContentKits,
  generateEventChallengeContentKit,
} from '../api/eventChallengeContentKits';
import type {
  EventChallengeContentKitSet,
  EventChallengeContentKit,
  GenerateContentKitRequest,
  ContentKitType,
} from '../types';
import { getEvents } from '../../EventosYRetos/api/events';
import type { Event } from '../../EventosYRetos/api/events';
import type { SocialPlatform } from '../../PlannerDeRedesSociales/api/social';

interface EventChallengeContentKitProps {
  loading?: boolean;
}

export function EventChallengeContentKit({ loading: externalLoading }: EventChallengeContentKitProps) {
  const [kits, setKits] = useState<EventChallengeContentKitSet[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!externalLoading) {
      loadData();
    }
  }, [externalLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kitsData, eventsData] = await Promise.all([
        getEventChallengeContentKits(),
        getEvents({ status: 'upcoming' }),
      ]);
      setKits(kitsData);
      setEvents(eventsData.data);
    } catch (error) {
      console.error('Error cargando kits de contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKit = async (eventId: string) => {
    setGenerating(true);
    try {
      const request: GenerateContentKitRequest = {
        eventId,
        kitTypes: ['invitacion', 'recordatorio', 'recap'],
        platforms: ['instagram', 'facebook'],
        autoSchedule: true,
        scheduleConfig: {
          invitacion: { daysBefore: 7, time: '10:00' },
          recordatorio: { hoursBefore: 24, time: '09:00' },
          recap: { daysAfter: 1, time: '18:00' },
        },
      };

      const response = await generateEventChallengeContentKit(request);
      if (response.success) {
        await loadData();
        setShowGenerator(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error generando kit:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getKitTypeLabel = (type: ContentKitType): string => {
    switch (type) {
      case 'invitacion':
        return 'Invitación';
      case 'recordatorio':
        return 'Recordatorio';
      case 'recap':
        return 'Recap';
    }
  };

  const getKitTypeIcon = (type: ContentKitType) => {
    switch (type) {
      case 'invitacion':
        return <Calendar className="w-4 h-4" />;
      case 'recordatorio':
        return <Clock className="w-4 h-4" />;
      case 'recap':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Publicado</Badge>;
      case 'scheduled':
        return <Badge variant="info">Programado</Badge>;
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      case 'tiktok':
        return '🎵';
      default:
        return '📱';
    }
  };

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Kits de Contenido Automático - Eventos/Retos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Genera automáticamente invitaciones, recordatorios y recaps para tus eventos y retos
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => setShowGenerator(true)}
              variant="primary"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generar Kit
            </Button>
          </div>
        </div>

        {/* Eventos disponibles sin kits */}
        {events.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Eventos/Retos Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {events
                .filter(e => !kits.find(k => k.eventId === e.id))
                .slice(0, 6)
                .map(event => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {event.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {event.type === 'challenge' ? 'Reto' : 'Evento'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {event.status === 'upcoming' ? 'Próximo' : event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleGenerateKit(event.id)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={generating}
                    >
                      <Zap className="w-3 h-3 mr-2" />
                      Generar Kit Automático
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Kits generados */}
        {kits.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay kits de contenido generados aún</p>
            <p className="text-sm mt-2">
              Genera kits automáticos para tus eventos y retos para amplificarlos rápidamente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {kits.map(kitSet => (
              <div
                key={kitSet.eventId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {kitSet.eventName}
                      <Badge variant="outline">{kitSet.eventType}</Badge>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(kitSet.startDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {kitSet.autoGenerationEnabled && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Auto-generado
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['invitacion', 'recordatorio', 'recap'] as ContentKitType[]).map(kitType => {
                    const kit = kitSet.kits[kitType];
                    if (!kit) return null;

                    return (
                      <div
                        key={kitType}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getKitTypeIcon(kitType)}
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {getKitTypeLabel(kitType)}
                            </span>
                          </div>
                          {getStatusBadge(kit.status)}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{getPlatformIcon(kit.platform)}</span>
                          <Badge variant="outline" className="text-xs">
                            {kit.contentType}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                          {kit.content.caption}
                        </p>

                        {kit.scheduledAt && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(kit.scheduledAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mb-3">
                          {kit.content.hashtags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {kit.content.hashtags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{kit.content.hashtags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          {kit.status === 'draft' && (
                            <Button variant="primary" size="sm" className="flex-1">
                              <Settings className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

