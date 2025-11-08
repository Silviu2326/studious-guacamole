// API para generación de estrategias de marketing con IA

export type StrategyType = 
  | 'content_plan_30_days' 
  | 'content_plan_60_days' 
  | 'content_plan_90_days'
  | 'launch_campaign' 
  | 'retention_strategy' 
  | 'collaboration_ideas'
  | 'seasonal_campaign'
  | 'product_launch'
  | 'other';

export type MarketingChannel = 'instagram' | 'facebook' | 'email' | 'blog' | 'youtube' | 'tiktok' | 'multiple';
export type BudgetRange = 'low' | 'medium' | 'high' | 'very_high';
export type TimeHorizon = 'short_term' | 'medium_term' | 'long_term';

export interface StrategyInputData {
  type: StrategyType;
  objectives: {
    primary: string;
    secondary?: string[];
    timeHorizon: TimeHorizon;
    targetMetrics?: string[];
  };
  audience: {
    description: string;
    ageRange?: string;
    demographics?: string;
    painPoints?: string[];
  };
  niche?: string;
  services?: string[];
  budget: BudgetRange;
  channels: MarketingChannel[];
  tone: string;
  customRequirements?: string;
}

export interface ContentPlanDay {
  day: string;
  date?: string;
  topic: string;
  format: string;
  description?: string;
  hashtags?: string[];
  copy?: string;
}

export interface ContentPlanWeek {
  weekNumber: number;
  theme?: string;
  days: ContentPlanDay[];
}

export interface CampaignElement {
  type: 'email_sequence' | 'ad_copy' | 'landing_page' | 'social_post' | 'other';
  title: string;
  content: string;
  order?: number;
}

export interface StrategyOutput {
  summary: string;
  type: StrategyType;
  contentPlan?: {
    weeks: ContentPlanWeek[];
  };
  campaign?: {
    name: string;
    timeline: string;
    elements: CampaignElement[];
  };
  retentionStrategies?: {
    title: string;
    description: string;
    actions: string[];
  }[];
  collaborationIdeas?: {
    partner: string;
    idea: string;
    benefits: string[];
  }[];
  recommendations?: string[];
  nextSteps?: string[];
}

export interface MarketingStrategy {
  id: string;
  trainerId: string;
  type: StrategyType;
  title: string;
  status: 'generating' | 'completed' | 'failed';
  input: StrategyInputData;
  output?: StrategyOutput;
  createdAt: string;
  updatedAt?: string;
}

export interface StrategySummary {
  id: string;
  type: StrategyType;
  title: string;
  createdAt: string;
  status: string;
}

export interface StrategiesResponse {
  data: StrategySummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// Funciones API simuladas (a implementar con backend real)
export const generateStrategy = async (
  input: StrategyInputData
): Promise<MarketingStrategy> => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simular delay de generación
  
  // Generar estrategia simulada basada en el tipo
  const output: StrategyOutput = generateMockStrategyOutput(input);
  
  return {
    id: `strat_${Date.now()}`,
    trainerId: 'trn_current',
    type: input.type,
    title: generateStrategyTitle(input),
    status: 'completed',
    input,
    output,
    createdAt: new Date().toISOString()
  };
};

function generateStrategyTitle(input: StrategyInputData): string {
  const typeMap: Record<StrategyType, string> = {
    content_plan_30_days: 'Plan de Contenido - 30 Días',
    content_plan_60_days: 'Plan de Contenido - 60 Días',
    content_plan_90_days: 'Plan de Contenido - 90 Días',
    launch_campaign: 'Campaña de Lanzamiento',
    retention_strategy: 'Estrategia de Retención',
    collaboration_ideas: 'Ideas de Colaboración',
    seasonal_campaign: 'Campaña Estacional',
    product_launch: 'Lanzamiento de Producto',
    other: 'Estrategia Personalizada'
  };
  
  return typeMap[input.type] || 'Estrategia de Marketing';
}

