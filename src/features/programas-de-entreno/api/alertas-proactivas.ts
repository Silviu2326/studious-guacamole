/**
 * API para alertas proactivas de riesgos
 * User Story: Como coach quiero recibir alertas proactivas cuando detecte riesgos 
 * (sobrecarga en un grupo muscular, baja frecuencia de movilidad, feedback negativo del cliente), 
 * junto con recomendaciones accionables.
 */

import type { GrupoMuscular } from '../types';

export type TipoRiesgoProactivo = 
  | 'sobrecarga-muscular' 
  | 'baja-movilidad' 
  | 'feedback-negativo' 
  | 'fatiga-acumulada'
  | 'desbalance-volumen';

export interface AlertaProactiva {
  id: string;
  tipo: TipoRiesgoProactivo;
  titulo: string;
  descripcion: string;
  clienteId: string;
  clienteNombre: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaDeteccion: string;
  datos: {
    // Para sobrecarga muscular
    grupoMuscular?: GrupoMuscular;
    volumenActual?: number;
    volumenRecomendado?: number;
    semanasConsecutivas?: number;
    // Para baja movilidad
    frecuenciaMovilidad?: number; // Sesiones de movilidad por semana
    frecuenciaRecomendada?: number;
    ultimaSesionMovilidad?: string;
    // Para feedback negativo
    feedbackId?: string;
    puntuacion?: number;
    comentario?: string;
    fechaFeedback?: string;
    // Para fatiga acumulada
    volumenAcumulado?: number;
    intensidadPromedio?: number;
    diasSinDescanso?: number;
  };
  recomendaciones: {
    accion: string;
    descripcion: string;
    prioridad: 'alta' | 'media' | 'baja';
    accionable: boolean; // Si el coach puede ejecutar la acción directamente
  }[];
  resuelta: boolean;
  resueltaEn?: string;
}

// Mock data storage
const MOCK_ALERTAS_PROACTIVAS: AlertaProactiva[] = [];

/**
 * Detecta sobrecarga en grupos musculares
 */
function detectarSobrecargaMuscular(clienteId: string, clienteNombre: string): AlertaProactiva[] {
  const alertas: AlertaProactiva[] = [];
  
  // Simular detección de sobrecarga en pecho (ejemplo)
  const gruposMusculares: GrupoMuscular[] = ['pecho', 'piernas', 'espalda'];
  const grupoAleatorio = gruposMusculares[Math.floor(Math.random() * gruposMusculares.length)];
  
  alertas.push({
    id: `sobrecarga-${clienteId}-${Date.now()}`,
    tipo: 'sobrecarga-muscular',
    titulo: `Sobrecarga detectada en ${grupoAleatorio}`,
    descripcion: `El grupo muscular de ${grupoAleatorio} ha sido entrenado con alto volumen durante las últimas 3 semanas consecutivas, lo que puede llevar a sobreentrenamiento o lesiones.`,
    clienteId,
    clienteNombre,
    prioridad: 'alta',
    fechaDeteccion: new Date().toISOString(),
    datos: {
      grupoMuscular: grupoAleatorio,
      volumenActual: 450,
      volumenRecomendado: 300,
      semanasConsecutivas: 3,
    },
    recomendaciones: [
      {
        accion: 'Reducir volumen del grupo muscular',
        descripcion: `Reducir el volumen de entrenamiento de ${grupoAleatorio} en un 30-40% durante la próxima semana.`,
        prioridad: 'alta',
        accionable: true,
      },
      {
        accion: 'Aumentar días de descanso',
        descripcion: 'Incluir al menos 2 días de descanso activo o recuperación antes de volver a entrenar este grupo.',
        prioridad: 'alta',
        accionable: true,
      },
      {
        accion: 'Incluir ejercicios de movilidad',
        descripcion: `Agregar ejercicios de movilidad específicos para ${grupoAleatorio} en los días de descanso.`,
        prioridad: 'media',
        accionable: true,
      },
    ],
    resuelta: false,
  });
  
  return alertas;
}

