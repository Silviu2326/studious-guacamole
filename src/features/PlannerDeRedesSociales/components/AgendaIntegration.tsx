import React, { useState, useEffect } from 'react';
import {
  AgendaEvent,
  IntegrationSettings,
  getAgendaEvents,
  getIntegrationSettings,
  generatePostFromEvent,
  updateIntegrationSettings
} from '../api/integrations';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

interface AgendaIntegrationProps {
  onPostGenerated?: (post: any) => void;
}

export const AgendaIntegration: React.FC<AgendaIntegrationProps> = ({
  onPostGenerated
}) => {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const [eventsData, settingsData] = await Promise.all([
        getAgendaEvents(startDate, endDate),
        getIntegrationSettings()
      ]);
      
      setEvents(eventsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePost = async (eventId: string) => {
    setIsGenerating(true);
    try {
      const post = await generatePostFromEvent(eventId);
      onPostGenerated?.(post);
      alert('Post generado exitosamente');
    } catch (err: any) {
      alert('Error al generar post: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleAutoGenerate = async () => {
    if (!settings) return;
    
    try {
      const updated = await updateIntegrationSettings({
        agenda: {
          ...settings.agenda,
          autoGeneratePosts: !settings.agenda.autoGeneratePosts
        }
      });
      setSettings(updated);
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  const getEventTypeLabel = (type: AgendaEvent['type']): string => {
    switch (type) {
      case 'class':
        return 'Clase';
      case 'event':
        return 'Evento';
      case 'workshop':
        return 'Workshop';
      case 'challenge':
        return 'Reto';
      case 'appointment':
        return 'Cita';
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: AgendaEvent['type']): string => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-700';
      case 'event':
        return 'bg-purple-100 text-purple-700';
      case 'workshop':
        return 'bg-green-100 text-green-700';
      case 'challenge':
        return 'bg-orange-100 text-orange-700';
      case 'appointment':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando eventos...</p>
      </Card>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Integración con Agenda</h3>
            <p className="text-sm text-gray-600">Genera posts automáticamente desde eventos y clases</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleAutoGenerate}
            variant={settings.agenda.autoGeneratePosts ? "destructive" : "primary"}
            size="sm"
          >
            {settings.agenda.autoGeneratePosts ? 'Desactivar Auto' : 'Activar Auto'}
          </Button>
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="secondary"
            size="sm"
            leftIcon={<Settings size={18} />}
          >
            Configuración
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.agenda.autoGeneratePosts ? 'bg-green-100' : 'bg-gray-100'}`}>
              {settings.agenda.autoGeneratePosts ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Clock size={20} className="text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {settings.agenda.autoGeneratePosts ? 'Generación Automática Activa' : 'Generación Automática Inactiva'}
              </p>
              <p className="text-sm text-gray-600">
                Posts se generan {settings.agenda.postBeforeEvent} horas antes del evento
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs text-gray-600">Eventos próximos</p>
          </div>
        </div>
      </Card>

      {/* Events List */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Eventos Próximos</h4>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{event.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(event.startDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(event.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{event.enrolled || 0}/{event.capacity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleGeneratePost(event.id)}
                      variant="secondary"
                      size="sm"
                      loading={isGenerating}
                      leftIcon={<Sparkles size={16} />}
                    >
                      Generar Post
                    </Button>
                  </div>
                </div>
                
                {settings.agenda.autoGeneratePosts && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span>
                        Post se generará automáticamente {settings.agenda.postBeforeEvent} horas antes
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos próximos</h3>
              <p className="text-gray-600">Los eventos de tu agenda aparecerán aquí</p>
            </Card>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && settings && (
        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="Configuración de Integración"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Configuración de Agenda</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Generación Automática</p>
                    <p className="text-sm text-gray-600">Generar posts automáticamente para eventos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.agenda.autoGeneratePosts}
                      onChange={handleToggleAutoGenerate}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publicar antes del evento (horas)
                  </label>
                  <input
                    type="number"
                    value={settings.agenda.postBeforeEvent}
                    onChange={(e) => {
                      const updated = {
                        ...settings,
                        agenda: {
                          ...settings.agenda,
                          postBeforeEvent: parseInt(e.target.value) || 24
                        }
                      };
                      setSettings(updated);
                      updateIntegrationSettings(updated);
                    }}
                    className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2"
                    min="1"
                    max="168"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Publicar después del evento</p>
                    <p className="text-sm text-gray-600">Generar post de resumen después del evento</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.agenda.postAfterEvent}
                      onChange={async () => {
                        const updated = await updateIntegrationSettings({
                          agenda: {
                            ...settings.agenda,
                            postAfterEvent: !settings.agenda.postAfterEvent
                          }
                        });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Configuración de Clientes</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Publicar Transformaciones</p>
                    <p className="text-sm text-gray-600">Publicar automáticamente transformaciones de clientes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.clients.autoPostTransformations}
                      onChange={async () => {
                        const updated = await updateIntegrationSettings({
                          clients: {
                            ...settings.clients,
                            autoPostTransformations: !settings.clients.autoPostTransformations
                          }
                        });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Publicar Logros</p>
                    <p className="text-sm text-gray-600">Publicar automáticamente logros de clientes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.clients.autoPostAchievements}
                      onChange={async () => {
                        const updated = await updateIntegrationSettings({
                          clients: {
                            ...settings.clients,
                            autoPostAchievements: !settings.clients.autoPostAchievements
                          }
                        });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

