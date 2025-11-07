import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, Button, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { 
  Calendar,
  Trophy,
  Users,
  TrendingUp,
  Target,
  Plus,
  BarChart3,
  Award,
} from 'lucide-react';
import { useEventosRetos } from '../hooks/useEventosRetos';
import { EventosList, CreadorReto, Participantes, SeguimientoProgreso, RankingRetos, ContenidoMotivacional, PremiosReconocimientos, AnalyticsEventos } from '../components';
import { EventoReto, Participante } from '../types';
import { publicarEvento } from '../api/retos';
import { inscribirParticipante, eliminarParticipante } from '../api/participantes';
import { registrarProgreso } from '../api/progreso';
import { ConfirmModal } from '../../../components/componentsreutilizables';

/**
 * Página principal de Eventos y Retos Especiales
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Retos personales 'Reto 30 días conmigo', más íntimos y personalizados
 * - Gimnasios: Eventos grupales 'Masterclass de movilidad', retos masivos 'Reto 8 Semanas Verano'
 */
export const EventosRetosEspecialesPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  const {
    eventos,
    loading,
    error,
    createEvento,
    updateEvento,
    deleteEvento,
    reload,
  } = useEventosRetos();

  const [tabActiva, setTabActiva] = useState<string>('eventos');
  const [showCreador, setShowCreador] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoReto | null>(null);
  const [eventoEditar, setEventoEditar] = useState<EventoReto | null>(null);
  const [eventoEliminar, setEventoEliminar] = useState<EventoReto | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Filtrar eventos según rol
  const eventosFiltrados = useMemo(() => {
    if (esEntrenador) {
      return eventos.filter(e => e.tipoReto === 'personal' || e.creadorId === user?.id);
    }
    return eventos.filter(e => e.tipoReto === 'grupal' || e.tipo === 'evento');
  }, [eventos, esEntrenador, user?.id]);

  // Calcular métricas
  const totalEventos = eventosFiltrados.length;
  const eventosActivos = eventosFiltrados.filter(e => e.estado === 'en_curso').length;
  const eventosPublicados = eventosFiltrados.filter(e => e.estado === 'publicado').length;
  const totalParticipantes = eventosFiltrados.reduce((sum, e) => sum + e.participantes.length, 0);
  const promedioParticipantes = totalEventos > 0 ? Math.round(totalParticipantes / totalEventos) : 0;

  const metricas = useMemo(() => [
    {
      id: 'total-eventos',
      title: esEntrenador ? 'Mis Retos' : 'Total Eventos',
      value: totalEventos,
      subtitle: `${eventosActivos} en curso`,
      icon: <Calendar className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'participantes',
      title: 'Participantes',
      value: totalParticipantes,
      subtitle: `Promedio: ${promedioParticipantes}`,
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'publicados',
      title: 'Publicados',
      value: eventosPublicados,
      subtitle: 'Listos para inscribirse',
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'engagement',
      title: 'Engagement',
      value: '85%',
      subtitle: 'Tasa de participación',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning' as const,
    },
  ], [totalEventos, eventosActivos, eventosPublicados, totalParticipantes, promedioParticipantes, esEntrenador]);

  const tabs = useMemo(() => {
    if (esEntrenador) {
      return [
        { 
          id: 'mis-retos', 
          label: 'Mis Retos', 
          icon: Trophy
        },
        { 
          id: 'participantes', 
          label: 'Participantes', 
          icon: Users
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: BarChart3
        },
      ];
    } else {
      return [
        { 
          id: 'eventos', 
          label: 'Eventos y Retos', 
          icon: Calendar
        },
        { 
          id: 'participantes', 
          label: 'Participantes', 
          icon: Users
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: BarChart3
        },
      ];
    }
  }, [esEntrenador]);

  const handleCrearEvento = async (evento: Omit<EventoReto, 'id' | 'createdAt' | 'updatedAt' | 'participantes' | 'ranking' | 'contenidoMotivacional' | 'premios'>) => {
    try {
      await createEvento(evento);
      setShowCreador(false);
      setEventoEditar(null);
    } catch (err) {
      console.error('Error al crear evento:', err);
    }
  };

  const handleEditarEvento = (evento: EventoReto) => {
    setEventoEditar(evento);
    setShowCreador(true);
  };

  const handleEliminarEvento = async () => {
    if (eventoEliminar) {
      try {
        await deleteEvento(eventoEliminar.id);
        setShowConfirmDelete(false);
        setEventoEliminar(null);
      } catch (err) {
        console.error('Error al eliminar evento:', err);
      }
    }
  };

  const handlePublicarEvento = async (evento: EventoReto) => {
    try {
      await publicarEvento(evento.id);
      await reload();
    } catch (err) {
      console.error('Error al publicar evento:', err);
    }
  };

  const handleInscribirParticipante = async (eventoId: string, participanteId: string, nombre: string, email: string) => {
    try {
      await inscribirParticipante(eventoId, participanteId, nombre, email);
      await reload();
      if (eventoSeleccionado) {
        const evento = eventos.find(e => e.id === eventoSeleccionado.id);
        if (evento) setEventoSeleccionado(evento);
      }
    } catch (err) {
      console.error('Error al inscribir participante:', err);
    }
  };

  const handleEliminarParticipante = async (participante: Participante) => {
    if (!eventoSeleccionado) return;
    try {
      await eliminarParticipante(eventoSeleccionado.id, participante.id);
      await reload();
      const evento = eventos.find(e => e.id === eventoSeleccionado.id);
      if (evento) setEventoSeleccionado(evento);
    } catch (err) {
      console.error('Error al eliminar participante:', err);
    }
  };

  const handleRegistrarProgreso = async (progreso: Omit<import('../types').ProgresoParticipante, 'fecha'>) => {
    if (!eventoSeleccionado) return;
    try {
      await registrarProgreso(eventoSeleccionado.id, progreso);
      await reload();
      const evento = eventos.find(e => e.id === eventoSeleccionado.id);
      if (evento) setEventoSeleccionado(evento);
    } catch (err) {
      console.error('Error al registrar progreso:', err);
    }
  };

  const renderTabContent = () => {
    const eventosTabId = esEntrenador ? 'mis-retos' : 'eventos';

    switch (tabActiva) {
      case eventosTabId:
        return (
          <div className="space-y-4">
            <EventosList
              eventos={eventosFiltrados}
              loading={loading}
              onView={(evento) => setEventoSeleccionado(evento)}
              onEdit={handleEditarEvento}
              onDelete={(evento) => {
                setEventoEliminar(evento);
                setShowConfirmDelete(true);
              }}
              onPublish={handlePublicarEvento}
              esEntrenador={esEntrenador}
            />
          </div>
        );

      case 'participantes':
        if (!eventoSeleccionado) {
          return (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un evento</h3>
              <p className="text-gray-600 mb-4">Selecciona un evento para ver sus participantes</p>
            </Card>
          );
        }
        return (
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {eventoSeleccionado.titulo}
                </h3>
                <p className="text-gray-600">
                  {eventoSeleccionado.descripcion}
                </p>
              </div>
            </Card>
            <Participantes
              participantes={eventoSeleccionado.participantes}
              onEliminar={handleEliminarParticipante}
            />
            {esEntrenador && (
              <SeguimientoProgreso
                participantes={eventoSeleccionado.participantes}
                eventoId={eventoSeleccionado.id}
                onRegistrarProgreso={handleRegistrarProgreso}
              />
            )}
            <RankingRetos ranking={eventoSeleccionado.ranking} />
          </div>
        );

      case 'analytics':
        if (!eventoSeleccionado) {
          return (
            <Card className="p-8 text-center bg-white shadow-sm">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un evento</h3>
              <p className="text-gray-600 mb-4">Selecciona un evento para ver sus analytics</p>
            </Card>
          );
        }
        return (
          <div className="space-y-6">
            <AnalyticsEventos evento={eventoSeleccionado} />
            <ContenidoMotivacional contenido={eventoSeleccionado.contenidoMotivacional} />
            <PremiosReconocimientos premios={eventoSeleccionado.premios} />
          </div>
        );

      default:
        return null;
    }
  };

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
                  {esEntrenador ? (
                    <Trophy size={24} className="text-blue-600" />
                  ) : (
                    <Calendar size={24} className="text-blue-600" />
                  )}
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Retos Personales' : 'Eventos y Retos Especiales'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Crea retos personalizados para fidelizar y motivar a tus clientes. "Reto 30 días conmigo" con tu marca personal.'
                      : 'Organiza eventos especiales y retos grupales para aumentar el engagement y retención de tu comunidad.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="primary" size="md" onClick={() => {
                  setEventoEditar(null);
                  setShowCreador(true);
                }}>
                  <Plus size={20} className="mr-2" />
                  {esEntrenador ? 'Crear Reto' : 'Crear Evento/Reto'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} columns={4} />

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 px-4 pb-4">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <CreadorReto
        isOpen={showCreador}
        onClose={() => {
          setShowCreador(false);
          setEventoEditar(null);
        }}
        onSubmit={handleCrearEvento}
        eventoEditar={eventoEditar || undefined}
        esEntrenador={esEntrenador}
      />

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setEventoEliminar(null);
        }}
        onConfirm={handleEliminarEvento}
        title="Eliminar Evento/Reto"
        message={`¿Estás seguro de que deseas eliminar "${eventoEliminar?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

export default EventosRetosEspecialesPage;

