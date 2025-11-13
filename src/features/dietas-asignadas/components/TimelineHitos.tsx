import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Target,
  Activity,
  Stethoscope,
  Trophy,
  FileText,
  MapPin,
  ChevronRight,
  Plus,
  Filter,
} from 'lucide-react';
import type { Hito, TareaPendiente, TipoHito, TipoTarea } from '../types';
import { getHitos, getTareasPendientes, completarTarea } from '../api/hitosTareas';

interface TimelineHitosProps {
  dietaId: string;
  clienteId: string;
  onHitoClick?: (hito: Hito) => void;
  onTareaCompletada?: (tarea: TareaPendiente) => void;
}

const iconosHitos: Record<TipoHito, React.ReactNode> = {
  'control-medico': <Stethoscope className="w-5 h-5" />,
  'competicion': <Trophy className="w-5 h-5" />,
  'sesion-clave': <Activity className="w-5 h-5" />,
  'evaluacion': <FileText className="w-5 h-5" />,
  'evento-deportivo': <Target className="w-5 h-5" />,
  'otro': <Calendar className="w-5 h-5" />,
};

const coloresHitos: Record<TipoHito, string> = {
  'control-medico': 'bg-blue-100 text-blue-700 border-blue-300',
  'competicion': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'sesion-clave': 'bg-purple-100 text-purple-700 border-purple-300',
  'evaluacion': 'bg-green-100 text-green-700 border-green-300',
  'evento-deportivo': 'bg-orange-100 text-orange-700 border-orange-300',
  'otro': 'bg-gray-100 text-gray-700 border-gray-300',
};

const iconosTareas: Record<TipoTarea, React.ReactNode> = {
  'revisar-macros': <Target className="w-4 h-4" />,
  'ajustar-plan': <Activity className="w-4 h-4" />,
  'coordinar-entrenador': <FileText className="w-4 h-4" />,
  'revisar-suplementacion': <Stethoscope className="w-4 h-4" />,
  'feedback-cliente': <Circle className="w-4 h-4" />,
  'preparacion-hito': <Calendar className="w-4 h-4" />,
  'seguimiento': <Clock className="w-4 h-4" />,
  'otro': <FileText className="w-4 h-4" />,
};

