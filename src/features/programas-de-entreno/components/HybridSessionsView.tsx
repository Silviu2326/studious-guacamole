// User Story 1: Vista híbrida con toggle entre tablero semanal (7 columnas) y tarjetas expandibles tipo agenda
import { useState, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Button } from '../../../components/componentsreutilizables/Button';
import {
  Calendar,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { EventoTimeline, TimelineSesiones } from '../types';
import {
  getTipoEntrenamientoIcon,
  getSessionColorClass,
  getGrupoMuscularColor,
  getGrupoMuscularIcon,
  analizarDistribucionEstimulos,
  type AnalisisEstimulos,
} from '../utils/sessionVisuals';

type ViewMode = 'board' | 'agenda';

interface HybridSessionsViewProps {
  timeline: TimelineSesiones;
  onSesionClick?: (evento: EventoTimeline) => void;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function HybridSessionsView({ timeline, onSesionClick }: HybridSessionsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Filtrar solo sesiones
  const sesiones = useMemo(() => {
    return timeline.eventos.filter((evento) => evento.tipo === 'sesion');
  }, [timeline.eventos]);

  // Agrupar sesiones por día de la semana
  const sesionesPorDia = useMemo(() => {
    const agrupadas: Record<string, EventoTimeline[]> = {};
    diasSemana.forEach((dia) => {
      agrupadas[dia] = [];
    });

    sesiones.forEach((sesion) => {
      const fecha = new Date(sesion.fecha);
      const diaSemana = fecha.getDay();
      const nombreDia = diaSemana === 0 ? diasSemana[6] : diasSemana[diaSemana - 1];
      if (!agrupadas[nombreDia]) {
        agrupadas[nombreDia] = [];
      }
      agrupadas[nombreDia].push(sesion);
    });

    return agrupadas;
  }, [sesiones]);

  // Obtener semana actual
  const semanaActual = useMemo(() => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes de esta semana
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dias.push(dia);
    }
    return dias;
  }, []);

  // Análisis de estímulos
  const analisisEstimulos = useMemo(() => {
    return analizarDistribucionEstimulos(
      sesiones.map((s) => ({
        tipoEntrenamiento: s.metadata?.tipoEntrenamiento,
        gruposMusculares: s.metadata?.gruposMusculares,
      }))
    );
  }, [sesiones]);

  const toggleCard = (eventoId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(eventoId)) {
        next.delete(eventoId);
      } else {
        next.add(eventoId);
      }
      return next;
    });
  };

  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatHora = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Vista de Tablero Semanal (7 columnas)
  const renderBoardView = () => {
    return (
      <div className="space-y-4">
        {/* Indicadores de análisis de estímulos */}
        {(analisisEstimulos.excesos.length > 0 || analisisEstimulos.carencias.length > 0) && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Análisis de Estímulos</h3>
            </div>
            <div className="space-y-2">
              {analisisEstimulos.excesos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Excesos detectados:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analisisEstimulos.excesos.map((exceso, idx) => (
                      <Badge
                        key={idx}
                        variant={exceso.severidad === 'alta' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {exceso.valor}: {exceso.cantidad} sesiones ({exceso.porcentaje.toFixed(0)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analisisEstimulos.carencias.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Carencias detectadas:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analisisEstimulos.carencias.map((carencia, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {carencia.valor}: {carencia.cantidad} sesiones
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tablero de 7 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {diasSemana.map((dia, index) => {
            const diaFecha = semanaActual[index];
            const sesionesDia = sesionesPorDia[dia] || [];

            return (
              <Card key={dia} className="p-3 min-h-[200px]">
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-500 uppercase">{dia}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {diaFecha.getDate()}
                  </div>
                  {sesionesDia.length > 0 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {sesionesDia.length} sesión{sesionesDia.length !== 1 ? 'es' : ''}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {sesionesDia.length === 0 ? (
                    <div className="text-xs text-gray-400 text-center py-4">Sin sesiones</div>
                  ) : (
                    sesionesDia.map((sesion) => {
                      const TipoIcon = getTipoEntrenamientoIcon(sesion.metadata?.tipoEntrenamiento);
                      const isExpanded = expandedCards.has(sesion.id);

                      return (
                        <div
                          key={sesion.id}
                          className={`rounded-lg p-2 cursor-pointer transition-all ${getSessionColorClass(
                            sesion.metadata?.tipoEntrenamiento
                          )}`}
                          onClick={() => onSesionClick?.(sesion)}
                        >
                          <div className="flex items-start gap-2">
                            <TipoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">{sesion.titulo}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{formatHora(sesion.fecha)}</div>
                              {sesion.metadata?.tipoEntrenamiento && (
                                <Badge variant="secondary" className="text-[10px] mt-1">
                                  {sesion.metadata.tipoEntrenamiento}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Información expandida */}
                          {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                              {sesion.metadata?.duracionMinutos && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  {sesion.metadata.duracionMinutos} min
                                </div>
                              )}
                              {sesion.metadata?.gruposMusculares && sesion.metadata.gruposMusculares.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sesion.metadata.gruposMusculares.map((grupo, idx) => {
                                    const GrupoIcon = getGrupoMuscularIcon(grupo);
                                    return (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className={`text-[10px] ${getGrupoMuscularColor(grupo)}`}
                                      >
                                        <GrupoIcon className="w-3 h-3 mr-1" />
                                        {grupo}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCard(sesion.id);
                            }}
                            className="mt-1 w-full flex items-center justify-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Menos
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Más
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Vista de Agenda (tarjetas expandibles)
  const renderAgendaView = () => {
    return (
      <div className="space-y-4">
        {/* Indicadores de análisis de estímulos */}
        {(analisisEstimulos.excesos.length > 0 || analisisEstimulos.carencias.length > 0) && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Análisis de Estímulos</h3>
            </div>
            <div className="space-y-2">
              {analisisEstimulos.excesos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Excesos detectados:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analisisEstimulos.excesos.map((exceso, idx) => (
                      <Badge
                        key={idx}
                        variant={exceso.severidad === 'alta' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {exceso.valor}: {exceso.cantidad} sesiones ({exceso.porcentaje.toFixed(0)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analisisEstimulos.carencias.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Carencias detectadas:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analisisEstimulos.carencias.map((carencia, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {carencia.valor}: {carencia.cantidad} sesiones
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tarjetas de agenda */}
        <div className="space-y-3">
          {sesiones.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">No hay sesiones programadas</p>
            </Card>
          ) : (
            sesiones.map((sesion) => {
              const TipoIcon = getTipoEntrenamientoIcon(sesion.metadata?.tipoEntrenamiento);
              const isExpanded = expandedCards.has(sesion.id);

              return (
                <Card
                  key={sesion.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${getSessionColorClass(
                    sesion.metadata?.tipoEntrenamiento
                  )}`}
                  onClick={() => onSesionClick?.(sesion)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                          <TipoIcon className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{sesion.titulo}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span>{formatFecha(sesion.fecha)}</span>
                              <span>•</span>
                              <span>{formatHora(sesion.fecha)}</span>
                              {sesion.metadata?.duracionMinutos && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {sesion.metadata.duracionMinutos} min
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              if (e) {
                                e.stopPropagation();
                              }
                              toggleCard(sesion.id);
                            }}
                            type="button"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Ver más
                              </>
                            )}
                          </Button>
                        </div>

                        {sesion.descripcion && (
                          <p className="text-sm text-gray-700 mt-2">{sesion.descripcion}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                          {sesion.metadata?.tipoEntrenamiento && (
                            <Badge variant="secondary">{sesion.metadata.tipoEntrenamiento}</Badge>
                          )}
                          {sesion.metadata?.gruposMusculares &&
                            sesion.metadata.gruposMusculares.map((grupo, idx) => {
                              const GrupoIcon = getGrupoMuscularIcon(grupo);
                              return (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className={getGrupoMuscularColor(grupo)}
                                >
                                  <GrupoIcon className="w-3 h-3 mr-1" />
                                  {grupo}
                                </Badge>
                              );
                            })}
                        </div>

                        {/* Información expandida */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            {sesion.metadata?.ejerciciosCompletados !== undefined &&
                              sesion.metadata?.ejerciciosTotales !== undefined && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Ejercicios:</span>{' '}
                                  {sesion.metadata.ejerciciosCompletados} /{' '}
                                  {sesion.metadata.ejerciciosTotales} completados
                                </div>
                              )}
                            {sesion.metadata?.programaNombre && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Programa:</span>{' '}
                                {sesion.metadata.programaNombre}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toggle de vista */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Sesiones de la Semana</h2>
            <Badge variant="secondary">{sesiones.length} sesiones</Badge>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              leftIcon={<LayoutGrid className="w-4 h-4" />}
            >
              Tablero
            </Button>
            <Button
              variant={viewMode === 'agenda' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('agenda')}
              leftIcon={<List className="w-4 h-4" />}
            >
              Agenda
            </Button>
          </div>
        </div>
      </Card>

      {/* Renderizar vista seleccionada */}
      {viewMode === 'board' ? renderBoardView() : renderAgendaView()}
    </div>
  );
}

