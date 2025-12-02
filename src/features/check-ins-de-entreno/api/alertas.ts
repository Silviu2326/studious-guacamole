import { CheckInEntreno } from './checkins';

export interface AlertaCheckIn {
  id?: string;
  checkInId: string;
  tipo: 'dolor_lumbar' | 'fatiga_extrema' | 'patron_negativo' | 'sensacion_alerta';
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  mensaje: string;
  fecha: string;
  resuelta: boolean;
  recomendacion?: string;
}

export async function crearAlerta(alerta: Omit<AlertaCheckIn, 'id'>): Promise<AlertaCheckIn | null> {
  // Simular creación con datos falsos
  const nuevaAlerta: AlertaCheckIn = {
    ...alerta,
    id: `alerta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  
  return Promise.resolve(nuevaAlerta);
}

export async function getAlertas(clienteId?: string, resueltas?: boolean): Promise<AlertaCheckIn[]> {
  // Datos falsos para desarrollo
  if (!clienteId) return [];
  
  const ahora = new Date();
  const alertas: AlertaCheckIn[] = [];
  
  // Generar alertas activas (no resueltas)
  if (resueltas === false || resueltas === undefined) {
    const tiposAlerta: Array<'dolor_lumbar' | 'fatiga_extrema' | 'patron_negativo' | 'sensacion_alerta'> = [
      'dolor_lumbar',
      'fatiga_extrema',
      'patron_negativo',
      'sensacion_alerta',
    ];
    const severidades: Array<'baja' | 'media' | 'alta' | 'critica'> = ['baja', 'media', 'alta', 'critica'];
    
    for (let i = 0; i < 8; i++) {
      const tipo = tiposAlerta[Math.floor(Math.random() * tiposAlerta.length)];
      const severidad = severidades[Math.floor(Math.random() * severidades.length)];
      const fecha = new Date(ahora.getTime() - i * 12 * 60 * 60 * 1000);
      
      const mensajes: Record<string, string> = {
        dolor_lumbar: 'Se detectó dolor lumbar durante el ejercicio',
        fatiga_extrema: 'Nivel de fatiga extremadamente alto reportado',
        patron_negativo: 'Patrón negativo detectado en los últimos check-ins',
        sensacion_alerta: 'Sensaciones consistentemente negativas en múltiples series',
      };
      
      const recomendaciones: Record<string, string> = {
        dolor_lumbar: severidad === 'critica' 
          ? 'Detener ejercicio inmediatamente y consultar médico' 
          : 'Considerar modificar el ejercicio o reducir la intensidad',
        fatiga_extrema: 'Aumentar tiempo de descanso entre series y reducir volumen',
        patron_negativo: 'Revisar programa de entrenamiento y ajustar progresión',
        sensacion_alerta: 'Evaluar carga de entrenamiento y considerar periodización',
      };
      
      alertas.push({
        id: `alerta_activa_${i}`,
        checkInId: `checkin_${i}`,
        tipo,
        severidad,
        mensaje: mensajes[tipo],
        fecha: fecha.toISOString(),
        resuelta: false,
        recomendacion: recomendaciones[tipo],
      });
    }
  }
  
  // Generar alertas resueltas
  if (resueltas === true || resueltas === undefined) {
    for (let i = 0; i < 12; i++) {
      const fecha = new Date(ahora.getTime() - (i + 8) * 24 * 60 * 60 * 1000);
      
      alertas.push({
        id: `alerta_resuelta_${i}`,
        checkInId: `checkin_${i + 8}`,
        tipo: 'dolor_lumbar',
        severidad: 'media',
        mensaje: 'Dolor lumbar detectado y resuelto',
        fecha: fecha.toISOString(),
        resuelta: true,
        recomendacion: 'Ajuste aplicado exitosamente',
      });
    }
  }
  
  // Filtrar según parámetro resueltas
  if (resueltas !== undefined) {
    return alertas.filter(a => a.resuelta === resueltas);
  }
  
  return Promise.resolve(alertas);
}

export async function resolverAlerta(alertaId: string): Promise<boolean> {
  // Simular resolución con datos falsos
  return Promise.resolve(true);
}

