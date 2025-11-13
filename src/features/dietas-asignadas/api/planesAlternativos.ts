import {
  PlanAlternativo,
  ConfiguracionPlanAlternativo,
  OpcionesGeneracionPlanAlternativo,
  TipoPlanAlternativo,
  Dieta,
  Comida,
  Alimento,
  MacrosNutricionales,
  TipoComida,
} from '../types';
import { getDieta } from './dietas';

// Mock de planes alternativos generados
const planesAlternativosMock: PlanAlternativo[] = [];

/**
 * Genera un plan alternativo basado en un plan existente
 */
export async function generarPlanAlternativo(
  opciones: OpcionesGeneracionPlanAlternativo
): Promise<PlanAlternativo> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const dietaOriginal = await getDieta(opciones.dietaId);
  if (!dietaOriginal) {
    throw new Error('Dieta original no encontrada');
  }

  const config = opciones.configuracion;
  const tipo = config.tipo;

  // Generar nombre y descripción
  const nombresTipos: Record<TipoPlanAlternativo, string> = {
    vegetariano: 'Versión Vegetariana',
    vegano: 'Versión Vegana',
    'presupuesto-reducido': 'Plan con Presupuesto Reducido',
    'alto-presupuesto': 'Plan con Presupuesto Elevado',
    'sin-gluten': 'Versión Sin Gluten',
    'sin-lactosa': 'Versión Sin Lactosa',
    keto: 'Versión Keto',
    paleo: 'Versión Paleo',
    mediterraneo: 'Versión Mediterránea',
    'bajo-carbohidratos': 'Versión Baja en Carbohidratos',
    'alto-carbohidratos': 'Versión Alta en Carbohidratos',
    'alto-proteina': 'Versión Alta en Proteína',
    'bajo-sodio': 'Versión Baja en Sodio',
    personalizado: config.nombre || 'Plan Personalizado',
  };

  const nombre = `${dietaOriginal.nombre} - ${nombresTipos[tipo]}`;
  const descripcion = generarDescripcionPlan(tipo, config);

  // Generar dieta alternativa
  const dietaAlternativa = await generarDietaAlternativa(dietaOriginal, config, opciones);

  // Calcular comparación
  const comparacion = calcularComparacion(dietaOriginal, dietaAlternativa, config);

  // Generar razones de cambios
  const razonesCambios = generarRazonesCambios(tipo, config, comparacion);

  const planAlternativo: PlanAlternativo = {
    id: `plan-alt-${Date.now()}`,
    dietaOriginalId: dietaOriginal.id,
    nombre,
    descripcion,
    tipo,
    configuracion: config,
    dieta: dietaAlternativa,
    comparacion,
    razonesCambios,
    aplicado: false,
    creadoEn: new Date().toISOString(),
    creadoPor: 'user-1', // En producción vendría del contexto de autenticación
  };

  planesAlternativosMock.push(planAlternativo);
  return planAlternativo;
}

/**
 * Genera la descripción del plan alternativo
 */
function generarDescripcionPlan(tipo: TipoPlanAlternativo, config: ConfiguracionPlanAlternativo): string {
  const descripciones: Record<TipoPlanAlternativo, string> = {
    vegetariano: 'Plan adaptado sin carne ni pescado, manteniendo el equilibrio nutricional con proteínas vegetales.',
    vegano: 'Plan completamente basado en plantas, sin productos de origen animal.',
    'presupuesto-reducido': 'Plan optimizado para reducir costes manteniendo la calidad nutricional.',
    'alto-presupuesto': 'Plan con ingredientes premium y opciones gourmet.',
    'sin-gluten': 'Plan adaptado para personas con intolerancia o sensibilidad al gluten.',
    'sin-lactosa': 'Plan sin productos lácteos, adaptado para intolerancia a la lactosa.',
    keto: 'Plan bajo en carbohidratos y alto en grasas saludables.',
    paleo: 'Plan basado en alimentos que habrían estado disponibles en el Paleolítico.',
    mediterraneo: 'Plan inspirado en la dieta mediterránea tradicional.',
    'bajo-carbohidratos': 'Plan reducido en carbohidratos para control de peso.',
    'alto-carbohidratos': 'Plan alto en carbohidratos para rendimiento deportivo.',
    'alto-proteina': 'Plan con mayor contenido proteico para desarrollo muscular.',
    'bajo-sodio': 'Plan reducido en sodio para salud cardiovascular.',
    personalizado: config.nombre || 'Plan personalizado según tus preferencias.',
  };

  return descripciones[tipo] || 'Plan alternativo generado automáticamente.';
}

