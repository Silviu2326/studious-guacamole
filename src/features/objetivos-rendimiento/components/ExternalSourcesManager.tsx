import React, { useState, useEffect } from 'react';
import { ExternalSource, ExternalEvent, ExternalSourceType } from '../types';
import {
  getExternalSources,
  getAllExternalSources,
  createExternalSource,
  updateExternalSource,
  deleteExternalSource,
  getExternalEvents,
  createExternalEvent,
  updateExternalEvent,
  deleteExternalEvent,
  syncExternalSource,
} from '../api/externalSources';
import { Card, Button, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { 
  Link2, Plus, Edit2, Trash2, RefreshCw, Loader2, 
  Database, Activity, Megaphone, Settings, Calendar, X 
} from 'lucide-react';

interface ExternalSourcesManagerProps {
  onEventCreated?: (event: ExternalEvent) => void;
}

export const ExternalSourcesManager: React.FC<ExternalSourcesManagerProps> = ({ onEventCreated }) => {
  const [sources, setSources] = useState<ExternalSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ExternalSource | null>(null);
  const [editingEvent, setEditingEvent] = useState<ExternalEvent | null>(null);
  const [selectedSource, setSelectedSource] = useState<ExternalSource | null>(null);
  const [events, setEvents] = useState<ExternalEvent[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  useEffect(() => {
    if (selectedSource) {
      loadEvents(selectedSource.id);
    }
  }, [selectedSource]);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await getAllExternalSources();
      setSources(data);
    } catch (error) {
      console.error('Error loading external sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (sourceId: string) => {
    try {
      const data = await getExternalEvents(sourceId);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCreateSource = () => {
    setEditingSource(null);
    setIsSourceModalOpen(true);
  };

  const handleEditSource = (source: ExternalSource) => {
    setEditingSource(source);
    setIsSourceModalOpen(true);
  };

  const handleDeleteSource = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta fuente externa?')) {
      try {
        await deleteExternalSource(id);
        loadSources();
        if (selectedSource?.id === id) {
          setSelectedSource(null);
        }
      } catch (error) {
        console.error('Error deleting source:', error);
      }
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    setSyncing(sourceId);
    try {
      await syncExternalSource(sourceId);
      await loadSources();
      if (selectedSource?.id === sourceId) {
        await loadEvents(sourceId);
      }
    } catch (error) {
      console.error('Error syncing source:', error);
      alert('Error al sincronizar la fuente externa');
    } finally {
      setSyncing(null);
    }
  };

  const handleCreateEvent = (source: ExternalSource) => {
    setSelectedSource(source);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: ExternalEvent) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await deleteExternalEvent(id);
        if (selectedSource) {
          await loadEvents(selectedSource.id);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getSourceIcon = (type: ExternalSourceType) => {
    switch (type) {
      case 'crm':
        return <Database className="w-5 h-5" />;
      case 'wearable':
        return <Activity className="w-5 h-5" />;
      case 'campaign':
        return <Megaphone className="w-5 h-5" />;
      default:
        return <Link2 className="w-5 h-5" />;
    }
  };

  const getSourceTypeLabel = (type: ExternalSourceType) => {
    switch (type) {
      case 'crm':
        return 'CRM';
      case 'wearable':
        return 'Wearable';
      case 'campaign':
        return 'Campaña';
      default:
        return 'Otro';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
        <p className="text-gray-600 mt-4">Cargando fuentes externas...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fuentes Externas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Integra fuentes externas (CRM, wearables, campañas) para contextualizar variaciones en los gráficos
          </p>
        </div>
        <Button onClick={handleCreateSource}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Fuente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  source.type === 'crm' ? 'bg-blue-100 text-blue-600' :
                  source.type === 'wearable' ? 'bg-green-100 text-green-600' :
                  source.type === 'campaign' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{source.name}</h3>
                  <Badge variant="blue" className="mt-1">
                    {getSourceTypeLabel(source.type)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSyncSource(source.id)}
                  disabled={syncing === source.id}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  title="Sincronizar"
                >
                  {syncing === source.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => handleEditSource(source)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteSource(source.id)}
                  className="p-1.5 rounded hover:bg-red-100 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            {source.description && (
              <p className="text-sm text-gray-600 mb-3">{source.description}</p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Estado: {source.enabled ? 'Activa' : 'Inactiva'}</span>
              {source.lastSync && (
                <span>Última sync: {new Date(source.lastSync).toLocaleDateString()}</span>
              )}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedSource(source);
                loadEvents(source.id);
              }}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ver Eventos
            </Button>
          </Card>
        ))}
      </div>

      {sources.length === 0 && (
        <Card className="p-8 text-center">
          <Link2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay fuentes externas</h3>
          <p className="text-gray-600 mb-4">Crea una fuente externa para comenzar a integrar datos</p>
          <Button onClick={handleCreateSource}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Fuente
          </Button>
        </Card>
      )}

      {/* Modal para crear/editar fuente */}
      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => {
          setIsSourceModalOpen(false);
          setEditingSource(null);
        }}
        source={editingSource}
        onSave={async (sourceData) => {
          if (editingSource) {
            await updateExternalSource(editingSource.id, sourceData);
          } else {
            await createExternalSource(sourceData);
          }
          await loadSources();
          setIsSourceModalOpen(false);
          setEditingSource(null);
        }}
      />

      {/* Modal para eventos */}
      {selectedSource && (
        <EventsModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          source={selectedSource}
          event={editingEvent}
          events={events}
          onSave={async (eventData) => {
            if (editingEvent) {
              await updateExternalEvent(editingEvent.id, eventData);
            } else {
              const newEvent = await createExternalEvent({
                ...eventData,
                sourceId: selectedSource.id,
                sourceName: selectedSource.name,
                sourceType: selectedSource.type,
              });
              if (onEventCreated) {
                onEventCreated(newEvent);
              }
            }
            await loadEvents(selectedSource.id);
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

// Modal para crear/editar fuente
interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ExternalSource | null;
  onSave: (source: Omit<ExternalSource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const SourceModal: React.FC<SourceModalProps> = ({ isOpen, onClose, source, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'crm' as ExternalSourceType,
    description: '',
    enabled: true,
    apiUrl: '',
    apiKey: '',
  });

  useEffect(() => {
    if (source) {
      setFormData({
        name: source.name,
        type: source.type,
        description: source.description || '',
        enabled: source.enabled,
        apiUrl: source.connectionConfig?.apiUrl || '',
        apiKey: source.connectionConfig?.apiKey || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'crm',
        description: '',
        enabled: true,
        apiUrl: '',
        apiKey: '',
      });
    }
  }, [source, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      enabled: formData.enabled,
      connectionConfig: {
        apiUrl: formData.apiUrl,
        apiKey: formData.apiKey,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={source ? 'Editar Fuente Externa' : 'Nueva Fuente Externa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ExternalSourceType })}
          >
            <option value="crm">CRM</option>
            <option value="wearable">Wearable</option>
            <option value="campaign">Campaña</option>
            <option value="other">Otro</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de API</label>
          <Input
            type="url"
            value={formData.apiUrl}
            onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
            placeholder="https://api.example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <Input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            placeholder="Ingresa tu API key"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="enabled" className="text-sm text-gray-700">Activa</label>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {source ? 'Guardar Cambios' : 'Crear Fuente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Modal para eventos
interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ExternalSource;
  event: ExternalEvent | null;
  events: ExternalEvent[];
  onSave: (event: Omit<ExternalEvent, 'id' | 'sourceId' | 'sourceName' | 'sourceType'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose, source, event, events, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    relatedMetrics: [] as string[],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || '',
        date: event.date.split('T')[0],
        relatedMetrics: event.relatedMetrics || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        relatedMetrics: [],
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Eventos - ${source.name}`}
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <Button onClick={() => {
            setFormData({
              name: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              relatedMetrics: [],
            });
            setFormData({ ...formData, name: '' });
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((evt) => (
            <Card key={evt.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{evt.name}</h4>
                  {evt.description && (
                    <p className="text-sm text-gray-600 mt-1">{evt.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(evt.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        name: evt.name,
                        description: evt.description || '',
                        date: evt.date.split('T')[0],
                        relatedMetrics: evt.relatedMetrics || [],
                      });
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(evt.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No hay eventos registrados</p>
          </div>
        )}

        {/* Formulario para crear/editar evento */}
        {(event || formData.name) && (
          <Card className="p-4 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => {
                  setFormData({
                    name: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                    relatedMetrics: [],
                  });
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {event ? 'Guardar Cambios' : 'Crear Evento'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </Modal>
  );
};

