import type {
  RespuestaCuestionarioMetodologia,
  PlantillaSugerida,
  TipoPlantillaSugerida,
  TipoMetricaExcel,
  FocoCliente,
  NivelDetalle,
} from '../types';

/**
 * Sugiere plantillas basadas en las respuestas del cuestionario de metodología
 */
export async function sugerirPlantillas(
  cuestionario: RespuestaCuestionarioMetodologia
): Promise<PlantillaSugerida[]> {
  // Simular procesamiento (en producción sería una llamada a la API)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const plantillas: PlantillaSugerida[] = [];
  const { metricas, nivelDetalle, focoCliente } = cuestionario;

  // Plantilla: Entrenador de Fuerza
  if (
    focoCliente.includes('ganancia-muscular') ||
    metricas.includes('ratio-proteina') ||
    nivelDetalle === 'avanzado' || nivelDetalle === 'completo'
  ) {
    const puntuacion = calcularPuntuacion(
      focoCliente,
      metricas,
      nivelDetalle,
      ['ganancia-muscular', 'superavit-calorico'],
      ['ratio-proteina', 'proteinas'],
      ['avanzado', 'completo']
    );

    plantillas.push({
      id: 'plantilla-entrenador-fuerza',
      tipo: 'entrenador-fuerza',
      nombre: 'Entrenador de Fuerza',
      descripcion: 'Optimizada para clientes que buscan ganancia muscular y fuerza',
      icono: '💪',
      columnasRecomendadas: [
        'calorias',
        'proteinas',
        'ratio-proteina',
        'carbohidratos',
        'grasas',
        'fibra',
        'vasos-agua',
      ],
      resumenesRecomendados: [
        {
          tipo: 'diario',
          metricas: ['calorias', 'proteinas', 'ratio-proteina'],
        },
        {
          tipo: 'semanal',
          metricas: ['calorias', 'proteinas', 'carbohidratos', 'grasas'],
        },
      ],
      formulasPredefinidas: {
        total_proteinas: '=SUM(C2:C100)',
        ratio_proteina_dia: '=C2/PESO_CLIENTE',
        superavit_calorico: '=SUM(A2:A100)-OBJETIVO_CALORIAS',
      },
      puntuacionCoincidencia: puntuacion,
      razones: generarRazones(
        focoCliente,
        metricas,
        nivelDetalle,
        'Entrenador de Fuerza',
        ['ganancia-muscular', 'superavit-calorico'],
        ['ratio-proteina', 'proteinas']
      ),
    });
  }

  // Plantilla: Nutricionista Endurance
  if (
    focoCliente.includes('rendimiento') ||
    metricas.includes('carbohidratos') ||
    nivelDetalle === 'intermedio' || nivelDetalle === 'avanzado'
  ) {
    const puntuacion = calcularPuntuacion(
      focoCliente,
      metricas,
      nivelDetalle,
      ['rendimiento'],
      ['carbohidratos', 'calorias'],
      ['intermedio', 'avanzado', 'completo']
    );

    plantillas.push({
      id: 'plantilla-nutricionista-endurance',
      tipo: 'nutricionista-endurance',
      nombre: 'Nutricionista Endurance',
      descripcion: 'Diseñada para atletas de resistencia y deportes de larga duración',
      icono: '🏃',
      columnasRecomendadas: [
        'calorias',
        'carbohidratos',
        'proteinas',
        'grasas',
        'fibra',
        'vasos-agua',
        'tiempo-preparacion',
      ],
      resumenesRecomendados: [
        {
          tipo: 'diario',
          metricas: ['calorias', 'carbohidratos', 'proteinas'],
        },
        {
          tipo: 'semanal',
          metricas: ['calorias', 'carbohidratos', 'proteinas', 'grasas', 'vasos-agua'],
        },
      ],
      formulasPredefinidas: {
        total_carbohidratos: '=SUM(D2:D100)',
        ratio_carbohidratos_calorias: '=D2/A2*4',
        hidratacion_total: '=SUM(I2:I100)',
      },
      puntuacionCoincidencia: puntuacion,
      razones: generarRazones(
        focoCliente,
        metricas,
        nivelDetalle,
        'Nutricionista Endurance',
        ['rendimiento'],
        ['carbohidratos', 'calorias']
      ),
    });
  }

  // Plantilla: Pérdida de Peso
  if (
    focoCliente.includes('perdida-peso') ||
    focoCliente.includes('deficit-calorico') ||
    metricas.includes('calorias')
  ) {
    const puntuacion = calcularPuntuacion(
      focoCliente,
      metricas,
      nivelDetalle,
      ['perdida-peso', 'deficit-calorico'],
      ['calorias', 'fibra'],
      ['basico', 'intermedio', 'avanzado', 'completo']
    );

    plantillas.push({
      id: 'plantilla-perdida-peso',
      tipo: 'perdida-peso',
      nombre: 'Pérdida de Peso',
      descripcion: 'Enfocada en déficit calórico controlado y saciedad',
      icono: '🎯',
      columnasRecomendadas: [
        'calorias',
        'proteinas',
        'carbohidratos',
        'grasas',
        'fibra',
        'vasos-agua',
        'adherencia',
      ],
      resumenesRecomendados: [
        {
          tipo: 'diario',
          metricas: ['calorias', 'proteinas', 'fibra'],
        },
        {
          tipo: 'semanal',
          metricas: ['calorias', 'proteinas', 'adherencia'],
        },
      ],
      formulasPredefinidas: {
        deficit_calorico: '=OBJETIVO_CALORIAS-SUM(A2:A100)',
        total_fibra: '=SUM(E2:E100)',
        ratio_fibra_calorias: '=E2/A2',
      },
      puntuacionCoincidencia: puntuacion,
      razones: generarRazones(
        focoCliente,
        metricas,
        nivelDetalle,
        'Pérdida de Peso',
        ['perdida-peso', 'deficit-calorico'],
        ['calorias', 'fibra']
      ),
    });
  }

  // Plantilla: Salud General
  if (
    focoCliente.includes('salud-general') ||
    focoCliente.includes('mantenimiento') ||
    nivelDetalle === 'basico' || nivelDetalle === 'intermedio'
  ) {
    const puntuacion = calcularPuntuacion(
      focoCliente,
      metricas,
      nivelDetalle,
      ['salud-general', 'mantenimiento'],
      ['calorias', 'proteinas', 'carbohidratos', 'grasas'],
      ['basico', 'intermedio']
    );

    plantillas.push({
      id: 'plantilla-salud-general',
      tipo: 'salud-general',
      nombre: 'Salud General',
      descripcion: 'Equilibrio nutricional para bienestar general',
      icono: '🌿',
      columnasRecomendadas: [
        'calorias',
        'proteinas',
        'carbohidratos',
        'grasas',
        'fibra',
        'vasos-agua',
      ],
      resumenesRecomendados: [
        {
          tipo: 'diario',
          metricas: ['calorias', 'proteinas', 'carbohidratos', 'grasas'],
        },
        {
          tipo: 'semanal',
          metricas: ['calorias', 'proteinas', 'fibra', 'vasos-agua'],
        },
      ],
      formulasPredefinidas: {
        balance_macros: '=(B2+C2+D2)/A2',
        total_fibra: '=SUM(E2:E100)',
      },
      puntuacionCoincidencia: puntuacion,
      razones: generarRazones(
        focoCliente,
        metricas,
        nivelDetalle,
        'Salud General',
        ['salud-general', 'mantenimiento'],
        ['calorias', 'proteinas', 'carbohidratos', 'grasas']
      ),
    });
  }

  // Ordenar por puntuación de coincidencia (mayor a menor)
  return plantillas.sort((a, b) => b.puntuacionCoincidencia - a.puntuacionCoincidencia);
}