/**
 * Detecta baja frecuencia de movilidad
 */
function detectarBajaMovilidad(clienteId: string, clienteNombre: string): AlertaProactiva[] {
  const alertas: AlertaProactiva[] = [];
  
  // Simular detección de baja movilidad
  const frecuenciaActual = Math.floor(Math.random() * 2); // 0-1 sesiones por semana
  const frecuenciaRecomendada = 3;
  
  if (frecuenciaActual < 2) {
    const ultimaSesion = new Date();
    ultimaSesion.setDate(ultimaSesion.getDate() - (7 + Math.floor(Math.random() * 7)));
    
    alertas.push({
      id: `movilidad-${clienteId}-${Date.now()}`,
      tipo: 'baja-movilidad',
      titulo: 'Baja frecuencia de sesiones de movilidad',
      descripcion: `El cliente solo ha realizado ${frecuenciaActual} sesión(es) de movilidad en la última semana, cuando se recomiendan al menos ${frecuenciaRecomendada} sesiones semanales para mantener la flexibilidad y prevenir lesiones.`,
      clienteId,
      clienteNombre,
      prioridad: 'media',
      fechaDeteccion: new Date().toISOString(),
      datos: {
        frecuenciaMovilidad: frecuenciaActual,
        frecuenciaRecomendada,
        ultimaSesionMovilidad: ultimaSesion.toISOString(),
      },
      recomendaciones: [
        {
          accion: 'Agregar sesiones de movilidad al programa',
          descripcion: `Incluir al menos ${frecuenciaRecomendada - frecuenciaActual} sesión(es) adicional(es) de movilidad en el programa semanal.`,
          prioridad: 'alta',
          accionable: true,
        },
        {
          accion: 'Recordar al cliente sobre la importancia de la movilidad',
          descripcion: 'Enviar un mensaje al cliente explicando los beneficios de las sesiones de movilidad y cómo pueden prevenir lesiones.',
          prioridad: 'media',
          accionable: true,
        },
        {
          accion: 'Incluir ejercicios de movilidad en el calentamiento',
          descripcion: 'Agregar 5-10 minutos de movilidad al inicio de cada sesión de entrenamiento.',
          prioridad: 'media',
          accionable: true,
        },
      ],
      resuelta: false,
    });
  }
  
  return alertas;
}

/**
 * Detecta feedback negativo del cliente
 */
function detectarFeedbackNegativo(clienteId: string, clienteNombre: string): AlertaProactiva[] {
  const alertas: AlertaProactiva[] = [];
  
  // Simular detección de feedback negativo (30% de probabilidad)
  if (Math.random() < 0.3) {
    const puntuacion = Math.floor(Math.random() * 3) + 1; // 1-3 (negativo)
    const comentarios = [
      'El entrenamiento es demasiado intenso',
      'No me siento cómodo con algunos ejercicios',
      'Siento dolor después de las sesiones',
      'No veo progreso',
      'Las sesiones son muy largas',
    ];
    const comentario = comentarios[Math.floor(Math.random() * comentarios.length)];
    
    const fechaFeedback = new Date();
    fechaFeedback.setDate(fechaFeedback.getDate() - Math.floor(Math.random() * 3));
    
    alertas.push({
      id: `feedback-${clienteId}-${Date.now()}`,
      tipo: 'feedback-negativo',
      titulo: 'Feedback negativo recibido',
      descripcion: `El cliente ha proporcionado feedback negativo (${puntuacion}/5) sobre su experiencia de entrenamiento: "${comentario}"`,
      clienteId,
      clienteNombre,
      prioridad: puntuacion <= 2 ? 'alta' : 'media',
      fechaDeteccion: new Date().toISOString(),
      datos: {
        puntuacion,
        comentario,
        fechaFeedback: fechaFeedback.toISOString(),
      },
      recomendaciones: [
        {
          accion: 'Contactar al cliente para entender mejor el problema',
          descripcion: 'Programar una conversación con el cliente para discutir sus preocupaciones y encontrar soluciones.',
          prioridad: 'alta',
          accionable: true,
        },
        {
          accion: 'Revisar y ajustar el programa de entrenamiento',
          descripcion: 'Evaluar el programa actual y hacer ajustes basados en el feedback recibido.',
          prioridad: 'alta',
          accionable: true,
        },
        {
          accion: 'Ofrecer sesión de seguimiento',
          descripcion: 'Proponer una sesión adicional para trabajar en las áreas de preocupación del cliente.',
          prioridad: 'media',
          accionable: true,
        },
      ],
      resuelta: false,
    });
  }
  
  return alertas;
}

