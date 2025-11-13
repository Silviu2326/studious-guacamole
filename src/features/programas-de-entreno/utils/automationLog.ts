/**
 * Sistema de logging detallado para automatizaciones
 * User Story: Como coach quiero disponer de un log detallado de cada automatización aplicada,
 * indicando qué elementos cambió y bajo qué condiciones, para auditar ediciones en caso de duda.
 */

import type { DayPlan, DaySession } from '../types';
import type { ReglaInteligente } from './intelligentRules';

export type TipoAutomatizacion = 
  | 'regla_inteligente' 
  | 'bulk_automation' 
  | 'regla_encadenada' 
  | 'automatizacion_recurrente'
  | 'sustitucion_manual'
  | 'batch_operation';

export type TipoCambio = 
  | 'sesion_agregada'
  | 'sesion_eliminada'
  | 'sesion_modificada'
  | 'sesion_movida'
  | 'sesion_duplicada'
  | 'propiedad_modificada'
  | 'dia_modificado';

export interface CambioDetallado {
  tipo: TipoCambio;
  dia?: string;
  sesionId?: string;
  sesionNombre?: string;
  propiedad?: string; // 'block', 'modality', 'intensity', 'duration', 'notes', etc.
  valorAnterior?: string | number | boolean;
  valorNuevo?: string | number | boolean;
  detalles?: Record<string, any>; // Información adicional del cambio
}

export interface CondicionAplicada {
  tipo: string; // Tipo de condición (lesion, patron, modalidad, etc.)
  operador?: string;
  valor: string | number;
  resultado: boolean; // Si la condición se cumplió
}

export interface LogAutomatizacion {
  id: string;
  tipo: TipoAutomatizacion;
  nombre: string; // Nombre de la automatización/regla aplicada
  descripcion?: string;
  programaId?: string;
  clienteId?: string;
  fechaAplicacion: string;
  aplicadoPor: string; // ID del usuario que aplicó la automatización
  condiciones: CondicionAplicada[]; // Condiciones bajo las que se aplicó
  cambios: CambioDetallado[]; // Lista detallada de cambios realizados
  contexto?: {
    lesiones?: string[];
    equipamiento?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
  };
  resultado: {
    sesionesAfectadas: number;
    diasAfectados: number;
    exito: boolean;
    errores?: string[];
  };
  metadata?: Record<string, any>; // Información adicional
}

const STORAGE_KEY = 'automation-logs';

/**
 * Obtener todos los logs de automatizaciones
 */
export function obtenerLogsAutomatizaciones(
  filtros?: {
    programaId?: string;
    clienteId?: string;
    tipo?: TipoAutomatizacion;
    fechaDesde?: string;
    fechaHasta?: string;
  }
): LogAutomatizacion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    let logs: LogAutomatizacion[] = JSON.parse(stored);
    
    if (filtros) {
      if (filtros.programaId) {
        logs = logs.filter(log => log.programaId === filtros.programaId);
      }
      if (filtros.clienteId) {
        logs = logs.filter(log => log.clienteId === filtros.clienteId);
      }
      if (filtros.tipo) {
        logs = logs.filter(log => log.tipo === filtros.tipo);
      }
      if (filtros.fechaDesde) {
        logs = logs.filter(log => log.fechaAplicacion >= filtros.fechaDesde!);
      }
      if (filtros.fechaHasta) {
        logs = logs.filter(log => log.fechaAplicacion <= filtros.fechaHasta!);
      }
    }
    
    // Ordenar por fecha más reciente primero
    return logs.sort((a, b) => 
      new Date(b.fechaAplicacion).getTime() - new Date(a.fechaAplicacion).getTime()
    );
  } catch (error) {
    console.warn('Error cargando logs de automatizaciones:', error);
    return [];
  }
}

/**
 * Guardar un nuevo log de automatización
 */
export function guardarLogAutomatizacion(log: Omit<LogAutomatizacion, 'id'>): LogAutomatizacion {
  const nuevoLog: LogAutomatizacion = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  const logs = obtenerLogsAutomatizaciones();
  logs.push(nuevoLog);
  
  try {
    // Mantener solo los últimos 1000 logs para evitar problemas de almacenamiento
    const logsLimitados = logs.slice(-1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logsLimitados));
  } catch (error) {
    console.warn('Error guardando log de automatización:', error);
  }
  
  return nuevoLog;
}

/**
 * Crear log para una regla inteligente aplicada
 */
export function crearLogReglaInteligente(
  regla: ReglaInteligente,
  cambios: CambioDetallado[],
  condiciones: CondicionAplicada[],
  contexto: {
    programaId?: string;
    clienteId?: string;
    lesiones?: string[];
    equipamiento?: string[];
    tags?: string[];
  },
  aplicadoPor: string
): LogAutomatizacion {
  const sesionesAfectadas = cambios.filter(c => 
    c.tipo === 'sesion_modificada' || c.tipo === 'sesion_agregada' || c.tipo === 'sesion_eliminada'
  ).length;
  
  const diasAfectados = new Set(cambios.map(c => c.dia).filter(Boolean)).size;
  
  return guardarLogAutomatizacion({
    tipo: 'regla_inteligente',
    nombre: regla.nombre,
    descripcion: regla.descripcion,
    programaId: contexto.programaId,
    clienteId: contexto.clienteId,
    fechaAplicacion: new Date().toISOString(),
    aplicadoPor,
    condiciones,
    cambios,
    contexto: {
      lesiones: contexto.lesiones,
      equipamiento: contexto.equipamiento,
      tags: contexto.tags,
    },
    resultado: {
      sesionesAfectadas,
      diasAfectados,
      exito: true,
    },
    metadata: {
      reglaId: regla.id,
      prioridad: regla.prioridad,
    },
  });
}