/**
 * Aplica una plantilla sugerida a la configuración del cuestionario
 */
export async function aplicarPlantillaSugerida(
  cuestionario: RespuestaCuestionarioMetodologia,
  plantilla: PlantillaSugerida
): Promise<RespuestaCuestionarioMetodologia> {
  // Actualizar métricas según la plantilla
  const metricasActualizadas = [
    ...new Set([...cuestionario.metricas, ...plantilla.columnasRecomendadas]),
  ];

  // Actualizar columnas Excel
  const columnasActualizadas = plantilla.columnasRecomendadas.map((metrica, index) => ({
    id: metrica,
    label: obtenerLabelMetrica(metrica),
    visible: true,
    orden: index,
    formato: obtenerFormatoMetrica(metrica),
    ancho: 100,
  }));

  // Actualizar fórmulas personalizadas
  const formulasActualizadas = {
    ...cuestionario.formulasPersonalizadas,
    ...plantilla.formulasPredefinidas,
  };

  return {
    ...cuestionario,
    metricas: metricasActualizadas,
    columnasExcel: columnasActualizadas,
    formulasPersonalizadas: formulasActualizadas,
    actualizadoEn: new Date().toISOString(),
    version: cuestionario.version + 1,
  };
}

// Funciones auxiliares

function calcularPuntuacion(
  focoCliente: FocoCliente[],
  metricas: TipoMetricaExcel[],
  nivelDetalle: NivelDetalle,
  focosRelevantes: FocoCliente[],
  metricasRelevantes: TipoMetricaExcel[],
  nivelesRelevantes: NivelDetalle[]
): number {
  let puntuacion = 0;

  // Puntuación por foco del cliente (40 puntos máximo)
  const focosCoincidentes = focoCliente.filter((f) => focosRelevantes.includes(f)).length;
  puntuacion += (focosCoincidentes / focosRelevantes.length) * 40;

  // Puntuación por métricas (30 puntos máximo)
  const metricasCoincidentes = metricas.filter((m) => metricasRelevantes.includes(m)).length;
  puntuacion += (metricasCoincidentes / metricasRelevantes.length) * 30;

  // Puntuación por nivel de detalle (30 puntos máximo)
  if (nivelesRelevantes.includes(nivelDetalle)) {
    puntuacion += 30;
  }

  return Math.round(puntuacion);
}

