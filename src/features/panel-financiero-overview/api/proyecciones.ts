// API service para Proyecciones Financieras
// En producción, estas llamadas se harían a un backend real

import { ProyeccionFinanciera, RolFinanciero, NivelConfianza, EscenarioProyeccion } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Filtros opcionales para obtener proyecciones financieras
 */
export interface FiltrosProyecciones {
  /** Número de períodos a proyectar (por defecto 6, rango recomendado 3-6) */
  cantidadPeriodos?: number;
  /** Incluir escenarios optimista y pesimista además del base (por defecto false) */
  incluirEscenariosAlternativos?: boolean;
  /** Mes de inicio para las proyecciones (por defecto mes siguiente al actual) */
  mesInicio?: number;
  /** Año de inicio para las proyecciones (por defecto año actual o siguiente si estamos en diciembre) */
  anioInicio?: number;
}

export const proyeccionesApi = {
  // Obtener proyecciones futuras
  async obtenerProyecciones(
    rol: 'entrenador' | 'gimnasio',
    meses: number = 6
  ): Promise<ProyeccionFinanciera[]> {
    await delay(700);
    const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
    const baseGastos = rol === 'entrenador' ? 0 : 32400;
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ahora = new Date();
    
    return Array.from({ length: meses }, (_, i) => {
      const indice = (ahora.getMonth() + i + 1) % 12;
      const factorCrecimiento = 1 + i * 0.03; // Crecimiento del 3% por mes
      const variacion = (Math.random() * 0.1 - 0.05); // Variación de ±5%
      const ingresos = baseIngresos * factorCrecimiento * (1 + variacion);
      const gastos = baseGastos * (1 + variacion * 0.5); // Gastos más estables
      return {
        periodo: nombresMeses[indice],
        ingresos: Math.round(ingresos),
        gastos: Math.round(gastos),
        beneficio: Math.round(ingresos - gastos),
        confianza: 75 + Math.random() * 20 // 75-95%
      };
    });
  },

  // Generar proyección personalizada
  async generarProyeccion(
    rol: 'entrenador' | 'gimnasio',
    parametros: Record<string, any>
  ): Promise<ProyeccionFinanciera> {
    await delay(800);
    const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
    const baseGastos = rol === 'entrenador' ? 0 : 32400;
    
    return {
      periodo: parametros.periodo || 'Próximo mes',
      ingresos: baseIngresos,
      gastos: baseGastos,
      beneficio: baseIngresos - baseGastos,
      confianza: 80
    };
  },
};

/**
 * Obtiene proyecciones financieras futuras simuladas
 * 
 * NOTA: Estas proyecciones son simuladas (mock) y se generan usando datos base
 * y factores de crecimiento simples. En producción, estas proyecciones deberían
 * calcularse usando modelos financieros más complejos basados en datos históricos
 * reales, tendencias del mercado, y factores de riesgo.
 * 
 * Esta función alimenta el componente ProyeccionesFinancieras.tsx proporcionando
 * proyecciones de ingresos, costes y beneficios para períodos futuros.
 * 
 * @param rol - Rol financiero del usuario ('entrenador' o 'gimnasio')
 * @param filtros - Filtros opcionales para personalizar las proyecciones
 * @returns Promise con array de proyecciones financieras
 */
