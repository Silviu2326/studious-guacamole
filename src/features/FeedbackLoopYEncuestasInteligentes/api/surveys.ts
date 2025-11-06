// API para gestión de encuestas y feedback

export type SurveyStatus = 'draft' | 'active' | 'archived';
export type QuestionType = 'rating_stars' | 'nps' | 'multiple_choice' | 'text' | 'yes_no' | 'scale';
export type TriggerEvent = 'session_completed' | 'plan_started' | 'plan_30_days' | 'milestone_reached' | 'goal_completed' | 'manual';

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  text: string;
  required?: boolean;
  options?: string[]; // Para multiple_choice
  min?: number; // Para scale
  max?: number; // Para scale o rating_stars
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt?: string;
  templateId?: string;
}

export interface SurveySummary {
  id: string;
  title: string;
  status: SurveyStatus;
  responseRate: number;
  totalSent?: number;
  totalResponses?: number;
  mainKpi: {
    label: string;
    value: string | number;
  };
}

export interface SurveyResponse {
  responseId: string;
  clientId: string;
  clientName?: string;
  clientAvatar?: string;
  surveyId: string;
  submittedAt: string;
  answers: Record<string, any>;
}

export interface SurveyResults {
  summary: {
    totalResponses: number;
    responseRate: number;
    nps?: number;
    csat?: number;
  };
  breakdown: QuestionBreakdown[];
  individualResponses: SurveyResponse[];
}

export interface QuestionBreakdown {
  questionId: string;
  type: QuestionType;
  text: string;
  stats?: {
    promoters?: number;
    passives?: number;
    detractors?: number;
    average?: number;
    distribution?: Record<number, number>;
  };
}

export interface AutomationRule {
  id: string;
  surveyId: string;
  triggerEvent: TriggerEvent;
  delayInHours: number;
  isActive: boolean;
  conditions?: Record<string, any>;
}

export interface TriggerOption {
  id: TriggerEvent;
  name: string;
  description: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getSurveys = async (filters?: {
  status?: SurveyStatus;
}): Promise<SurveySummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'survey_abc123',
      title: 'Satisfacción Post-Sesión',
      status: 'active',
      responseRate: 82,
      totalSent: 50,
      totalResponses: 41,
      mainKpi: {
        label: 'CSAT',
        value: '4.8/5'
      }
    },
    {
      id: 'survey_def456',
      title: 'NPS Trimestral Q4',
      status: 'active',
      responseRate: 65,
      totalSent: 120,
      totalResponses: 78,
      mainKpi: {
        label: 'NPS',
        value: 60
      }
    },
    {
      id: 'survey_ghi789',
      title: 'Check-in de Progreso Mensual',
      status: 'active',
      responseRate: 71,
      totalSent: 35,
      totalResponses: 25,
      mainKpi: {
        label: 'Satisfacción',
        value: '4.2/5'
      }
    },
    {
      id: 'survey_jkl012',
      title: 'Feedback sobre Plan Nutricional',
      status: 'draft',
      responseRate: 0,
      totalSent: 0,
      totalResponses: 0,
      mainKpi: {
        label: 'CSAT',
        value: 'N/A'
      }
    }
  ].filter(s => !filters?.status || s.status === filters.status);
};

export const getSurvey = async (surveyId: string): Promise<Survey | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data
  return {
    id: surveyId,
    title: 'Satisfacción Post-Sesión',
    description: 'Encuesta automática enviada después de cada sesión',
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'rating_stars',
        text: '¿Cómo calificarías tu sesión de hoy?',
        required: true,
        max: 5
      },
      {
        id: 'q2',
        type: 'text',
        text: '¿Qué fue lo que más te gustó?',
        required: false
      },
      {
        id: 'q3',
        type: 'yes_no',
        text: '¿Recomendarías esta sesión a un amigo?',
        required: true
      }
    ],
    createdAt: '2023-10-27T10:00:00Z',
    updatedAt: '2023-10-28T14:30:00Z'
  };
};

