import {
  EncuestaRapida,
  RespuestaEncuestaRapida,
  InsightEncuestaRapida,
  PreguntaEncuestaRapida,
  TipoEncuestaRapida,
} from '../types';

// Mock data para desarrollo
const encuestasMock: EncuestaRapida[] = [];
const respuestasMock: RespuestaEncuestaRapida[] = [];

/**
 * Obtiene todas las encuestas rápidas de una dieta
 */
export const getEncuestasRapidas = async (dietaId: string): Promise<EncuestaRapida[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return encuestasMock.filter(e => e.dietaId === dietaId);
};

/**
 * Obtiene una encuesta rápida por ID
 */
export const getEncuestaRapida = async (encuestaId: string): Promise<EncuestaRapida | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const encuesta = encuestasMock.find(e => e.id === encuestaId);
  return encuesta || null;
};

/**
 * Crea una nueva encuesta rápida
 */
export const crearEncuestaRapida = async (
  datos: Omit<EncuestaRapida, 'id' | 'creadoEn' | 'actualizadoEn' | 'respuestasRecibidas' | 'totalRespuestasEsperadas' | 'enviada'>
): Promise<EncuestaRapida> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaEncuesta: EncuestaRapida = {
    ...datos,
    id: `encuesta_${Date.now()}`,
    respuestasRecibidas: 0,
    totalRespuestasEsperadas: 1,
    enviada: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  encuestasMock.push(nuevaEncuesta);
  return nuevaEncuesta;
};

/**
 * Actualiza una encuesta rápida
 */
export const actualizarEncuestaRapida = async (
  encuestaId: string,
  actualizaciones: Partial<EncuestaRapida>
): Promise<EncuestaRapida> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = encuestasMock.findIndex(e => e.id === encuestaId);
  if (index === -1) {
    throw new Error('Encuesta no encontrada');
  }
  
  encuestasMock[index] = {
    ...encuestasMock[index],
    ...actualizaciones,
    actualizadoEn: new Date().toISOString(),
  };
  
  return encuestasMock[index];
};

/**
 * Elimina una encuesta rápida
 */
export const eliminarEncuestaRapida = async (encuestaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = encuestasMock.findIndex(e => e.id === encuestaId);
  if (index === -1) {
    throw new Error('Encuesta no encontrada');
  }
  
  encuestasMock.splice(index, 1);
};

/**
 * Envía una encuesta rápida al cliente
 */
export const enviarEncuestaRapida = async (encuestaId: string): Promise<EncuestaRapida> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const encuesta = encuestasMock.find(e => e.id === encuestaId);
  if (!encuesta) {
    throw new Error('Encuesta no encontrada');
  }
  
  encuesta.enviada = true;
  encuesta.fechaEnvio = new Date().toISOString();
  encuesta.actualizadoEn = new Date().toISOString();
  
  return encuesta;
};

/**
 * Obtiene las respuestas de una encuesta rápida
 */
export const getRespuestasEncuesta = async (encuestaId: string): Promise<RespuestaEncuestaRapida[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return respuestasMock.filter(r => r.encuestaId === encuestaId);
};

/**
 * Guarda una respuesta de encuesta rápida
 */
