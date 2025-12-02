/**
 * Utilidades para calcular métricas de programas de entrenamiento
 * User Story: Como coach quiero simular el resultado de un conjunto de reglas y ver métricas antes de aplicarlas
 */

import type { DayPlan, DaySession, MetricasPrograma } from '../types';

/**
 * Extraer número de una cadena (ej: "40 min" -> 40)
 */
function parseFirstNumber(str: string | undefined): number | null {
  if (!str) return null;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Clasificar intensidad de una sesión
 */
function clasificarIntensidad(intensity: string): 'baja' | 'media' | 'alta' {
  const intensityLower = intensity.toLowerCase();
  
  // Buscar RPE
  const rpeMatch = intensity.match(/rpe\s*(\d+(?:\.\d+)?)/i);
  if (rpeMatch) {
    const rpe = parseFloat(rpeMatch[1]);
    if (rpe <= 6) return 'baja';
    if (rpe <= 8) return 'media';
    return 'alta';
  }
  
  // Buscar palabras clave
  if (intensityLower.includes('ligera') || intensityLower.includes('baja') || intensityLower.includes('low')) {
    return 'baja';
  }
  if (intensityLower.includes('alta') || intensityLower.includes('high') || intensityLower.includes('máxima')) {
    return 'alta';
  }
  
  return 'media';
}

/**
 * Calcular métricas de un programa semanal
 */
export function calcularMetricasPrograma(
  weeklyPlan: Record<string, DayPlan>
): MetricasPrograma {
  let volumenTotal = 0;
  let caloriasTotales = 0;
  let duracionTotal = 0;
  const distribucionModalidades: Record<string, number> = {};
  const sesionesPorDia: Record<string, number> = {};
  const intensidades: { baja: number; media: number; alta: number } = {
    baja: 0,
    media: 0,
    alta: 0,
  };
  let totalSesiones = 0;

  Object.entries(weeklyPlan).forEach(([dia, dayPlan]) => {
    const sessions = dayPlan.sessions || [];
    sesionesPorDia[dia] = sessions.length;
    totalSesiones += sessions.length;

    // Calcular volumen del día (series o ejercicios)
    const volumenDia = parseFirstNumber(dayPlan.volume) || sessions.length * 3;
    volumenTotal += volumenDia;

    // Calcular duración y calorías
    sessions.forEach((session) => {
      const duracionMinutos = parseFirstNumber(session.duration) || 0;
      duracionTotal += duracionMinutos;
      
      // Estimar calorías: ~8 calorías por minuto de ejercicio
      caloriasTotales += Math.round(duracionMinutos * 8);

      // Distribución de modalidades
      const modalidad = session.modality || 'Sin especificar';
      distribucionModalidades[modalidad] = (distribucionModalidades[modalidad] || 0) + 1;

      // Clasificar intensidad
      const intensidad = clasificarIntensidad(session.intensity);
      intensidades[intensidad]++;
    });
  });

  // Calcular porcentajes de intensidad
  const balanceIntensidades = {
    baja: totalSesiones > 0 ? (intensidades.baja / totalSesiones) * 100 : 0,
    media: totalSesiones > 0 ? (intensidades.media / totalSesiones) * 100 : 0,
    alta: totalSesiones > 0 ? (intensidades.alta / totalSesiones) * 100 : 0,
  };

  return {
    volumenTotal,
    caloriasTotales,
    duracionTotal,
    balanceIntensidades,
    distribucionModalidades,
    sesionesPorDia,
  };
}

/**
 * Calcular diferencia entre dos métricas
 */
export function calcularDiferenciaMetricas(
  originales: MetricasPrograma,
  simuladas: MetricasPrograma
) {
  return {
    volumenTotal: simuladas.volumenTotal - originales.volumenTotal,
    caloriasTotales: simuladas.caloriasTotales - originales.caloriasTotales,
    duracionTotal: simuladas.duracionTotal - originales.duracionTotal,
    balanceIntensidades: {
      baja: simuladas.balanceIntensidades.baja - originales.balanceIntensidades.baja,
      media: simuladas.balanceIntensidades.media - originales.balanceIntensidades.media,
      alta: simuladas.balanceIntensidades.alta - originales.balanceIntensidades.alta,
    },
  };
}

