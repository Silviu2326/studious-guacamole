import type {
  FormulaPersonalizada,
  ConfiguracionFormulasPersonalizadas,
  TipoFormulaPersonalizada,
  Dieta,
  Comida,
} from '../types';

// Mock storage - en producción sería una llamada a la API
const STORAGE_KEY = 'formulas_personalizadas';

/**
 * Obtiene las fórmulas personalizadas del dietista
 */
export async function getFormulasPersonalizadas(
  dietistaId: string
): Promise<ConfiguracionFormulasPersonalizadas | null> {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo fórmulas personalizadas:', error);
    return null;
  }
}

/**
 * Guarda las fórmulas personalizadas del dietista
 */
export async function guardarFormulasPersonalizadas(
  configuracion: Omit<ConfiguracionFormulasPersonalizadas, 'version' | 'actualizadoEn'>
): Promise<ConfiguracionFormulasPersonalizadas> {
  try {
    const existente = await getFormulasPersonalizadas(configuracion.dietistaId);
    const ahora = new Date().toISOString();

    const config: ConfiguracionFormulasPersonalizadas = {
      ...configuracion,
      version: (existente?.version || 0) + 1,
      actualizadoEn: ahora,
    };

    localStorage.setItem(`${STORAGE_KEY}_${configuracion.dietistaId}`, JSON.stringify(config));

    return config;
  } catch (error) {
    console.error('Error guardando fórmulas personalizadas:', error);
    throw error;
  }
}

/**
 * Crea una nueva fórmula personalizada
 */
