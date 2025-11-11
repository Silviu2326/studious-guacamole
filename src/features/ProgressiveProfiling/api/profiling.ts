// API para gestión del Progressive Profiling

export type QuestionType = 'multiple_choice' | 'single_choice' | 'text' | 'number' | 'scale';
export type SequenceStatus = 'draft' | 'active' | 'archived';
export type AutoActionType = 'add_tag' | 'send_notification' | 'assign_to_list';

export interface QuestionOption {
  value: string;
  label: string;
  autoActions?: AutoAction[];
}

export interface AutoAction {
  type: AutoActionType;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  isRequired: boolean;
  order: number;
  autoActions?: AutoAction[];
}

export interface ProfilingSequence {
  id: string;
  name: string;
  status: SequenceStatus;
  questions: Question[];
  questionCount?: number;
  completionRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SequenceStats {
  completionRate: number;
  dropOffQuestion: string | null;
  totalResponses: number;
  perQuestionResponseRate: QuestionResponseRate[];
}

export interface QuestionResponseRate {
  questionId: string;
  questionText: string;
  responseRate: number;
  dropOffRate: number;
}

export interface LeadProfile {
  leadId: string;
  email: string;
  profileData: ProfileResponse[];
}

export interface ProfileResponse {
  questionText: string;
  answerValue: string | string[] | number;
  answeredAt: string;
}

// Funciones API simuladas
export const getProfilingSequences = async (): Promise<ProfilingSequence[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    {
      id: 'seq_001',
      name: 'Embudo de Consulta Gratuita',
      status: 'active',
      questionCount: 5,
      completionRate: 82,
      createdAt: '2024-01-01T00:00:00Z',
      questions: [
        {
          id: 'q_001',
          text: '¿Cuál es tu objetivo principal?',
          type: 'single_choice',
          options: [
            { value: 'lose_weight', label: 'Perder peso' },
            { value: 'gain_muscle', label: 'Ganar músculo' },
            { value: 'improve_condition', label: 'Mejorar condición física' }
          ],
          isRequired: true,
          order: 1
        },
        {
          id: 'q_002',
          text: '¿Tienes experiencia previa en gimnasios?',
          type: 'single_choice',
          options: [
            { value: 'none', label: 'Ninguna' },
            { value: 'little', label: 'Poca' },
            { value: 'moderate', label: 'Moderada' },
            { value: 'advanced', label: 'Avanzada' }
          ],
          isRequired: false,
          order: 2,
          autoActions: [
            { type: 'add_tag', value: 'experiencia_basica' }
          ]
        },
        {
          id: 'q_003',
          text: '¿Tienes alguna lesión o limitación física?',
          type: 'text',
          isRequired: false,
          order: 3
        }
      ]
    },
    {
      id: 'seq_002',
      name: 'Lead Magnet: Guía de Nutrición',
      status: 'active',
      questionCount: 3,
      completionRate: 95,
      createdAt: '2024-01-10T00:00:00Z',
      questions: [
        {
          id: 'q_004',
          text: '¿Cuál es tu mayor reto nutricional?',
          type: 'multiple_choice',
          options: [
            { value: 'meal_planning', label: 'Planificación de comidas' },
            { value: 'cravings', label: 'Controles de antojos' },
            { value: 'knowledge', label: 'Conocimiento nutricional' }
          ],
          isRequired: true,
          order: 1
        },
        {
          id: 'q_005',
          text: '¿Qué edad tienes?',
          type: 'number',
          isRequired: false,
          order: 2
        }
      ]
    },
    {
      id: 'seq_003',
      name: 'Captación Mamás Fit',
      status: 'draft',
      questionCount: 4,
      completionRate: 0,
      createdAt: '2024-01-15T00:00:00Z',
      questions: [
        {
          id: 'q_006',
          text: '¿Cuál es tu mayor reto ahora mismo?',
          type: 'single_choice',
          options: [
            { value: 'recover_figure', label: 'Recuperar mi figura' },
            { value: 'gain_energy', label: 'Ganar energía' },
            { value: 'strengthen_pelvic', label: 'Fortalecer suelo pélvico' }
          ],
          isRequired: true,
          order: 1
        }
      ]
    }
  ];
};

export const createProfilingSequence = async (
  name: string,
  questions: Question[] = []
): Promise<ProfilingSequence> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `seq_${Date.now()}`,
    name,
    status: 'draft',
    questions,
    questionCount: questions.length,
    completionRate: 0,
    createdAt: new Date().toISOString()
  };
};

export const updateProfilingSequence = async (
  sequenceId: string,
  updates: Partial<ProfilingSequence>
): Promise<ProfilingSequence> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const sequences = await getProfilingSequences();
  const existing = sequences.find(s => s.id === sequenceId);

  if (!existing) {
    throw new Error('Secuencia no encontrada');
  }

  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getSequenceStats = async (sequenceId: string): Promise<SequenceStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    completionRate: 82,
    dropOffQuestion: '¿Tienes alguna lesión o limitación física?',
    totalResponses: 150,
    perQuestionResponseRate: [
      {
        questionId: 'q_001',
        questionText: '¿Cuál es tu objetivo principal?',
        responseRate: 100,
        dropOffRate: 0
      },
      {
        questionId: 'q_002',
        questionText: '¿Tienes experiencia previa en gimnasios?',
        responseRate: 85,
        dropOffRate: 15
      },
      {
        questionId: 'q_003',
        questionText: '¿Tienes alguna lesión o limitación física?',
        responseRate: 60,
        dropOffRate: 25
      }
    ]
  };
};

export const getLeadProfile = async (leadId: string): Promise<LeadProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    leadId,
    email: 'lead@example.com',
    profileData: [
      {
        questionText: '¿Cuál es tu objetivo principal?',
        answerValue: 'Perder peso',
        answeredAt: '2024-01-20T10:00:00Z'
      },
      {
        questionText: '¿Tienes experiencia previa en gimnasios?',
        answerValue: 'Poca',
        answeredAt: '2024-01-21T14:00:00Z'
      }
    ]
  };
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  const labels = {
    multiple_choice: 'Múltiple Opción',
    single_choice: 'Opción Única',
    text: 'Texto Libre',
    number: 'Número',
    scale: 'Escala'
  };
  return labels[type];
};

export const getStatusLabel = (status: SequenceStatus): string => {
  const labels = {
    draft: 'Borrador',
    active: 'Activa',
    archived: 'Archivada'
  };
  return labels[status];
};

export const getStatusColor = (status: SequenceStatus): string => {
  const colors = {
    draft: 'text-gray-700 bg-gray-50',
    active: 'text-green-700 bg-green-50',
    archived: 'text-gray-700 bg-gray-50'
  };
  return colors[status];
};

export const getAutoActionLabel = (type: AutoActionType): string => {
  const labels = {
    add_tag: 'Añadir etiqueta',
    send_notification: 'Enviar notificación',
    assign_to_list: 'Asignar a lista'
  };
  return labels[type];
};


















