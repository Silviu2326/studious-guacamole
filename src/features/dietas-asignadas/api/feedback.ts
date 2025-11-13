import type { FeedbackCliente, SugerenciaAjusteAutomatico, RespuestaFeedbackCliente } from '../types';

// Obtener feedback de un cliente para una dieta
export async function getFeedbackCliente(
  dietaId: string,
  clienteId?: string
): Promise<FeedbackCliente[]> {
  // Simulación de API - en producción sería una llamada real
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data
  const mockFeedback: FeedbackCliente[] = [
    {
      id: '1',
      comidaId: 'comida-1',
      dietaId,
      clienteId: clienteId || 'cliente-1',
      fecha: new Date().toISOString(),
      sensacion: 4,
      saciedad: 3,
      tiempoRealConsumido: 25,
      comentarios: 'Me gustó pero me quedé con hambre',
      completada: true,
      porcentajeConsumido: 85,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
  ];

  return mockFeedback;
}

// Obtener feedback de una comida específica
export async function getFeedbackPorComida(
  comidaId: string
): Promise<FeedbackCliente | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, buscaría en la base de datos
  return null;
}

// Guardar feedback del cliente
export async function guardarFeedbackCliente(
  feedback: Omit<FeedbackCliente, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<FeedbackCliente> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoFeedback: FeedbackCliente = {
    ...feedback,
    id: `feedback-${Date.now()}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  // En producción, guardaría en la base de datos
  // USER STORY 2: Ejecutar reglas activadas por eventos automáticamente
  try {
    const { ejecutarReglasPorEvento } = await import('./reglasPersonalizadas');
    
    // Determinar el tipo de evento basado en el feedback
    if (nuevoFeedback.sensacion < 3 || nuevoFeedback.saciedad < 3) {
      // Feedback negativo o bajo
      const tipoEvento = nuevoFeedback.sensacion <= 2 || nuevoFeedback.saciedad <= 2
        ? 'feedback-bajo'
        : 'feedback-negativo';
      
      await ejecutarReglasPorEvento({
        tipo: tipoEvento,
        dietaId: nuevoFeedback.dietaId,
        feedback: nuevoFeedback,
      });
    }
  } catch (error) {
    // No fallar si hay error al ejecutar reglas
    console.error('Error ejecutando reglas por evento:', error);
  }
  
  return nuevoFeedback;
}

// Obtener sugerencias de ajuste automático basadas en feedback
export async function getSugerenciasAjusteAutomatico(
  feedbackId: string
): Promise<SugerenciaAjusteAutomatico[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock de sugerencias basadas en feedback
  const sugerencias: SugerenciaAjusteAutomatico[] = [
    {
      id: 'sug-1',
      feedbackId,
      tipo: 'aumentar',
      descripcion: 'Aumentar cantidad de proteína para mejorar saciedad',
      razon: 'El cliente reportó baja saciedad (3/5) tras la comida',
      accion: 'Añadir 20g de proteína adicional',
      impacto: 'medio',
      aplicada: false,
      creadoEn: new Date().toISOString(),
    },
  ];

  return sugerencias;
}

// Aplicar sugerencia de ajuste automático
export async function aplicarSugerenciaAjuste(
  sugerenciaId: string,
  dietaId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción, aplicaría el ajuste a la dieta
  return true;
}

// User Story 2: Respuestas del dietista al feedback del cliente

// Mock de respuestas almacenadas
let respuestasMock: RespuestaFeedbackCliente[] = [];

/**
 * Obtener respuestas a un feedback específico
 */
export async function getRespuestasFeedback(
  feedbackId: string
): Promise<RespuestaFeedbackCliente[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const respuestas = respuestasMock.filter(r => r.feedbackId === feedbackId);
  return respuestas;
}

/**
 * Obtener todas las respuestas para una dieta
 */
export async function getRespuestasPorDieta(
  dietaId: string
): Promise<RespuestaFeedbackCliente[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const respuestas = respuestasMock.filter(r => r.dietaId === dietaId);
  return respuestas;
}

/**
 * Crear una respuesta al feedback del cliente
 */
export async function crearRespuestaFeedback(
  respuesta: Omit<RespuestaFeedbackCliente, 'id' | 'creadoEn' | 'actualizadoEn' | 'vistoPorCliente'>
): Promise<RespuestaFeedbackCliente> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevaRespuesta: RespuestaFeedbackCliente = {
    ...respuesta,
    id: `respuesta-feedback-${Date.now()}`,
    vistoPorCliente: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  respuestasMock.push(nuevaRespuesta);
  
  // En producción, notificaría al cliente sobre la respuesta
  // await notificarClienteRespuesta(nuevaRespuesta);
  
  return nuevaRespuesta;
}

/**
 * Actualizar una respuesta
 */
export async function actualizarRespuestaFeedback(
  respuestaId: string,
  actualizacion: Partial<RespuestaFeedbackCliente>
): Promise<RespuestaFeedbackCliente> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = respuestasMock.findIndex(r => r.id === respuestaId);
  if (index === -1) {
    throw new Error('Respuesta no encontrada');
  }
  
  respuestasMock[index] = {
    ...respuestasMock[index],
    ...actualizacion,
    actualizadoEn: new Date().toISOString(),
  };
  
  return respuestasMock[index];
}

/**
 * Marcar respuesta como vista por el cliente
 */
export async function marcarRespuestaVista(
  respuestaId: string
): Promise<RespuestaFeedbackCliente> {
  return actualizarRespuestaFeedback(respuestaId, {
    vistoPorCliente: true,
    fechaVistoPorCliente: new Date().toISOString(),
  });
}

/**
 * Aplicar ajuste propuesto en una respuesta
 */
export async function aplicarAjustePropuesto(
  respuestaId: string
): Promise<RespuestaFeedbackCliente> {
  const respuesta = respuestasMock.find(r => r.id === respuestaId);
  if (!respuesta || !respuesta.ajustePropuesto) {
    throw new Error('Respuesta o ajuste no encontrado');
  }
  
  // En producción, aplicaría el ajuste a la dieta
  // await aplicarAjusteDieta(respuesta.dietaId, respuesta.ajustePropuesto);
  
  return actualizarRespuestaFeedback(respuestaId, {
    ajustePropuesto: {
      ...respuesta.ajustePropuesto,
      aplicado: true,
      fechaAplicacion: new Date().toISOString(),
    },
  });
}

/**
 * Eliminar una respuesta
 */
export async function eliminarRespuestaFeedback(
  respuestaId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = respuestasMock.findIndex(r => r.id === respuestaId);
  if (index === -1) {
    return false;
  }
  
  respuestasMock.splice(index, 1);
  return true;
}