/**
 * Crear log para una operación bulk (BulkAutomationFlow)
 */
export function crearLogBulkAutomation(
  operaciones: Array<{
    tipo: 'add' | 'edit' | 'move' | 'duplicate' | 'delete';
    descripcion: string;
    config: any;
  }>,
  cambios: CambioDetallado[],
  programaId?: string,
  clienteId?: string,
  aplicadoPor: string = 'usuario-actual'
): LogAutomatizacion {
  const nombre = operaciones.length === 1 
    ? `Operación: ${operaciones[0].descripcion}`
    : `Flujo de ${operaciones.length} operaciones`;
  
  const descripcion = operaciones.map(op => op.descripcion).join(', ');
  
  const condiciones: CondicionAplicada[] = operaciones.map(op => ({
    tipo: 'operacion_bulk',
    valor: op.tipo,
    resultado: true,
  }));
  
  const sesionesAfectadas = cambios.filter(c => 
    c.tipo !== 'dia_modificado'
  ).length;
  
  const diasAfectados = new Set(cambios.map(c => c.dia).filter(Boolean)).size;
  
  return guardarLogAutomatizacion({
    tipo: 'bulk_automation',
    nombre,
    descripcion,
    programaId,
    clienteId,
    fechaAplicacion: new Date().toISOString(),
    aplicadoPor,
    condiciones,
    cambios,
    resultado: {
      sesionesAfectadas,
      diasAfectados,
      exito: true,
    },
    metadata: {
      operaciones: operaciones.map(op => ({
        tipo: op.tipo,
        config: op.config,
      })),
    },
  });
}

/**
 * Comparar dos planes semanales y generar cambios detallados
 */
export function compararPlanes(
  planAnterior: Record<string, DayPlan>,
  planNuevo: Record<string, DayPlan>,
  dias: readonly string[]
): CambioDetallado[] {
  const cambios: CambioDetallado[] = [];
  
  dias.forEach(dia => {
    const anterior = planAnterior[dia];
    const nuevo = planNuevo[dia];
    
    if (!anterior && nuevo) {
      // Día nuevo
      nuevo.sessions.forEach(sesion => {
        cambios.push({
          tipo: 'sesion_agregada',
          dia,
          sesionId: sesion.id,
          sesionNombre: sesion.block,
        });
      });
      return;
    }
    
    if (anterior && !nuevo) {
      // Día eliminado
      anterior.sessions.forEach(sesion => {
        cambios.push({
          tipo: 'sesion_eliminada',
          dia,
          sesionId: sesion.id,
          sesionNombre: sesion.block,
        });
      });
      return;
    }
    
    if (!anterior || !nuevo) return;
    
    // Comparar sesiones
    const sesionesAnteriores = new Map(anterior.sessions.map(s => [s.id, s]));
    const sesionesNuevas = new Map(nuevo.sessions.map(s => [s.id, s]));
    
    // Sesiones eliminadas
    sesionesAnteriores.forEach((sesion, id) => {
      if (!sesionesNuevas.has(id)) {
        cambios.push({
          tipo: 'sesion_eliminada',
          dia,
          sesionId: id,
          sesionNombre: sesion.block,
        });
      }
    });
    
    // Sesiones nuevas
    sesionesNuevas.forEach((sesion, id) => {
      if (!sesionesAnteriores.has(id)) {
        cambios.push({
          tipo: 'sesion_agregada',
          dia,
          sesionId: id,
          sesionNombre: sesion.block,
        });
      }
    });
    
    // Sesiones modificadas
    sesionesAnteriores.forEach((sesionAnterior, id) => {
      const sesionNueva = sesionesNuevas.get(id);
      if (sesionNueva) {
        // Comparar propiedades
        const propiedades: (keyof DaySession)[] = ['block', 'time', 'duration', 'modality', 'intensity', 'notes'];
        propiedades.forEach(prop => {
          if (sesionAnterior[prop] !== sesionNueva[prop]) {
            cambios.push({
              tipo: 'sesion_modificada',
              dia,
              sesionId: id,
              sesionNombre: sesionAnterior.block,
              propiedad: prop,
              valorAnterior: sesionAnterior[prop],
              valorNuevo: sesionNueva[prop],
            });
          }
        });
        
        // Comparar tags
        const tagsAnteriores = sesionAnterior.tags || [];
        const tagsNuevos = sesionNueva.tags || [];
        if (JSON.stringify(tagsAnteriores.sort()) !== JSON.stringify(tagsNuevos.sort())) {
          cambios.push({
            tipo: 'sesion_modificada',
            dia,
            sesionId: id,
            sesionNombre: sesionAnterior.block,
            propiedad: 'tags',
            valorAnterior: JSON.stringify(tagsAnteriores),
            valorNuevo: JSON.stringify(tagsNuevos),
          });
        }
      }
    });
  });
  
  return cambios;
}

/**
 * Eliminar logs antiguos (más de X días)
 */
export function limpiarLogsAntiguos(dias: number = 90): number {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);
  
  const logs = obtenerLogsAutomatizaciones();
  const logsFiltrados = logs.filter(log => 
    new Date(log.fechaAplicacion) >= fechaLimite
  );
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logsFiltrados));
    return logs.length - logsFiltrados.length;
  } catch (error) {
    console.warn('Error limpiando logs antiguos:', error);
    return 0;
  }
}

