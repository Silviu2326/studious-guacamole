/**
 * Utilidades para comparar ejercicios con sesiones anteriores
 * User Story: Como coach quiero comparar cualquier ejercicio con su versión en la sesión anterior
 */

import type { DaySession, ComparacionEjercicio, TipoCambio, SesionHistorica } from '../types';

/**
 * Obtiene la sesión anterior para un ejercicio específico
 */
export function obtenerSesionAnterior(
  ejercicioId: string,
  sesionActual: DaySession,
  historialSesiones: SesionHistorica[]
): DaySession | undefined {
  // Ordenar sesiones por fecha (más recientes primero)
  const sesionesOrdenadas = [...historialSesiones].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  // Buscar la sesión anterior que contenga el mismo ejercicio (mismo block o nombre similar)
  for (const sesionHistorica of sesionesOrdenadas) {
    const sesionAnterior = sesionHistorica.dayPlan.sessions.find(
      (s) => s.id === ejercicioId || s.block === sesionActual.block
    );
    
    if (sesionAnterior) {
      return sesionAnterior;
    }
  }

  return undefined;
}

/**
 * Compara dos valores numéricos y determina si es mejora, retroceso o sin cambio
 */
function compararNumerico(
  actual: number | undefined,
  anterior: number | undefined
): { tipo: TipoCambio; cambioPorcentual?: number } {
  if (actual === undefined || anterior === undefined) {
    return { tipo: 'sin_cambio' };
  }

  const cambioPorcentual = ((actual - anterior) / anterior) * 100;
  
  // Umbral del 5% para considerar cambio significativo
  if (Math.abs(cambioPorcentual) < 5) {
    return { tipo: 'sin_cambio', cambioPorcentual };
  }

  // Para series, repeticiones, peso: más es mejor
  // Para descanso: menos es mejor (menos descanso = más intenso)
  if (cambioPorcentual > 0) {
    return { tipo: 'mejora', cambioPorcentual };
  } else {
    return { tipo: 'retroceso', cambioPorcentual };
  }
}

/**
 * Compara dos valores de string
 */
function compararString(
  actual: string | undefined,
  anterior: string | undefined
): TipoCambio {
  if (!actual && !anterior) return 'sin_cambio';
  if (!actual || !anterior) return 'sin_cambio';
  if (actual === anterior) return 'sin_cambio';
  
  // Si hay cambio, consideramos que puede ser mejora o retroceso según contexto
  // Por ahora, cualquier cambio es considerado como cambio
  return 'sin_cambio';
}

/**
 * Compara descanso (menos descanso = mejora para intensidad, pero puede ser retroceso para recuperación)
 */
function compararDescanso(
  actual: number | undefined,
  anterior: number | undefined
): { tipo: TipoCambio; cambioPorcentual?: number } {
  if (actual === undefined || anterior === undefined) {
    return { tipo: 'sin_cambio' };
  }

  const cambioPorcentual = ((actual - anterior) / anterior) * 100;
  
  if (Math.abs(cambioPorcentual) < 5) {
    return { tipo: 'sin_cambio', cambioPorcentual };
  }

  // Menos descanso puede ser mejora (más intenso) o retroceso (menos recuperación)
  // Por ahora, consideramos que menos descanso es mejora (mayor intensidad)
  if (cambioPorcentual < 0) {
    return { tipo: 'mejora', cambioPorcentual };
  } else {
    return { tipo: 'retroceso', cambioPorcentual };
  }
}

/**
 * Compara un ejercicio con su versión anterior
 */
