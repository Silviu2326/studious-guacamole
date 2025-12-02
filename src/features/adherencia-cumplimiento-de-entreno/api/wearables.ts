/**
 * API para sincronización de datos de wearables (frecuencia cardíaca y recuperación)
 */

export interface DatosWearable {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  frecuenciaCardiaca: {
    promedio: number; // bpm
    maximo: number; // bpm
    minimo: number; // bpm
    zonas: {
      reposo: number; // minutos
      moderada: number; // minutos
      intensa: number; // minutos
      maxima: number; // minutos
    };
  };
  recuperacion: {
    hrv: number; // Heart Rate Variability (ms)
    calidadSueño: number; // 0-100
    tiempoRecuperacion: number; // horas desde último entrenamiento
    estado: 'recuperado' | 'en_recuperacion' | 'sobrecarga' | 'fatiga';
  };
  esfuerzo: {
    cargaEntrenamiento: number; // 0-100
    rpe: number; // Rate of Perceived Exertion (1-10)
  };
}

export interface CorrelacionAdherenciaWearable {
  clienteId: string;
  clienteNombre: string;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  adherencia: number; // 0-100
  datosWearable: {
    frecuenciaCardiacaPromedio: number;
    hrvPromedio: number;
    calidadSueñoPromedio: number;
    sesionesConSobrecarga: number;
    sesionesConFatiga: number;
  };
  correlacion: {
    adherenciaVsFrecuenciaCardiaca: number; // -1 a 1
    adherenciaVsRecuperacion: number; // -1 a 1
    adherenciaVsSobrecarga: number; // -1 a 1
  };
  alertas: {
    sobrecarga: boolean;
    fatiga: boolean;
    recuperacionInsuficiente: boolean;
  };
}

// Simulación de almacenamiento en memoria
const datosWearables = new Map<string, DatosWearable[]>();

/**
 * Obtener datos de wearables para un cliente en un rango de fechas
 */
export const obtenerDatosWearables = async (
  clienteId: string,
  fechaInicio: Date,
  fechaFin: Date
): Promise<DatosWearable[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const datos = datosWearables.get(clienteId) || [];
  return datos.filter(
    d => d.fecha >= fechaInicio && d.fecha <= fechaFin
  );
};

/**
 * Sincronizar datos de wearables para un cliente
 */