export async function crearFormulaPersonalizada(
  dietistaId: string,
  formula: Omit<FormulaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<FormulaPersonalizada> {
  const config = await getFormulasPersonalizadas(dietistaId);
  const ahora = new Date().toISOString();

  const nuevaFormula: FormulaPersonalizada = {
    ...formula,
    id: `formula_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  const formulas = config?.formulas || [];
  const nuevasFormulas = [...formulas, nuevaFormula];

  await guardarFormulasPersonalizadas({
    dietistaId,
    formulas: nuevasFormulas,
  });

  return nuevaFormula;
}

/**
 * Actualiza una fórmula personalizada existente
 */
export async function actualizarFormulaPersonalizada(
  dietistaId: string,
  formulaId: string,
  actualizaciones: Partial<Omit<FormulaPersonalizada, 'id' | 'creadoEn' | 'dietistaId'>>
): Promise<FormulaPersonalizada> {
  const config = await getFormulasPersonalizadas(dietistaId);
  if (!config) {
    throw new Error('No se encontró configuración de fórmulas');
  }

  const formulas = config.formulas.map((f) =>
    f.id === formulaId
      ? { ...f, ...actualizaciones, actualizadoEn: new Date().toISOString() }
      : f
  );

  await guardarFormulasPersonalizadas({
    dietistaId,
    formulas,
  });

  const formulaActualizada = formulas.find((f) => f.id === formulaId);
  if (!formulaActualizada) {
    throw new Error('Fórmula no encontrada');
  }

  return formulaActualizada;
}

/**
 * Elimina una fórmula personalizada
 */
export async function eliminarFormulaPersonalizada(
  dietistaId: string,
  formulaId: string
): Promise<void> {
  const config = await getFormulasPersonalizadas(dietistaId);
  if (!config) {
    throw new Error('No se encontró configuración de fórmulas');
  }

  const formulas = config.formulas.filter((f) => f.id !== formulaId);

  await guardarFormulasPersonalizadas({
    dietistaId,
    formulas,
  });
}

/**
 * Obtiene fórmulas predefinidas disponibles
 */
export function getFormulasPredefinidas(): Omit<FormulaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'activa' | 'orden'>[] {
  return [
    {
      nombre: 'Tonelaje',
      tipo: 'tonelaje',
      descripcion: 'Suma total de gramos de todos los macronutrientes (proteínas + carbohidratos + grasas)',
      formula: 'proteinas + carbohidratos + grasas',
      variables: [
        { nombre: 'proteinas', descripcion: 'Gramos de proteínas', tipo: 'numero' },
        { nombre: 'carbohidratos', descripcion: 'Gramos de carbohidratos', tipo: 'numero' },
        { nombre: 'grasas', descripcion: 'Gramos de grasas', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'g',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Densidad Energética',
      tipo: 'densidad-energetica',
      descripcion: 'Calorías por gramo de alimento (kcal/g)',
      formula: 'calorias / (proteinas + carbohidratos + grasas)',
      variables: [
        { nombre: 'calorias', descripcion: 'Calorías totales', tipo: 'numero' },
        { nombre: 'proteinas', descripcion: 'Gramos de proteínas', tipo: 'numero' },
        { nombre: 'carbohidratos', descripcion: 'Gramos de carbohidratos', tipo: 'numero' },
        { nombre: 'grasas', descripcion: 'Gramos de grasas', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: 'kcal/g',
      recalculoAutomatico: true,
    },
    {
      nombre: '% Vegetariano',
      tipo: 'porcentaje-vegetariano',
      descripcion: 'Porcentaje de comidas vegetarianas en la dieta',
      formula: '(comidasVegetarianas / totalComidas) * 100',
      variables: [
        { nombre: 'comidasVegetarianas', descripcion: 'Número de comidas vegetarianas', tipo: 'numero' },
        { nombre: 'totalComidas', descripcion: 'Total de comidas', tipo: 'numero' },
      ],
      formato: 'porcentaje',
      unidad: '%',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Ratio Carbohidratos/Proteína',
      tipo: 'ratio-carbohidratos-proteina',
      descripcion: 'Relación entre carbohidratos y proteínas',
      formula: 'carbohidratos / proteinas',
      variables: [
        { nombre: 'carbohidratos', descripcion: 'Gramos de carbohidratos', tipo: 'numero' },
        { nombre: 'proteinas', descripcion: 'Gramos de proteínas', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: '',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Índice de Saciedad',
      tipo: 'indice-saciedad',
      descripcion: 'Índice estimado de saciedad basado en proteínas, fibra y volumen',
      formula: '(proteinas * 2) + (fibra * 1.5) + (calorias / 10)',
      variables: [
        { nombre: 'proteinas', descripcion: 'Gramos de proteínas', tipo: 'numero' },
        { nombre: 'fibra', descripcion: 'Gramos de fibra', tipo: 'numero' },
        { nombre: 'calorias', descripcion: 'Calorías totales', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: '',
      recalculoAutomatico: true,
    },
    {
      nombre: 'Carga Glicémica',
      tipo: 'carga-glicemica',
      descripcion: 'Carga glicémica estimada (carbohidratos * IG estimado / 100)',
      formula: '(carbohidratos * indiceGlicemico) / 100',
      variables: [
        { nombre: 'carbohidratos', descripcion: 'Gramos de carbohidratos', tipo: 'numero' },
        { nombre: 'indiceGlicemico', descripcion: 'Índice glicémico estimado (0-100)', tipo: 'numero' },
      ],
      formato: 'numero',
      unidad: '',
      recalculoAutomatico: true,
    },
  ];
}

/**
 * Calcula el valor de una fórmula personalizada para una comida o dieta
 */
export function calcularFormula(
  formula: FormulaPersonalizada,
  datos: {
    comida?: Comida;
    dieta?: Dieta;
    valoresPersonalizados?: Record<string, number>;
  }
): number | string {
  try {
    const { comida, dieta, valoresPersonalizados = {} } = datos;

    // Preparar contexto de variables
    const contexto: Record<string, number> = {
      // Valores de la comida
      calorias: comida?.calorias || 0,
      proteinas: comida?.proteinas || 0,
      carbohidratos: comida?.carbohidratos || 0,
      grasas: comida?.grasas || 0,
      fibra: comida?.alimentos?.reduce((sum, a) => sum + ((a as any).fibra || 0), 0) || 0,
      // Valores de la dieta
      totalCalorias: dieta?.macros.calorias || 0,
      totalProteinas: dieta?.macros.proteinas || 0,
      totalCarbohidratos: dieta?.macros.carbohidratos || 0,
      totalGrasas: dieta?.macros.grasas || 0,
      // Valores personalizados
      ...valoresPersonalizados,
    };

    // Para fórmulas específicas, calcular valores especiales
    if (formula.tipo === 'porcentaje-vegetariano' && dieta) {
      const totalComidas = dieta.comidas.length;
      const comidasVegetarianas = dieta.comidas.filter((c) => {
        // Lógica simplificada: considerar vegetariano si no tiene carne/pescado
        return !c.alimentos.some((a) =>
          a.nombre.toLowerCase().includes('pollo') ||
          a.nombre.toLowerCase().includes('carne') ||
          a.nombre.toLowerCase().includes('pescado') ||
          a.nombre.toLowerCase().includes('atún') ||
          a.nombre.toLowerCase().includes('salmón')
        );
      }).length;
      contexto.comidasVegetarianas = comidasVegetarianas;
      contexto.totalComidas = totalComidas;
    }

    // Evaluar la fórmula
    const resultado = evaluarFormula(formula.formula, contexto);

    // Formatear según el tipo
    if (formula.formato === 'porcentaje') {
      return `${resultado.toFixed(2)}%`;
    }
    if (formula.formato === 'moneda') {
      return `€${resultado.toFixed(2)}`;
    }
    if (formula.unidad) {
      return `${resultado.toFixed(2)} ${formula.unidad}`;
    }
    return resultado.toFixed(2);
  } catch (error) {
    console.error('Error calculando fórmula:', error);
    return '-';
  }
}

/**
 * Evalúa una fórmula matemática de forma segura
 */
function evaluarFormula(formula: string, contexto: Record<string, number>): number {
  try {
    // Reemplazar variables con sus valores
    let formulaEvaluable = formula;
    Object.keys(contexto).forEach((variable) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      formulaEvaluable = formulaEvaluable.replace(regex, contexto[variable].toString());
    });

    // Evaluar de forma segura (solo operaciones matemáticas básicas)
    // En producción, usar una librería más segura como mathjs
    const resultado = Function(`"use strict"; return (${formulaEvaluable})`)();
    
    if (typeof resultado !== 'number' || isNaN(resultado) || !isFinite(resultado)) {
      return 0;
    }

    return resultado;
  } catch (error) {
    console.error('Error evaluando fórmula:', error);
    return 0;
  }
}

/**
 * Recalcula todas las fórmulas activas para una dieta
 */
export function recalcularFormulasDieta(
  formulas: FormulaPersonalizada[],
  dieta: Dieta
): Record<string, number | string> {
  const resultados: Record<string, number | string> = {};

  formulas
    .filter((f) => f.activa && f.recalculoAutomatico)
    .forEach((formula) => {
      // Calcular para cada comida
      dieta.comidas.forEach((comida) => {
        const key = `${formula.id}_${comida.id}`;
        resultados[key] = calcularFormula(formula, { comida, dieta });
      });

      // Calcular para la dieta completa
      resultados[`${formula.id}_dieta`] = calcularFormula(formula, { dieta });
    });

  return resultados;
}

