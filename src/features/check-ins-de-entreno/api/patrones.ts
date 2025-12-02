import { CheckInEntreno } from './checkins';

export interface PatronCheckIn {
  tipo: 'dolor_lumbar_recurrente' | 'fatiga_alta' | 'rpe_bajo' | 'sensaciones_negativas' | 'patron_positivo';
  descripcion: string;
  frecuencia: number;
  ultimaOcurrencia: string;
  severidad: 'baja' | 'media' | 'alta';
  recomendaciones: string[];
}

export interface AnalisisPatrones {
  clienteId: string;
  patrones: PatronCheckIn[];
  tendenciaGeneral: 'mejora' | 'estable' | 'empeora';
  recomendacionesGlobales: string[];
}

export async function analizarPatrones(clienteId: string): Promise<AnalisisPatrones | null> {
  // Datos falsos para desarrollo
  const ahora = new Date();
  
  const patrones: PatronCheckIn[] = [
    {
      tipo: 'dolor_lumbar_recurrente',
      descripcion: 'Dolor lumbar reportado en el 18% de los check-ins de los últimos 30 días',
      frecuencia: 12,
      ultimaOcurrencia: new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      severidad: 'media',
      recomendaciones: [
        'Incorporar ejercicios de movilidad lumbar antes del entrenamiento',
        'Evaluar técnica de ejecución en ejercicios de espalda',
        'Considerar reducir carga en ejercicios que generen estrés lumbar',
        'Implementar trabajo de fortalecimiento del core',
      ],
    },
    {
      tipo: 'fatiga_alta',
      descripcion: 'RPE consistentemente alto (15-18) en últimas sesiones',
      frecuencia: 15,
      ultimaOcurrencia: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      severidad: 'alta',
      recomendaciones: [
        'Aumentar tiempo de descanso entre series de 90s a 120s',
        'Considerar reducir volumen de entrenamiento semanal',
        'Implementar semana de descarga',
        'Evaluar calidad del sueño y recuperación',
      ],
    },
    {
      tipo: 'rpe_bajo',
      descripcion: 'RPE bajo (6-8) en ejercicios principales sugiere posible sub-entrenamiento',
      frecuencia: 8,
      ultimaOcurrencia: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      severidad: 'baja',
      recomendaciones: [
        'Evaluar si el atleta está listo para progresar en carga',
        'Revisar objetivos de entrenamiento',
        'Considerar aumentar intensidad de forma progresiva',
      ],
    },
    {
      tipo: 'sensaciones_negativas',
      descripcion: 'Sensaciones negativas (Regular/Mal) en el 25% de las series',
      frecuencia: 20,
      ultimaOcurrencia: new Date(ahora.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      severidad: 'media',
      recomendaciones: [
        'Dialogar con el atleta sobre factores externos (estrés, sueño, nutrición)',
        'Ajustar periodización del entrenamiento',
        'Implementar técnicas de recuperación activa',
      ],
    },
    {
      tipo: 'patron_positivo',
      descripcion: 'Mejora consistente en semáforos durante últimas 2 semanas',
      frecuencia: 14,
      ultimaOcurrencia: new Date(ahora.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      severidad: 'baja',
      recomendaciones: [
        'Mantener progresión actual',
        'El atleta está adaptándose bien al programa',
        'Considerar aumentar volumen o intensidad gradualmente',
      ],
    },
  ];
  
  const recomendacionesGlobales = [
    'El atleta muestra buena adaptación general al programa de entrenamiento',
    'Priorizar trabajo preventivo para reducir incidencia de dolor lumbar',
    'Monitorear carga de fatiga para evitar sobre-entrenamiento',
    'Mantener comunicación activa sobre bienestar y sensaciones',
    'Continuar con progresión gradual y periodizada',
  ];
  
  const tendenciaGeneral: 'mejora' | 'estable' | 'empeora' = 'mejora';
  
  return Promise.resolve({
    clienteId,
    patrones,
    tendenciaGeneral,
    recomendacionesGlobales,
  });
}

export async function aplicarAjusteAutomatico(
  clienteId: string,
  checkInId: string,
  tipoAjuste: 'reducir_intensidad' | 'cambiar_ejercicio' | 'aumentar_descanso' | 'mantener'
): Promise<boolean> {
  // Simular aplicación de ajuste con datos falsos
  return Promise.resolve(true);
}