export async function getProyeccionesFinancieras(
  rol: RolFinanciero,
  filtros?: FiltrosProyecciones
): Promise<ProyeccionFinanciera[]> {
  await delay(700);

  // Valores base según el rol
  const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
  const baseGastos = rol === 'entrenador' ? 0 : 32400;

  // Parámetros de filtros con valores por defecto
  const cantidadPeriodos = Math.max(3, Math.min(6, filtros?.cantidadPeriodos || 6));
  const incluirEscenarios = filtros?.incluirEscenariosAlternativos || false;

  // Calcular fecha de inicio (próximo mes por defecto)
  const ahora = new Date();
  let mesInicio = filtros?.mesInicio || ahora.getMonth() + 2; // Mes siguiente al actual
  let anioInicio = filtros?.anioInicio || ahora.getFullYear();

  // Ajustar si mesInicio > 12
  if (mesInicio > 12) {
    anioInicio++;
    mesInicio = mesInicio - 12;
  }

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const proyecciones: ProyeccionFinanciera[] = [];

  // Generar proyecciones para cada período
  for (let i = 0; i < cantidadPeriodos; i++) {
    const mesActual = ((mesInicio - 1 + i) % 12);
    const anioActual = anioInicio + Math.floor((mesInicio - 1 + i) / 12);
    const periodoLabel = `${nombresMeses[mesActual]} ${anioActual}`;

    // Factor de crecimiento mensual (3% acumulativo)
    const factorCrecimiento = 1 + (i * 0.03);
    // Variación aleatoria pequeña (±3%)
    const variacionAleatoria = 1 + (Math.random() * 0.06 - 0.03);

    // Cálculos para escenario base
    const ingresosBase = baseIngresos * factorCrecimiento * variacionAleatoria;
    const costesBase = baseGastos * (1 + (i * 0.01)) * (1 + (Math.random() * 0.02 - 0.01)); // Gastos más estables
    const beneficioBase = ingresosBase - costesBase;

    // Determinar nivel de confianza según la distancia temporal
    // Períodos más cercanos tienen mayor confianza
    let nivelConfianza: NivelConfianza;
    if (i < 2) {
      nivelConfianza = 'alto'; // Primeros 2 meses: alta confianza
    } else if (i < 4) {
      nivelConfianza = 'medio'; // Meses 3-4: confianza media
    } else {
      nivelConfianza = 'bajo'; // Meses 5-6: menor confianza
    }

    // Si se solicitan escenarios alternativos, generar múltiples proyecciones
    if (incluirEscenarios && i === 0) {
      // Solo para el primer período generamos los 3 escenarios
      
      // Escenario Optimista
      const ingresosOptimista = ingresosBase * 1.15; // +15%
      const costesOptimista = costesBase * 0.95; // -5%
      proyecciones.push({
        periodo: `${periodoLabel} (Optimista)`,
        ingresosEsperados: Math.round(ingresosOptimista),
        costesEsperados: Math.round(costesOptimista),
        beneficioEsperado: Math.round(ingresosOptimista - costesOptimista),
        nivelConfianza: 'medio' as NivelConfianza, // Escenarios alternativos tienen confianza media
        escenario: 'optimista' as EscenarioProyeccion,
        // Campos legacy para compatibilidad
        ingresos: Math.round(ingresosOptimista),
        gastos: Math.round(costesOptimista),
        beneficio: Math.round(ingresosOptimista - costesOptimista),
        confianza: 70, // 70% para escenario optimista
      });

      // Escenario Base
      proyecciones.push({
        periodo: periodoLabel,
        ingresosEsperados: Math.round(ingresosBase),
        costesEsperados: Math.round(costesBase),
        beneficioEsperado: Math.round(beneficioBase),
        nivelConfianza,
        escenario: 'base' as EscenarioProyeccion,
        // Campos legacy para compatibilidad
        ingresos: Math.round(ingresosBase),
        gastos: Math.round(costesBase),
        beneficio: Math.round(beneficioBase),
        confianza: nivelConfianza === 'alto' ? 85 : nivelConfianza === 'medio' ? 75 : 65,
      });

      // Escenario Pesimista
      const ingresosPesimista = ingresosBase * 0.85; // -15%
      const costesPesimista = costesBase * 1.05; // +5%
      proyecciones.push({
        periodo: `${periodoLabel} (Pesimista)`,
        ingresosEsperados: Math.round(ingresosPesimista),
        costesEsperados: Math.round(costesPesimista),
        beneficioEsperado: Math.round(ingresosPesimista - costesPesimista),
        nivelConfianza: 'medio' as NivelConfianza,
        escenario: 'pesimista' as EscenarioProyeccion,
        // Campos legacy para compatibilidad
        ingresos: Math.round(ingresosPesimista),
        gastos: Math.round(costesPesimista),
        beneficio: Math.round(ingresosPesimista - costesPesimista),
        confianza: 70, // 70% para escenario pesimista
      });
    } else {
      // Solo escenario base para este período
      proyecciones.push({
        periodo: periodoLabel,
        ingresosEsperados: Math.round(ingresosBase),
        costesEsperados: Math.round(costesBase),
        beneficioEsperado: Math.round(beneficioBase),
        nivelConfianza,
        escenario: 'base' as EscenarioProyeccion,
        // Campos legacy para compatibilidad con ProyeccionesFinancieras.tsx
        ingresos: Math.round(ingresosBase),
        gastos: Math.round(costesBase),
        beneficio: Math.round(beneficioBase),
        confianza: nivelConfianza === 'alto' ? 85 : nivelConfianza === 'medio' ? 75 : 65,
      });
    }
  }

  return proyecciones;
}

