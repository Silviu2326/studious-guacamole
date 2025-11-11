// API para experimentos de A/B Testing

export interface Experiment {
  id: string;
  name: string;
  type: ExperimentType;
  status: ExperimentStatus;
  objective: string;
  variants: ExperimentVariant[];
  winner?: string; // ID de la variante ganadora
  confidence?: number; // Nivel de confianza estadística (0-1)
  lift?: number; // Mejora relativa
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  trainerId: string;
}

export type ExperimentType = 'LANDING_PAGE' | 'EMAIL' | 'OFFER';
export type ExperimentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'FINISHED';

export interface ExperimentVariant {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

export interface ExperimentFilters {
  status?: ExperimentStatus[];
  type?: ExperimentType[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getExperiments = async (filters?: ExperimentFilters): Promise<Experiment[]> => {
  // Simulación - en producción esto haría una llamada real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  return [
    {
      id: 'exp_1',
      name: 'Test de Headline Landing Verano',
      type: 'LANDING_PAGE',
      status: 'ACTIVE',
      objective: 'Inscripciones al Reto de 30 Días',
      variants: [
        {
          id: 'var_a',
          name: 'Versión A - Headline Original',
          visitors: 1024,
          conversions: 51,
          conversionRate: 0.05
        },
        {
          id: 'var_b',
          name: 'Versión B - Headline Agresivo',
          visitors: 1019,
          conversions: 68,
          conversionRate: 0.0667
        }
      ],
      confidence: 0.96,
      lift: 0.334,
      startDate: '2023-10-28T10:00:00Z',
      createdAt: '2023-10-27T10:00:00Z',
      updatedAt: '2023-10-27T10:00:00Z',
      trainerId: 'trainer-123'
    }
  ];
};

export const getExperiment = async (id: string): Promise<Experiment | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto haría una llamada GET /api/marketing/experiments/{id}
  const experiments = await getExperiments();
  return experiments.find(exp => exp.id === id) || null;
};

export const createExperiment = async (experimentData: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt' | 'trainerId'>): Promise<Experiment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/marketing/experiments
  const newExperiment: Experiment = {
    ...experimentData,
    id: `exp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trainerId: 'trainer-123', // En producción vendría del contexto de autenticación
    variants: experimentData.variants.map((v, idx) => ({
      ...v,
      id: `var_${idx === 0 ? 'a' : idx === 1 ? 'b' : String.fromCharCode(99 + idx)}`,
      visitors: 0,
      conversions: 0,
      conversionRate: 0
    }))
  };
  
  return newExperiment;
};

export const updateExperimentStatus = async (
  id: string, 
  status: ExperimentStatus
): Promise<Experiment> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/marketing/experiments/{id}/status
  const experiment = await getExperiment(id);
  if (!experiment) {
    throw new Error('Experimento no encontrado');
  }
  
  return {
    ...experiment,
    status,
    updatedAt: new Date().toISOString()
  };
};

export const applyWinner = async (experimentId: string, variantId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/marketing/experiments/{id}/apply-winner
  // Esto aplicaría la variante ganadora como versión por defecto
};
















