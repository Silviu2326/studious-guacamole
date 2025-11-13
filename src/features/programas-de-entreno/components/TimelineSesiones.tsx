import { useEffect, useState, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Button } from '../../../components/componentsreutilizables/Button';
import {
  Calendar,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Target,
  Clock,
  User,
  Activity,
  AlertTriangle,
  TrendingDown,
  Minus,
  Filter,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
} from 'lucide-react';
import * as timelineApi from '../api/timeline-sesiones';
import { TimelineSesiones as TimelineSesionesType, TipoEventoTimeline } from '../types';
import * as contextoApi from '../api/contexto-cliente';
// User Story 1: Importar componente de vista híbrida
import { HybridSessionsView } from './HybridSessionsView';

export function TimelineSesiones() {
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [timeline, setTimeline] = useState<TimelineSesionesType | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  // User Story 1: Toggle entre vista híbrida y timeline tradicional
  const [mostrarVistaHibrida, setMostrarVistaHibrida] = useState<boolean>(true);
  // User Story 2: Zoom y vista detallada
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 0.5, 0.75, 1, 1.25, 1.5, 2
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      loadTimeline();
    } else {
      setTimeline(null);
    }
  }, [clienteSeleccionado]);

  const loadClientes = async () => {
    try {
      const clientesData = await contextoApi.getClientes();
      setClientes(clientesData);
      if (clientesData.length > 0 && !clienteSeleccionado) {
        setClienteSeleccionado(clientesData[0].id);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const loadTimeline = async () => {
    if (!clienteSeleccionado) return;
    
    setLoading(true);
    try {
      const timelineData = await timelineApi.getTimelineSesiones(clienteSeleccionado);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: TipoEventoTimeline) => {
    switch (tipo) {
      case 'sesion':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'resultado':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'checkin':
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
      case 'objetivo':
        return <Target className="w-5 h-5 text-indigo-500" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTipoLabel = (tipo: TipoEventoTimeline): string => {
    switch (tipo) {
      case 'sesion':
        return 'Sesión';
      case 'feedback':
        return 'Feedback';
      case 'resultado':
        return 'Resultado';
      case 'checkin':
        return 'Check-in';
      case 'objetivo':
        return 'Objetivo';
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: TipoEventoTimeline): 'blue' | 'green' | 'purple' | 'orange' | 'indigo' => {
    switch (tipo) {
      case 'sesion':
        return 'blue';
      case 'feedback':
        return 'green';
      case 'resultado':
        return 'purple';
      case 'checkin':
        return 'orange';
      case 'objetivo':
        return 'indigo';
      default:
        return 'blue';
    }
  };

  const getPatronSeveridadColor = (severidad: string): 'destructive' | 'secondary' | 'default' => {
    switch (severidad) {
      case 'alta':
        return 'destructive';
      case 'media':
        return 'secondary';
      case 'baja':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPatronIcon = (tipo: string) => {
    switch (tipo) {
      case 'adherencia':
        return <TrendingDown className="w-4 h-4" />;
      case 'fatiga':
        return <AlertTriangle className="w-4 h-4" />;
      case 'progreso':
        return <TrendingUp className="w-4 h-4" />;
      case 'riesgo':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === ayer.toDateString()) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Filtrar eventos
  const eventosFiltrados = timeline?.eventos.filter(evento => {
    if (filtroTipo !== 'todos' && evento.tipo !== filtroTipo) return false;
    return true;
  }) || [];

  // User Story 2: Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // User Story 2: Toggle session expansion
  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  // User Story 2: Calculate timeline item height based on zoom
  const getTimelineItemHeight = useMemo(() => {
    return (isExpanded: boolean) => {
      const baseHeight = viewMode === 'compact' ? 80 : 120;
      const expandedHeight = viewMode === 'compact' ? 200 : 400;
      const height = isExpanded ? expandedHeight : baseHeight;
      return height * zoomLevel;
    };
  }, [zoomLevel, viewMode]);

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando timeline...</div>
      </Card>
    );
  }

  if (!timeline) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <Select
            label="Seleccionar Cliente"
            value={clienteSeleccionado}
            onChange={(v) => setClienteSeleccionado(v)}
            options={[
              { label: 'Selecciona un cliente', value: '' },
              ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
            ]}
          />
        </Card>
        <Card className="p-8 text-center text-gray-500">
          Selecciona un cliente para ver su timeline
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con selector y resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                label="Cliente"
                value={clienteSeleccionado}
                onChange={(v) => setClienteSeleccionado(v)}
                options={[
                  { label: 'Selecciona un cliente', value: '' },
                  ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
                ]}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">{timeline.clienteNombre}</span>
            </div>
          </div>
        </Card>

        {/* Resumen */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Resumen</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{timeline.resumen.totalSesiones}</div>
              <div className="text-xs text-gray-600">Sesiones totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{timeline.resumen.sesionesCompletadas}</div>
              <div className="text-xs text-gray-600">Completadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {timeline.resumen.promedioAdherencia.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Adherencia</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {timeline.resumen.promedioFeedback.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Feedback promedio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{timeline.resumen.sesionesPendientes}</div>
              <div className="text-xs text-gray-600">Pendientes</div>
            </div>
            {timeline.resumen.ultimaSesion && (
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(timeline.resumen.ultimaSesion).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
                <div className="text-xs text-gray-600">Última sesión</div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Patrones detectados */}
      {timeline.resumen.patronesDetectados && timeline.resumen.patronesDetectados.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Patrones Detectados</h2>
          </div>
          <div className="space-y-2">
            {timeline.resumen.patronesDetectados.map((patron, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                {getPatronIcon(patron.tipo)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{patron.descripcion}</div>
                  <div className="text-xs text-gray-600 capitalize">Tipo: {patron.tipo}</div>
                </div>
                <Badge variant={getPatronSeveridadColor(patron.severidad)}>
                  {patron.severidad}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* User Story 1: Toggle entre vista híbrida y timeline tradicional */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            <Select
              value={filtroTipo}
              onChange={(v) => setFiltroTipo(v)}
              options={[
                { label: 'Todos los eventos', value: 'todos' },
                { label: 'Sesiones', value: 'sesion' },
                { label: 'Feedback', value: 'feedback' },
                { label: 'Resultados', value: 'resultado' },
                { label: 'Check-ins', value: 'checkin' },
                { label: 'Objetivos', value: 'objetivo' },
              ]}
            />
            {filtroTipo !== 'todos' && (
              <button
                onClick={() => setFiltroTipo('todos')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
                Limpiar filtro
              </button>
            )}
          </div>
          
          {/* Toggle de vista híbrida */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMostrarVistaHibrida(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mostrarVistaHibrida
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vista Híbrida
            </button>
            <button
              onClick={() => setMostrarVistaHibrida(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                !mostrarVistaHibrida
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline Clásico
            </button>
          </div>
        </div>
      </Card>

      {/* User Story 1: Mostrar vista híbrida si está habilitada y el filtro es 'sesion' o 'todos' */}
      {mostrarVistaHibrida && (filtroTipo === 'sesion' || filtroTipo === 'todos') && (
        <HybridSessionsView
          timeline={timeline}
          onSesionClick={(evento) => {
            console.log('Sesión clickeada:', evento);
            // Aquí puedes agregar lógica adicional cuando se hace clic en una sesión
          }}
        />
      )}

      {/* User Story 2: Timeline tradicional con zoom y vista compacta/detallada */}
      {(!mostrarVistaHibrida || (filtroTipo !== 'sesion' && filtroTipo !== 'todos')) && (
        <>
      {eventosFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">No hay eventos en el timeline</p>
          <p className="text-sm text-gray-500 mt-1">
            {filtroTipo !== 'todos' ? 'Intenta ajustar el filtro' : 'No hay eventos registrados'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* User Story 2: Controles de zoom y vista */}
          <Card className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Zoom:</span>
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    leftIcon={<ZoomOut className="w-4 h-4" />}
                  >
                    -
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2}
                    leftIcon={<ZoomIn className="w-4 h-4" />}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomReset}
                    className="ml-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Vista:</span>
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-white">
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('compact')}
                    leftIcon={<Minimize2 className="w-4 h-4" />}
                  >
                    Compacta
                  </Button>
                  <Button
                    variant={viewMode === 'detailed' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('detailed')}
                    leftIcon={<Maximize2 className="w-4 h-4" />}
                  >
                    Detallada
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 overflow-x-auto">
            <div className="relative" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
              {/* Línea vertical del timeline */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Eventos */}
              <div className="space-y-6">
                {eventosFiltrados.map((evento, idx) => {
                  const isExpanded = expandedSessions.has(evento.id);
                  const isSession = evento.tipo === 'sesion';
                  
                  return (
                    <div 
                      key={evento.id} 
                      className="relative flex items-start gap-4"
                      style={{ minHeight: isSession ? `${getTimelineItemHeight(isExpanded)}px` : 'auto' }}
                    >
                      {/* Icono del evento */}
                      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-sm flex-shrink-0">
                        {getTipoIcon(evento.tipo)}
                      </div>

                      {/* Contenido del evento */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className={`font-semibold text-gray-900 ${viewMode === 'detailed' ? 'text-lg' : 'text-base'}`}>
                            {evento.titulo}
                          </h3>
                          <Badge variant={getTipoColor(evento.tipo)}>{getTipoLabel(evento.tipo)}</Badge>
                          <span className="text-sm text-gray-500">{formatFecha(evento.fecha)}</span>
                          {isSession && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSessionExpansion(evento.id)}
                              leftIcon={isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            >
                              {isExpanded ? 'Ocultar detalles' : 'Ver ejercicios'}
                            </Button>
                          )}
                        </div>

                        {viewMode === 'detailed' && evento.descripcion && (
                          <p className="text-gray-700 mb-3">{evento.descripcion}</p>
                        )}

                        {/* Metadata específica según el tipo */}
                        {evento.metadata && (
                          <div className="space-y-2">
                            {evento.tipo === 'sesion' && (
                              <>
                                {evento.metadata.duracionMinutos && (
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{evento.metadata.duracionMinutos} min</span>
                                    </div>
                                    {evento.metadata.ejerciciosCompletados !== undefined &&
                                      evento.metadata.ejerciciosTotales !== undefined && (
                                        <div>
                                          {evento.metadata.ejerciciosCompletados}/{evento.metadata.ejerciciosTotales}{' '}
                                          ejercicios
                                        </div>
                                      )}
                                    {evento.metadata.programaNombre && (
                                      <div className="text-blue-600 font-medium">
                                        {evento.metadata.programaNombre}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* User Story 2: Ejercicios detallados cuando está expandido */}
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Dumbbell className="w-5 h-5 text-gray-600" />
                                      <h4 className="font-semibold text-gray-900">Ejercicios de la sesión</h4>
                                    </div>
                                    {/* Aquí se mostrarían los ejercicios detallados */}
                                    {/* Por ahora mostramos información disponible en metadata */}
                                    {evento.metadata.tipoEntrenamiento && (
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary">Tipo: {evento.metadata.tipoEntrenamiento}</Badge>
                                      </div>
                                    )}
                                    {evento.metadata.gruposMusculares && evento.metadata.gruposMusculares.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        <span className="text-sm font-medium text-gray-700">Grupos musculares:</span>
                                        {evento.metadata.gruposMusculares.map((grupo, gIdx) => (
                                          <Badge key={gIdx} variant="secondary">{grupo}</Badge>
                                        ))}
                                      </div>
                                    )}
                                    {evento.descripcion && (
                                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium">Notas: </span>
                                        {evento.descripcion}
                                      </div>
                                    )}
                                    {(!evento.metadata.tipoEntrenamiento && !evento.metadata.gruposMusculares && !evento.descripcion) && (
                                      <p className="text-sm text-gray-500 italic">No hay detalles adicionales disponibles para esta sesión</p>
                                    )}
                                  </div>
                                )}
                              </>
                            )}

                            {evento.tipo === 'feedback' && evento.metadata.puntuacion !== undefined && (
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    Puntuación: {evento.metadata.puntuacion}/10
                                  </span>
                                  <div className="flex gap-1">
                                    {[...Array(10)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${
                                          i < evento.metadata.puntuacion!
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {viewMode === 'detailed' && evento.metadata.comentarios && (
                                  <div className="text-gray-600 italic">"{evento.metadata.comentarios}"</div>
                                )}
                              </div>
                            )}

                            {evento.tipo === 'resultado' &&
                              evento.metadata.metrica &&
                              evento.metadata.valorActual !== undefined && (
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="font-semibold text-gray-900">
                                    {evento.metadata.metrica}: {evento.metadata.valorActual.toFixed(1)}{' '}
                                    {evento.metadata.unidad || ''}
                                  </div>
                                  {viewMode === 'detailed' && evento.metadata.valorAnterior !== undefined && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                      {evento.metadata.valorActual > evento.metadata.valorAnterior ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                      ) : evento.metadata.valorActual < evento.metadata.valorAnterior ? (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                      ) : (
                                        <Minus className="w-4 h-4 text-gray-400" />
                                      )}
                                      <span>
                                        Anterior: {evento.metadata.valorAnterior.toFixed(1)}{' '}
                                        {evento.metadata.unidad || ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                            {evento.tipo === 'objetivo' && evento.metadata.estadoObjetivo && (
                              <div>
                                <Badge
                                  variant={
                                    evento.metadata.estadoObjetivo === 'achieved'
                                      ? 'success'
                                      : evento.metadata.estadoObjetivo === 'at_risk'
                                      ? 'destructive'
                                      : 'default'
                                  }
                                >
                                  {evento.metadata.estadoObjetivo === 'achieved'
                                    ? 'Completado'
                                    : evento.metadata.estadoObjetivo === 'at_risk'
                                    ? 'En riesgo'
                                    : evento.metadata.estadoObjetivo === 'in_progress'
                                    ? 'En progreso'
                                    : evento.metadata.estadoObjetivo}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}
        </>
      )}
    </div>
  );
}

