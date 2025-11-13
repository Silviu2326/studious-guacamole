import {
  Dieta,
  InsightsSaludGlobal,
  InsightCoste,
  InsightVariedadNutricional,
  InsightGradoProcesamiento,
  NivelProcesamiento,
  AlimentoProcesamiento,
} from '../types';

// Base de datos de niveles de procesamiento de alimentos (simplificado)
const nivelesProcesamientoAlimentos: Record<string, NivelProcesamiento> = {
  // Sin procesar
  'manzana': 'sin-procesar',
  'plátano': 'sin-procesar',
  'naranja': 'sin-procesar',
  'pollo': 'sin-procesar',
  'pescado': 'sin-procesar',
  'huevo': 'sin-procesar',
  'lechuga': 'sin-procesar',
  'tomate': 'sin-procesar',
  'brócoli': 'sin-procesar',
  'zanahoria': 'sin-procesar',
  // Minimamente procesado
  'yogur': 'minimamente-procesado',
  'queso': 'minimamente-procesado',
  'pan': 'minimamente-procesado',
  'arroz': 'minimamente-procesado',
  'pasta': 'minimamente-procesado',
  'avena': 'minimamente-procesado',
  // Procesado
  'jamón': 'procesado',
  'queso procesado': 'procesado',
  'pan de molde': 'procesado',
  'cereales': 'procesado',
  // Ultra-procesado
  'galletas': 'ultra-procesado',
  'bollería': 'ultra-procesado',
  'snacks': 'ultra-procesado',
  'bebidas azucaradas': 'ultra-procesado',
  'comida precocinada': 'ultra-procesado',
};

// Grupos alimentarios
const gruposAlimentarios: Record<string, string[]> = {
  'frutas': ['manzana', 'plátano', 'naranja', 'frutos rojos', 'fruta'],
  'verduras': ['lechuga', 'tomate', 'brócoli', 'zanahoria', 'verdura', 'ensalada'],
  'cereales': ['arroz', 'pasta', 'avena', 'pan', 'cereales'],
  'proteínas': ['pollo', 'pescado', 'huevo', 'carne', 'proteína'],
  'lácteos': ['yogur', 'queso', 'leche'],
  'grasas': ['aguacate', 'aceite', 'frutos secos', 'almendras'],
};

function detectarNivelProcesamiento(nombreAlimento: string): NivelProcesamiento {
  const nombreLower = nombreAlimento.toLowerCase();
  
  // Buscar coincidencias exactas
  for (const [alimento, nivel] of Object.entries(nivelesProcesamientoAlimentos)) {
    if (nombreLower.includes(alimento)) {
      return nivel;
    }
  }
  
  // Detección por palabras clave
  if (nombreLower.includes('ultra') || nombreLower.includes('precocinado') || nombreLower.includes('snack')) {
    return 'ultra-procesado';
  }
  if (nombreLower.includes('procesado') || nombreLower.includes('envasado')) {
    return 'procesado';
  }
  if (nombreLower.includes('fresco') || nombreLower.includes('natural')) {
    return 'sin-procesar';
  }
  
  // Por defecto, minimamente procesado
  return 'minimamente-procesado';
}

function detectarGrupoAlimentario(nombreAlimento: string): string {
  const nombreLower = nombreAlimento.toLowerCase();
  
  for (const [grupo, alimentos] of Object.entries(gruposAlimentarios)) {
    for (const alimento of alimentos) {
      if (nombreLower.includes(alimento)) {
        return grupo;
      }
    }
  }
  
  return 'otros';
}

