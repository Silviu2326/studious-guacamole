import type {
  DatosSeguimientoImportados,
  ComparacionPlanRealidad,
  ConfiguracionImportacion,
  TipoAppSeguimiento,
  SintomaDigestivo,
  MacrosNutricionales,
  TipoComida,
  Dieta,
} from '../types';
import { getDieta } from './dietas';

// Mock storage para datos importados
const datosImportadosStorage: Record<string, DatosSeguimientoImportados[]> = {};
const comparacionesStorage: Record<string, ComparacionPlanRealidad[]> = {};
const configuracionesStorage: Record<string, ConfiguracionImportacion> = {};

/**
 * Obtiene la configuración de importación para una dieta
 */
export async function getConfiguracionImportacion(
  dietaId: string,
  clienteId: string
): Promise<ConfiguracionImportacion | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const key = `${dietaId}-${clienteId}`;
  if (!configuracionesStorage[key]) {
    // Crear configuración por defecto
    const configDefault: ConfiguracionImportacion = {
      appOrigen: 'myfitnesspal',
      clienteId,
      dietaId,
      sincronizacionAutomatica: false,
      frecuenciaSincronizacion: 'manual',
      importarCalorias: true,
      importarMacros: true,
      importarSintomas: true,
      importarDatosAdicionales: false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    configuracionesStorage[key] = configDefault;
  }
  return configuracionesStorage[key];
}

/**
 * Guarda o actualiza la configuración de importación
 */
export async function guardarConfiguracionImportacion(
  config: ConfiguracionImportacion
): Promise<ConfiguracionImportacion> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const key = `${config.dietaId}-${config.clienteId}`;
  configuracionesStorage[key] = {
    ...config,
    actualizadoEn: new Date().toISOString(),
  };
  return configuracionesStorage[key];
}

/**
 * Importa datos de una app de seguimiento
 */
export async function importarDatosSeguimiento(
  dietaId: string,
  clienteId: string,
  appOrigen: TipoAppSeguimiento,
  fecha: string,
  credenciales?: Record<string, any>
): Promise<DatosSeguimientoImportados> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simular importación de datos desde la app externa
  const datosImportados: DatosSeguimientoImportados = {
    id: `import-${Date.now()}`,
    clienteId,
    dietaId,
    appOrigen,
    fecha,
    caloriasConsumidas: {
      total: 1850,
      desayuno: 420,
      mediaManana: 150,
      almuerzo: 650,
      merienda: 180,
      cena: 450,
    },
    macrosConsumidos: {
      calorias: 1850,
      proteinas: 145,
      carbohidratos: 180,
      grasas: 65,
    },
    sintomasDigestivos: [
      {
        id: 'sintoma-1',
        tipo: 'hinchazon',
        intensidad: 'leve',
        descripcion: 'Hinchazón después del almuerzo',
        hora: '14:30',
        fecha,
      },
    ],
    datosAdicionales: {
      hidratacion: 2000,
      peso: 72.5,
    },
    fechaImportacion: new Date().toISOString(),
    sincronizado: true,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  if (!datosImportadosStorage[dietaId]) {
    datosImportadosStorage[dietaId] = [];
  }
  datosImportadosStorage[dietaId].push(datosImportados);

  return datosImportados;
}

/**
 * Obtiene todos los datos importados para una dieta
 */
