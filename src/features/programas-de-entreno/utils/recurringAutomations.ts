/**
 * Sistema de automatizaciones recurrentes
 * User Story: Como coach quiero programar automatizaciones recurrentes (p. ej. cada lunes recalcular objetivos,
 * cada semana refrescar finisher), para mantener el plan actualizado automáticamente.
 */

import type {
  AutomatizacionRecurrente,
  ConfiguracionRecurrencia,
  AccionAutomatizacion,
  FrecuenciaRecurrencia,
} from '../types';

const STORAGE_KEY = 'recurring-automations';

/**
 * Obtener todas las automatizaciones recurrentes
 */
export function obtenerAutomatizaciones(): AutomatizacionRecurrente[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando automatizaciones:', error);
  }
  return [];
}

/**
 * Guardar automatizaciones recurrentes
 */
export function guardarAutomatizaciones(automatizaciones: AutomatizacionRecurrente[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(automatizaciones));
  } catch (error) {
    console.warn('Error guardando automatizaciones:', error);
  }
}

/**
 * Crear una nueva automatización recurrente
 */
export function crearAutomatizacion(
  automatizacion: Omit<AutomatizacionRecurrente, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'totalEjecuciones' | 'errores' | 'proximaEjecucion'>
): AutomatizacionRecurrente {
  const nuevaAutomatizacion: AutomatizacionRecurrente = {
    ...automatizacion,
    id: `automation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    totalEjecuciones: 0,
    errores: 0,
    proximaEjecucion: calcularProximaEjecucion(automatizacion.configuracion),
  };

  const automatizaciones = obtenerAutomatizaciones();
  automatizaciones.push(nuevaAutomatizacion);
  guardarAutomatizaciones(automatizaciones);

  return nuevaAutomatizacion;
}

/**
 * Actualizar una automatización recurrente
 */
export function actualizarAutomatizacion(
  id: string,
  actualizaciones: Partial<AutomatizacionRecurrente>
): AutomatizacionRecurrente | null {
  const automatizaciones = obtenerAutomatizaciones();
  const index = automatizaciones.findIndex((a) => a.id === id);

  if (index === -1) return null;

  automatizaciones[index] = {
    ...automatizaciones[index],
    ...actualizaciones,
    fechaActualizacion: new Date().toISOString(),
  };

  // Recalcular próxima ejecución si cambió la configuración
  if (actualizaciones.configuracion) {
    automatizaciones[index].proximaEjecucion = calcularProximaEjecucion(
      automatizaciones[index].configuracion
    );
  }

  guardarAutomatizaciones(automatizaciones);
  return automatizaciones[index];
}

/**
 * Eliminar una automatización recurrente
 */
export function eliminarAutomatizacion(id: string): boolean {
  const automatizaciones = obtenerAutomatizaciones();
  const filtradas = automatizaciones.filter((a) => a.id !== id);

  if (filtradas.length === automatizaciones.length) return false;

  guardarAutomatizaciones(filtradas);
  return true;
}

/**
 * Calcular la próxima fecha de ejecución basada en la configuración
 */
export function calcularProximaEjecucion(
  configuracion: ConfiguracionRecurrencia
): string {
  const ahora = new Date();
  const proximaEjecucion = new Date(ahora);

  // Si hay fecha de inicio y es futura, usar esa
  if (configuracion.fechaInicio) {
    const fechaInicio = new Date(configuracion.fechaInicio);
    if (fechaInicio > ahora) {
      return fechaInicio.toISOString();
    }
  }

  switch (configuracion.frecuencia) {
    case 'diaria':
      proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);
      break;

    case 'semanal':
      if (configuracion.diaSemana) {
        const diasMap: Record<string, number> = {
          domingo: 0,
          lunes: 1,
          martes: 2,
          miercoles: 3,
          jueves: 4,
          viernes: 5,
          sabado: 6,
        };
        const diaObjetivo = diasMap[configuracion.diaSemana];
        const diaActual = ahora.getDay();
        let diasHastaProximo = (diaObjetivo - diaActual + 7) % 7;
        if (diasHastaProximo === 0) {
          diasHastaProximo = 7; // Si es hoy, programar para la próxima semana
        }
        proximaEjecucion.setDate(proximaEjecucion.getDate() + diasHastaProximo);
      } else {
        proximaEjecucion.setDate(proximaEjecucion.getDate() + 7);
      }
      break;

    case 'mensual':
      if (configuracion.diaMes) {
        proximaEjecucion.setDate(configuracion.diaMes);
        if (proximaEjecucion <= ahora) {
          proximaEjecucion.setMonth(proximaEjecucion.getMonth() + 1);
        }
      } else {
        proximaEjecucion.setMonth(proximaEjecucion.getMonth() + 1);
      }
      break;

    case 'personalizada':
      if (configuracion.intervalo) {
        proximaEjecucion.setDate(proximaEjecucion.getDate() + configuracion.intervalo);
      } else {
        proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);
      }
      break;
  }

  // Aplicar hora si está configurada
  if (configuracion.hora) {
    const [horas, minutos] = configuracion.hora.split(':').map(Number);
    proximaEjecucion.setHours(horas || 0, minutos || 0, 0, 0);
  } else {
    // Por defecto, ejecutar a las 8:00 AM
    proximaEjecucion.setHours(8, 0, 0, 0);
  }

  return proximaEjecucion.toISOString();
}

/**
 * Verificar si una automatización debe ejecutarse ahora
 */
export function debeEjecutarse(automatizacion: AutomatizacionRecurrente): boolean {
  if (!automatizacion.activa) return false;

  const ahora = new Date();
  const proximaEjecucion = automatizacion.proximaEjecucion
    ? new Date(automatizacion.proximaEjecucion)
    : null;

  if (!proximaEjecucion) return false;

  // Verificar fecha de fin
  if (automatizacion.configuracion.fechaFin) {
    const fechaFin = new Date(automatizacion.configuracion.fechaFin);
    if (ahora > fechaFin) return false;
  }

  // Verificar si es hora de ejecutar
  return ahora >= proximaEjecucion;
}

/**
 * Obtener automatizaciones que deben ejecutarse
 */
export function obtenerAutomatizacionesPendientes(): AutomatizacionRecurrente[] {
  const automatizaciones = obtenerAutomatizaciones();
  return automatizaciones.filter(debeEjecutarse);
}

/**
 * Ejecutar una automatización
 */
export async function ejecutarAutomatizacion(
  automatizacion: AutomatizacionRecurrente
): Promise<{ exito: boolean; error?: string }> {
  try {
    // Aquí se ejecutarían las acciones reales
    // Por ahora, simulamos la ejecución
    for (const accion of automatizacion.acciones) {
      await ejecutarAccion(accion);
    }

    // Actualizar la automatización
    const proximaEjecucion = calcularProximaEjecucion(automatizacion.configuracion);
    actualizarAutomatizacion(automatizacion.id, {
      ultimaEjecucion: new Date().toISOString(),
      proximaEjecucion,
      totalEjecuciones: automatizacion.totalEjecuciones + 1,
    });

    return { exito: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    actualizarAutomatizacion(automatizacion.id, {
      errores: automatizacion.errores + 1,
    });
    return { exito: false, error: errorMessage };
  }
}

/**
 * Ejecutar una acción específica
 */
async function ejecutarAccion(accion: AccionAutomatizacion): Promise<void> {
  switch (accion.tipo) {
    case 'recalcular_objetivos':
      // Aquí se implementaría la lógica para recalcular objetivos
      console.log('Ejecutando: Recalcular objetivos', accion.parametros);
      break;

    case 'refrescar_finisher':
      // Aquí se implementaría la lógica para refrescar finisher
      console.log('Ejecutando: Refrescar finisher', accion.parametros);
      break;

    case 'actualizar_intensidad':
      // Aquí se implementaría la lógica para actualizar intensidad
      console.log('Ejecutando: Actualizar intensidad', accion.parametros);
      break;

    case 'ajustar_volumen':
      // Aquí se implementaría la lógica para ajustar volumen
      console.log('Ejecutando: Ajustar volumen', accion.parametros);
      break;

    case 'aplicar_reglas':
      // Aquí se implementaría la lógica para aplicar reglas
      console.log('Ejecutando: Aplicar reglas', accion.parametros);
      break;

    case 'enviar_recordatorio':
      // Aquí se implementaría la lógica para enviar recordatorio
      console.log('Ejecutando: Enviar recordatorio', accion.parametros);
      break;

    case 'generar_reporte':
      // Aquí se implementaría la lógica para generar reporte
      console.log('Ejecutando: Generar reporte', accion.parametros);
      break;

    case 'personalizada':
      // Acción personalizada
      console.log('Ejecutando: Acción personalizada', accion.parametros);
      break;

    default:
      console.warn('Tipo de acción desconocido:', accion.tipo);
  }
}

/**
 * Ejecutar todas las automatizaciones pendientes
 */
export async function ejecutarAutomatizacionesPendientes(): Promise<{
  ejecutadas: number;
  exitosas: number;
  fallidas: number;
}> {
  const pendientes = obtenerAutomatizacionesPendientes();
  let exitosas = 0;
  let fallidas = 0;

  for (const automatizacion of pendientes) {
    const resultado = await ejecutarAutomatizacion(automatizacion);
    if (resultado.exito) {
      exitosas++;
    } else {
      fallidas++;
    }
  }

  return {
    ejecutadas: pendientes.length,
    exitosas,
    fallidas,
  };
}

/**
 * Formatear descripción de frecuencia
 */
export function formatearFrecuencia(configuracion: ConfiguracionRecurrencia): string {
  const hora = configuracion.hora || '08:00';
  
  switch (configuracion.frecuencia) {
    case 'diaria':
      return `Diariamente a las ${hora}`;
    case 'semanal':
      if (configuracion.diaSemana) {
        const diaCapitalizado = configuracion.diaSemana.charAt(0).toUpperCase() + configuracion.diaSemana.slice(1);
        return `Cada ${diaCapitalizado} a las ${hora}`;
      }
      return `Semanalmente a las ${hora}`;
    case 'mensual':
      if (configuracion.diaMes) {
        return `El día ${configuracion.diaMes} de cada mes a las ${hora}`;
      }
      return `Mensualmente a las ${hora}`;
    case 'personalizada':
      if (configuracion.intervalo) {
        return `Cada ${configuracion.intervalo} días a las ${hora}`;
      }
      return `Personalizada a las ${hora}`;
    default:
      return 'Frecuencia no especificada';
  }
}