/**
 * Genera la dieta alternativa basada en la configuración
 */
async function generarDietaAlternativa(
  dietaOriginal: Dieta,
  config: ConfiguracionPlanAlternativo,
  opciones: OpcionesGeneracionPlanAlternativo
): Promise<Dieta> {
  const comidasAlternativas: Comida[] = [];

  // Filtrar días a modificar
  const diasAModificar = config.diasModificar && config.diasModificar.length > 0
    ? config.diasModificar
    : ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  dietaOriginal.comidas.forEach((comida) => {
    const diaComida = comida.dia || 'lunes';
    
    if (!diasAModificar.includes(diaComida) && config.mantenerEstructura) {
      // Mantener comida original si no está en días a modificar
      comidasAlternativas.push({ ...comida });
      return;
    }

    // Generar comida alternativa
    const comidaAlternativa = generarComidaAlternativa(comida, config, config.tipo);
    comidasAlternativas.push(comidaAlternativa);
  });

  // Calcular macros totales
  const macrosAlternativos = calcularMacrosTotales(comidasAlternativas);

  // Aplicar ajustes de macros si se especifican
  let macrosFinales = macrosAlternativos;
  if (config.ajusteMacros) {
    macrosFinales = aplicarAjusteMacros(macrosAlternativos, config.ajusteMacros);
  }

  // Crear dieta alternativa
  const dietaAlternativa: Dieta = {
    ...dietaOriginal,
    id: `dieta-alt-${Date.now()}`,
    nombre: `${dietaOriginal.nombre} - Alternativa`,
    comidas: comidasAlternativas,
    macros: macrosFinales,
    estado: 'activa',
    estadoPublicacion: 'borrador',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  return dietaAlternativa;
}

/**
 * Genera una comida alternativa
 */
function generarComidaAlternativa(
  comida: Comida,
  config: ConfiguracionPlanAlternativo,
  tipo: TipoPlanAlternativo
): Comida {
  const alimentosAlternativos: Alimento[] = [];

  comida.alimentos.forEach((alimento) => {
    const alimentoAlternativo = generarAlimentoAlternativo(alimento, config, tipo);
    if (alimentoAlternativo) {
      alimentosAlternativos.push(alimentoAlternativo);
    }
  });

  // Calcular macros de la comida
  const macrosComida = alimentosAlternativos.reduce(
    (acc, alimento) => ({
      calorias: acc.calorias + alimento.calorias,
      proteinas: acc.proteinas + alimento.proteinas,
      carbohidratos: acc.carbohidratos + alimento.carbohidratos,
      grasas: acc.grasas + alimento.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  return {
    ...comida,
    id: `${comida.id}-alt-${Date.now()}`,
    alimentos: alimentosAlternativos,
    calorias: macrosComida.calorias,
    proteinas: macrosComida.proteinas,
    carbohidratos: macrosComida.carbohidratos,
    grasas: macrosComida.grasas,
  };
}

/**
 * Genera un alimento alternativo
 */
function generarAlimentoAlternativo(
  alimento: Alimento,
  config: ConfiguracionPlanAlternativo,
  tipo: TipoPlanAlternativo
): Alimento | null {
  // Mapeo de sustituciones por tipo de plan
  const sustituciones: Record<TipoPlanAlternativo, Record<string, Alimento>> = {
    vegetariano: {
      'pollo': { id: 'tofu', nombre: 'Tofu', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 76, proteinas: 8, carbohidratos: 1.9, grasas: 4.8 },
      'carne': { id: 'lentejas', nombre: 'Lentejas', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 116, proteinas: 9, carbohidratos: 20, grasas: 0.4 },
      'pescado': { id: 'huevo', nombre: 'Huevo', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 155, proteinas: 13, carbohidratos: 1.1, grasas: 11 },
    },
    vegano: {
      'pollo': { id: 'tofu', nombre: 'Tofu', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 76, proteinas: 8, carbohidratos: 1.9, grasas: 4.8 },
      'carne': { id: 'lentejas', nombre: 'Lentejas', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 116, proteinas: 9, carbohidratos: 20, grasas: 0.4 },
      'huevo': { id: 'tofu', nombre: 'Tofu', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 76, proteinas: 8, carbohidratos: 1.9, grasas: 4.8 },
      'leche': { id: 'leche-almendras', nombre: 'Leche de almendras', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 17, proteinas: 0.6, carbohidratos: 1.5, grasas: 1.1 },
    },
    'presupuesto-reducido': {
      'salmón': { id: 'atun-lata', nombre: 'Atún en lata', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 116, proteinas: 25, carbohidratos: 0, grasas: 0.8 },
      'quinoa': { id: 'arroz', nombre: 'Arroz', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3 },
    },
    'sin-gluten': {
      'trigo': { id: 'arroz', nombre: 'Arroz', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3 },
      'pasta': { id: 'pasta-sin-gluten', nombre: 'Pasta sin gluten', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 131, proteinas: 3.2, carbohidratos: 28, grasas: 0.5 },
    },
    'sin-lactosa': {
      'leche': { id: 'leche-almendras', nombre: 'Leche de almendras', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 17, proteinas: 0.6, carbohidratos: 1.5, grasas: 1.1 },
      'queso': { id: 'queso-vegano', nombre: 'Queso vegano', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 280, proteinas: 0, carbohidratos: 0, grasas: 28 },
    },
    keto: {
      'arroz': { id: 'coliflor', nombre: 'Coliflor', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 25, proteinas: 1.9, carbohidratos: 5, grasas: 0.3 },
      'pasta': { id: 'calabacin', nombre: 'Calabacín', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 17, proteinas: 1.2, carbohidratos: 3.4, grasas: 0.2 },
    },
    paleo: {
      'legumbres': { id: 'carne', nombre: 'Carne magra', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 250, proteinas: 26, carbohidratos: 0, grasas: 17 },
      'cereales': { id: 'batata', nombre: 'Batata', cantidad: alimento.cantidad, unidad: alimento.unidad, calorias: 86, proteinas: 1.6, carbohidratos: 20, grasas: 0.1 },
    },
    mediterraneo: {},
    'bajo-carbohidratos': {},
    'alto-carbohidratos': {},
    'alto-proteina': {},
    'bajo-sodio': {},
    personalizado: {},
  };

  const nombreLower = alimento.nombre.toLowerCase();
  const sustitucionesTipo = sustituciones[tipo] || {};

  // Buscar si hay una sustitución directa
  for (const [key, sustituto] of Object.entries(sustitucionesTipo)) {
    if (nombreLower.includes(key)) {
      return sustituto;
    }
  }

  // Si no hay sustitución, mantener el alimento original (ajustado según restricciones)
  if (debeEliminarAlimento(alimento, config)) {
    return null;
  }

  return { ...alimento };
}

/**
 * Determina si un alimento debe ser eliminado según las restricciones
 */
function debeEliminarAlimento(alimento: Alimento, config: ConfiguracionPlanAlternativo): boolean {
  const nombreLower = alimento.nombre.toLowerCase();

  if (config.tipo === 'vegetariano' || config.tipo === 'vegano') {
    const carnes = ['pollo', 'carne', 'cerdo', 'ternera', 'cordero', 'pavo'];
    const pescados = ['pescado', 'salmón', 'atún', 'merluza', 'bacalao'];
    if (carnes.some(c => nombreLower.includes(c)) || pescados.some(p => nombreLower.includes(p))) {
      return true;
    }
  }

  if (config.tipo === 'vegano') {
    const lacteos = ['leche', 'queso', 'yogur', 'mantequilla', 'nata'];
    const huevos = ['huevo', 'huevos'];
    if (lacteos.some(l => nombreLower.includes(l)) || huevos.some(h => nombreLower.includes(h))) {
      return true;
    }
  }

  if (config.tipo === 'sin-gluten') {
    const gluten = ['trigo', 'cebada', 'centeno', 'pasta', 'pan'];
    if (gluten.some(g => nombreLower.includes(g))) {
      return true;
    }
  }

  if (config.tipo === 'sin-lactosa') {
    const lacteos = ['leche', 'queso', 'yogur', 'mantequilla', 'nata'];
    if (lacteos.some(l => nombreLower.includes(l))) {
      return true;
    }
  }

  return false;
}

/**
 * Calcula los macros totales de una lista de comidas
 */
function calcularMacrosTotales(comidas: Comida[]): MacrosNutricionales {
  return comidas.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );
}

/**
 * Aplica ajustes de macros
 */
function aplicarAjusteMacros(
  macros: MacrosNutricionales,
  ajuste: ConfiguracionPlanAlternativo['ajusteMacros']
): MacrosNutricionales {
  if (!ajuste) return macros;

  return {
    calorias: ajuste.calorias ? Math.round(macros.calorias * (1 + ajuste.calorias / 100)) : macros.calorias,
    proteinas: ajuste.proteinas ? Math.round(macros.proteinas * (1 + ajuste.proteinas / 100) * 10) / 10 : macros.proteinas,
    carbohidratos: ajuste.carbohidratos ? Math.round(macros.carbohidratos * (1 + ajuste.carbohidratos / 100) * 10) / 10 : macros.carbohidratos,
    grasas: ajuste.grasas ? Math.round(macros.grasas * (1 + ajuste.grasas / 100) * 10) / 10 : macros.grasas,
  };
}

/**
 * Calcula la comparación entre el plan original y el alternativo
 */
function calcularComparacion(
  dietaOriginal: Dieta,
  dietaAlternativa: Dieta,
  config: ConfiguracionPlanAlternativo
): PlanAlternativo['comparacion'] {
  const macrosOriginal = dietaOriginal.macros;
  const macrosAlternativo = dietaAlternativa.macros;

  // Contar cambios en comidas
  const comidasModificadas = dietaAlternativa.comidas.filter(
    (c, idx) => c.id !== dietaOriginal.comidas[idx]?.id
  ).length;

  const comidasSustituidas = dietaAlternativa.comidas.filter((c) =>
    c.id.includes('-alt-')
  ).length;

  const comidasEliminadas = dietaOriginal.comidas.length - dietaAlternativa.comidas.length;
  const comidasAñadidas = dietaAlternativa.comidas.length - dietaOriginal.comidas.length;

  // Calcular coste (simulado)
  const costeOriginal = calcularCosteEstimado(dietaOriginal);
  const costeAlternativo = calcularCosteEstimado(dietaAlternativa);

  return {
    macros: {
      calorias: {
        original: macrosOriginal.calorias,
        alternativo: macrosAlternativo.calorias,
        diferencia: macrosAlternativo.calorias - macrosOriginal.calorias,
        porcentaje: ((macrosAlternativo.calorias - macrosOriginal.calorias) / macrosOriginal.calorias) * 100,
      },
      proteinas: {
        original: macrosOriginal.proteinas,
        alternativo: macrosAlternativo.proteinas,
        diferencia: macrosAlternativo.proteinas - macrosOriginal.proteinas,
        porcentaje: ((macrosAlternativo.proteinas - macrosOriginal.proteinas) / macrosOriginal.proteinas) * 100,
      },
      carbohidratos: {
        original: macrosOriginal.carbohidratos,
        alternativo: macrosAlternativo.carbohidratos,
        diferencia: macrosAlternativo.carbohidratos - macrosOriginal.carbohidratos,
        porcentaje: ((macrosAlternativo.carbohidratos - macrosOriginal.carbohidratos) / macrosOriginal.carbohidratos) * 100,
      },
      grasas: {
        original: macrosOriginal.grasas,
        alternativo: macrosAlternativo.grasas,
        diferencia: macrosAlternativo.grasas - macrosOriginal.grasas,
        porcentaje: ((macrosAlternativo.grasas - macrosOriginal.grasas) / macrosOriginal.grasas) * 100,
      },
    },
    coste: {
      original: costeOriginal,
      alternativo: costeAlternativo,
      diferencia: costeAlternativo - costeOriginal,
      porcentaje: ((costeAlternativo - costeOriginal) / costeOriginal) * 100,
    },
    cambios: {
      comidasModificadas,
      comidasSustituidas,
      comidasEliminadas,
      comidasAñadidas,
    },
  };
}

/**
 * Calcula el coste estimado de una dieta (simulado)
 */
function calcularCosteEstimado(dieta: Dieta): number {
  // Simulación simple: coste promedio por comida
  const costePorComida = 3.5; // euros
  return dieta.comidas.length * costePorComida;
}

/**
 * Genera las razones de los cambios realizados
 */
function generarRazonesCambios(
  tipo: TipoPlanAlternativo,
  config: ConfiguracionPlanAlternativo,
  comparacion: PlanAlternativo['comparacion']
): string[] {
  const razones: string[] = [];

  if (tipo === 'vegetariano' || tipo === 'vegano') {
    razones.push('Sustitución de proteínas animales por proteínas vegetales');
    razones.push('Ajuste de macros para mantener el equilibrio nutricional');
  }

  if (tipo === 'presupuesto-reducido') {
    razones.push('Sustitución de ingredientes premium por alternativas más económicas');
    if (comparacion.coste && comparacion.coste.porcentaje < 0) {
      razones.push(`Reducción del coste en ${Math.abs(comparacion.coste.porcentaje).toFixed(1)}%`);
    }
  }

  if (tipo === 'sin-gluten' || tipo === 'sin-lactosa') {
    razones.push('Eliminación de alimentos con restricciones alimentarias');
    razones.push('Sustitución por alternativas compatibles');
  }

  if (comparacion.cambios.comidasSustituidas > 0) {
    razones.push(`${comparacion.cambios.comidasSustituidas} comidas sustituidas`);
  }

  return razones;
}

/**
 * Obtiene todos los planes alternativos generados para una dieta
 */
export async function getPlanesAlternativosPorDieta(dietaId: string): Promise<PlanAlternativo[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return planesAlternativosMock.filter((p) => p.dietaOriginalId === dietaId);
}

/**
 * Obtiene un plan alternativo por ID
 */
export async function getPlanAlternativoPorId(id: string): Promise<PlanAlternativo | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return planesAlternativosMock.find((p) => p.id === id) || null;
}

/**
 * Aplica un plan alternativo (reemplaza la dieta original)
 */
export async function aplicarPlanAlternativo(planAlternativoId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const plan = planesAlternativosMock.find((p) => p.id === planAlternativoId);
  if (!plan) return false;

  plan.aplicado = true;
  plan.fechaAplicacion = new Date().toISOString();

  // En producción, aquí se reemplazaría la dieta original con la alternativa
  // await actualizarDieta(plan.dietaOriginalId, plan.dieta);

  return true;
}