export const createSurvey = async (
  surveyData: Omit<Survey, 'id' | 'createdAt' | 'status'>
): Promise<Survey> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newSurvey: Survey = {
    id: `survey_${Date.now()}`,
    ...surveyData,
    status: 'draft',
    createdAt: new Date().toISOString()
  };
  
  return newSurvey;
};

export const updateSurvey = async (
  surveyId: string,
  updates: Partial<Survey>
): Promise<Survey> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const existing = await getSurvey(surveyId);
  if (!existing) {
    throw new Error('Encuesta no encontrada');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getSurveyResults = async (surveyId: string): Promise<SurveyResults> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    summary: {
      totalResponses: 150,
      responseRate: 75,
      nps: 60,
      csat: 4.8
    },
    breakdown: [
      {
        questionId: 'q1',
        type: 'nps',
        text: '¿Qué tan probable es que recomiendes nuestros servicios?',
        stats: {
          promoters: 100,
          passives: 30,
          detractors: 20
        }
      },
      {
        questionId: 'q2',
        type: 'rating_stars',
        text: '¿Cómo calificarías tu sesión?',
        stats: {
          average: 4.8,
          distribution: {
            1: 2,
            2: 5,
            3: 10,
            4: 35,
            5: 98
          }
        }
      }
    ],
    individualResponses: [
      {
        responseId: 'resp_001',
        clientId: 'client_xyz',
        clientName: 'Ana Gómez',
        clientAvatar: 'https://via.placeholder.com/100',
        surveyId,
        submittedAt: '2024-08-15T14:30:00Z',
        answers: {
          q1: 9,
          q2: 5,
          q3: 'Sí'
        }
      },
      {
        responseId: 'resp_002',
        clientId: 'client_abc',
        clientName: 'Carlos Ruiz',
        clientAvatar: 'https://via.placeholder.com/100',
        surveyId,
        submittedAt: '2024-08-15T16:20:00Z',
        answers: {
          q1: 8,
          q2: 4,
          q3: 'Sí'
        }
      }
    ]
  };
};

export const getAutomationRules = async (surveyId?: string): Promise<AutomationRule[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: 'auto_xyz789',
      surveyId: 'survey_abc123',
      triggerEvent: 'session_completed',
      delayInHours: 24,
      isActive: true
    },
    {
      id: 'auto_def456',
      surveyId: 'survey_ghi789',
      triggerEvent: 'plan_30_days',
      delayInHours: 0,
      isActive: true
    }
  ].filter(a => !surveyId || a.surveyId === surveyId);
};

export const createAutomationRule = async (
  automationData: Omit<AutomationRule, 'id'>
): Promise<AutomationRule> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: `auto_${Date.now()}`,
    ...automationData
  };
};

export const updateAutomationRule = async (
  automationId: string,
  updates: Partial<AutomationRule>
): Promise<AutomationRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const rules = await getAutomationRules();
  const existing = rules.find(r => r.id === automationId);
  
  if (!existing) {
    throw new Error('Regla de automatización no encontrada');
  }
  
  return {
    ...existing,
    ...updates
  };
};

export const deleteSurvey = async (surveyId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando encuesta:', surveyId);
};

export const getTriggerOptions = (): TriggerOption[] => {
  return [
    {
      id: 'session_completed',
      name: 'Sesión Completada',
      description: 'Cuando un cliente completa una sesión de entrenamiento'
    },
    {
      id: 'plan_started',
      name: 'Plan Iniciado',
      description: 'Cuando un cliente inicia un nuevo plan'
    },
    {
      id: 'plan_30_days',
      name: '30 Días en el Plan',
      description: 'Cuando un cliente cumple 30 días con el plan actual'
    },
    {
      id: 'milestone_reached',
      name: 'Hito Alcanzado',
      description: 'Cuando un cliente alcanza un hito definido'
    },
    {
      id: 'goal_completed',
      name: 'Objetivo Completado',
      description: 'Cuando un cliente completa un objetivo'
    },
    {
      id: 'manual',
      name: 'Manual',
      description: 'Envío manual por el entrenador'
    }
  ];
};