function generarRazones(
  focoCliente: FocoCliente[],
  metricas: TipoMetricaExcel[],
  nivelDetalle: NivelDetalle,
  nombrePlantilla: string,
  focosRelevantes: FocoCliente[],
  metricasRelevantes: TipoMetricaExcel[]
): string[] {
  const razones: string[] = [];

  const focosCoincidentes = focoCliente.filter((f) => focosRelevantes.includes(f));
  if (focosCoincidentes.length > 0) {
    razones.push(
      `Tu foco en ${focosCoincidentes.map((f) => obtenerLabelFoco(f)).join(', ')} coincide con esta plantilla`
    );
  }

  const metricasCoincidentes = metricas.filter((m) => metricasRelevantes.includes(m));
  if (metricasCoincidentes.length > 0) {
    razones.push(
      `Incluyes métricas clave: ${metricasCoincidentes.map((m) => obtenerLabelMetrica(m)).join(', ')}`
    );
  }

  if (nivelDetalle === 'avanzado' || nivelDetalle === 'completo') {
    razones.push('Tu nivel de detalle avanzado se adapta bien a esta plantilla');
  }

  return razones;
}

function obtenerLabelMetrica(metrica: TipoMetricaExcel): string {
  const labels: Record<TipoMetricaExcel, string> = {
    calorias: 'Calorías (kcal)',
    proteinas: 'Proteínas (g)',
    carbohidratos: 'Carbohidratos (g)',
    grasas: 'Grasas (g)',
    fibra: 'Fibra (g)',
    azucares: 'Azúcares (g)',
    sodio: 'Sodio (mg)',
    'ratio-proteina': 'Ratio Proteína/kg',
    'vasos-agua': 'Vasos de Agua',
    adherencia: 'Adherencia (%)',
    'tiempo-preparacion': 'Tiempo Prep. (min)',
    coste: 'Coste (€)',
    'satisfaccion-prevista': 'Satisfacción Prevista',
  };
  return labels[metrica] || metrica;
}

function obtenerFormatoMetrica(metrica: TipoMetricaExcel): 'numero' | 'porcentaje' | 'moneda' {
  if (metrica === 'adherencia') return 'porcentaje';
  if (metrica === 'coste') return 'moneda';
  return 'numero';
}

function obtenerLabelFoco(foco: FocoCliente): string {
  const labels: Record<FocoCliente, string> = {
    'perdida-peso': 'Pérdida de Peso',
    'ganancia-muscular': 'Ganancia Muscular',
    rendimiento: 'Rendimiento',
    'salud-general': 'Salud General',
    'deficit-calorico': 'Déficit Calórico',
    'superavit-calorico': 'Superávit Calórico',
    mantenimiento: 'Mantenimiento',
    flexibilidad: 'Flexibilidad',
  };
  return labels[foco] || foco;
}

