import { TestimonialScript, TestimonialScriptObjective, TestimonialScriptFormat } from '../types';
import { CommunityVoiceConfig } from '../types';

// Mock data para guiones
const MOCK_SCRIPTS: TestimonialScript[] = [
  {
    id: 'script_001',
    name: 'Guión para ventas premium - Transformación',
    objective: 'ventas-premium',
    format: 'video',
    storyArc: {
      opening: 'Hola [Nombre], ¡felicidades por alcanzar tu objetivo! Me encantaría que compartieras tu experiencia con otros que están considerando empezar su transformación.',
      questions: [
        {
          id: 'q1',
          order: 1,
          question: '¿Cuál era tu objetivo principal cuando empezaste?',
          purpose: 'Establecer el punto de partida y motivación inicial',
          expectedDuration: 30,
        },
        {
          id: 'q2',
          order: 2,
          question: '¿Qué fue lo que más te sorprendió del proceso?',
          purpose: 'Destacar elementos únicos del servicio',
          expectedDuration: 45,
        },
        {
          id: 'q3',
          order: 3,
          question: '¿Cómo te sientes ahora comparado con cuando empezaste?',
          purpose: 'Mostrar el impacto emocional y físico',
          expectedDuration: 40,
        },
        {
          id: 'q4',
          order: 4,
          question: '¿Qué le dirías a alguien que está pensando en empezar?',
          purpose: 'Cierre motivacional y llamada a la acción',
          expectedDuration: 35,
        },
      ],
      closing: '¡Gracias por compartir tu historia! Tu testimonio inspirará a otros a dar el primer paso. 💪✨',
    },
    tone: 'Motivacional pero cercano',
    keywords: ['transformación', 'progreso', 'comunidad', 'disciplina'],
    preferredEmojis: ['💪', '🔥', '✨', '🎯'],
    estimatedDuration: 3,
    createdAt: '2025-10-10T10:00:00Z',
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

export const TestimonialScriptsAPI = {
  async getScripts(): Promise<TestimonialScript[]> {
    await delay(200);
    return cloneData(MOCK_SCRIPTS);
  },

  async getScript(scriptId: string): Promise<TestimonialScript | null> {
    await delay(150);
    const script = MOCK_SCRIPTS.find((s) => s.id === scriptId);
    return script ? cloneData(script) : null;
  },

  async generateScript(params: {
    objective: TestimonialScriptObjective;
    format: TestimonialScriptFormat;
    voiceConfig?: CommunityVoiceConfig;
    clientContext?: {
      clientId?: string;
      clientName?: string;
      objective?: string;
      progress?: string;
    };
  }): Promise<TestimonialScript> {
    await delay(800); // Simular generación IA

    const { objective, format, voiceConfig, clientContext } = params;

    // Generar preguntas basadas en el objetivo
    const questions = generateQuestionsForObjective(objective, clientContext);

    // Usar configuración de voz si está disponible
    const tone = voiceConfig?.tone || 'Motivacional pero cercano';
    const keywords = voiceConfig?.keywords || ['transformación', 'progreso', 'comunidad'];
    const preferredEmojis = voiceConfig?.preferredEmojis || ['💪', '🔥', '✨'];

    // Generar opening y closing personalizados
    const opening = generateOpening(objective, clientContext, tone, preferredEmojis);
    const closing = generateClosing(objective, tone, preferredEmojis);

    // Generar texto para teleprompter
    const teleprompterText = generateTeleprompterText(opening, questions, closing);

    const newScript: TestimonialScript = {
      id: `script_${Date.now()}`,
      name: `Guión ${getObjectiveLabel(objective)} - ${getFormatLabel(format)}`,
      objective,
      format,
      storyArc: {
        opening,
        questions,
        closing,
      },
      tone,
      keywords,
      preferredEmojis,
      estimatedDuration: calculateEstimatedDuration(questions),
      clientContext,
      teleprompterText,
      createdAt: new Date().toISOString(),
    };

    return cloneData(newScript);
  },

  async updateScript(scriptId: string, updates: Partial<TestimonialScript>): Promise<TestimonialScript> {
    await delay(200);
    const script = MOCK_SCRIPTS.find((s) => s.id === scriptId);
    if (!script) {
      throw new Error('Guión no encontrado');
    }
    const updated = { ...script, ...updates, updatedAt: new Date().toISOString() };
    return cloneData(updated);
  },

  async exportToTeleprompter(scriptId: string): Promise<string> {
    await delay(150);
    const script = MOCK_SCRIPTS.find((s) => s.id === scriptId);
    if (!script) {
      throw new Error('Guión no encontrado');
    }
    return script.teleprompterText || generateTeleprompterText(
      script.storyArc.opening,
      script.storyArc.questions,
      script.storyArc.closing,
    );
  },
};

// Funciones auxiliares para generación IA simulada
function generateQuestionsForObjective(
  objective: TestimonialScriptObjective,
  clientContext?: { objective?: string; progress?: string },
): TestimonialScript['storyArc']['questions'] {
  const baseQuestions: Record<TestimonialScriptObjective, string[]> = {
    'ventas-premium': [
      '¿Cuál era tu objetivo principal cuando empezaste?',
      '¿Qué fue lo que más te sorprendió del proceso?',
      '¿Cómo te sientes ahora comparado con cuando empezaste?',
      '¿Qué le dirías a alguien que está pensando en empezar?',
    ],
    'programa-grupal': [
      '¿Qué te motivó a unirte al programa grupal?',
      '¿Cómo ha sido la experiencia de entrenar en grupo?',
      '¿Qué impacto ha tenido la comunidad en tu progreso?',
      '¿Recomendarías este programa a otros?',
    ],
    'transformacion': [
      '¿Cuál era tu situación antes de empezar?',
      '¿Qué cambios has notado en tu vida?',
      '¿Qué fue lo más difícil y cómo lo superaste?',
      '¿Qué consejo le darías a alguien en tu situación anterior?',
    ],
    'fidelizacion': [
      '¿Cuánto tiempo llevas con nosotros?',
      '¿Qué es lo que más valoras del servicio?',
      '¿Qué te mantiene motivado a seguir?',
      '¿Qué hace diferente a este lugar?',
    ],
    'referidos': [
      '¿Cómo conociste nuestro servicio?',
      '¿Qué te hizo decidirte a probarlo?',
      '¿Has recomendado nuestro servicio a alguien?',
      '¿Por qué lo recomendarías?',
    ],
    'personalizado': [
      'Cuéntame sobre tu experiencia',
      '¿Qué destacarías como lo más importante?',
      '¿Cómo ha impactado esto en tu vida?',
      '¿Qué mensaje quieres compartir?',
    ],
  };

  const questions = baseQuestions[objective] || baseQuestions.personalizado;

  return questions.map((q, index) => ({
    id: `q${index + 1}`,
    order: index + 1,
    question: clientContext?.objective ? q.replace('[objetivo]', clientContext.objective) : q,
    purpose: getQuestionPurpose(objective, index),
    expectedDuration: 30 + index * 5,
  }));
}

function getQuestionPurpose(objective: TestimonialScriptObjective, index: number): string {
  const purposes: Record<TestimonialScriptObjective, string[]> = {
    'ventas-premium': [
      'Establecer el punto de partida y motivación inicial',
      'Destacar elementos únicos del servicio',
      'Mostrar el impacto emocional y físico',
      'Cierre motivacional y llamada a la acción',
    ],
    'programa-grupal': [
      'Entender la motivación inicial',
      'Destacar beneficios del grupo',
      'Mostrar valor de la comunidad',
      'Generar interés en el programa',
    ],
    'transformacion': [
      'Establecer contraste antes/después',
      'Mostrar impacto real',
      'Humanizar el proceso',
      'Inspirar a otros',
    ],
    'fidelizacion': [
      'Establecer credibilidad por tiempo',
      'Identificar elementos de valor',
      'Mostrar satisfacción continua',
      'Destacar diferenciadores',
    ],
    'referidos': [
      'Establecer origen',
      'Identificar motivadores',
      'Mostrar satisfacción',
      'Generar confianza',
    ],
    'personalizado': [
      'Abrir conversación',
      'Identificar puntos clave',
      'Mostrar impacto',
      'Cerrar con mensaje',
    ],
  };

  return purposes[objective]?.[index] || 'Obtener información valiosa';
}

function generateOpening(
  objective: TestimonialScriptObjective,
  clientContext?: { clientName?: string },
  tone?: string,
  emojis?: string[],
): string {
  const emoji = emojis?.[0] || '💪';
  const name = clientContext?.clientName ? `, ${clientContext.clientName}` : '';
  
  const openings: Record<TestimonialScriptObjective, string> = {
    'ventas-premium': `Hola${name}${emoji} ¡Felicidades por alcanzar tu objetivo! Me encantaría que compartieras tu experiencia con otros que están considerando empezar su transformación.`,
    'programa-grupal': `Hola${name}${emoji} Gracias por ser parte de nuestra comunidad. ¿Te gustaría compartir cómo ha sido tu experiencia en el programa grupal?`,
    'transformacion': `Hola${name}${emoji} Has logrado una transformación increíble. ¿Podrías contarnos tu historia para inspirar a otros?`,
    'fidelizacion': `Hola${name}${emoji} Llevas tiempo con nosotros y queremos saber qué es lo que más valoras de tu experiencia.`,
    'referidos': `Hola${name}${emoji} Nos encantaría saber qué te hizo elegirnos y cómo ha sido tu experiencia hasta ahora.`,
    'personalizado': `Hola${name}${emoji} Me encantaría que compartieras tu experiencia con nosotros.`,
  };

  return openings[objective] || openings.personalizado;
}

function generateClosing(
  objective: TestimonialScriptObjective,
  tone?: string,
  emojis?: string[],
): string {
  const emoji = emojis?.join(' ') || '💪✨';
  
  const closings: Record<TestimonialScriptObjective, string> = {
    'ventas-premium': `¡Gracias por compartir tu historia! Tu testimonio inspirará a otros a dar el primer paso. ${emoji}`,
    'programa-grupal': `¡Gracias por ser parte de nuestra comunidad y compartir tu experiencia! ${emoji}`,
    'transformacion': `¡Gracias por inspirarnos con tu transformación! Tu historia motivará a muchos. ${emoji}`,
    'fidelizacion': `¡Gracias por tu lealtad y por compartir lo que más valoras! ${emoji}`,
    'referidos': `¡Gracias por confiar en nosotros y por compartir tu experiencia! ${emoji}`,
    'personalizado': `¡Gracias por compartir tu experiencia! ${emoji}`,
  };

  return closings[objective] || closings.personalizado;
}

function generateTeleprompterText(
  opening: string,
  questions: TestimonialScript['storyArc']['questions'],
  closing: string,
): string {
  const lines = [
    '=== APERTURA ===',
    opening,
    '',
    '=== PREGUNTAS ===',
    ...questions.map((q, index) => {
      return `\n${index + 1}. ${q.question}\n   [Propósito: ${q.purpose}]\n   [Duración esperada: ~${q.expectedDuration}s]`;
    }),
    '',
    '=== CIERRE ===',
    closing,
  ];

  return lines.join('\n');
}

function getObjectiveLabel(objective: TestimonialScriptObjective): string {
  const labels: Record<TestimonialScriptObjective, string> = {
    'ventas-premium': 'Ventas Premium',
    'programa-grupal': 'Programa Grupal',
    'transformacion': 'Transformación',
    'fidelizacion': 'Fidelización',
    'referidos': 'Referidos',
    'personalizado': 'Personalizado',
  };
  return labels[objective] || objective;
}

function getFormatLabel(format: TestimonialScriptFormat): string {
  const labels: Record<TestimonialScriptFormat, string> = {
    video: 'Video',
    audio: 'Audio',
    texto: 'Texto',
    live: 'En Vivo',
  };
  return labels[format] || format;
}

function calculateEstimatedDuration(questions: TestimonialScript['storyArc']['questions']): number {
  const totalSeconds = questions.reduce((sum, q) => sum + (q.expectedDuration || 30), 0);
  return Math.ceil(totalSeconds / 60); // Convertir a minutos
}