export function compararEjercicio(
  ejercicioId: string,
  ejercicioNombre: string,
  sesionActual: DaySession,
  sesionAnterior?: DaySession
): ComparacionEjercicio {
  const cambios: ComparacionEjercicio['cambios'] = {};
  const mejorasDestacadas: string[] = [];
  const retrocesosDestacados: string[] = [];

  if (!sesionAnterior) {
    return {
      ejercicioId,
      ejercicioNombre,
      sesionActual,
      cambios: {},
      resumen: {
        tieneMejoras: false,
        tieneRetrocesos: false,
        mejorasDestacadas: [],
        retrocesosDestacados: [],
      },
    };
  }

  // Comparar series
  if (sesionActual.series !== undefined || sesionAnterior.series !== undefined) {
    const comparacion = compararNumerico(sesionActual.series, sesionAnterior.series);
    cambios.series = {
      actual: sesionActual.series || 0,
      anterior: sesionAnterior.series,
      tipo: comparacion.tipo,
    };
    
    if (comparacion.tipo === 'mejora') {
      mejorasDestacadas.push(`Series aumentadas de ${sesionAnterior.series} a ${sesionActual.series}`);
    } else if (comparacion.tipo === 'retroceso') {
      retrocesosDestacados.push(`Series disminuidas de ${sesionAnterior.series} a ${sesionActual.series}`);
    }
  }

  // Comparar repeticiones
  if (sesionActual.repeticiones || sesionAnterior.repeticiones) {
    const tipo = compararString(sesionActual.repeticiones, sesionAnterior.repeticiones);
    cambios.repeticiones = {
      actual: sesionActual.repeticiones || '',
      anterior: sesionAnterior.repeticiones,
      tipo,
    };
    
    if (tipo !== 'sin_cambio' && sesionActual.repeticiones && sesionAnterior.repeticiones) {
      mejorasDestacadas.push(`Repeticiones: ${sesionAnterior.repeticiones} → ${sesionActual.repeticiones}`);
    }
  }

  // Comparar peso
  if (sesionActual.peso !== undefined || sesionAnterior.peso !== undefined) {
    const comparacion = compararNumerico(sesionActual.peso, sesionAnterior.peso);
    cambios.peso = {
      actual: sesionActual.peso,
      anterior: sesionAnterior.peso,
      tipo: comparacion.tipo,
      cambioPorcentual: comparacion.cambioPorcentual,
    };
    
    if (comparacion.tipo === 'mejora' && comparacion.cambioPorcentual) {
      mejorasDestacadas.push(
        `Peso aumentado de ${sesionAnterior.peso}kg a ${sesionActual.peso}kg (+${comparacion.cambioPorcentual.toFixed(1)}%)`
      );
    } else if (comparacion.tipo === 'retroceso' && comparacion.cambioPorcentual) {
      retrocesosDestacados.push(
        `Peso disminuido de ${sesionAnterior.peso}kg a ${sesionActual.peso}kg (${comparacion.cambioPorcentual.toFixed(1)}%)`
      );
    }
  }

  // Comparar tempo
  if (sesionActual.tempo || sesionAnterior.tempo) {
    const tipo = compararString(sesionActual.tempo, sesionAnterior.tempo);
    cambios.tempo = {
      actual: sesionActual.tempo,
      anterior: sesionAnterior.tempo,
      tipo,
    };
    
    if (tipo !== 'sin_cambio' && sesionActual.tempo && sesionAnterior.tempo) {
      mejorasDestacadas.push(`Tempo modificado: ${sesionAnterior.tempo} → ${sesionActual.tempo}`);
    }
  }

  // Comparar descanso
  if (sesionActual.descanso !== undefined || sesionAnterior.descanso !== undefined) {
    const comparacion = compararDescanso(sesionActual.descanso, sesionAnterior.descanso);
    cambios.descanso = {
      actual: sesionActual.descanso,
      anterior: sesionAnterior.descanso,
      tipo: comparacion.tipo,
      cambioPorcentual: comparacion.cambioPorcentual,
    };
    
    if (comparacion.tipo === 'mejora' && comparacion.cambioPorcentual) {
      mejorasDestacadas.push(
        `Descanso reducido de ${sesionAnterior.descanso}s a ${sesionActual.descanso}s (mayor intensidad)`
      );
    } else if (comparacion.tipo === 'retroceso' && comparacion.cambioPorcentual) {
      retrocesosDestacados.push(
        `Descanso aumentado de ${sesionAnterior.descanso}s a ${sesionActual.descanso}s`
      );
    }
  }

  // Comparar material alternativo
  if (sesionActual.materialAlternativo || sesionAnterior.materialAlternativo) {
    const tipo = compararString(sesionActual.materialAlternativo, sesionAnterior.materialAlternativo);
    cambios.materialAlternativo = {
      actual: sesionActual.materialAlternativo,
      anterior: sesionAnterior.materialAlternativo,
      tipo,
    };
    
    if (tipo !== 'sin_cambio' && sesionActual.materialAlternativo && sesionAnterior.materialAlternativo) {
      mejorasDestacadas.push(
        `Material alternativo: ${sesionAnterior.materialAlternativo} → ${sesionActual.materialAlternativo}`
      );
    }
  }

  return {
    ejercicioId,
    ejercicioNombre,
    sesionActual,
    sesionAnterior,
    cambios,
    resumen: {
      tieneMejoras: mejorasDestacadas.length > 0,
      tieneRetrocesos: retrocesosDestacados.length > 0,
      mejorasDestacadas,
      retrocesosDestacados,
    },
  };
}

/**
 * Obtiene el historial de sesiones desde localStorage (mock)
 * En producción, esto vendría de una API
 */
export function obtenerHistorialSesiones(clienteId?: string): SesionHistorica[] {
  try {
    const stored = localStorage.getItem(`historial-sesiones-${clienteId || 'default'}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando historial de sesiones:', error);
  }
  return [];
}

/**
 * Guarda una sesión en el historial
 */
export function guardarSesionEnHistorial(sesion: SesionHistorica): void {
  try {
    const historial = obtenerHistorialSesiones(sesion.clienteId);
    historial.push(sesion);
    // Mantener solo las últimas 50 sesiones
    const historialLimitado = historial.slice(-50);
    localStorage.setItem(
      `historial-sesiones-${sesion.clienteId || 'default'}`,
      JSON.stringify(historialLimitado)
    );
  } catch (error) {
    console.warn('Error guardando sesión en historial:', error);
  }
}

