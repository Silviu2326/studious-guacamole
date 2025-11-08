// API para gestión del Personalization Engine (IA avanzada)

export type SuggestionType = 'WORKOUT_ADJUSTMENT' | 'ADAPTIVE_COMMUNICATION' | 'CONTENT_RECOMMENDATION' | 'INTELLIGENT_OFFER';
export type SuggestionStatus = 'PENDING_REVIEW' | 'ACCEPTED' | 'REJECTED';
export type GlobalObjective = 'MAXIMIZE_RETENTION' | 'MAXIMIZE_LTV' | 'IMPROVE_ADHERENCE';
export type SuggestionAction = 'INCREASE_WEIGHT' | 'DECREASE_WEIGHT' | 'REPLACE_EXERCISE' | 'ADD_DELOAD_WEEK' | 'SEND_MESSAGE' | 'RECOMMEND_CONTENT' | 'OFFER_UPSELL';

export interface SuggestionData {
  exerciseId?: string;
  exerciseName?: string;
  action: SuggestionAction;
  value?: string;
  newValue?: string;
  contentTitle?: string;
  contentUrl?: string;
  messageTone?: string;
  offerProduct?: string;
  offerDiscount?: number;
}

export interface AISuggestion {
  suggestionId: string;
  clientId: string;
  clientName: string;
  type: SuggestionType;
  data: SuggestionData;
  justificationText: string;
  createdAt: string;
  status?: SuggestionStatus;
}

export interface ModuleConfig {
  enabled: boolean;
  maxWeightIncreasePercent?: number;
  reviewRequired?: boolean;
  maxOffersPerMonth?: number;
  autoSend?: boolean;
}

export interface EngineSettings {
  trainerId: string;
  globalObjective: GlobalObjective;
  modules: {
    workoutAdjustments: ModuleConfig;
    adaptiveCommunication: ModuleConfig;
    contentRecommendation: ModuleConfig;
    intelligentOffers: ModuleConfig;
  };
}

export interface PersonalizationKPI {
  acceptanceRate: number;
  adherenceImpact: number;
  churnRateIA: number;
  offerConversionRate: number;
  contentEngagementRate: number;
  riskPredictionAccuracy: number;
  totalSuggestionsGenerated: number;
  totalSuggestionsAccepted: number;
  totalSuggestionsRejected: number;
}

// Funciones API simuladas
export const getAISuggestions = async (
  status?: SuggestionStatus,
  type?: SuggestionType,
  clientId?: string
): Promise<AISuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const suggestions: AISuggestion[] = [
    {
      suggestionId: 'sug_001',
      clientId: 'cli_001',
      clientName: 'Laura Gómez',
      type: 'WORKOUT_ADJUSTMENT',
      data: {
        exerciseId: 'ex_001',
        exerciseName: 'Press de Banca',
        action: 'INCREASE_WEIGHT',
        value: '80kg',
        newValue: '84kg'
      },
      justificationText: 'Laura ha completado todas las repeticiones y series en las últimas 3 sesiones con el peso actual. El sistema recomienda un aumento del 5% para continuar con la sobrecarga progresiva.',
      createdAt: '2024-01-15T10:00:00Z',
      status: 'PENDING_REVIEW'
    },
    {
      suggestionId: 'sug_002',
      clientId: 'cli_002',
      clientName: 'Juan Pérez',
      type: 'CONTENT_RECOMMENDATION',
      data: {
        action: 'RECOMMEND_CONTENT',
        contentTitle: 'Técnica correcta de Peso Muerto',
        contentUrl: 'https://ejemplo.com/peso-muerto'
      },
      justificationText: 'Juan está empezando un nuevo bloque de fuerza. Este video de técnica será esencial para asegurar una ejecución correcta y prevenir lesiones.',
      createdAt: '2024-01-16T09:00:00Z',
      status: 'PENDING_REVIEW'
    },
    {
      suggestionId: 'sug_003',
      clientId: 'cli_003',
      clientName: 'Ana Martínez',
      type: 'INTELLIGENT_OFFER',
      data: {
        action: 'OFFER_UPSELL',
        offerProduct: 'Plan de Nutrición Personalizado',
        offerDiscount: 15
      },
      justificationText: 'Ana ha mencionado en sus check-ins dificultades con su dieta actual. Un plan de nutrición personalizado complementaría perfectamente su entrenamiento.',
      createdAt: '2024-01-17T11:00:00Z',
      status: 'PENDING_REVIEW'
    },
    {
      suggestionId: 'sug_004',
      clientId: 'cli_004',
      clientName: 'Carlos Ruiz',
      type: 'ADAPTIVE_COMMUNICATION',
      data: {
        action: 'SEND_MESSAGE',
        messageTone: 'empático'
      },
      justificationText: 'Carlos no ha registrado un entrenamiento en los últimos 3 días. Enviar un mensaje de motivación empático para reconectar.',
      createdAt: '2024-01-18T08:00:00Z',
      status: 'PENDING_REVIEW'
    }
  ];

  let filtered = suggestions;
  if (status) {
    filtered = filtered.filter(s => s.status === status);
  }
  if (type) {
    filtered = filtered.filter(s => s.type === type);
  }
  if (clientId) {
    filtered = filtered.filter(s => s.clientId === clientId);
  }

  return filtered;
};