function generateMockStrategyOutput(input: StrategyInputData): StrategyOutput {
  if (input.type.startsWith('content_plan')) {
    const days = input.type === 'content_plan_30_days' ? 30 :
                 input.type === 'content_plan_60_days' ? 60 : 90;
    const weeks = Math.ceil(days / 7);
    
    const contentPlan: ContentPlanWeek[] = [];
    for (let week = 1; week <= weeks; week++) {
      const weekDays: ContentPlanDay[] = [];
      const daysThisWeek = week === weeks ? days - (week - 1) * 7 : 7;
      
      for (let day = 1; day <= daysThisWeek; day++) {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const dayIndex = ((week - 1) * 7 + day - 1) % 7;
        
        weekDays.push({
          day: dayNames[dayIndex],
          topic: `Tema de contenido para ${dayNames[dayIndex]} - Semana ${week}`,
          format: day % 3 === 0 ? 'Reel' : day % 2 === 0 ? 'Carrusel' : 'Post',
          description: `Contenido enfocado en ${input.audience.description}`,
          hashtags: ['#fitness', '#entrenamiento', '#salud'],
          copy: `Copy sugerido para el contenido del día ${day}`
        });
      }
      
      contentPlan.push({
        weekNumber: week,
        theme: `Tema de la Semana ${week}`,
        days: weekDays
      });
    }
    
    return {
      summary: `Plan de contenido de ${days} días enfocado en ${input.audience.description}. ${input.objectives.primary}`,
      type: input.type,
      contentPlan: { weeks: contentPlan },
      recommendations: [
        'Publica consistentemente a las horas de mayor engagement',
        'Responde todos los comentarios para aumentar el alcance',
        'Utiliza historias para aumentar la visibilidad'
      ],
      nextSteps: [
        'Revisa y ajusta el calendario según tu disponibilidad',
        'Prepara el contenido visual para cada publicación',
        'Programa las publicaciones usando el planificador'
      ]
    };
  }
  
  if (input.type === 'launch_campaign' || input.type === 'seasonal_campaign') {
    return {
      summary: `Campaña de marketing para ${input.objectives.primary}`,
      type: input.type,
      campaign: {
        name: input.type === 'seasonal_campaign' ? 'Campaña Estacional' : 'Campaña de Lanzamiento',
        timeline: '4 semanas',
        elements: [
          {
            type: 'email_sequence',
            title: 'Secuencia de Bienvenida',
            content: 'Email 1: Introducción y valor...\nEmail 2: Casos de éxito...\nEmail 3: Llamada a la acción...',
            order: 1
          },
          {
            type: 'ad_copy',
            title: 'Copy para Anuncios',
            content: 'Título: Transforma tu cuerpo en 30 días\nDescripción: Programa personalizado...',
            order: 2
          },
          {
            type: 'landing_page',
            title: 'Estructura de Landing Page',
            content: 'Header: Beneficio principal\nSección 1: Problema/Solución...',
            order: 3
          }
        ]
      },
      recommendations: [
        'Comienza la campaña un lunes para maximizar engagement',
        'Ajusta el presupuesto según los resultados de los primeros días'
      ],
      nextSteps: [
        'Configura los anuncios en la plataforma seleccionada',
        'Prepara todos los elementos visuales',
        'Programa la secuencia de emails'
      ]
    };
  }
  
  if (input.type === 'retention_strategy') {
    return {
      summary: `Estrategia de retención para clientes existentes`,
      type: input.type,
      retentionStrategies: [
        {
          title: 'Programa de Lealtad',
          description: 'Sistema de recompensas para clientes de largo plazo',
          actions: [
            'Ofrecer sesión gratuita después de 6 meses',
            'Crear un grupo exclusivo de Facebook',
            'Enviar descuentos por cumpleaños'
          ]
        },
        {
          title: 'Comunicación Proactiva',
          description: 'Mantener contacto regular con los clientes',
          actions: [
            'Enviar check-ins semanales',
            'Compartir tips personalizados',
            'Celebrar logros y aniversarios'
          ]
        }
      ],
      recommendations: [
        'Implementa al menos 2 estrategias simultáneamente',
        'Mide el impacto de cada iniciativa'
      ]
    };
  }
  
  if (input.type === 'collaboration_ideas') {
    return {
      summary: 'Ideas de colaboración para expandir tu alcance',
      type: input.type,
      collaborationIdeas: [
        {
          partner: 'Nutricionista',
          idea: 'Crea un paquete combinado: Entrenamiento + Plan Nutricional',
          benefits: [
            'Amplía tu propuesta de valor',
            'Atrae clientes interesados en transformación completa',
            'Genera ingresos adicionales'
          ]
        },
        {
          partner: 'Fisioterapeuta',
          idea: 'Colabora en programas de recuperación post-lesión',
          benefits: [
            'Especialización en nicho específico',
            'Mayor credibilidad',
            'Referidos cruzados'
          ]
        }
      ],
      recommendations: [
        'Inicia con colaboradores locales',
        'Define claramente los términos de la colaboración'
      ]
    };
  }
  
  return {
    summary: 'Estrategia personalizada generada',
    type: input.type,
    recommendations: ['Revisa y personaliza según tus necesidades'],
    nextSteps: ['Implementa las acciones sugeridas']
  };
}

export const getStrategies = async (params?: {
  page?: number;
  limit?: number;
}): Promise<StrategiesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockStrategies: StrategySummary[] = [
    {
      id: 'strat_1a2b3c4d5e',
      type: 'content_plan_30_days',
      title: 'Plan de Contenido - Octubre 2024',
      createdAt: '2024-10-01T10:00:00Z',
      status: 'completed'
    },
    {
      id: 'strat_2b3c4d5e6f',
      type: 'launch_campaign',
      title: 'Campaña Lanzamiento Reto Verano',
      createdAt: '2024-09-15T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'strat_3c4d5e6f7g',
      type: 'retention_strategy',
      title: 'Estrategia Retención Q4',
      createdAt: '2024-08-20T09:15:00Z',
      status: 'completed'
    }
  ];
  
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  
  return {
    data: mockStrategies.slice(startIndex, startIndex + limit),
    pagination: {
      total: mockStrategies.length,
      page,
      limit
    }
  };
};

export const getStrategy = async (strategyId: string): Promise<MarketingStrategy | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const strategies = await getStrategies();
  const found = strategies.data.find(s => s.id === strategyId);
  
  if (!found) return null;
  
  // Generar estrategia completa simulada
  const mockInput: StrategyInputData = {
    type: found.type,
    objectives: {
      primary: 'Aumentar engagement y atraer nuevos leads',
      timeHorizon: 'short_term'
    },
    audience: {
      description: 'Clientes objetivo'
    },
    budget: 'medium',
    channels: ['instagram'],
    tone: 'Motivacional'
  };
  
  const output = generateMockStrategyOutput(mockInput);
  
  return {
    id: found.id,
    trainerId: 'trn_current',
    type: found.type,
    title: found.title,
    status: 'completed',
    input: mockInput,
    output,
    createdAt: found.createdAt
  };
};

export const deleteStrategy = async (strategyId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando estrategia:', strategyId);
};












