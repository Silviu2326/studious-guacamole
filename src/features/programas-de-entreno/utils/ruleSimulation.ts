/**
 * Utilidades para simular la aplicación de reglas a un programa
 * User Story: Como coach quiero simular el resultado de un conjunto de reglas y ver métricas antes de aplicarlas
 */

import type {
  DayPlan,
  DaySession,
  ReglaEncadenada,
  ResultadoSimulacion,
  ContextoCliente,
} from '../types';
import { aplicarReglasEncadenadas } from './chainedRules';
import { calcularMetricasPrograma, calcularDiferenciaMetricas } from './programMetrics';
import { obtenerReglasEncadenadas } from './chainedRules';

/**
 * Simular la aplicación de reglas seleccionadas a un programa
 */
export function simularReglas(
  weeklyPlan: Record<string, DayPlan>,
  reglasIds: string[],
  contextoCliente?: ContextoCliente,
  programaId?: string,
  clienteId?: string
): ResultadoSimulacion {
  // Crear copia profunda del programa original
  const programaOriginal = JSON.parse(JSON.stringify(weeklyPlan)) as Record<string, DayPlan>;
  const programaSimulado = JSON.parse(JSON.stringify(weeklyPlan)) as Record<string, DayPlan>;

  // Obtener reglas seleccionadas
  const todasLasReglas = obtenerReglasEncadenadas();
  const reglasSeleccionadas = todasLasReglas.filter((r) => reglasIds.includes(r.id));

  // Contador de sesiones modificadas por regla
  const sesionesModificadasPorRegla: Record<string, { nombre: string; count: number }> = {};

  // Aplicar reglas a cada sesión del programa simulado
  Object.entries(programaSimulado).forEach(([dia, dayPlan]) => {
    dayPlan.sessions = dayPlan.sessions.map((session) => {
      let sesionModificada = { ...session };
      let algunaReglaAplicada = false;

      // Aplicar cada regla seleccionada
      for (const regla of reglasSeleccionadas) {
        const resultado = aplicarReglasEncadenadas(sesionModificada, {
          diaPlan: dayPlan,
          contextoCliente,
          programaId,
          clienteId,
        });

        if (resultado.modificado && resultado.sesionModificada) {
          sesionModificada = resultado.sesionModificada;
          algunaReglaAplicada = true;

          // Contar sesiones modificadas por regla
          if (!sesionesModificadasPorRegla[regla.id]) {
            sesionesModificadasPorRegla[regla.id] = {
              nombre: regla.nombre,
              count: 0,
            };
          }
          sesionesModificadasPorRegla[regla.id].count++;
        }
      }

      return sesionModificada;
    });
  });

  // Calcular métricas
  const metricasOriginales = calcularMetricasPrograma(programaOriginal);
  const metricasSimuladas = calcularMetricasPrograma(programaSimulado);
  const diferencias = calcularDiferenciaMetricas(metricasOriginales, metricasSimuladas);

  // Preparar lista de reglas aplicadas
  const reglasAplicadas = Object.entries(sesionesModificadasPorRegla).map(([reglaId, data]) => ({
    reglaId,
    reglaNombre: data.nombre,
    sesionesModificadas: data.count,
  }));

  return {
    programaOriginal,
    programaSimulado,
    metricasOriginales,
    metricasSimuladas,
    diferencias,
    reglasAplicadas,
    fechaSimulacion: new Date().toISOString(),
  };
}

