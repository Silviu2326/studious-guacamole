// API para generación de ideas de contenido con IA

export type ContentObjective = 
  | 'captar_leads' 
  | 'vender_programa' 
  | 'educar_audiencia' 
  | 'aumentar_engagement'
  | 'retencion_clientes'
  | 'promocionar_evento'
  | 'other';

export type ContentFormat = 
  | 'reel' 
  | 'post' 
  | 'carousel' 
  | 'blog' 
  | 'newsletter' 
  | 'tiktok' 
  | 'youtube'
  | 'story'
  | 'other';

export interface GenerationRequest {
  objective: ContentObjective;
  audience: {
    segmentId?: string;
    description: string;
  };
  format: ContentFormat;
  topic?: string;
  keywords?: string[];
  tone?: string;
  count?: number;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  hook: string;
  cta: string;
  hashtags: string[];
  format: ContentFormat;
  topics?: string[];
  outline?: string[];
}

export interface GenerationResponse {
  ideas: ContentIdea[];
  creditsConsumed: number;
  generatedAt: string;
}

export interface SavedIdea {
  savedId: string;
  savedAt: string;
  originalIdea: ContentIdea;
  status: 'saved' | 'scheduled' | 'used';
  scheduledDate?: string;
}

export interface ClientSegment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

// Funciones API simuladas (a implementar con backend real)
export const generateContentIdeas = async (
  request: GenerationRequest
): Promise<GenerationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay de IA
  
  const count = request.count || 5;
  const ideas: ContentIdea[] = [];
  
  for (let i = 0; i < count; i++) {
    ideas.push(generateMockIdea(request, i + 1));
  }
  
  return {
    ideas,
    creditsConsumed: count,
    generatedAt: new Date().toISOString()
  };
};

function generateMockIdea(request: GenerationRequest, variant: number): ContentIdea {
  const objectives: Record<ContentObjective, { titles: string[]; hooks: string[]; ctas: string[] }> = {
    captar_leads: {
      titles: [
        '3 Mitos sobre las Sentadillas que DEBES conocer',
        '¿Tu silla de oficina te está oxidando? 5 ejercicios de movilidad',
        'La verdad sobre el cardio para perder peso (te sorprenderá)'
      ],
      hooks: [
        '¿Tus rodillas te duelen al hacer sentadillas? Quizás crees en uno de estos mitos...',
        'Pasar 8 horas sentado tiene consecuencias. Aquí están las soluciones...',
        'Has estado haciendo cardio mal todo este tiempo. Aquí está por qué...'
      ],
      ctas: [
        '¡Comenta "SENTADILLA" si quieres mi guía gratuita de técnica!',
        'Envía "MOVILIDAD" por DM para un descuento en mi nuevo reto',
        'Reserva tu consulta gratuita en el enlace de mi bio'
      ]
    },
    vender_programa: {
      titles: [
        '¿Por qué este programa de 30 días funciona cuando otros fallan?',
        'Testimonios reales: cómo transformaron su cuerpo en 8 semanas',
        'La diferencia entre hacer ejercicio y TRANSFORMAR tu cuerpo'
      ],
      hooks: [
        'No es otro programa más. Esta es la diferencia que marca la diferencia...',
        'Estos resultados no son de influencers. Son personas normales como tú...',
        'Existe una brecha entre hacer ejercicio y obtener resultados. Aquí está cómo cerrarla...'
      ],
      ctas: [
        'Únete a la próxima cohorte. Plazas limitadas →',
        'Descubre cómo puedes obtener estos resultados. Info en mi bio →',
        'Reserva tu lugar antes del 30 de noviembre y obtén un descuento del 30%'
      ]
    },
    educar_audiencia: {
      titles: [
        'Cómo calcular tus macros para ganar masa muscular',
        'La verdad sobre la ventana anabólica (spoiler: no es lo que crees)',
        'Progresión de carga: la guía completa para principiantes'
      ],
      hooks: [
        'Has escuchado hablar de macros pero no sabes cómo calcularlos. Aquí está todo explicado...',
        'La ciencia desmiente uno de los mitos más grandes del fitness...',
        'Aplicar más peso sin técnica no es progresar. Aquí está cómo hacerlo bien...'
      ],
      ctas: [
        'Guarda este post para tenerlo a mano',
        '¿Te gustaría una plantilla personalizada? Escríbeme',
        'Comparte esto con alguien que pueda necesitarlo'
      ]
    },
    aumentar_engagement: {
      titles: [
        'Encuesta: ¿Cuál es tu mayor desafío en el gimnasio?',
        'Cuéntame: ¿Qué te motivó a empezar a entrenar?',
        'Historia real: Mi cliente que pasó de 0 a 10 dominadas'
      ],
      hooks: [
        'Necesito tu ayuda: cuéntame qué es lo que más te cuesta en el gimnasio',
        'Cada persona tiene una historia. ¿Cuál es la tuya?',
        'Hace 6 meses no podía hacer ni una. Mira lo que pasó...'
      ],
      ctas: [
        'Comenta y cuéntame tu experiencia',
        'Vota en la encuesta y comenta por qué',
        'Comparte tu propia historia de transformación'
      ]
    },
    retencion_clientes: {
      titles: [
        'Exclusivo para miembros: Descuento del 20% en el próximo programa',
        'Recordatorio: Tu sesión de check-in está programada',
        'Celebremos juntos: Has cumplido 6 meses con nosotros'
      ],
      hooks: [
        'Como agradecimiento por tu fidelidad, tenemos algo especial para ti...',
        'Es momento de revisar tu progreso y ajustar tu plan...',
        'Hace 6 meses empezaste este viaje. Mira lo lejos que has llegado...'
      ],
      ctas: [
        'Usa el código FIDELIDAD20 en el checkout',
        'Responde a este mensaje para agendar',
        '¡Celebremos tu logro! Comparte tu historia'
      ]
    },
    promocionar_evento: {
      titles: [
        '¡Últimas horas! Únete al Reto de 30 días',
        'Bootcamp de Fin de Semana: Plazas Limitadas',
        'Webinar Gratuito: Nutrición para el Rendimiento'
      ],
      hooks: [
        'El reto comienza en 48 horas. ¿Estás listo para la transformación?',
        'Solo quedan 5 plazas para este bootcamp intensivo...',
        'Aprende los fundamentos de la nutrición deportiva sin costo alguno'
      ],
      ctas: [
        'Inscríbete ahora antes de que se agoten las plazas →',
        'Reserva tu lugar aquí →',
        'Regístrate gratis en el enlace de mi bio'
      ]
    },
    other: {
      titles: ['Idea de contenido personalizada'],
      hooks: ['Hook personalizado para captar atención'],
      ctas: ['Llamada a la acción efectiva']
    }
  };
  
  const objectiveData = objectives[request.objective] || objectives.other;
  const index = (variant - 1) % objectiveData.titles.length;
  
  const formatHashtags: Record<ContentFormat, string[]> = {
    reel: ['#reels', '#fitnessreels', '#entrenamiento', '#fitness'],
    post: ['#fitness', '#entrenamiento', '#salud', '#bienestar'],
    carousel: ['#fitness', '#consejos', '#tips', '#salud'],
    blog: ['#fitness', '#salud', '#bienestar'],
    newsletter: [],
    tiktok: ['#fyp', '#fitness', '#gym', '#workout'],
    youtube: ['#fitness', '#entrenamiento', '#salud'],
    story: [],
    other: ['#fitness']
  };
  
  return {
    id: `idea_${Date.now()}_${variant}`,
    title: objectiveData.titles[index],
    description: `Descripción detallada para ${request.format}. Este contenido está diseñado para ${request.audience.description} y tiene como objetivo ${request.objective.replace(/_/g, ' ')}. ${request.topic ? `Tema central: ${request.topic}` : ''}`,
    hook: objectiveData.hooks[index],
    cta: objectiveData.ctas[index],
    hashtags: [
      ...formatHashtags[request.format],
      ...(request.keywords || []).slice(0, 3).map(k => `#${k.toLowerCase().replace(/\s+/g, '')}`)
    ],
    format: request.format,
    topics: request.topic ? [request.topic] : [],
    outline: [
      'Punto 1: Introducción y captación de atención',
      'Punto 2: Desarrollo del tema principal',
      'Punto 3: Cierre con llamada a la acción'
    ]
  };
}