export const guardarRespuestaEncuesta = async (
  respuesta: Omit<RespuestaEncuestaRapida, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<RespuestaEncuestaRapida> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaRespuesta: RespuestaEncuestaRapida = {
    ...respuesta,
    id: `respuesta_${Date.now()}`,
    fechaRespuesta: new Date().toISOString(),
    completada: true,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  respuestasMock.push(nuevaRespuesta);
  
  // Actualizar contador de respuestas en la encuesta
  const encuesta = encuestasMock.find(e => e.id === respuesta.encuestaId);
  if (encuesta) {
    encuesta.respuestasRecibidas += 1;
    encuesta.actualizadoEn = new Date().toISOString();
  }
  
  return nuevaRespuesta;
};

/**
 * Obtiene insights de una encuesta rápida
 */
export const getInsightsEncuesta = async (encuestaId: string): Promise<InsightEncuestaRapida | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const encuesta = encuestasMock.find(e => e.id === encuestaId);
  if (!encuesta) {
    return null;
  }
  
  const respuestas = respuestasMock.filter(r => r.encuestaId === encuestaId);
  
  // Calcular promedio de puntuaciones
  let sumaPuntuaciones = 0;
  let cantidadPuntuaciones = 0;
  const distribucionRespuestas: Record<string, Record<string, number>> = {};
  const respuestasTexto: Record<string, string[]> = {};
  
  respuestas.forEach(respuesta => {
    respuesta.respuestas.forEach(resp => {
      const pregunta = encuesta.preguntas.find(p => p.id === resp.preguntaId);
      if (!pregunta) return;
      
      // Para preguntas de escala
      if (pregunta.tipo === 'escala' && typeof resp.valor === 'number') {
        sumaPuntuaciones += resp.valor;
        cantidadPuntuaciones += 1;
        
        if (!distribucionRespuestas[resp.preguntaId]) {
          distribucionRespuestas[resp.preguntaId] = {};
        }
        const valorStr = resp.valor.toString();
        distribucionRespuestas[resp.preguntaId][valorStr] = 
          (distribucionRespuestas[resp.preguntaId][valorStr] || 0) + 1;
      }
      
      // Para respuestas de texto
      if (pregunta.tipo === 'texto' && resp.texto) {
        if (!respuestasTexto[resp.preguntaId]) {
          respuestasTexto[resp.preguntaId] = [];
        }
        respuestasTexto[resp.preguntaId].push(resp.texto);
      }
      
      // Para otras preguntas
      if (pregunta.tipo !== 'escala' && pregunta.tipo !== 'texto') {
        if (!distribucionRespuestas[resp.preguntaId]) {
          distribucionRespuestas[resp.preguntaId] = {};
        }
        const valorStr = resp.valor.toString();
        distribucionRespuestas[resp.preguntaId][valorStr] = 
          (distribucionRespuestas[resp.preguntaId][valorStr] || 0) + 1;
      }
    });
  });
  
  const promedioPuntuacion = cantidadPuntuaciones > 0 
    ? sumaPuntuaciones / cantidadPuntuaciones 
    : undefined;
  
  // Construir distribución de respuestas
  const distribucion = encuesta.preguntas.map(pregunta => {
    const distrib = distribucionRespuestas[pregunta.id] || {};
    const valores = Object.values(distrib);
    const promedio = pregunta.tipo === 'escala' && valores.length > 0
      ? Object.entries(distrib).reduce((sum, [valor, cantidad]) => sum + (parseFloat(valor) * cantidad), 0) / valores.reduce((a, b) => a + b, 0)
      : undefined;
    
    return {
      preguntaId: pregunta.id,
      preguntaTexto: pregunta.texto,
      distribucion: distrib,
      promedio,
    };
  });
  
  // Construir respuestas de texto
  const texto = Object.entries(respuestasTexto).map(([preguntaId, respuestas]) => {
    const pregunta = encuesta.preguntas.find(p => p.id === preguntaId);
    return {
      preguntaId,
      preguntaTexto: pregunta?.texto || '',
      respuestas,
    };
  });
  
  const insight: InsightEncuestaRapida = {
    encuestaId: encuesta.id,
    encuestaNombre: encuesta.nombre,
    tipo: encuesta.tipo,
    totalRespuestas: respuestas.length,
    promedioPuntuacion,
    distribucionRespuestas: distribucion,
    respuestasTexto: texto.length > 0 ? texto : undefined,
    generadoEn: new Date().toISOString(),
  };
  
  return insight;
};

/**
 * Crea una encuesta rápida predefinida
 */
