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
  ArrowRight,
  Package
} from 'lucide-react';
import { Card, Button, MetricCards, type MetricCardData } from '../../../components/componentsreutilizables';

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
      completed: 'bg-blue-100 text-blue-800',
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
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Trophy size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Eventos & Retos
                  </h1>
                  <p className="text-gray-600">
                    Crea experiencias grupales que escalan tu negocio y construyen comunidad
                  </p>
                </div>
              </div>
              
              <Button onClick={handleCreateEvent} leftIcon={<Plus size={20} />}>
                Crear Evento/Reto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-6">
        {/* Información educativa */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué son Eventos & Retos?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta herramienta permite crear experiencias grupales como retos de transformación, bootcamps 
                o workshops. Escala tu negocio más allá de las sesiones individuales, monetiza experiencias 
                grupales y construye una comunidad comprometida. Incluye leaderboards, seguimiento de progreso 
                personalizado, integración de pagos y comunicación automatizada para mantener alta la motivación.
              </p>
            </div>
          </div>
        </Card>

        {/* KPIs/Métricas */}
        <MetricCards
          columns={3}
          data={[
            {
              id: 'total-events',
              title: 'Total Eventos',
              value: events.length,
              color: 'info',
              icon: <Trophy size={20} />
            },
            {
              id: 'active-events',
              title: 'Eventos Activos',
              value: events.filter(e => e.status === 'active').length,
              color: 'success',
              icon: <Calendar size={20} />
            },
            {
              id: 'total-participants',
              title: 'Total Participantes',
              value: events.reduce((sum, e) => sum + e.participantCount, 0),
              color: 'info',
              icon: <Users size={20} />
            }
          ] as MetricCardData[]}
        />

        {/* Filtros */}
        <Card className="bg-white shadow-sm">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 text-sm"
                  >
                    <option value="all">Todos los eventos</option>
                    <option value="draft">Borradores</option>
                    <option value="upcoming">Próximos</option>
                    <option value="active">Activos</option>
                    <option value="completed">Completados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de eventos */}
        {isLoading ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </Card>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                variant="hover"
                className="h-full flex flex-col transition-shadow overflow-hidden"
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

                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button
                      onClick={() => handleViewEvent(event.id)}
                      className="flex-1"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                    >
                      Ver Dashboard
                    </Button>
                    {event.status === 'draft' && (
                      <>
                        <Button
                          onClick={() => handleEditEvent(event.id)}
                          variant="ghost"
                          size="sm"
                          leftIcon={<Edit size={16} />}
                        />
                        <Button
                          onClick={() => handleDeleteEvent(event.id)}
                          variant="destructive"
                          size="sm"
                          leftIcon={<Trash2 size={16} />}
                        />
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes eventos creados todavía
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu primer evento o reto para empezar a construir comunidad y escalar tu negocio
            </p>
            <Button onClick={handleCreateEvent} leftIcon={<Plus size={20} />}>
              Crear Primer Evento
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventosYRetosPage;


