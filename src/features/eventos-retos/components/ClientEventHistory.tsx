import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Target, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Star,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import { 
  getEventosHistorialCliente, 
  getEstadisticasEventosCliente,
  EventoHistorialCliente,
  EstadisticasEventosCliente,
  TipoEvento
} from '../api/events';
import { Select } from '../../../components/componentsreutilizables/Select';
import { calcularEstadisticasAsistenciaPorCliente } from '../services/estadisticasAsistenciaService';
import { obtenerEncuestaPorEvento } from '../services/feedbackService';

interface ClientEventHistoryProps {
  clientId: string;
}

export const ClientEventHistory: React.FC<ClientEventHistoryProps> = ({ clientId }) => {
  const [historial, setHistorial] = useState<EventoHistorialCliente[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEventosCliente | null>(null);
  const [estadisticasAsistencia, setEstadisticasAsistencia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<TipoEvento | 'todos'>('todos');

  useEffect(() => {
    cargarDatos();
  }, [clientId]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [historialData, estadisticasData, estadisticasAsistenciaData] = await Promise.all([
        getEventosHistorialCliente(clientId),
        getEstadisticasEventosCliente(clientId),
        calcularEstadisticasAsistenciaPorCliente(clientId),
      ]);
      setHistorial(historialData);
      setEstadisticas(estadisticasData);
      setEstadisticasAsistencia(estadisticasAsistenciaData);
    } catch (error) {
      console.error('Error cargando historial de eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const historialFiltrado = tipoFiltro === 'todos' 
    ? historial 
    : historial.filter(e => e.eventoTipo === tipoFiltro);

  const getTipoEventoIcon = (tipo: TipoEvento) => {
    switch (tipo) {
      case 'presencial':
        return <MapPin className="w-4 h-4" />;
      case 'virtual':
        return <Video className="w-4 h-4" />;
      case 'reto':
        return <Target className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTipoEventoLabel = (tipo: TipoEvento) => {
    switch (tipo) {
      case 'presencial':
        return 'Presencial';
      case 'virtual':
        return 'Virtual';
      case 'reto':
        return 'Reto';
      default:
        return tipo;
    }
  };

  const getEstadoEventoBadge = (estado: string) => {
    switch (estado) {
      case 'programado':
        return <Badge variant="blue">Programado</Badge>;
      case 'en-curso':
        return <Badge variant="green">En Curso</Badge>;
      case 'finalizado':
        return <Badge variant="gray">Finalizado</Badge>;
      case 'cancelado':
        return <Badge variant="red">Cancelado</Badge>;
      default:
        return <Badge variant="gray">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de eventos...</p>
        </div>
      </Card>
    );
  }

  // Función para verificar si un evento tiene feedback
  const tieneFeedback = (eventoId: string): boolean => {
    const encuesta = obtenerEncuestaPorEvento(eventoId);
    return encuesta ? encuesta.respuestas.length > 0 : false;
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Asistencia (usando estadisticasAsistenciaService) */}
      {estadisticasAsistencia && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Asistencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Eventos</p>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasAsistencia.totalEventos}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Inscripciones</p>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasAsistencia.eventosInscritos}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Asistencias</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasAsistencia.eventosAsistidos}</p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticasAsistencia.eventosNoAsistidos} no asistidos
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">% Asistencia</p>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{estadisticasAsistencia.porcentajeAsistencia}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {estadisticasAsistencia.porcentajeNoShow}% no-show
              </p>
            </div>
          </div>

          {/* Estadísticas por tipo de evento */}
          {estadisticasAsistencia.eventosPorTipo && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Asistencia por Tipo de Evento</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{estadisticasAsistencia.eventosPorTipo.presencial.asistidos}</p>
                  <p className="text-xs text-gray-600">de {estadisticasAsistencia.eventosPorTipo.presencial.inscritos} presenciales</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Video className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{estadisticasAsistencia.eventosPorTipo.virtual.asistidos}</p>
                  <p className="text-xs text-gray-600">de {estadisticasAsistencia.eventosPorTipo.virtual.inscritos} virtuales</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">{estadisticasAsistencia.eventosPorTipo.reto.asistidos}</p>
                  <p className="text-xs text-gray-600">de {estadisticasAsistencia.eventosPorTipo.reto.inscritos} retos</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Estadísticas adicionales (compatibilidad) */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalEventos}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inscripciones</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.eventosInscritos}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Asistencias</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.eventosAsistidos}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">% Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.porcentajeAsistencia}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Eventos por tipo */}
      {estadisticas && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos por Tipo</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{estadisticas.eventosPorTipo.presencial}</p>
              <p className="text-sm text-gray-600">Presencial</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{estadisticas.eventosPorTipo.virtual}</p>
              <p className="text-sm text-gray-600">Virtual</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{estadisticas.eventosPorTipo.reto}</p>
              <p className="text-sm text-gray-600">Reto</p>
            </div>
          </div>
        </Card>
      )}

      {/* Eventos favoritos */}
      {estadisticas && estadisticas.eventosFavoritos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Eventos Favoritos
          </h3>
          <div className="space-y-3">
            {estadisticas.eventosFavoritos.map((favorito) => (
              <div
                key={favorito.eventoId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTipoEventoIcon(favorito.eventoTipo)}
                  <div>
                    <p className="font-medium text-gray-900">{favorito.eventoNombre}</p>
                    <p className="text-sm text-gray-600">{getTipoEventoLabel(favorito.eventoTipo)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{favorito.vecesAsistido}</p>
                  <p className="text-xs text-gray-600">
                    {favorito.vecesAsistido === 1 ? 'vez' : 'veces'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lista de eventos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Eventos</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value as TipoEvento | 'todos')}
              className="w-40"
            >
              <option value="todos">Todos los tipos</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="reto">Reto</option>
            </Select>
          </div>
        </div>

        {historialFiltrado.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay eventos en el historial</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historialFiltrado.map((evento) => (
              <div
                key={evento.eventoId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {getTipoEventoIcon(evento.eventoTipo)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{evento.eventoNombre}</h4>
                      {getEstadoEventoBadge(evento.estadoEvento)}
                      <Badge variant={evento.eventoTipo === 'presencial' ? 'blue' : evento.eventoTipo === 'virtual' ? 'purple' : 'green'}>
                        {getTipoEventoLabel(evento.eventoTipo)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-11 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {evento.ubicacion && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {evento.ubicacion}
                        </span>
                      )}
                      {evento.plataforma && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {evento.plataforma}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ml-11 flex-wrap">
                      {evento.inscrito && (
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">Inscrito</span>
                          {evento.fechaInscripcion && (
                            <span className="text-gray-500">
                              ({new Date(evento.fechaInscripcion).toLocaleDateString('es-ES')})
                            </span>
                          )}
                        </div>
                      )}
                      {evento.asistio && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Asistió</span>
                        </div>
                      )}
                      {evento.cancelado && (
                        <div className="flex items-center gap-1 text-sm text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>Cancelado</span>
                          {evento.fechaCancelacion && (
                            <span className="text-gray-500">
                              ({new Date(evento.fechaCancelacion).toLocaleDateString('es-ES')})
                            </span>
                          )}
                        </div>
                      )}
                      {/* Indicador de feedback */}
                      {tieneFeedback(evento.eventoId) && (
                        <div className="flex items-center gap-1 text-sm text-purple-600" title="Este evento tiene feedback disponible">
                          <MessageSquare className="w-4 h-4" />
                          <span>Feedback</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};