function calcularInsightCoste(dieta: Dieta): InsightCoste {
  // Calcular coste total de todas las comidas
  let costeTotal = 0;
  const costePorTipoComida: Record<string, number> = {};
  
  dieta.comidas.forEach((comida) => {
    let costeComida = 0;
    
    // Calcular coste de alimentos
    if (comida.alimentos && comida.alimentos.length > 0) {
      costeComida = comida.alimentos.reduce((sum, alimento) => {
        return sum + ((alimento as any).coste || 0);
      }, 0);
    } else {
      // Estimación basada en macros si no hay coste específico
      // Estimación aproximada: 0.10€ por 100 kcal
      costeComida = (comida.calorias / 100) * 0.10;
    }
    
    costeTotal += costeComida;
    
    if (!costePorTipoComida[comida.tipo]) {
      costePorTipoComida[comida.tipo] = 0;
    }
    costePorTipoComida[comida.tipo] += costeComida;
  });
  
  const costePorDia = costeTotal;
  const costePorComida = costeTotal / dieta.comidas.length;
  const costeTotalSemanal = costePorDia * 7;
  const costeTotalMensual = costePorDia * 30;
  
  // Promedio del mercado: ~8-12€ por día para una dieta equilibrada
  const promedioMercado = 10;
  const diferencia = costePorDia - promedioMercado;
  const porcentajeDiferencia = (diferencia / promedioMercado) * 100;
  
  // Generar recomendaciones
  const recomendaciones: string[] = [];
  if (costePorDia > promedioMercado * 1.2) {
    recomendaciones.push('El coste diario está por encima del promedio. Considera incluir más alimentos de temporada.');
    recomendaciones.push('Revisa opciones de proteínas más económicas como legumbres o huevos.');
  } else if (costePorDia < promedioMercado * 0.8) {
    recomendaciones.push('El coste está por debajo del promedio. Asegúrate de mantener la calidad nutricional.');
  }
  
  // Identificar tipos de comida más costosos
  const tipoMasCostoso = Object.entries(costePorTipoComida)
    .sort((a, b) => b[1] - a[1])[0];
  if (tipoMasCostoso && tipoMasCostoso[1] > costePorComida * 1.5) {
    recomendaciones.push(`El ${tipoMasCostoso[0]} representa un porcentaje alto del coste. Considera alternativas más económicas.`);
  }
  
  return {
    costeTotalSemanal: Math.round(costeTotalSemanal * 100) / 100,
    costeTotalMensual: Math.round(costeTotalMensual * 100) / 100,
    costePorDia: Math.round(costePorDia * 100) / 100,
    costePorComida: Math.round(costePorComida * 100) / 100,
    distribucionPorTipoComida: Object.entries(costePorTipoComida).map(([tipo, coste]) => ({
      tipoComida: tipo as any,
      coste: Math.round(coste * 100) / 100,
      porcentaje: Math.round((coste / costeTotal) * 100),
    })),
    comparacionMercado: {
      promedio: promedioMercado,
      diferencia: Math.round(diferencia * 100) / 100,
      porcentajeDiferencia: Math.round(porcentajeDiferencia * 100) / 100,
    },
    recomendaciones,
  };
}

