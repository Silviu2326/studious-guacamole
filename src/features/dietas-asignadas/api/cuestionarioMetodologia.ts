import type {
  RespuestaCuestionarioMetodologia,
  ConfiguracionColumnaExcel,
  TipoMetricaExcel,
  NivelDetalle,
  FocoCliente,
} from '../types';

// Mock storage - en producción sería una llamada a la API
const STORAGE_KEY = 'cuestionario_metodologia';

/**
 * Obtiene el cuestionario de metodología del dietista actual
 */
export async function getCuestionarioMetodologia(
  dietistaId: string
): Promise<RespuestaCuestionarioMetodologia | null> {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo cuestionario:', error);
    return null;
  }
}

/**
 * Guarda las respuestas del cuestionario de metodología
 */
export async function guardarCuestionarioMetodologia(
  respuestas: Omit<RespuestaCuestionarioMetodologia, 'id' | 'creadoEn' | 'actualizadoEn' | 'version'>
): Promise<RespuestaCuestionarioMetodologia> {
  try {
    const existente = await getCuestionarioMetodologia(respuestas.dietistaId);
    const ahora = new Date().toISOString();
    
    const cuestionario: RespuestaCuestionarioMetodologia = {
      ...respuestas,
      id: existente?.id || `cuestionario_${Date.now()}`,
      creadoEn: existente?.creadoEn || ahora,
      actualizadoEn: ahora,
      version: (existente?.version || 0) + 1,
    };

    // Generar configuración de columnas basada en las respuestas
    cuestionario.columnasExcel = generarColumnasExcel(
      cuestionario.metricas,
      cuestionario.nivelDetalle,
      cuestionario.focoCliente
    );

    // Generar fórmulas personalizadas
    cuestionario.formulasPersonalizadas = generarFormulas(
      cuestionario.columnasExcel,
      cuestionario.focoCliente
    );

    localStorage.setItem(
      `${STORAGE_KEY}_${respuestas.dietistaId}`,
      JSON.stringify(cuestionario)
    );

    return cuestionario;
  } catch (error) {
    console.error('Error guardando cuestionario:', error);
    throw error;
  }
}

/**
 * Genera la configuración de columnas Excel basada en las respuestas del cuestionario
 */
function generarColumnasExcel(
  metricas: TipoMetricaExcel[],
  nivelDetalle: NivelDetalle,
  focoCliente: FocoCliente[]
): ConfiguracionColumnaExcel[] {
  const columnasBase: Record<TipoMetricaExcel, Omit<ConfiguracionColumnaExcel, 'orden' | 'visible'>> = {
    calorias: { id: 'calorias', label: 'Calorías (kcal)', formato: 'numero', ancho: 100 },
    proteinas: { id: 'proteinas', label: 'Proteínas (g)', formato: 'numero', ancho: 100 },
    carbohidratos: { id: 'carbohidratos', label: 'Carbohidratos (g)', formato: 'numero', ancho: 120 },
    grasas: { id: 'grasas', label: 'Grasas (g)', formato: 'numero', ancho: 100 },
    fibra: { id: 'fibra', label: 'Fibra (g)', formato: 'numero', ancho: 100 },
    azucares: { id: 'azucares', label: 'Azúcares (g)', formato: 'numero', ancho: 100 },
    sodio: { id: 'sodio', label: 'Sodio (mg)', formato: 'numero', ancho: 100 },
    'ratio-proteina': { id: 'ratio-proteina', label: 'Ratio Proteína/kg', formato: 'numero', ancho: 130 },
    'vasos-agua': { id: 'vasos-agua', label: 'Vasos de Agua', formato: 'numero', ancho: 120 },
    adherencia: { id: 'adherencia', label: 'Adherencia (%)', formato: 'porcentaje', ancho: 120 },
    'tiempo-preparacion': { id: 'tiempo-preparacion', label: 'Tiempo Prep. (min)', formato: 'numero', ancho: 140 },
    coste: { id: 'coste', label: 'Coste (€)', formato: 'moneda', ancho: 100 },
    'satisfaccion-prevista': { id: 'satisfaccion-prevista', label: 'Satisfacción Prevista', formato: 'numero', ancho: 150 },
  };

  // Columnas siempre visibles
  const columnasSiempreVisibles: TipoMetricaExcel[] = ['calorias', 'proteinas', 'carbohidratos', 'grasas'];
  
  // Determinar columnas según nivel de detalle
  let columnasSeleccionadas: TipoMetricaExcel[] = [...columnasSiempreVisibles];
  
  if (nivelDetalle === 'intermedio' || nivelDetalle === 'avanzado' || nivelDetalle === 'completo') {
    columnasSeleccionadas.push('fibra', 'azucares');
  }
  
  if (nivelDetalle === 'avanzado' || nivelDetalle === 'completo') {
    columnasSeleccionadas.push('sodio', 'ratio-proteina', 'vasos-agua');
  }
  
  if (nivelDetalle === 'completo') {
    columnasSeleccionadas.push('adherencia', 'tiempo-preparacion', 'coste', 'satisfaccion-prevista');
  }

  // Agregar métricas seleccionadas manualmente
  metricas.forEach(metrica => {
    if (!columnasSeleccionadas.includes(metrica)) {
      columnasSeleccionadas.push(metrica);
    }
  });

  // Ajustar según foco del cliente
  if (focoCliente.includes('perdida-peso') || focoCliente.includes('deficit-calorico')) {
    if (!columnasSeleccionadas.includes('calorias')) columnasSeleccionadas.unshift('calorias');
  }
  
  if (focoCliente.includes('ganancia-muscular')) {
    if (!columnasSeleccionadas.includes('ratio-proteina')) {
      columnasSeleccionadas.push('ratio-proteina');
    }
  }

  // Generar configuración de columnas
  const columnas: ConfiguracionColumnaExcel[] = columnasSeleccionadas.map((metrica, index) => ({
    ...columnasBase[metrica],
    visible: true,
    orden: index,
  }));

  return columnas;
}

