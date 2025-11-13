import { useEffect, useState, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Button } from '../../../components/componentsreutilizables/Button';
import {
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  FileText,
  Activity,
  TrendingUp,
  ChevronRight,
  X,
} from 'lucide-react';

export type TipoHito = 'sesion-critica' | 'revision' | 'competicion' | 'tarea-pendiente' | 'objetivo';

export interface Hito {
  id: string;
  tipo: TipoHito;
  titulo: string;
  descripcion?: string;
  fecha: Date;
  clienteId?: string;
  clienteNombre?: string;
  programaId?: string;
  programaNombre?: string;
  prioridad: 'alta' | 'media' | 'baja';
  completado: boolean;
  metadata?: {
    sesionId?: string;
    duracionMinutos?: number;
    tipoEntrenamiento?: string;
    gruposMusculares?: string[];
    revisionId?: string;
    tipoRevision?: 'semanal' | 'mensual' | 'trimestral';
    competicionId?: string;
    tipoCompeticion?: string;
    tareaId?: string;
    accionRequerida?: string;
  };
}

interface TimelineMilestonesPanelProps {
  clienteId?: string;
  programaId?: string;
  onHitoClick?: (hito: Hito) => void;
  onCompletarHito?: (hitoId: string) => void;
  onDescartarHito?: (hitoId: string) => void;
}

// Función para generar hitos de ejemplo (en producción vendría de la API)
function generarHitosEjemplo(clienteId?: string, programaId?: string): Hito[] {
  const ahora = new Date();
  const hitos: Hito[] = [];

  // Sesiones críticas (próximos 7 días)
  for (let i = 1; i <= 3; i++) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() + i * 2);
    
    hitos.push({
      id: `sesion-critica-${i}`,
      tipo: 'sesion-critica',
      titulo: `Sesión Crítica - ${fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}`,
      descripcion: 'Sesión de evaluación de progreso y ajuste de carga',
      fecha,
      clienteId: clienteId || 'cli-123',
      clienteNombre: 'María López',
      programaId: programaId || 'prog-123',
      programaNombre: 'Programa Hipertrofia',
      prioridad: i === 1 ? 'alta' : 'media',
      completado: false,
      metadata: {
        sesionId: `sesion-${i}`,
        duracionMinutos: 60,
        tipoEntrenamiento: 'fuerza',
        gruposMusculares: ['pecho', 'espalda'],
      },
    });
  }

  // Revisiones (próximos 14 días)
  const revisiones = [
    { dias: 3, tipo: 'semanal' as const },
    { dias: 10, tipo: 'mensual' as const },
  ];

  revisiones.forEach((rev, idx) => {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() + rev.dias);
    
    hitos.push({
      id: `revision-${idx + 1}`,
      tipo: 'revision',
      titulo: `Revisión ${rev.tipo === 'semanal' ? 'Semanal' : 'Mensual'}`,
      descripcion: `Revisión ${rev.tipo} del programa y ajustes necesarios`,
      fecha,
      clienteId: clienteId || 'cli-123',
      clienteNombre: 'María López',
      programaId: programaId || 'prog-123',
      programaNombre: 'Programa Hipertrofia',
      prioridad: rev.tipo === 'mensual' ? 'alta' : 'media',
      completado: false,
      metadata: {
        revisionId: `rev-${idx + 1}`,
        tipoRevision: rev.tipo,
      },
    });
  });

  // Competiciones (próximos 30 días)
  const competiciones = [
    { dias: 15, tipo: 'Maratón Local' },
    { dias: 25, tipo: 'Competencia de Fuerza' },
  ];

  competiciones.forEach((comp, idx) => {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() + comp.dias);
    
    hitos.push({
      id: `competicion-${idx + 1}`,
      tipo: 'competicion',
      titulo: comp.tipo,
      descripcion: `Preparación y tapering para ${comp.tipo}`,
      fecha,
      clienteId: clienteId || 'cli-123',
      clienteNombre: 'María López',
      programaId: programaId || 'prog-123',
      programaNombre: 'Programa Hipertrofia',
      prioridad: 'alta',
      completado: false,
      metadata: {
        competicionId: `comp-${idx + 1}`,
        tipoCompeticion: comp.tipo,
      },
    });
  });

  // Tareas pendientes
  const tareas = [
    { dias: 1, titulo: 'Revisar feedback del cliente', accion: 'Revisar y responder feedback de la última sesión' },
    { dias: 2, titulo: 'Ajustar programa según lesión', accion: 'Modificar ejercicios para evitar agravar lesión' },
    { dias: 5, titulo: 'Actualizar objetivos de progreso', accion: 'Revisar y actualizar objetivos según avances' },
  ];

  tareas.forEach((tarea, idx) => {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() + tarea.dias);
    
    hitos.push({
      id: `tarea-${idx + 1}`,
      tipo: 'tarea-pendiente',
      titulo: tarea.titulo,
      descripcion: tarea.accion,
      fecha,
      clienteId: clienteId || 'cli-123',
      clienteNombre: 'María López',
      programaId: programaId || 'prog-123',
      programaNombre: 'Programa Hipertrofia',
      prioridad: idx === 0 ? 'alta' : 'media',
      completado: false,
      metadata: {
        tareaId: `tarea-${idx + 1}`,
        accionRequerida: tarea.accion,
      },
    });
  });

  // Ordenar por fecha
  return hitos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