export const TimelineHitos: React.FC<TimelineHitosProps> = ({
  dietaId,
  clienteId,
  onHitoClick,
  onTareaCompletada,
}) => {
  const [hitos, setHitos] = useState<Hito[]>([]);
  const [tareas, setTareas] = useState<TareaPendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'hitos' | 'tareas'>('todos');
  const [mostrarCompletados, setMostrarCompletados] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [dietaId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [hitosData, tareasData] = await Promise.all([
        getHitos(dietaId),
        getTareasPendientes(dietaId),
      ]);
      setHitos(hitosData);
      setTareas(tareasData);
    } catch (error) {
      console.error('Error cargando hitos y tareas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCompletarTarea = async (tareaId: string) => {
    try {
      const tareaCompletada = await completarTarea(tareaId);
      setTareas(prev => prev.filter(t => t.id !== tareaId));
      onTareaCompletada?.(tareaCompletada);
    } catch (error) {
      console.error('Error completando tarea:', error);
    }
  };

  // Combinar hitos y tareas y ordenar por fecha
  const eventosCombinados = React.useMemo(() => {
    const eventos: Array<{
      tipo: 'hito' | 'tarea';
      fecha: string;
      data: Hito | TareaPendiente;
    }> = [];

    hitos.forEach(hito => {
      if (mostrarCompletados || !hito.completado) {
        eventos.push({
          tipo: 'hito',
          fecha: hito.fecha,
          data: hito,
        });
      }
    });

    tareas.forEach(tarea => {
      eventos.push({
        tipo: 'tarea',
        fecha: tarea.fechaLimite || tarea.creadoEn.split('T')[0],
        data: tarea,
      });
    });

    return eventos.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return fechaA - fechaB;
    });
  }, [hitos, tareas, mostrarCompletados]);

  const eventosFiltrados = eventosCombinados.filter(evento => {
    if (filtroTipo === 'todos') return true;
    if (filtroTipo === 'hitos') return evento.tipo === 'hito';
    if (filtroTipo === 'tareas') return evento.tipo === 'tarea';
    return true;
  });

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaObj.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
    if (diffDays < 0 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;

    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: fechaObj.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined,
    });
  };

  const renderHito = (hito: Hito) => {
    const fechaObj = new Date(hito.fecha);
    const hoy = new Date();
    const diffDays = Math.ceil((fechaObj.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    const esProximo = diffDays >= 0 && diffDays <= 7;

    return (
      <div
        key={hito.id}
        className={`relative pl-8 pb-6 border-l-2 ${
          esProximo ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        {/* Punto del timeline */}
        <div
          className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
            esProximo
              ? 'bg-blue-500 border-blue-600'
              : hito.completado
              ? 'bg-green-500 border-green-600'
              : 'bg-gray-300 border-gray-400'
          }`}
        />

        <Card
          className={`cursor-pointer hover:shadow-md transition-all ${
            esProximo ? 'border-blue-200 bg-blue-50/30' : ''
          }`}
          onClick={() => onHitoClick?.(hito)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${coloresHitos[hito.tipo]}`}>
                  {iconosHitos[hito.tipo]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{hito.titulo}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatearFecha(hito.fecha)}</span>
                    {hito.hora && (
                      <>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{hito.hora}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    hito.importancia === 'alta'
                      ? 'bg-red-100 text-red-700'
                      : hito.importancia === 'media'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {hito.importancia}
                </Badge>
                {hito.completado && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {hito.descripcion && (
              <p className="text-sm text-gray-600 mb-3">{hito.descripcion}</p>
            )}

            {hito.ubicacion && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{hito.ubicacion}</span>
              </div>
            )}

            {hito.impactoNutricional && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  Impacto Nutricional:
                </div>
                {hito.impactoNutricional.recomendaciones && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {hito.impactoNutricional.recomendaciones.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Tareas relacionadas */}
            {tareas.filter(t => t.relacionadaConHito === hito.id).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  Tareas relacionadas:
                </div>
                {tareas
                  .filter(t => t.relacionadaConHito === hito.id)
                  .map(tarea => (
                    <div
                      key={tarea.id}
                      className="flex items-center justify-between text-xs bg-gray-50 rounded p-2 mb-1"
                    >
                      <span className="text-gray-700">{tarea.titulo}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompletarTarea(tarea.id);
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        Completar
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderTarea = (tarea: TareaPendiente) => {
    const fechaLimite = tarea.fechaLimite
      ? new Date(tarea.fechaLimite)
      : null;
    const hoy = new Date();
    const esUrgente =
      fechaLimite &&
      fechaLimite.getTime() - hoy.getTime() <= 3 * 24 * 60 * 60 * 1000 &&
      fechaLimite.getTime() >= hoy.getTime();

    return (
      <div
        key={tarea.id}
        className={`relative pl-8 pb-6 border-l-2 ${
          esUrgente ? 'border-orange-500' : 'border-gray-300'
        }`}
      >
        {/* Punto del timeline */}
        <div
          className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
            esUrgente
              ? 'bg-orange-500 border-orange-600'
              : tarea.prioridad === 'alta'
              ? 'bg-red-400 border-red-500'
              : 'bg-gray-300 border-gray-400'
          }`}
        />

        <Card
          className={`hover:shadow-md transition-all ${
            esUrgente ? 'border-orange-200 bg-orange-50/30' : ''
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-gray-100 text-gray-600">
                  {iconosTareas[tarea.tipo]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tarea.titulo}</h4>
                  {tarea.fechaLimite && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {esUrgente ? '⚠️ ' : ''}
                        {formatearFecha(tarea.fechaLimite)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    tarea.prioridad === 'alta'
                      ? 'bg-red-100 text-red-700'
                      : tarea.prioridad === 'media'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {tarea.prioridad}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCompletarTarea(tarea.id)}
                  className="h-8 px-3"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Completar
                </Button>
              </div>
            </div>

            {tarea.descripcion && (
              <p className="text-sm text-gray-600">{tarea.descripcion}</p>
            )}
          </div>
        </Card>
      </div>
    );
  };

  if (cargando) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando timeline...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Timeline de Hitos y Tareas</h2>
          <p className="text-sm text-gray-600">
            Alinea la nutrición con eventos importantes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filtros */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <Button
              variant={filtroTipo === 'todos' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltroTipo('todos')}
              className="h-8 px-3 text-xs"
            >
              Todos
            </Button>
            <Button
              variant={filtroTipo === 'hitos' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltroTipo('hitos')}
              className="h-8 px-3 text-xs"
            >
              Hitos
            </Button>
            <Button
              variant={filtroTipo === 'tareas' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltroTipo('tareas')}
              className="h-8 px-3 text-xs"
            >
              Tareas
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {eventosFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay hitos o tareas programadas</p>
        </Card>
      ) : (
        <div className="relative">
          {eventosFiltrados.map((evento, idx) => (
            <div key={`${evento.tipo}-${evento.data.id}`}>
              {evento.tipo === 'hito'
                ? renderHito(evento.data as Hito)
                : renderTarea(evento.data as TareaPendiente)}
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Hitos</div>
              <div className="font-semibold text-gray-900">{hitos.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Tareas Pendientes</div>
              <div className="font-semibold text-gray-900">{tareas.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Próximos 7 días</div>
              <div className="font-semibold text-gray-900">
                {
                  eventosCombinados.filter(e => {
                    const fecha = new Date(e.fecha);
                    const hoy = new Date();
                    const diffDays = Math.ceil(
                      (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return diffDays >= 0 && diffDays <= 7;
                  }).length
                }
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

