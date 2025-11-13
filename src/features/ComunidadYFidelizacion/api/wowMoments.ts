import { WowMoment, ReplicationStrategy, WowMomentStatus } from '../types';

// Mock data para momentos wow
const MOCK_WOW_MOMENTS: WowMoment[] = [
  {
    id: 'wow_001',
    title: 'Ritual de bienvenida personalizado',
    type: 'ritual',
    description: 'Cliente nuevo recibió un ritual de bienvenida personalizado con música, decoración temática y un pequeño regalo. La reacción fue muy positiva.',
    capturedAt: '2025-10-15T10:00:00Z',
    capturedBy: 'trainer_001',
    clientId: 'cliente_001',
    clientName: 'Laura Méndez',
    sessionId: 'ses_001',
    aiAnalysis: {
      keyElements: ['Personalización extrema', 'Elemento sorpresa', 'Atención a detalles', 'Música ambiental'],
      emotionalTriggers: ['Sentirse especial', 'Apreciación del esfuerzo', 'Conexión emocional'],
      replicableActions: [
        'Investigar gustos del cliente antes de la primera sesión',
        'Preparar ambiente con música personalizada',
        'Incluir pequeño detalle físico (regalo, carta)',
        'Fotografía del momento para compartir',
      ],
      suggestedScripts: [
        'Mensaje de bienvenida personalizado mencionando sus objetivos específicos',
        'Guión para explicar el ritual y su significado',
      ],
      suggestedFollowUps: [
        'Enviar foto del momento 24h después',
        'Preguntar cómo se sintió en la siguiente sesión',
        'Compartir el momento en redes sociales (con permiso)',
      ],
    },
    replicationStrategies: [
      {
        id: 'strategy_001',
        name: 'Bienvenida Premium',
        description: 'Aplicar ritual personalizado a nuevos clientes premium',
        targetAudience: 'Nuevos clientes premium',
        suggestedActions: [
          'Crear perfil de preferencias antes de primera sesión',
          'Preparar ambiente personalizado',
          'Incluir detalle físico relacionado con sus objetivos',
        ],
        suggestedScript: 'Bienvenida personalizada mencionando objetivos y preparación especial',
        suggestedFollowUp: 'Seguimiento 24h después con foto y pregunta sobre experiencia',
        isActive: true,
        createdAt: '2025-10-15T11:00:00Z',
      },
    ],
    status: 'replicado',
    tags: ['bienvenida', 'personalización', 'ritual'],
    notes: 'Este momento generó un testimonio espontáneo muy positivo',
  },
  {
    id: 'wow_002',
    title: 'Celebración de logro con comunidad',
    type: 'logro-cliente',
    description: 'Cliente alcanzó su objetivo de perder 10kg. Se organizó una pequeña celebración con otros miembros de la comunidad presente.',
    capturedAt: '2025-10-12T16:00:00Z',
    capturedBy: 'trainer_001',
    clientId: 'cliente_002',
    clientName: 'Carlos Ortega',
    eventDetails: 'Celebración grupal con 5 miembros de la comunidad',
    aiAnalysis: {
      keyElements: ['Reconocimiento público', 'Comunidad presente', 'Elemento visual (foto/video)', 'Mensaje motivacional'],
      emotionalTriggers: ['Orgullo', 'Pertenencia', 'Motivación para otros', 'Logro compartido'],
      replicableActions: [
        'Identificar momentos de logro importantes',
        'Invitar a miembros de la comunidad a celebrar',
        'Documentar el momento (foto/video)',
        'Compartir en comunidad con mensaje motivacional',
      ],
      suggestedScripts: [
        'Guión para anunciar el logro a la comunidad',
        'Mensaje de felicitación personalizado',
      ],
      suggestedFollowUps: [
        'Publicar en redes sociales (con permiso)',
        'Usar como caso de éxito en marketing',
        'Solicitar testimonio en el momento de emoción',
      ],
    },
    status: 'en-analisis',
    tags: ['logro', 'comunidad', 'celebración'],
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export const WowMomentsAPI = {
  async getMoments(): Promise<WowMoment[]> {
    await delay(200);
    return cloneData(MOCK_WOW_MOMENTS);
  },

  async getMoment(momentId: string): Promise<WowMoment | null> {
    await delay(150);
    const moment = MOCK_WOW_MOMENTS.find((m) => m.id === momentId);
    return moment ? cloneData(moment) : null;
  },

  async captureMoment(momentData: Omit<WowMoment, 'id' | 'capturedAt' | 'status'>): Promise<WowMoment> {
    await delay(300);
    // Simular análisis IA
    const newMoment: WowMoment = {
      ...momentData,
      id: `wow_${Date.now()}`,
      capturedAt: new Date().toISOString(),
      status: 'en-analisis',
      aiAnalysis: {
        keyElements: [
          'Elemento personalizado identificado',
          'Momento emocional detectado',
          'Acción replicable encontrada',
        ],
        emotionalTriggers: ['Conexión emocional', 'Sentimiento positivo'],
        replicableActions: [
          'Documentar el momento',
          'Identificar elementos clave',
          'Crear estrategia de replicación',
        ],
        suggestedScripts: ['Guión sugerido basado en el momento'],
        suggestedFollowUps: ['Seguimiento sugerido'],
      },
    };
    return cloneData(newMoment);
  },

  async analyzeMomentWithAI(momentId: string): Promise<WowMoment> {
    await delay(500);
    const moment = MOCK_WOW_MOMENTS.find((m) => m.id === momentId);
    if (!moment) {
      throw new Error('Momento no encontrado');
    }
    // Simular análisis IA más profundo
    const analyzed = {
      ...moment,
      aiAnalysis: {
        keyElements: [
          'Elemento personalizado identificado',
          'Momento emocional detectado',
          'Acción replicable encontrada',
          'Elemento visual importante',
        ],
        emotionalTriggers: ['Conexión emocional', 'Sentimiento positivo', 'Motivación'],
        replicableActions: [
          'Documentar el momento',
          'Identificar elementos clave',
          'Crear estrategia de replicación',
          'Preparar materiales necesarios',
        ],
        suggestedScripts: [
          'Guión sugerido basado en el momento',
          'Mensaje personalizado para replicar',
        ],
        suggestedFollowUps: [
          'Seguimiento sugerido',
          'Compartir en comunidad',
          'Solicitar testimonio',
        ],
      },
      status: 'capturado' as WowMomentStatus,
    };
    return cloneData(analyzed);
  },

  async createReplicationStrategy(
    momentId: string,
    strategy: Omit<ReplicationStrategy, 'id' | 'createdAt'>,
  ): Promise<ReplicationStrategy> {
    await delay(250);
    const newStrategy: ReplicationStrategy = {
      ...strategy,
      id: `strategy_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return cloneData(newStrategy);
  },

  async updateMoment(momentId: string, updates: Partial<WowMoment>): Promise<WowMoment> {
    await delay(200);
    const moment = MOCK_WOW_MOMENTS.find((m) => m.id === momentId);
    if (!moment) {
      throw new Error('Momento no encontrado');
    }
    const updated = { ...moment, ...updates };
    return cloneData(updated);
  },
};