export const sincronizarDatosWearables = async (
  clienteId: string,
  clienteNombre: string,
  datos: Omit<DatosWearable, 'id' | 'clienteId' | 'clienteNombre'>
): Promise<DatosWearable> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const nuevoDato: DatosWearable = {
    ...datos,
    id: `wearable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    clienteId,
    clienteNombre,
  };

  const datosExistentes = datosWearables.get(clienteId) || [];
  datosExistentes.push(nuevoDato);
  datosWearables.set(clienteId, datosExistentes);

  return nuevoDato;
};

/**
 * Obtener correlación entre adherencia y datos de wearables
 */
export const obtenerCorrelacionAdherenciaWearable = async (
  clienteId: string,
  clienteNombre: string,
  adherencia: number,
  fechaInicio: Date,
  fechaFin: Date
): Promise<CorrelacionAdherenciaWearable> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const datos = await obtenerDatosWearables(clienteId, fechaInicio, fechaFin);

  if (datos.length === 0) {
    // Retornar datos vacíos si no hay datos de wearables
    return {
      clienteId,
      clienteNombre,
      periodo: { inicio: fechaInicio, fin: fechaFin },
      adherencia,
      datosWearable: {
        frecuenciaCardiacaPromedio: 0,
        hrvPromedio: 0,
        calidadSueñoPromedio: 0,
        sesionesConSobrecarga: 0,
        sesionesConFatiga: 0,
      },
      correlacion: {
        adherenciaVsFrecuenciaCardiaca: 0,
        adherenciaVsRecuperacion: 0,
        adherenciaVsSobrecarga: 0,
      },
      alertas: {
        sobrecarga: false,
        fatiga: false,
        recuperacionInsuficiente: false,
      },
    };
  }

  const frecuenciaCardiacaPromedio = datos.reduce((sum, d) => sum + d.frecuenciaCardiaca.promedio, 0) / datos.length;
  const hrvPromedio = datos.reduce((sum, d) => sum + d.recuperacion.hrv, 0) / datos.length;
  const calidadSueñoPromedio = datos.reduce((sum, d) => sum + d.recuperacion.calidadSueño, 0) / datos.length;
  const sesionesConSobrecarga = datos.filter(d => d.recuperacion.estado === 'sobrecarga').length;
  const sesionesConFatiga = datos.filter(d => d.recuperacion.estado === 'fatiga').length;

  // Calcular correlaciones simplificadas
  // En producción, esto usaría análisis estadístico real
  const correlacionFrecuenciaCardiaca = calcularCorrelacion(
    adherencia,
    frecuenciaCardiacaPromedio,
    60, // rango esperado de FC
    100
  );
  const correlacionRecuperacion = calcularCorrelacion(
    adherencia,
    hrvPromedio,
    0, // rango esperado de HRV
    100
  );
  const correlacionSobrecarga = sesionesConSobrecarga > 0
    ? -0.5 // Correlación negativa: más sobrecarga = menos adherencia
    : 0;

  const alertas = {
    sobrecarga: sesionesConSobrecarga > datos.length * 0.3, // Más del 30% de sesiones con sobrecarga
    fatiga: sesionesConFatiga > datos.length * 0.2, // Más del 20% de sesiones con fatiga
    recuperacionInsuficiente: hrvPromedio < 30 || calidadSueñoPromedio < 60,
  };

  return {
    clienteId,
    clienteNombre,
    periodo: { inicio: fechaInicio, fin: fechaFin },
    adherencia,
    datosWearable: {
      frecuenciaCardiacaPromedio: Math.round(frecuenciaCardiacaPromedio),
      hrvPromedio: Math.round(hrvPromedio),
      calidadSueñoPromedio: Math.round(calidadSueñoPromedio),
      sesionesConSobrecarga,
      sesionesConFatiga,
    },
    correlacion: {
      adherenciaVsFrecuenciaCardiaca: correlacionFrecuenciaCardiaca,
      adherenciaVsRecuperacion: correlacionRecuperacion,
      adherenciaVsSobrecarga: correlacionSobrecarga,
    },
    alertas,
  };
};

/**
 * Calcular correlación simplificada entre dos valores
 */
function calcularCorrelacion(
  valor1: number,
  valor2: number,
  min2: number,
  max2: number
): number {
  // Normalizar valor2 al rango 0-1
  const normalizado = (valor2 - min2) / (max2 - min2);
  // Normalizar valor1 al rango 0-1 (asumiendo 0-100)
  const normalizado1 = valor1 / 100;
  
  // Calcular correlación simple (en producción usar Pearson o Spearman)
  const diferencia = Math.abs(normalizado1 - normalizado);
  return 1 - diferencia * 2; // Retorna valor entre -1 y 1
}

/**
 * Obtener datos de wearables para múltiples clientes
 */
export const obtenerDatosWearablesMultiples = async (
  clienteIds: string[],
  fechaInicio: Date,
  fechaFin: Date
): Promise<Map<string, DatosWearable[]>> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const resultado = new Map<string, DatosWearable[]>();
  
  for (const clienteId of clienteIds) {
    const datos = await obtenerDatosWearables(clienteId, fechaInicio, fechaFin);
    resultado.set(clienteId, datos);
  }

  return resultado;
};

/**
 * Simular datos de wearables para desarrollo/demo
 */
export const simularDatosWearables = async (
  clienteId: string,
  clienteNombre: string,
  cantidad: number = 7
): Promise<DatosWearable[]> => {
  const datos: DatosWearable[] = [];
  const ahora = new Date();

  for (let i = 0; i < cantidad; i++) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - (cantidad - i - 1));

    const fcBase = 65 + Math.random() * 20; // 65-85 bpm base
    const fcMax = fcBase + 30 + Math.random() * 40; // picos durante ejercicio
    const fcMin = fcBase - 10; // reposo

    const hrv = 30 + Math.random() * 50; // 30-80 ms
    const calidadSueño = 60 + Math.random() * 40; // 60-100

    let estado: 'recuperado' | 'en_recuperacion' | 'sobrecarga' | 'fatiga';
    if (hrv < 35 || calidadSueño < 65) {
      estado = Math.random() > 0.5 ? 'sobrecarga' : 'fatiga';
    } else if (hrv < 45) {
      estado = 'en_recuperacion';
    } else {
      estado = 'recuperado';
    }

    const dato: DatosWearable = {
      id: `wearable-${Date.now()}-${i}`,
      clienteId,
      clienteNombre,
      fecha,
      frecuenciaCardiaca: {
        promedio: Math.round(fcBase),
        maximo: Math.round(fcMax),
        minimo: Math.round(fcMin),
        zonas: {
          reposo: Math.round(480 + Math.random() * 120), // 8-10 horas
          moderada: Math.round(30 + Math.random() * 60), // 30-90 min
          intensa: Math.round(15 + Math.random() * 30), // 15-45 min
          maxima: Math.round(5 + Math.random() * 10), // 5-15 min
        },
      },
      recuperacion: {
        hrv: Math.round(hrv),
        calidadSueño: Math.round(calidadSueño),
        tiempoRecuperacion: Math.round(12 + Math.random() * 36), // 12-48 horas
        estado,
      },
      esfuerzo: {
        cargaEntrenamiento: Math.round(50 + Math.random() * 50), // 50-100
        rpe: Math.round(5 + Math.random() * 5), // 5-10
      },
    };

    datos.push(dato);
  }

  // Guardar datos simulados
  const datosExistentes = datosWearables.get(clienteId) || [];
  datosExistentes.push(...datos);
  datosWearables.set(clienteId, datosExistentes);

  return datos;
};