export async function getDatosImportados(
  dietaId: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<DatosSeguimientoImportados[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const datos = datosImportadosStorage[dietaId] || [];

  if (fechaInicio || fechaFin) {
    return datos.filter((d) => {
      const fecha = new Date(d.fecha);
      if (fechaInicio && fecha < new Date(fechaInicio)) return false;
      if (fechaFin && fecha > new Date(fechaFin)) return false;
      return true;
    });
  }

  return datos;
}

/**
 * Compara el plan con la realidad usando datos importados
 */
export async function compararPlanRealidad(
  dietaId: string,
  clienteId: string,
  fecha: string
): Promise<ComparacionPlanRealidad> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Obtener datos importados para la fecha
  const datosImportados = await getDatosImportados(dietaId, fecha, fecha);
  const datosFecha = datosImportados.find((d) => d.fecha === fecha);

  if (!datosFecha) {
    throw new Error('No hay datos importados para esta fecha');
  }

  // Calcular macros del plan para la fecha
  const macrosPlan: MacrosNutricionales = dieta.comidas.reduce(
    (acc, comida) => ({
      calorias: acc.calorias + comida.calorias,
      proteinas: acc.proteinas + comida.proteinas,
      carbohidratos: acc.carbohidratos + comida.carbohidratos,
      grasas: acc.grasas + comida.grasas,
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  const macrosRealidad = datosFecha.macrosConsumidos || {
    calorias: datosFecha.caloriasConsumidas?.total || 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  };

  // Calcular comparación de calorías
  const diferenciaCalorias = macrosRealidad.calorias - macrosPlan.calorias;
  const porcentajeDiferenciaCalorias =
    macrosPlan.calorias > 0 ? (diferenciaCalorias / macrosPlan.calorias) * 100 : 0;
  const cumplimientoCalorias = Math.max(
    0,
    Math.min(100, 100 - Math.abs(porcentajeDiferenciaCalorias))
  );

  // Calcular comparación de macros
  const calcularComparacionMacro = (plan: number, realidad: number) => {
    const diferencia = realidad - plan;
    const porcentajeDiferencia = plan > 0 ? (diferencia / plan) * 100 : 0;
    return { plan, realidad, diferencia, porcentajeDiferencia };
  };

  // Comparación por tipo de comida
  const comparacionPorComida: ComparacionPlanRealidad['comparacionPorComida'] = [];
  const tiposComida: TipoComida[] = [
    'desayuno',
    'media-manana',
    'almuerzo',
    'merienda',
    'cena',
    'post-entreno',
  ];

  tiposComida.forEach((tipo) => {
    const comidasPlan = dieta.comidas.filter((c) => c.tipo === tipo);
    const macrosPlanComida: MacrosNutricionales = comidasPlan.reduce(
      (acc, comida) => ({
        calorias: acc.calorias + comida.calorias,
        proteinas: acc.proteinas + comida.proteinas,
        carbohidratos: acc.carbohidratos + comida.carbohidratos,
        grasas: acc.grasas + comida.grasas,
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );

    const caloriasRealidadComida =
      datosFecha.caloriasConsumidas?.[tipo === 'media-manana' ? 'mediaManana' : tipo] || 0;
    const macrosRealidadComida: MacrosNutricionales = {
      calorias: caloriasRealidadComida,
      proteinas: 0, // Simplificado - en producción se calcularía desde los datos reales
      carbohidratos: 0,
      grasas: 0,
    };

    const diferenciaComida: MacrosNutricionales = {
      calorias: macrosRealidadComida.calorias - macrosPlanComida.calorias,
      proteinas: macrosRealidadComida.proteinas - macrosPlanComida.proteinas,
      carbohidratos: macrosRealidadComida.carbohidratos - macrosPlanComida.carbohidratos,
      grasas: macrosRealidadComida.grasas - macrosPlanComida.grasas,
    };

    const cumplimientoComida =
      macrosPlanComida.calorias > 0
        ? Math.max(
            0,
            Math.min(
              100,
              100 - Math.abs((diferenciaComida.calorias / macrosPlanComida.calorias) * 100)
            )
          )
        : 0;

    comparacionPorComida.push({
      tipoComida: tipo,
      plan: macrosPlanComida,
      realidad: macrosRealidadComida,
      diferencia: diferenciaComida,
      cumplimiento: cumplimientoComida,
    });
  });

  // Análisis básico
  const analisis = {
    areasMejora: [] as string[],
    puntosFuertes: [] as string[],
    recomendaciones: [] as string[],
    patronesDetectados: [] as string[],
  };

  if (diferenciaCalorias > 200) {
    analisis.areasMejora.push('Consumo de calorías por encima del plan');
    analisis.recomendaciones.push('Considera reducir las porciones o ajustar los snacks');
  } else if (diferenciaCalorias < -200) {
    analisis.areasMejora.push('Consumo de calorías por debajo del plan');
    analisis.recomendaciones.push('Asegúrate de cumplir con todas las comidas planificadas');
  } else {
    analisis.puntosFuertes.push('Cumplimiento adecuado del plan calórico');
  }

  if (datosFecha.sintomasDigestivos && datosFecha.sintomasDigestivos.length > 0) {
    analisis.areasMejora.push('Síntomas digestivos registrados');
    analisis.recomendaciones.push(
      'Revisa los alimentos que pueden estar causando molestias digestivas'
    );
  }

  const comparacion: ComparacionPlanRealidad = {
    id: `comparacion-${Date.now()}`,
    dietaId,
    clienteId,
    fecha,
    comparacionCalorias: {
      plan: macrosPlan.calorias,
      realidad: macrosRealidad.calorias,
      diferencia: diferenciaCalorias,
      porcentajeDiferencia: porcentajeDiferenciaCalorias,
      cumplimiento: cumplimientoCalorias,
    },
    comparacionMacros: {
      proteinas: calcularComparacionMacro(macrosPlan.proteinas, macrosRealidad.proteinas),
      carbohidratos: calcularComparacionMacro(
        macrosPlan.carbohidratos,
        macrosRealidad.carbohidratos
      ),
      grasas: calcularComparacionMacro(macrosPlan.grasas, macrosRealidad.grasas),
    },
    comparacionPorComida,
    sintomasDigestivos: datosFecha.sintomasDigestivos || [],
    analisis,
    datosImportadosId: datosFecha.id,
    generadoEn: new Date().toISOString(),
  };

  if (!comparacionesStorage[dietaId]) {
    comparacionesStorage[dietaId] = [];
  }
  comparacionesStorage[dietaId].push(comparacion);

  return comparacion;
}

/**
 * Obtiene todas las comparaciones para una dieta
 */
export async function getComparaciones(
  dietaId: string,
  fechaInicio?: string,
  fechaFin?: string
): Promise<ComparacionPlanRealidad[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const comparaciones = comparacionesStorage[dietaId] || [];

  if (fechaInicio || fechaFin) {
    return comparaciones.filter((c) => {
      const fecha = new Date(c.fecha);
      if (fechaInicio && fecha < new Date(fechaInicio)) return false;
      if (fechaFin && fecha > new Date(fechaFin)) return false;
      return true;
    });
  }

  return comparaciones;
}

/**
 * Sincroniza automáticamente datos desde una app de seguimiento
 */
export async function sincronizarDatosAutomaticos(
  dietaId: string,
  clienteId: string
): Promise<DatosSeguimientoImportados[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const config = await getConfiguracionImportacion(dietaId, clienteId);
  if (!config || !config.sincronizacionAutomatica) {
    throw new Error('Sincronización automática no configurada');
  }

  // Simular sincronización de últimos 7 días
  const datosSincronizados: DatosSeguimientoImportados[] = [];
  const hoy = new Date();

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];

    try {
      const datos = await importarDatosSeguimiento(
        dietaId,
        clienteId,
        config.appOrigen,
        fechaStr,
        config.credenciales
      );
      datosSincronizados.push(datos);
    } catch (error) {
      console.error(`Error sincronizando datos para ${fechaStr}:`, error);
    }
  }

  return datosSincronizados;
}