/**
 * Genera fórmulas personalizadas basadas en la configuración
 */
function generarFormulas(
  columnas: ConfiguracionColumnaExcel[],
  focoCliente: FocoCliente[]
): Record<string, string> {
  const formulas: Record<string, string> = {};

  // Fórmulas de totales por columna
  columnas.forEach((columna, index) => {
    if (columna.formato === 'numero' || columna.formato === 'moneda') {
      const columnaLetra = String.fromCharCode(65 + index + 2); // +2 porque A y B son Día y Comida
      formulas[`total_${columna.id}`] = `=SUM(${columnaLetra}2:${columnaLetra}100)`;
    }
  });

  // Fórmulas específicas según foco
  if (focoCliente.includes('perdida-peso') || focoCliente.includes('deficit-calorico')) {
    const columnaCalorias = columnas.findIndex(c => c.id === 'calorias');
    if (columnaCalorias >= 0) {
      const letra = String.fromCharCode(65 + columnaCalorias + 2);
      formulas['deficit_calorico'] = `=SUM(${letra}2:${letra}100)-OBJETIVO_CALORIAS`;
    }
  }

  if (focoCliente.includes('ganancia-muscular')) {
    const columnaProteinas = columnas.findIndex(c => c.id === 'proteinas');
    if (columnaProteinas >= 0) {
      const letra = String.fromCharCode(65 + columnaProteinas + 2);
      formulas['total_proteinas'] = `=SUM(${letra}2:${letra}100)`;
      formulas['ratio_proteina_dia'] = `=${letra}2/PESO_CLIENTE`;
    }
  }

  return formulas;
}

/**
 * Regenera la configuración de Excel basada en un cuestionario existente
 */
export async function regenerarConfiguracionExcel(
  dietistaId: string
): Promise<RespuestaCuestionarioMetodologia> {
  const cuestionario = await getCuestionarioMetodologia(dietistaId);
  
  if (!cuestionario) {
    throw new Error('No se encontró cuestionario para regenerar');
  }

  // Regenerar columnas y fórmulas
  cuestionario.columnasExcel = generarColumnasExcel(
    cuestionario.metricas,
    cuestionario.nivelDetalle,
    cuestionario.focoCliente
  );

  cuestionario.formulasPersonalizadas = generarFormulas(
    cuestionario.columnasExcel,
    cuestionario.focoCliente
  );

  cuestionario.actualizadoEn = new Date().toISOString();
  cuestionario.version += 1;

  localStorage.setItem(
    `${STORAGE_KEY}_${dietistaId}`,
    JSON.stringify(cuestionario)
  );

  return cuestionario;
}

