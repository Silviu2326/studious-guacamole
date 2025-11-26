export interface CheckInEntreno {
  id?: string;
  clienteId: string;
  sesionId?: string;
  ejercicioId?: string;
  // Métricas de dispositivos wearables asociadas al check-in
  wearableMetrics?: {
    source: 'garmin' | 'fitbit' | 'apple' | 'whoop' | 'otro';
    heartRateBpm?: number;
    hrvMs?: number;
    capturedAt?: string;
    raw?: Record<string, any>;
  };
  // Adjuntos multimedia (fotos / videos) para técnica o molestias
  media?: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
    createdAt: string;
  }>;
  serie?: number;
  fecha: string;
  semaforo: 'rojo' | 'amarillo' | 'verde';
  sensaciones?: string;
  dolorLumbar: boolean;
  rpe?: number;
  observaciones?: string;
  ajusteAplicado?: boolean;
  // Campos extras definidos por plantillas personalizadas
  camposPersonalizados?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface HistorialCheckIn {
  checkIn: CheckInEntreno;
  fecha: string;
  tendencia?: 'mejora' | 'estable' | 'empeora';
}

export async function getCheckIns(clienteId?: string, sesionId?: string): Promise<CheckInEntreno[]> {
  // Datos falsos para desarrollo
  if (!clienteId) return [];
  
  const ahora = new Date();
  const datosFalsos: CheckInEntreno[] = [
    {
      id: '1',
      clienteId,
      sesionId,
      serie: 1,
      fecha: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      semaforo: 'verde',
      sensaciones: 'Excelente, me siento muy bien',
      dolorLumbar: false,
      rpe: 8,
      observaciones: 'Primera serie muy cómoda',
      ajusteAplicado: false,
      media: [],
      wearableMetrics: {
        source: 'garmin',
        heartRateBpm: 92,
        hrvMs: 58,
        capturedAt: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      createdAt: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      clienteId,
      sesionId,
      serie: 2,
      fecha: new Date(ahora.getTime() - 90 * 60 * 1000).toISOString(),
      semaforo: 'verde',
      sensaciones: 'Bien, con buena energía',
      dolorLumbar: false,
      rpe: 9,
      observaciones: 'Intensidad adecuada',
      ajusteAplicado: false,
      media: [],
      wearableMetrics: {
        source: 'garmin',
        heartRateBpm: 104,
        hrvMs: 52,
        capturedAt: new Date(ahora.getTime() - 90 * 60 * 1000).toISOString(),
      },
      createdAt: new Date(ahora.getTime() - 90 * 60 * 1000).toISOString(),
      updatedAt: new Date(ahora.getTime() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      clienteId,
      sesionId,
      serie: 3,
      fecha: new Date(ahora.getTime() - 60 * 60 * 1000).toISOString(),
      semaforo: 'amarillo',
      sensaciones: 'Regular, algo de fatiga',
      dolorLumbar: false,
      rpe: 12,
      observaciones: 'Notando algo de cansancio',
      ajusteAplicado: false,
      media: [],
      wearableMetrics: {
        source: 'garmin',
        heartRateBpm: 118,
        hrvMs: 46,
        capturedAt: new Date(ahora.getTime() - 60 * 60 * 1000).toISOString(),
      },
      createdAt: new Date(ahora.getTime() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(ahora.getTime() - 60 * 60 * 1000).toISOString(),
    },
  ];

  return Promise.resolve(datosFalsos);
}

export async function crearCheckIn(checkIn: Omit<CheckInEntreno, 'id' | 'createdAt' | 'updatedAt'>): Promise<CheckInEntreno | null> {
  // Simular creación con datos falsos
  const nuevoCheckIn: CheckInEntreno = {
    ...checkIn,
    id: `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    media: checkIn.media || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return Promise.resolve(nuevoCheckIn);
}

export async function actualizarCheckIn(id: string, checkIn: Partial<CheckInEntreno>): Promise<boolean> {
  // Simular actualización con datos falsos
  return Promise.resolve(true);
}

export async function getHistorialCheckIns(clienteId: string, dias?: number): Promise<HistorialCheckIn[]> {
  // Datos falsos para desarrollo
  const ahora = new Date();
  const historial: HistorialCheckIn[] = [];
  const diasAmostrar = dias || 30;
  
  // Generar check-ins de los últimos días
  for (let i = 0; i < 25; i++) {
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);
    const numSeries = Math.floor(Math.random() * 4) + 3; // 3-6 series por día
    
    for (let serie = 1; serie <= numSeries; serie++) {
      const semaforos: ('verde' | 'amarillo' | 'rojo')[] = ['verde', 'verde', 'verde', 'amarillo', 'amarillo', 'rojo'];
      const semaforo = semaforos[Math.floor(Math.random() * semaforos.length)];
      const tieneDolorLumbar = semaforo === 'rojo' || (semaforo === 'amarillo' && Math.random() > 0.7);
      const sensaciones = ['Excelente', 'Bien', 'Regular', 'Mal'];
      const sensacion = sensaciones[Math.floor(Math.random() * sensaciones.length)];
      const rpe = Math.floor(Math.random() * 15) + 6; // RPE entre 6-20
      
      const checkIn: CheckInEntreno = {
        id: `checkin_${i}_${serie}`,
        clienteId,
        serie,
        fecha: new Date(fecha.getTime() - serie * 30 * 60 * 1000).toISOString(),
        semaforo,
        sensaciones: `${sensacion}${Math.random() > 0.5 ? ', con buena forma' : ', intensidad adecuada'}`,
        dolorLumbar: tieneDolorLumbar,
        rpe,
        observaciones: serie === 1 ? 'Inicio de sesión' : `Serie ${serie}`,
        ajusteAplicado: semaforo === 'rojo' && Math.random() > 0.5,
        media: [],
        wearableMetrics: {
          source: 'garmin',
          heartRateBpm: 80 + Math.floor(Math.random() * 60),
          hrvMs: 40 + Math.floor(Math.random() * 30),
          capturedAt: new Date(fecha.getTime() - serie * 30 * 60 * 1000).toISOString(),
        },
        createdAt: fecha.toISOString(),
        updatedAt: fecha.toISOString(),
      };
      
      // Calcular tendencia comparando con serie anterior
      let tendencia: 'mejora' | 'estable' | 'empeora' | undefined = undefined;
      if (serie > 1) {
        const serieAnterior = historial.find(h => 
          new Date(h.fecha).toDateString() === fecha.toDateString() && 
          h.checkIn.serie === serie - 1
        );
        if (serieAnterior) {
          const semaforosOrden = { verde: 3, amarillo: 2, rojo: 1 };
          const ordenActual = semaforosOrden[semaforo];
          const ordenAnterior = semaforosOrden[serieAnterior.checkIn.semaforo];
          
          if (ordenActual > ordenAnterior) tendencia = 'mejora';
          else if (ordenActual < ordenAnterior) tendencia = 'empeora';
          else tendencia = 'estable';
        }
      }
      
      historial.push({
        checkIn,
        fecha: checkIn.fecha,
        tendencia,
      });
    }
  }
  
  // Ordenar por fecha descendente
  historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  return Promise.resolve(historial);
}

export async function getCheckInsAnalytics(clienteId?: string): Promise<{
  totalCheckIns: number;
  promedioSemaforo: number;
  dolorLumbarCount: number;
  promedioRPE: number;
  tendencias: Array<{ fecha: string; verde: number; amarillo: number; rojo: number }>;
  distribucionSemaforos: { verde: number; amarillo: number; rojo: number };
  evolucionRPE: Array<{ fecha: string; promedio: number; maximo: number; minimo: number }>;
  frecuenciaDolor: number;
  tendenciaGeneral: 'mejora' | 'estable' | 'empeora';
}> {
  // Datos falsos para desarrollo
  if (!clienteId) {
    return {
      totalCheckIns: 0,
      promedioSemaforo: 0,
      dolorLumbarCount: 0,
      promedioRPE: 0,
      tendencias: [],
      distribucionSemaforos: { verde: 0, amarillo: 0, rojo: 0 },
      evolucionRPE: [],
      frecuenciaDolor: 0,
      tendenciaGeneral: 'estable',
    };
  }
  
  const ahora = new Date();
  const tendencias: Array<{ fecha: string; verde: number; amarillo: number; rojo: number }> = [];
  
  // Generar tendencias de los últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);
    const verde = Math.floor(Math.random() * 8) + 5;
    const amarillo = Math.floor(Math.random() * 3) + 1;
    const rojo = Math.floor(Math.random() * 2);
    
    tendencias.push({
      fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      verde,
      amarillo,
      rojo,
    });
  }
  
  const totalCheckIns = tendencias.reduce((sum, t) => sum + t.verde + t.amarillo + t.rojo, 0);
  const totalVerde = tendencias.reduce((sum, t) => sum + t.verde, 0);
  const totalAmarillo = tendencias.reduce((sum, t) => sum + t.amarillo, 0);
  const totalRojo = tendencias.reduce((sum, t) => sum + t.rojo, 0);
  
  // Promedio semáforo: verde=3, amarillo=2, rojo=1
  const promedioSemaforo = totalCheckIns > 0 
    ? (totalVerde * 3 + totalAmarillo * 2 + totalRojo * 1) / totalCheckIns 
    : 0;
  
  const dolorLumbarCount = Math.floor(totalCheckIns * 0.15); // 15% con dolor
  const promedioRPE = 10.5 + Math.random() * 2; // RPE promedio entre 10.5-12.5
  
  // Evolución RPE de los últimos 7 días
  const evolucionRPE: Array<{ fecha: string; promedio: number; maximo: number; minimo: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);
    const promedio = 9 + Math.random() * 4;
    evolucionRPE.push({
      fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      promedio: Math.round(promedio * 10) / 10,
      maximo: Math.round((promedio + 2 + Math.random() * 2) * 10) / 10,
      minimo: Math.round((promedio - 2 - Math.random() * 2) * 10) / 10,
    });
  }
  
  const frecuenciaDolor = (dolorLumbarCount / totalCheckIns) * 100;
  const tendenciaGeneral = promedioSemaforo > 2.5 ? 'mejora' : promedioSemaforo > 2.0 ? 'estable' : 'empeora';
  
  return Promise.resolve({
    totalCheckIns,
    promedioSemaforo: Math.round(promedioSemaforo * 100) / 100,
    dolorLumbarCount,
    promedioRPE: Math.round(promedioRPE * 10) / 10,
    tendencias,
    distribucionSemaforos: {
      verde: totalVerde,
      amarillo: totalAmarillo,
      rojo: totalRojo,
    },
    evolucionRPE,
    frecuenciaDolor: Math.round(frecuenciaDolor * 10) / 10,
    tendenciaGeneral,
  });
}

/**
 * Analytics agregado para múltiples clientes (mock).
 * Devuelve métricas por cliente y un resumen comparativo.
 */
export async function getCheckInsAnalyticsClientes(clienteIds: string[]): Promise<{
  porCliente: Array<{
    clienteId: string;
    nombre?: string;
    totalCheckIns: number;
    promedioSemaforo: number;
    dolorLumbarCount: number;
    promedioRPE: number;
    distribucionSemaforos: { verde: number; amarillo: number; rojo: number };
    tendenciaGeneral: 'mejora' | 'estable' | 'empeora';
  }>;
  comparativo: {
    totalClientes: number;
    totalCheckIns: number;
    promedioSemaforoGlobal: number;
    promedioRPEGlobal: number;
    rankingPorRiesgo: Array<{ clienteId: string; scoreRiesgo: number }>;
    distribucionGlobal: { verde: number; amarillo: number; rojo: number };
  };
}> {
  if (!clienteIds || clienteIds.length === 0) {
    return {
      porCliente: [],
      comparativo: {
        totalClientes: 0,
        totalCheckIns: 0,
        promedioSemaforoGlobal: 0,
        promedioRPEGlobal: 0,
        rankingPorRiesgo: [],
        distribucionGlobal: { verde: 0, amarillo: 0, rojo: 0 },
      },
    };
  }

  // Reutilizamos el mock individual para generar datos por cliente
  const porCliente = await Promise.all(
    clienteIds.map(async (id) => {
      const a = await getCheckInsAnalytics(id);
      return {
        clienteId: id,
        totalCheckIns: a.totalCheckIns,
        promedioSemaforo: a.promedioSemaforo,
        dolorLumbarCount: a.dolorLumbarCount,
        promedioRPE: a.promedioRPE,
        distribucionSemaforos: a.distribucionSemaforos,
        tendenciaGeneral: a.tendenciaGeneral,
      };
    })
  );

  const totalCheckIns = porCliente.reduce((s, c) => s + c.totalCheckIns, 0);
  const totalVerde = porCliente.reduce((s, c) => s + c.distribucionSemaforos.verde, 0);
  const totalAmarillo = porCliente.reduce((s, c) => s + c.distribucionSemaforos.amarillo, 0);
  const totalRojo = porCliente.reduce((s, c) => s + c.distribucionSemaforos.rojo, 0);
  const promedioSemaforoGlobal =
    totalCheckIns > 0 ? (totalVerde * 3 + totalAmarillo * 2 + totalRojo * 1) / totalCheckIns : 0;
  const promedioRPEGlobal =
    porCliente.length > 0
      ? Math.round(
          (porCliente.reduce((s, c) => s + (isFinite(c.promedioRPE) ? c.promedioRPE : 0), 0) / porCliente.length) * 10
        ) / 10
      : 0;

  // Score de riesgo simple: pondera rojo>amarillo por check-in
  const rankingPorRiesgo = porCliente
    .map((c) => {
      const scoreTotal = c.distribucionSemaforos.rojo * 2 + c.distribucionSemaforos.amarillo * 1;
      const scoreRiesgo = c.totalCheckIns > 0 ? Math.round((scoreTotal / c.totalCheckIns) * 100) / 100 : 0;
      return { clienteId: c.clienteId, scoreRiesgo };
    })
    .sort((a, b) => b.scoreRiesgo - a.scoreRiesgo);

  return {
    porCliente,
    comparativo: {
      totalClientes: clienteIds.length,
      totalCheckIns,
      promedioSemaforoGlobal: Math.round(promedioSemaforoGlobal * 100) / 100,
      promedioRPEGlobal,
      rankingPorRiesgo,
      distribucionGlobal: { verde: totalVerde, amarillo: totalAmarillo, rojo: totalRojo },
    },
  };
}

// Objetivos/semanales del plan de entrenamiento asignado (mock)
export interface ObjetivosPlanSemanal {
  sesionesObjetivo: number; // sesiones/semana
  duracionMinutosObjetivo: number; // minutos/semana
  rpePromedioObjetivo: number; // objetivo de carga interna aproximada
}

export async function getObjetivosPlanSemana(clienteId?: string): Promise<ObjetivosPlanSemanal | null> {
  if (!clienteId) return null;
  // Mock simple basado en frecuencia típica
  const frecuenciasPosibles = [3, 4, 5];
  const sesionesObjetivo = frecuenciasPosibles[Math.floor(Math.random() * frecuenciasPosibles.length)];
  const duracionMinutosObjetivo = sesionesObjetivo * (35 + Math.floor(Math.random() * 21)); // 35-55m por sesión
  const rpePromedioObjetivo = 7 + Math.random() * 1.5; // 7.0 - 8.5
  return {
    sesionesObjetivo,
    duracionMinutosObjetivo,
    rpePromedioObjetivo: Math.round(rpePromedioObjetivo * 10) / 10,
  };
}

