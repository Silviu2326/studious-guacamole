import type { DayPlan, RespuestasCuestionario, TipoColumnas } from '../types';

/**
 * Aplica la configuración del cuestionario al layout del programa
 * Regenera columnas, cálculos y resúmenes según las respuestas
 */
export function aplicarConfiguracionLayout(
  weeklyPlan: Record<string, DayPlan>,
  respuestas: RespuestasCuestionario
): {
  weeklyPlan: Record<string, DayPlan>;
  columnasVisibles: TipoColumnas[];
  calculos: string[];
  resumenes: string[];
} {
  // Determinar columnas visibles basadas en las preferencias
  const columnasVisibles: TipoColumnas[] = [...respuestas.columnasPreferidas];

  // Si hay énfasis en tonelaje, asegurar que las columnas de tonelaje estén incluidas
  if (respuestas.enfasisTonelaje && !columnasVisibles.includes('tonelaje')) {
    columnasVisibles.push('tonelaje');
  }

  // Si hay énfasis en movilidad pero se quiere menos, remover algunas columnas de movilidad
  if (respuestas.enfasisMovilidad && columnasVisibles.includes('movilidad')) {
    // Mantener movilidad pero con menos énfasis
  }

  // Extraer cálculos activos
  const calculos = Object.entries(respuestas.calculosNecesarios)
    .filter(([_, activo]) => activo)
    .map(([key]) => key);

  // Extraer resúmenes activos
  const resumenes = Object.entries(respuestas.resumenesNecesarios)
    .filter(([_, activo]) => activo)
    .map(([key]) => key);

  // Aplicar cambios al plan semanal si es necesario
  // Por ejemplo, agregar campos adicionales a las sesiones según las columnas seleccionadas
  const planActualizado: Record<string, DayPlan> = { ...weeklyPlan };

  // Si se necesita tonelaje, asegurar que las sesiones tengan información de peso
  if (columnasVisibles.includes('tonelaje')) {
    Object.keys(planActualizado).forEach((day) => {
      planActualizado[day] = {
        ...planActualizado[day],
        sessions: planActualizado[day].sessions.map((session) => {
          // Si no tiene peso, agregar un valor por defecto o mantener undefined
          return session;
        }),
      };
    });
  }

  return {
    weeklyPlan: planActualizado,
    columnasVisibles,
    calculos,
    resumenes,
  };
}