/**
 * Obtiene todas las alertas proactivas para un cliente o todos los clientes
 */
export const getAlertasProactivas = async (clienteId?: string): Promise<AlertaProactiva[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Si no hay alertas generadas, crearlas
  if (MOCK_ALERTAS_PROACTIVAS.length === 0) {
    const clientes = [
      { id: '1', nombre: 'Carla' },
      { id: '2', nombre: 'Miguel' },
      { id: '3', nombre: 'Ana' },
    ];
    
    clientes.forEach((cliente) => {
      // Generar alertas para cada tipo de riesgo
      const sobrecarga = detectarSobrecargaMuscular(cliente.id, cliente.nombre);
      const movilidad = detectarBajaMovilidad(cliente.id, cliente.nombre);
      const feedback = detectarFeedbackNegativo(cliente.id, cliente.nombre);
      
      MOCK_ALERTAS_PROACTIVAS.push(...sobrecarga, ...movilidad, ...feedback);
    });
  }
  
  // Filtrar por cliente si se especifica
  let alertas = MOCK_ALERTAS_PROACTIVAS.filter(a => !a.resuelta);
  if (clienteId) {
    alertas = alertas.filter(a => a.clienteId === clienteId);
  }
  
  // Ordenar por prioridad (alta > media > baja) y luego por fecha
  const ordenPrioridad: Record<'alta' | 'media' | 'baja', number> = {
    alta: 3,
    media: 2,
    baja: 1,
  };
  
  return alertas.sort((a, b) => {
    const diffPrioridad = ordenPrioridad[b.prioridad] - ordenPrioridad[a.prioridad];
    if (diffPrioridad !== 0) return diffPrioridad;
    return new Date(b.fechaDeteccion).getTime() - new Date(a.fechaDeteccion).getTime();
  });
};

/**
 * Marca una alerta proactiva como resuelta
 */
export const resolverAlertaProactiva = async (alertaId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const alerta = MOCK_ALERTAS_PROACTIVAS.find(a => a.id === alertaId);
  if (alerta) {
    alerta.resuelta = true;
    alerta.resueltaEn = new Date().toISOString();
    return true;
  }
  return false;
};

/**
 * Obtiene el resumen de alertas proactivas por tipo y prioridad
 */
export const getResumenAlertasProactivas = async (clienteId?: string): Promise<{
  total: number;
  porTipo: Record<TipoRiesgoProactivo, number>;
  porPrioridad: {
    alta: number;
    media: number;
    baja: number;
  };
}> => {
  const alertas = await getAlertasProactivas(clienteId);
  
  const porTipo: Record<TipoRiesgoProactivo, number> = {
    'sobrecarga-muscular': 0,
    'baja-movilidad': 0,
    'feedback-negativo': 0,
    'fatiga-acumulada': 0,
    'desbalance-volumen': 0,
  };
  
  const porPrioridad = {
    alta: 0,
    media: 0,
    baja: 0,
  };
  
  alertas.forEach(alerta => {
    porTipo[alerta.tipo]++;
    porPrioridad[alerta.prioridad]++;
  });
  
  return {
    total: alertas.length,
    porTipo,
    porPrioridad,
  };
};