function calcularInsightVariedadNutricional(dieta: Dieta): InsightVariedadNutricional {
  const grupos: Record<string, Set<string>> = {};
  const totalAlimentos = new Set<string>();
  
  // Agrupar alimentos por grupo alimentario
  dieta.comidas.forEach((comida) => {
    if (comida.alimentos && comida.alimentos.length > 0) {
      comida.alimentos.forEach((alimento) => {
        const nombre = alimento.nombre.toLowerCase();
        const grupo = detectarGrupoAlimentario(nombre);
        
        if (!grupos[grupo]) {
          grupos[grupo] = new Set();
        }
        grupos[grupo].add(nombre);
        totalAlimentos.add(nombre);
      });
    } else {
      // Si no hay alimentos detallados, usar el nombre de la comida
      const grupo = detectarGrupoAlimentario(comida.nombre);
      if (!grupos[grupo]) {
        grupos[grupo] = new Set();
      }
      grupos[grupo].add(comida.nombre.toLowerCase());
      totalAlimentos.add(comida.nombre.toLowerCase());
    }
  });
  
  const totalAlimentosCount = totalAlimentos.size;
  const gruposAlimentariosData = Object.entries(grupos).map(([grupo, alimentos]) => {
    const count = alimentos.size;
    const porcentaje = totalAlimentosCount > 0 ? (count / totalAlimentosCount) * 100 : 0;
    
    // Recomendaciones: al menos 3-5 alimentos únicos por grupo principal
    const recomendado = count >= 3 || (grupo === 'otros' && count > 0);
    
    return {
      grupo,
      alimentos: count,
      porcentaje: Math.round(porcentaje * 100) / 100,
      recomendado,
    };
  });
  
  // Calcular puntuación de variedad (0-100)
  // Ideal: 6+ grupos alimentarios con 3+ alimentos únicos cada uno
  const gruposRecomendados = gruposAlimentariosData.filter((g) => g.recomendado).length;
  const gruposIdeales = 6;
  const puntuacionVariedad = Math.min(100, (gruposRecomendados / gruposIdeales) * 100);
  
  // Generar recomendaciones
  const recomendaciones: string[] = [];
  if (gruposRecomendados < 4) {
    recomendaciones.push('La variedad de grupos alimentarios es baja. Intenta incluir más frutas, verduras y proteínas diversas.');
  }
  if (!gruposAlimentariosData.find((g) => g.grupo === 'frutas')) {
    recomendaciones.push('Falta incluir frutas en la dieta. Añade al menos 2-3 porciones diarias.');
  }
  if (!gruposAlimentariosData.find((g) => g.grupo === 'verduras')) {
    recomendaciones.push('Falta incluir verduras en la dieta. Añade al menos 3-5 porciones diarias.');
  }
  if (totalAlimentosCount < 15) {
    recomendaciones.push(`Solo hay ${totalAlimentosCount} alimentos únicos. Intenta aumentar la variedad para mejorar el perfil nutricional.`);
  }
  
  return {
    gruposAlimentarios: gruposAlimentariosData,
    puntuacionVariedad: Math.round(puntuacionVariedad * 100) / 100,
    recomendaciones,
  };
}

function calcularInsightGradoProcesamiento(dieta: Dieta): InsightGradoProcesamiento {
  const alimentosProcesamiento: AlimentoProcesamiento[] = [];
  const distribucion: Record<NivelProcesamiento, AlimentoProcesamiento[]> = {
    'sin-procesar': [],
    'minimamente-procesado': [],
    'procesado': [],
    'ultra-procesado': [],
  };
  
  // Analizar todos los alimentos
  dieta.comidas.forEach((comida) => {
    if (comida.alimentos && comida.alimentos.length > 0) {
      comida.alimentos.forEach((alimento) => {
        const nivel = detectarNivelProcesamiento(alimento.nombre);
        const alimentoProc: AlimentoProcesamiento = {
          alimentoId: alimento.id,
          nombre: alimento.nombre,
          nivelProcesamiento: nivel,
          porcentajeEnDieta: 0, // Se calculará después
        };
        alimentosProcesamiento.push(alimentoProc);
        distribucion[nivel].push(alimentoProc);
      });
    } else {
      // Si no hay alimentos detallados, usar el nombre de la comida
      const nivel = detectarNivelProcesamiento(comida.nombre);
      const alimentoProc: AlimentoProcesamiento = {
        alimentoId: comida.id,
        nombre: comida.nombre,
        nivelProcesamiento: nivel,
        porcentajeEnDieta: 0,
      };
      alimentosProcesamiento.push(alimentoProc);
      distribucion[nivel].push(alimentoProc);
    }
  });
  
  const totalAlimentos = alimentosProcesamiento.length;
  
  // Calcular porcentajes
  const distribucionData = Object.entries(distribucion).map(([nivel, alimentos]) => ({
    nivel: nivel as NivelProcesamiento,
    porcentaje: totalAlimentos > 0 ? (alimentos.length / totalAlimentos) * 100 : 0,
    alimentos: alimentos.map((a) => ({
      ...a,
      porcentajeEnDieta: totalAlimentos > 0 ? (1 / totalAlimentos) * 100 : 0,
    })),
  }));
  
  // Calcular puntuación de procesamiento (0-100, mayor = menos procesado = mejor)
  // Ponderación: sin-procesar = 100%, minimamente = 75%, procesado = 50%, ultra = 0%
  const pesos = {
    'sin-procesar': 100,
    'minimamente-procesado': 75,
    'procesado': 50,
    'ultra-procesado': 0,
  };
  
  const puntuacionProcesamiento = distribucionData.reduce((sum, d) => {
    return sum + (d.porcentaje / 100) * pesos[d.nivel];
  }, 0);
  
  // Generar recomendaciones
  const recomendaciones: string[] = [];
  const porcentajeUltraProcesados = distribucionData.find((d) => d.nivel === 'ultra-procesado')?.porcentaje || 0;
  if (porcentajeUltraProcesados > 20) {
    recomendaciones.push(`El ${porcentajeUltraProcesados.toFixed(0)}% de los alimentos son ultra-procesados. Reduce su consumo para mejorar la salud.`);
  }
  if (porcentajeUltraProcesados > 10) {
    recomendaciones.push('Considera reemplazar alimentos ultra-procesados por alternativas frescas o mínimamente procesadas.');
  }
  const porcentajeSinProcesar = distribucionData.find((d) => d.nivel === 'sin-procesar')?.porcentaje || 0;
  if (porcentajeSinProcesar < 30) {
    recomendaciones.push('Aumenta la proporción de alimentos sin procesar (frutas, verduras frescas, carnes frescas).');
  }
  
  return {
    distribucion: distribucionData.map((d) => ({
      ...d,
      porcentaje: Math.round(d.porcentaje * 100) / 100,
    })),
    puntuacionProcesamiento: Math.round(puntuacionProcesamiento * 100) / 100,
    recomendaciones,
    alimentosUltraProcesados: distribucion['ultra-procesado'],
  };
}