export const performSuggestionAction = async (
  suggestionId: string,
  action: 'ACCEPT' | 'REJECT',
  reason?: string
): Promise<{ success: boolean; suggestionId: string; newStatus: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    suggestionId,
    newStatus: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
    message: action === 'ACCEPT' 
      ? 'La sugerencia ha sido aceptada y aplicada al plan del cliente.'
      : 'La sugerencia ha sido rechazada.'
  };
};

export const getEngineSettings = async (): Promise<EngineSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    trainerId: 'trn_001',
    globalObjective: 'MAXIMIZE_RETENTION',
    modules: {
      workoutAdjustments: {
        enabled: true,
        maxWeightIncreasePercent: 10,
        reviewRequired: true
      },
      adaptiveCommunication: {
        enabled: true,
        autoSend: false
      },
      contentRecommendation: {
        enabled: true,
        autoSend: true
      },
      intelligentOffers: {
        enabled: false,
        maxOffersPerMonth: 1
      }
    }
  };
};

export const updateEngineSettings = async (
  settings: Partial<EngineSettings>
): Promise<EngineSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const current = await getEngineSettings();
  return { ...current, ...settings };
};

export const getPersonalizationKPIs = async (): Promise<PersonalizationKPI> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    acceptanceRate: 82.5,
    adherenceImpact: 12.3,
    churnRateIA: 8.5,
    offerConversionRate: 25.8,
    contentEngagementRate: 34.2,
    riskPredictionAccuracy: 78.9,
    totalSuggestionsGenerated: 156,
    totalSuggestionsAccepted: 129,
    totalSuggestionsRejected: 27
  };
};

export const getSuggestionTypeLabel = (type: SuggestionType): string => {
  const labels = {
    WORKOUT_ADJUSTMENT: 'Ajuste de Entrenamiento',
    ADAPTIVE_COMMUNICATION: 'Comunicación Adaptativa',
    CONTENT_RECOMMENDATION: 'Recomendación de Contenido',
    INTELLIGENT_OFFER: 'Oferta Inteligente'
  };
  return labels[type];
};

export const getSuggestionTypeColor = (type: SuggestionType): string => {
  const colors = {
    WORKOUT_ADJUSTMENT: 'bg-blue-50 text-blue-700 border-blue-200',
    ADAPTIVE_COMMUNICATION: 'bg-purple-50 text-purple-700 border-purple-200',
    CONTENT_RECOMMENDATION: 'bg-green-50 text-green-700 border-green-200',
    INTELLIGENT_OFFER: 'bg-orange-50 text-orange-700 border-orange-200'
  };
  return colors[type];
};

export const getGlobalObjectiveLabel = (objective: GlobalObjective): string => {
  const labels = {
    MAXIMIZE_RETENTION: 'Maximizar Retención',
    MAXIMIZE_LTV: 'Maximizar LTV',
    IMPROVE_ADHERENCE: 'Mejorar Adherencia'
  };
  return labels[objective];
};










