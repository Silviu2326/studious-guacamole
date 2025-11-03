import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { EventBuilderWizard } from '../components/EventBuilderWizard';
import { EventDashboard } from '../components/EventDashboard';
import {
  getEvents,
  createEvent,
  deleteEvent,
  Event
} from '../api/events';
import {
  Trophy,
  Plus,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  Lightbulb,
  Eye,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react';

type ViewMode = 'list' | 'builder' | 'dashboard';

/**
 * Página principal de Eventos & Retos
 * 
 * Permite a los entrenadores crear, gestionar y monetizar eventos y retos grupales
 * con leaderboards, seguimiento de progreso y gamificación.
 */
export const EventosYRetosPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, [statusFilter]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEvents({
        status: statusFilter !== 'all' ? statusFilter as any : undefined
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEventId(null);
    setViewMode('builder');
  };

  const handleViewEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setViewMode('dashboard');
  };

  const handleEditEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setViewMode('builder');
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;

    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento. Por favor, intenta nuevamente.');
    }
  };

  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'status' | 'participantCount'>) => {
    try {
      await createEvent(eventData);
      await loadEvents();
      setViewMode('list');
      setSelectedEventId(null);
    } catch (error) {
      console.error('Error guardando evento:', error);
      alert('Error al guardar el evento. Por favor, intenta nuevamente.');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      upcoming: 'Próximo',
      active: 'Activo',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  if (viewMode === 'builder') {
    const eventToEdit = selectedEventId ? events.find(e => e.id === selectedEventId) : undefined;
    
    return (
      <EventBuilderWizard
        initialEventData={eventToEdit}
        onSubmit={handleSaveEvent}
        onCancel={() => {
          setViewMode('list');
          setSelectedEventId(null);
        }}
      />
    );
  }

  if (viewMode === 'dashboard' && selectedEventId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setSelectedEventId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Dashboard del Evento
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <EventDashboard eventId={selectedEventId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Trophy size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Eventos & Retos
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea experiencias grupales que escalan tu negocio y construyen comunidad
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Evento/Reto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué son Eventos & Retos?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta permite crear experiencias grupales como retos de transformación, bootcamps 
                o workshops. Escala tu negocio más allá de las sesiones individuales, monetiza experiencias 
                grupales y construye una comunidad comprometida. Incluye leaderboards, seguimiento de progreso 
                personalizado, integración de pagos y comunicación automatizada para mantener alta la motivación.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los eventos</option>
              <option value="draft">Borradores</option>
              <option value="upcoming">Próximos</option>
              <option value="active">Activos</option>
              <option value="completed">Completados</option>
            </select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Eventos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{events.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eventos Activos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {events.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participantes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {events.reduce((sum, e) => sum + e.participantCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {event.coverImageUrl && (
                  <img
                    src={event.coverImageUrl}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.participantCount} {event.maxParticipants ? `de ${event.maxParticipants}` : ''} participantes
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{event.fee.toFixed(2)}€</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Dashboard
                    </button>
                    {event.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleEditEvent(event.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes eventos creados todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer evento o reto para empezar a construir comunidad y escalar tu negocio
            </p>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Evento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventosYRetosPage;