export const crearEncuestaPredefinida = async (
  dietaId: string,
  clienteId: string,
  tipo: TipoEncuestaRapida,
  creadoPor: string
): Promise<EncuestaRapida> => {
  const plantillas: Record<TipoEncuestaRapida, Omit<EncuestaRapida, 'id' | 'dietaId' | 'clienteId' | 'creadoPor' | 'creadoEn' | 'actualizadoEn' | 'respuestasRecibidas' | 'totalRespuestasEsperadas' | 'enviada'>> = {
    'satisfaccion-semanal': {
      nombre: 'Satisfacción Semanal',
      descripcion: 'Encuesta de satisfacción semanal con el plan nutricional',
      tipo: 'satisfaccion-semanal',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Qué tan satisfecho estás con tu plan nutricional esta semana?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Muy insatisfecho',
          etiquetaMax: 'Muy satisfecho',
          orden: 1,
        },
        {
          id: 'p2',
          tipo: 'texto',
          texto: '¿Hay algo que te gustaría mejorar?',
          requerida: false,
          orden: 2,
        },
      ],
      frecuencia: 'semanal',
      diaSemana: ['lunes'],
      activa: true,
    },
    'facilidad-preparacion': {
      nombre: 'Facilidad de Preparación',
      descripcion: 'Encuesta sobre la facilidad de preparación de las comidas',
      tipo: 'facilidad-preparacion',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Qué tan fácil te resulta preparar las comidas del plan?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Muy difícil',
          etiquetaMax: 'Muy fácil',
          orden: 1,
        },
        {
          id: 'p2',
          tipo: 'texto',
          texto: '¿Qué comidas te resultan más difíciles de preparar?',
          requerida: false,
          orden: 2,
        },
      ],
      frecuencia: 'una-vez',
      activa: true,
    },
    'satisfaccion-comida': {
      nombre: 'Satisfacción con Comidas',
      descripcion: 'Encuesta de satisfacción con las comidas específicas',
      tipo: 'satisfaccion-comida',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Qué tan satisfecho estás con las comidas del plan?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Muy insatisfecho',
          etiquetaMax: 'Muy satisfecho',
          orden: 1,
        },
        {
          id: 'p2',
          tipo: 'rating-estrellas',
          texto: 'Califica el sabor de las comidas',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          orden: 2,
        },
      ],
      frecuencia: 'semanal',
      diaSemana: ['viernes'],
      activa: true,
    },
    'saciedad': {
      nombre: 'Nivel de Saciedad',
      descripcion: 'Encuesta sobre el nivel de saciedad con las comidas',
      tipo: 'saciedad',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Te sientes saciado después de las comidas?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Nada saciado',
          etiquetaMax: 'Muy saciado',
          orden: 1,
        },
      ],
      frecuencia: 'semanal',
      activa: true,
    },
    'digestion': {
      nombre: 'Digestión',
      descripcion: 'Encuesta sobre la digestión',
      tipo: 'digestion',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Cómo te sientes después de comer?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Muy mal',
          etiquetaMax: 'Muy bien',
          orden: 1,
        },
      ],
      frecuencia: 'semanal',
      activa: true,
    },
    'gusto': {
      nombre: 'Gusto',
      descripcion: 'Encuesta sobre el gusto de las comidas',
      tipo: 'gusto',
      preguntas: [
        {
          id: 'p1',
          tipo: 'rating-estrellas',
          texto: '¿Qué tan buenas te parecen las comidas?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          orden: 1,
        },
      ],
      frecuencia: 'semanal',
      activa: true,
    },
    'adherencia': {
      nombre: 'Adherencia',
      descripcion: 'Encuesta sobre la adherencia al plan',
      tipo: 'adherencia',
      preguntas: [
        {
          id: 'p1',
          tipo: 'escala',
          texto: '¿Qué tan bien has seguido el plan esta semana?',
          requerida: true,
          escalaMin: 1,
          escalaMax: 5,
          etiquetaMin: 'Muy mal',
          etiquetaMax: 'Muy bien',
          orden: 1,
        },
      ],
      frecuencia: 'semanal',
      activa: true,
    },
    'dificultades': {
      nombre: 'Dificultades',
      descripcion: 'Encuesta sobre dificultades encontradas',
      tipo: 'dificultades',
      preguntas: [
        {
          id: 'p1',
          tipo: 'texto',
          texto: '¿Qué dificultades has encontrado con el plan?',
          requerida: false,
          orden: 1,
        },
      ],
      frecuencia: 'una-vez',
      activa: true,
    },
    'sugerencias': {
      nombre: 'Sugerencias',
      descripcion: 'Encuesta para recoger sugerencias',
      tipo: 'sugerencias',
      preguntas: [
        {
          id: 'p1',
          tipo: 'texto',
          texto: '¿Tienes alguna sugerencia para mejorar el plan?',
          requerida: false,
          orden: 1,
        },
      ],
      frecuencia: 'mensual',
      activa: true,
    },
    'personalizada': {
      nombre: 'Encuesta Personalizada',
      descripcion: 'Encuesta personalizada',
      tipo: 'personalizada',
      preguntas: [],
      frecuencia: 'una-vez',
      activa: true,
    },
  };
  
  const plantilla = plantillas[tipo];
  if (!plantilla) {
    throw new Error('Tipo de encuesta no válido');
  }
  
  return crearEncuestaRapida({
    ...plantilla,
    dietaId,
    clienteId,
    creadoPor,
  });
};

