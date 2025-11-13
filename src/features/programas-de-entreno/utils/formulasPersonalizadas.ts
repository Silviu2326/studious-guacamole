import type { DayPlan, DaySession } from '../types';

export type TipoFormulaPersonalizada = 'volumen' | 'tonelaje' | 'densidad' | 'custom';

export interface VariableFormula {
  nombre: string;
  descripcion: string;
  tipo: 'numero' | 'texto';
}

export interface FormulaPersonalizada {
  id: string;
  nombre: string;
  descripcion: string;
  formula: string;
  tipo: TipoFormulaPersonalizada;
  variables: VariableFormula[];
  formato: 'numero' | 'porcentaje' | 'moneda';
  unidad: string;
  recalculoAutomatico: boolean;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
  orden: number;
}

export interface ConfiguracionFormulasPersonalizadas {
  formulas: FormulaPersonalizada[];
  ultimaActualizacion: string;
}

/**
 * Obtiene fórmulas predefinidas disponibles
 */
export function getFormulasPredefinidas(): Omit<FormulaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'activa' | 'orden'>[] {
  return [
    {
      nombre: 'Tonelaje Total',
      tipo: 'tonelaje',
      descripcion: 'Suma total del peso levantado (peso × series × repeticiones)',
      formula: 'SUM(peso * series * repeticiones)',
      variables: [
        { nombre: 'peso', descripcion: 'Peso en kg', tipo: 'numero' },
        { nombre: 'series', descripcion: 'Número de series', tipo: 'numero' },
        { nombre: 'repeticiones', descripcion: 'Número de repeticiones', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'kg',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Volumen Total',
      tipo: 'volumen',
      descripcion: 'Total de series multiplicado por repeticiones',
      formula: 'SUM(series * repeticiones)',
      variables: [
        { nombre: 'series', descripcion: 'Número de series', tipo: 'numero' },
        { nombre: 'repeticiones', descripcion: 'Número de repeticiones', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'series×rep',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Densidad de Entrenamiento',
      tipo: 'densidad',
      descripcion: 'Tonelaje por minuto de entrenamiento (kg/min)',
      formula: 'tonelajeTotal / duracion',
      variables: [
        { nombre: 'tonelajeTotal', descripcion: 'Tonelaje total calculado', tipo: 'numero' },
        { nombre: 'duracion', descripcion: 'Duración en minutos', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'kg/min',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Densidad de Volumen',
      tipo: 'densidad',
      descripcion: 'Volumen por minuto de entrenamiento',
      formula: 'volumenTotal / duracion',
      variables: [
        { nombre: 'volumenTotal', descripcion: 'Volumen total calculado', tipo: 'numero' },
        { nombre: 'duracion', descripcion: 'Duración en minutos', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'vol/min',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Intensidad Promedio',
      tipo: 'custom',
      descripcion: 'Promedio de RPE en todas las series',
      formula: 'AVG(rpe)',
      variables: [
        { nombre: 'rpe', descripcion: 'Escala de esfuerzo percibido (1-10)', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'RPE',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Calorías por Minuto',
      tipo: 'densidad',
      descripcion: 'Calorías quemadas por minuto de entrenamiento',
      formula: 'caloriasTotales / duracion',
      variables: [
        { nombre: 'caloriasTotales', descripcion: 'Total de calorías', tipo: 'numero' },
        { nombre: 'duracion', descripcion: 'Duración en minutos', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'kcal/min',
      recalculoAutomatico: true,
    },
  ];
}

/**
 * Extrae valores de una sesión para usar en fórmulas
 */
export function extraerValoresSesion(sesion: DaySession): Record<string, number> {
  const valores: Record<string, number> = {};

  // Valores básicos
  if (sesion.series !== undefined) valores.series = sesion.series;
  if (sesion.repeticiones) {
    // Intentar parsear repeticiones (puede ser "10-12" o "10")
    const match = sesion.repeticiones.match(/\d+/);
    if (match) valores.repeticiones = parseInt(match[0], 10);
  }
  if (sesion.peso !== undefined) valores.peso = sesion.peso;
  if (sesion.descanso !== undefined) valores.descanso = sesion.descanso;

  // Duración (parsear de string como "38 min" o número)
  if (sesion.duration) {
    const match = sesion.duration.match(/\d+/);
    if (match) valores.duracion = parseInt(match[0], 10);
  }

  // RPE (parsear de string como "RPE 7" o número)
  if (sesion.intensity) {
    const rpeMatch = sesion.intensity.match(/RPE\s*(\d+(?:\.\d+)?)/i);
    if (rpeMatch) {
      valores.rpe = parseFloat(rpeMatch[1]);
    } else {
      const numMatch = sesion.intensity.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) valores.rpe = parseFloat(numMatch[1]);
    }
  }

  return valores;
}

/**
 * Extrae valores de un plan diario
 */
export function extraerValoresPlan(plan: DayPlan): Record<string, number> {
  const valores: Record<string, number> = {};

  // Calcular valores agregados de todas las sesiones
  let tonelajeTotal = 0;
  let volumenTotal = 0;
  let duracionTotal = 0;
  let caloriasTotales = 0;
  const rpes: number[] = [];

  plan.sessions.forEach((sesion) => {
    const valoresSesion = extraerValoresSesion(sesion);

    // Tonelaje
    if (valoresSesion.peso && valoresSesion.series && valoresSesion.repeticiones) {
      tonelajeTotal += valoresSesion.peso * valoresSesion.series * valoresSesion.repeticiones;
    }

    // Volumen
    if (valoresSesion.series && valoresSesion.repeticiones) {
      volumenTotal += valoresSesion.series * valoresSesion.repeticiones;
    }

    // Duración
    if (valoresSesion.duracion) {
      duracionTotal += valoresSesion.duracion;
    }

    // RPE
    if (valoresSesion.rpe) {
      rpes.push(valoresSesion.rpe);
    }
  });

  // Calcular calorías estimadas (8 kcal/min es una estimación general)
  caloriasTotales = Math.round(duracionTotal * 8);

  valores.tonelajeTotal = tonelajeTotal;
  valores.volumenTotal = volumenTotal;
  valores.duracion = duracionTotal;
  valores.caloriasTotales = caloriasTotales;

  if (rpes.length > 0) {
    valores.rpe = rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length;
  }

  return valores;
}

/**
 * Evalúa una fórmula matemática simple
 */
export function evaluarFormula(
  formula: string,
  contexto: Record<string, number>
): number {
  try {
    // Reemplazar variables con valores
    let formulaEvaluable = formula;

    // Reemplazar funciones especiales
    formulaEvaluable = formulaEvaluable.replace(/SUM\(([^)]+)\)/gi, (match, expr) => {
      // Para SUM, necesitaríamos iterar sobre todas las sesiones
      // Por ahora, simplificamos asumiendo que la expresión ya está calculada
      return expr;
    });

    formulaEvaluable = formulaEvaluable.replace(/AVG\(([^)]+)\)/gi, (match, varName) => {
      const varValue = contexto[varName.trim()];
      return varValue !== undefined ? varValue.toString() : '0';
    });

    // Reemplazar variables con valores
    Object.keys(contexto).forEach((varName) => {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      formulaEvaluable = formulaEvaluable.replace(regex, contexto[varName].toString());
    });

    // Evaluar la expresión (usando Function para mayor seguridad)
    // En producción, deberías usar una librería más segura como mathjs
    const resultado = Function(`"use strict"; return (${formulaEvaluable})`)();
    return typeof resultado === 'number' ? resultado : 0;
  } catch (error) {
    console.error('Error evaluando fórmula:', formula, error);
    return 0;
  }
}

/**
 * Calcula el valor de una fórmula personalizada para un plan diario
 */
export function calcularFormula(
  formula: FormulaPersonalizada,
  plan: DayPlan
): number | string {
  try {
    const valores = extraerValoresPlan(plan);
    const resultado = evaluarFormula(formula.formula, valores);

    // Formatear según el tipo
    if (formula.formato === 'porcentaje') {
      return `${resultado.toFixed(2)}%`;
    }
    if (formula.formato === 'moneda') {
      return `€${resultado.toFixed(2)}`;
    }

    return resultado;
  } catch (error) {
    console.error('Error calculando fórmula:', error);
    return 0;
  }
}

/**
 * Calcula todas las fórmulas activas para un plan semanal
 */
export function calcularFormulasPlanSemanal(
  formulas: FormulaPersonalizada[],
  weeklyPlan: Record<string, DayPlan>
): Record<string, Record<string, number | string>> {
  const resultados: Record<string, Record<string, number | string>> = {};

  Object.keys(weeklyPlan).forEach((day) => {
    const plan = weeklyPlan[day];
    resultados[day] = {};

    formulas
      .filter((f) => f.activa && f.recalculoAutomatico)
      .forEach((formula) => {
        resultados[day][formula.id] = calcularFormula(formula, plan);
      });
  });

  return resultados;
}

/**
 * Guarda fórmulas personalizadas (simulado - en producción usar API)
 */
export async function guardarFormulasPersonalizadas(
  config: ConfiguracionFormulasPersonalizadas
): Promise<void> {
  // Simular guardado
  localStorage.setItem('formulasPersonalizadas', JSON.stringify(config));
}

/**
 * Carga fórmulas personalizadas (simulado - en producción usar API)
 */
export async function cargarFormulasPersonalizadas(): Promise<ConfiguracionFormulasPersonalizadas> {
  try {
    const stored = localStorage.getItem('formulasPersonalizadas');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error cargando fórmulas:', error);
  }

  // Retornar configuración por defecto con fórmulas predefinidas
  const formulasPredefinidas = getFormulasPredefinidas();
  return {
    formulas: formulasPredefinidas.map((f, index) => ({
      ...f,
      id: `formula-${index + 1}`,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      activa: true,
      orden: index,
    })),
    ultimaActualizacion: new Date().toISOString(),
  };
}