export function TimelineMilestonesPanel({
  clienteId,
  programaId,
  onHitoClick,
  onCompletarHito,
  onDescartarHito,
}: TimelineMilestonesPanelProps) {
  const [hitos, setHitos] = useState<Hito[]>([]);
  const [loading, setLoading] = useState(false);
  const [discardedHitos, setDiscardedHitos] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadHitos();
  }, [clienteId, programaId]);

  const loadHitos = async () => {
    setLoading(true);
    try {
      // En producción, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 500));
      const hitosData = generarHitosEjemplo(clienteId, programaId);
      setHitos(hitosData);
    } catch (error) {
      console.error('Error loading hitos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar hitos descartados y obtener solo los próximos (próximos 30 días)
  const hitosProximos = useMemo(() => {
    const ahora = new Date();
    const limite = new Date(ahora);
    limite.setDate(limite.getDate() + 30);

    return hitos
      .filter(hito => !discardedHitos.has(hito.id))
      .filter(hito => hito.fecha >= ahora && hito.fecha <= limite)
      .filter(hito => !hito.completado)
      .slice(0, 10); // Mostrar máximo 10 hitos
  }, [hitos, discardedHitos]);

  const getTipoIcon = (tipo: TipoHito) => {
    switch (tipo) {
      case 'sesion-critica':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'revision':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'competicion':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'tarea-pendiente':
        return <CheckCircle2 className="w-5 h-5 text-purple-500" />;
      case 'objetivo':
        return <Target className="w-5 h-5 text-indigo-500" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTipoLabel = (tipo: TipoHito): string => {
    switch (tipo) {
      case 'sesion-critica':
        return 'Sesión Crítica';
      case 'revision':
        return 'Revisión';
      case 'competicion':
        return 'Competición';
      case 'tarea-pendiente':
        return 'Tarea';
      case 'objetivo':
        return 'Objetivo';
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: TipoHito): 'blue' | 'green' | 'amber' | 'purple' | 'indigo' => {
    switch (tipo) {
      case 'sesion-critica':
        return 'blue';
      case 'revision':
        return 'green';
      case 'competicion':
        return 'amber';
      case 'tarea-pendiente':
        return 'purple';
      case 'objetivo':
        return 'indigo';
      default:
        return 'blue';
    }
  };

  const getPrioridadColor = (prioridad: 'alta' | 'media' | 'baja'): 'destructive' | 'secondary' | 'default' => {
    switch (prioridad) {
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

  const formatFecha = (fecha: Date): string => {
    const ahora = new Date();
    const diffTime = fecha.getTime() - ahora.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Mañana';
    } else if (diffDays < 7) {
      return `En ${diffDays} días`;
    } else if (diffDays < 30) {
      const semanas = Math.floor(diffDays / 7);
      return `En ${semanas} semana${semanas > 1 ? 's' : ''}`;
    } else {
      return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  const handleCompletar = (hitoId: string) => {
    setHitos(prev => prev.map(h => h.id === hitoId ? { ...h, completado: true } : h));
    onCompletarHito?.(hitoId);
  };

  const handleDescartar = (hitoId: string) => {
    setDiscardedHitos(prev => new Set(prev).add(hitoId));
    onDescartarHito?.(hitoId);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Cargando hitos...</div>
      </Card>
    );
  }

  if (hitosProximos.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Línea de Tiempo de Hitos</h3>
        </div>
        <div className="text-center text-gray-500 py-8">
          No hay hitos próximos en los próximos 30 días
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Línea de Tiempo de Hitos</h3>
        </div>
        <Badge size="sm" variant="secondary">
          {hitosProximos.length} próximos
        </Badge>
      </div>

      <div className="space-y-3">
        {hitosProximos.map((hito) => {
          const tipoColor = getTipoColor(hito.tipo);
          const prioridadColor = getPrioridadColor(hito.prioridad);
          const esUrgente = hito.prioridad === 'alta' && hito.fecha.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;

          return (
            <div
              key={hito.id}
              className={`relative flex items-start gap-3 p-4 rounded-lg border-2 transition hover:shadow-md ${
                esUrgente
                  ? 'border-red-300 bg-red-50/50'
                  : tipoColor === 'blue'
                  ? 'border-blue-200 bg-blue-50/30'
                  : tipoColor === 'green'
                  ? 'border-green-200 bg-green-50/30'
                  : tipoColor === 'amber'
                  ? 'border-amber-200 bg-amber-50/30'
                  : tipoColor === 'purple'
                  ? 'border-purple-200 bg-purple-50/30'
                  : 'border-indigo-200 bg-indigo-50/30'
              }`}
            >
              {/* Línea vertical del timeline */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Icono del hito */}
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 shadow-sm flex-shrink-0">
                {getTipoIcon(hito.tipo)}
              </div>

              {/* Contenido del hito */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-semibold text-gray-900">{hito.titulo}</h4>
                  <Badge variant={tipoColor} size="xs">
                    {getTipoLabel(hito.tipo)}
                  </Badge>
                  <Badge variant={prioridadColor} size="xs">
                    {hito.prioridad}
                  </Badge>
                  {esUrgente && (
                    <Badge variant="destructive" size="xs">
                      Urgente
                    </Badge>
                  )}
                </div>

                {hito.descripcion && (
                  <p className="text-sm text-gray-600 mb-2">{hito.descripcion}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatFecha(hito.fecha)}</span>
                  </div>
                  {hito.clienteNombre && (
                    <div className="flex items-center gap-1">
                      <span>Cliente: {hito.clienteNombre}</span>
                    </div>
                  )}
                  {hito.metadata?.duracionMinutos && (
                    <div className="flex items-center gap-1">
                      <span>{hito.metadata.duracionMinutos} min</span>
                    </div>
                  )}
                </div>

                {/* Metadata específica */}
                {hito.metadata?.tipoRevision && (
                  <Badge size="xs" variant="secondary" className="text-[10px]">
                    Revisión {hito.metadata.tipoRevision}
                  </Badge>
                )}

                {hito.metadata?.tipoCompeticion && (
                  <Badge size="xs" variant="secondary" className="text-[10px]">
                    {hito.metadata.tipoCompeticion}
                  </Badge>
                )}

                {hito.metadata?.accionRequerida && (
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Acción:</strong> {hito.metadata.accionRequerida}
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleCompletar(hito.id)}
                    className="h-7 text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completar
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onHitoClick?.(hito)}
                    className="h-7 text-xs"
                  >
                    Ver detalles
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDescartar(hito.id)}
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hitosProximos.length >= 10 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Mostrando los 10 hitos más próximos. Hay más hitos en el futuro.
        </div>
      )}
    </Card>
  );
}

