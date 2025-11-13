import { Programa } from './programas';
import { DayPlan } from '../types';
import { generarPlanMovilidad } from '../utils/riskDetection';
import { duplicarPrograma } from './programas';

export type MomentoPrograma = 
  | 'recien-creado' // Programa recién creado, no publicado
  | 'inicio' // Primera semana del programa
  | 'en-progreso' // Programa en curso, semana 2+
  | 'cerca-final' // Última semana del programa
  | 'finalizado'; // Programa finalizado

export interface AccionRapidaContextual {
  id: string;
  label: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  momentoPrograma: MomentoPrograma[];
  prioridad: 'alta' | 'media' | 'baja';
  accion: () => Promise<void>;
}

/**
 * Determina el momento del programa basado en las fechas y estado
 */
export function determinarMomentoPrograma(programa: Programa, weeklyPlan?: Record<string, DayPlan>): MomentoPrograma {
  if (!programa.fechaCreacion) {
    return 'recien-creado';
  }

  if (programa.estado === 'borrador') {
    return 'recien-creado';
  }

  if (!programa.activo) {
    return 'finalizado';
  }

  const ahora = new Date();
  const fechaCreacion = new Date(programa.fechaCreacion);
  
  // Calcular días transcurridos
  const diasTranscurridos = Math.floor(
    (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Si tiene duración en semanas, calcular si está cerca del final
  if (programa.duracionSemanas) {
    const diasTotales = programa.duracionSemanas * 7;
    const diasRestantes = diasTotales - diasTranscurridos;

    if (diasRestantes <= 7 && diasRestantes > 0) {
      return 'cerca-final';
    }

    if (diasRestantes <= 0) {
      return 'finalizado';
    }
  }

  if (diasTranscurridos < 7) {
    return 'inicio';
  }

  return 'en-progreso';
}

/**
 * Duplica la semana actual de un programa
 */
export async function duplicarSemanaPrograma(programa: Programa, weeklyPlan: Record<string, DayPlan>): Promise<void> {
  try {
    const nuevoNombre = `${programa.nombre} - Semana ${new Date().toLocaleDateString('es-ES', { week: 'numeric' })}`;
    const programaDuplicado = await duplicarPrograma(programa.id, nuevoNombre);
    
    if (programaDuplicado) {
      // Aquí podrías actualizar el plan semanal del programa duplicado
      console.log('Semana duplicada:', programaDuplicado);
      alert(`Semana duplicada exitosamente. Nuevo programa: ${programaDuplicado.nombre}`);
    } else {
      alert('Error al duplicar la semana');
    }
  } catch (error) {
    console.error('Error duplicando semana:', error);
    alert('Error al duplicar la semana');
  }
}

/**
 * Genera un plan de movilidad para un programa
 */
export async function generarPlanMovilidadPrograma(
  programa: Programa,
  weeklyPlan: Record<string, DayPlan>
): Promise<void> {
  try {
    // Analizar grupos musculares trabajados en la semana
    const gruposMusculares: string[] = [];
    Object.values(weeklyPlan).forEach((dayPlan) => {
      dayPlan.sessions.forEach((session) => {
        if (session.gruposMusculares) {
          session.gruposMusculares.forEach((grupo) => {
            if (!gruposMusculares.includes(grupo)) {
              gruposMusculares.push(grupo);
            }
          });
        }
      });
    });

    // Generar plan de movilidad
    const planMovilidad = generarPlanMovilidad(gruposMusculares as any);
    
    // Aquí podrías guardar el plan de movilidad o mostrarlo en un modal
    console.log('Plan de movilidad generado:', planMovilidad);
    alert(`Plan de movilidad generado para: ${planMovilidad.nombre}`);
  } catch (error) {
    console.error('Error generando plan de movilidad:', error);
    alert('Error al generar el plan de movilidad');
  }
}

/**
 * Envía resumen del programa al cliente
 */
export async function enviarResumenClientePrograma(programa: Programa): Promise<void> {
  try {
    // Simular envío de resumen
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En producción, aquí harías una llamada a la API para enviar el resumen
    console.log('Enviando resumen a cliente:', programa.clienteId);
    const clienteNombre = programa.clienteId || 'el cliente';
    alert(`Resumen del programa "${programa.nombre}" enviado a ${clienteNombre}`);
  } catch (error) {
    console.error('Error enviando resumen:', error);
    alert('Error al enviar el resumen');
  }
}

/**
 * Obtiene las acciones rápidas contextuales disponibles para un programa
 */
export function getAccionesRapidasContextuales(
  programa: Programa,
  weeklyPlan?: Record<string, DayPlan>,
  onAccionCompletada?: () => void
): AccionRapidaContextual[] {
  const momento = determinarMomentoPrograma(programa, weeklyPlan);
  const tienePlanSemanal = weeklyPlan && Object.keys(weeklyPlan).length > 0;

  const acciones: AccionRapidaContextual[] = [
    {
      id: 'duplicar-semana',
      label: 'Duplicar Semana',
      descripcion: 'Crea una copia de esta semana para la próxima',
      icono: 'Copy',
      disponible: momento !== 'finalizado' && momento !== 'recien-creado' && tienePlanSemanal,
      momentoPrograma: ['inicio', 'en-progreso', 'cerca-final'],
      prioridad: 'alta',
      accion: async () => {
        if (weeklyPlan) {
          await duplicarSemanaPrograma(programa, weeklyPlan);
        }
        onAccionCompletada?.();
      },
    },
    {
      id: 'generar-plan-movilidad',
      label: 'Generar Plan de Movilidad',
      descripcion: 'Genera un plan de movilidad basado en los grupos musculares trabajados',
      icono: 'Activity',
      disponible: momento !== 'finalizado' && tienePlanSemanal,
      momentoPrograma: ['inicio', 'en-progreso', 'cerca-final'],
      prioridad: 'media',
      accion: async () => {
        if (weeklyPlan) {
          await generarPlanMovilidadPrograma(programa, weeklyPlan);
        }
        onAccionCompletada?.();
      },
    },
    {
      id: 'enviar-resumen-cliente',
      label: 'Enviar Resumen al Cliente',
      descripcion: 'Envía un resumen del programa de entrenamiento al cliente',
      icono: 'Send',
      disponible: momento !== 'recien-creado' && programa.clienteId !== undefined,
      momentoPrograma: ['inicio', 'en-progreso', 'cerca-final', 'finalizado'],
      prioridad: 'media',
      accion: async () => {
        await enviarResumenClientePrograma(programa);
        onAccionCompletada?.();
      },
    },
  ];

  // Filtrar acciones disponibles según el momento del programa
  return acciones
    .filter(accion => accion.disponible && accion.momentoPrograma.includes(momento))
    .sort((a, b) => {
      const prioridadOrder = { alta: 3, media: 2, baja: 1 };
      return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    });
}