export async function getInsightsSaludGlobal(dietaId: string): Promise<InsightsSaludGlobal | null> {
  // En producción, esto vendría de la API
  // Por ahora, simulamos con datos mock
  
  // Obtener la dieta (en producción, desde la API)
  const { getDietas } = await import('./dietas');
  const dietas = await getDietas({});
  const dieta = dietas.find((d) => d.id === dietaId);
  
  if (!dieta) {
    return null;
  }
  
  // Calcular insights
  const coste = calcularInsightCoste(dieta);
  const variedadNutricional = calcularInsightVariedadNutricional(dieta);
  const gradoProcesamiento = calcularInsightGradoProcesamiento(dieta);
  
  // Calcular puntuación general (promedio ponderado)
  const puntuacionGeneral = Math.round(
    (coste.costePorDia <= 12 ? 100 : Math.max(0, 100 - (coste.costePorDia - 12) * 5)) * 0.3 +
    variedadNutricional.puntuacionVariedad * 0.4 +
    gradoProcesamiento.puntuacionProcesamiento * 0.3
  );
  
  // Generar resumen
  const resumen = `La dieta tiene un coste diario de ${coste.costePorDia.toFixed(2)}€, una variedad nutricional del ${variedadNutricional.puntuacionVariedad.toFixed(0)}% y un grado de procesamiento del ${gradoProcesamiento.puntuacionProcesamiento.toFixed(0)}%. Puntuación general: ${puntuacionGeneral}/100.`;
  
  // Recomendaciones prioritarias (top 3-5)
  const todasRecomendaciones = [
    ...coste.recomendaciones.map((r) => `Coste: ${r}`),
    ...variedadNutricional.recomendaciones.map((r) => `Variedad: ${r}`),
    ...gradoProcesamiento.recomendaciones.map((r) => `Procesamiento: ${r}`),
  ];
  const recomendacionesPrioritarias = todasRecomendaciones.slice(0, 5);
  
  return {
    dietaId: dieta.id,
    clienteId: dieta.clienteId,
    coste,
    variedadNutricional,
    gradoProcesamiento,
    puntuacionGeneral,
    resumen,
    recomendacionesPrioritarias,
    generadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
}