export const getSavedIdeas = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<SavedIdea[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockSaved: SavedIdea[] = [
    {
      savedId: 'svd_x1y2z3',
      savedAt: '2024-08-15T10:00:00Z',
      originalIdea: {
        id: 'idea_123',
        title: '3 Mitos sobre las Sentadillas que DEBES conocer',
        description: 'Un Reel rápido desmintiendo mitos comunes...',
        hook: '¿Tus rodillas te duelen al hacer sentadillas?',
        cta: '¡Comenta SENTADILLA si quieres mi guía!',
        hashtags: ['#sentadillas', '#fitness'],
        format: 'reel'
      },
      status: 'saved'
    },
    {
      savedId: 'svd_a2b3c4d',
      savedAt: '2024-08-14T14:30:00Z',
      originalIdea: {
        id: 'idea_456',
        title: '5 Ejercicios de Movilidad para Oficina',
        description: 'Carrusel con ejercicios...',
        hook: 'Tu silla de oficina te está oxidando...',
        cta: 'Guarda este post para tenerlo a mano',
        hashtags: ['#movilidad', '#oficina'],
        format: 'carousel'
      },
      status: 'scheduled',
      scheduledDate: '2024-08-20T18:00:00Z'
    }
  ];
  
  const limit = params?.limit || 10;
  const offset = params?.offset || 0;
  
  return mockSaved.slice(offset, offset + limit);
};

export const saveIdea = async (idea: ContentIdea): Promise<SavedIdea> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    savedId: `svd_${Date.now()}`,
    savedAt: new Date().toISOString(),
    originalIdea: idea,
    status: 'saved'
  };
};

export const deleteSavedIdea = async (savedId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando idea guardada:', savedId);
};

export const scheduleIdea = async (
  savedId: string,
  scheduledDate: string
): Promise<SavedIdea> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const saved = await getSavedIdeas();
  const found = saved.find(s => s.savedId === savedId);
  
  if (!found) {
    throw new Error('Idea no encontrada');
  }
  
  return {
    ...found,
    status: 'scheduled',
    scheduledDate
  };
};

export const getClientSegments = async (): Promise<ClientSegment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'seg_1',
      name: 'Clientes Actuales',
      description: 'Clientes con membresía activa',
      memberCount: 45
    },
    {
      id: 'seg_2',
      name: 'Principiantes',
      description: 'Clientes nuevos que empezaron hace menos de 3 meses',
      memberCount: 12
    },
    {
      id: 'seg_3',
      name: 'Clientes de Alto Valor',
      description: 'Clientes con múltiples servicios contratados',
      memberCount: 8
    },
    {
      id: 'seg_4',
      name: 'En Riesgo',
      description: 'Clientes que no han asistido en 30+ días',
      memberCount: 15
    }
  ];
};

