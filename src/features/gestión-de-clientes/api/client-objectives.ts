import { ClientObjective } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_CLIENT_OBJECTIVES: ClientObjective[] = [
  {
    id: 'obj-1',
    clientId: 'client_1',
    title: 'Perder 5 kg',
    description: 'Meta de pérdida de peso para mejorar la salud general',
    targetValue: 5,
    currentValue: 2.5,
    unit: 'kg',
    deadline: '2024-12-31',
    status: 'in_progress',
    category: 'weight',
    progress: 50,
    createdAt: '2024-01-15',
    updatedAt: '2024-10-28',
    createdBy: 'trainer',
  },
  {
    id: 'obj-2',
    clientId: 'client_1',
    title: 'Correr 10 km sin parar',
    description: 'Mejorar resistencia cardiovascular',
    targetValue: 10,
    currentValue: 7,
    unit: 'km',
    deadline: '2024-11-30',
    status: 'in_progress',
    category: 'endurance',
    progress: 70,
    createdAt: '2024-02-01',
    updatedAt: '2024-10-27',
    createdBy: 'client',
  },
  {
    id: 'obj-3',
    clientId: 'client_2',
    title: 'Aumentar masa muscular 3 kg',
    description: 'Ganar masa muscular mediante entrenamiento de fuerza',
    targetValue: 3,
    currentValue: 1.5,
    unit: 'kg',
    deadline: '2024-12-31',
    status: 'in_progress',
    category: 'strength',
    progress: 50,
    createdAt: '2024-02-20',
    updatedAt: '2024-10-15',
    createdBy: 'trainer',
  },
];

/**
 * Obtiene los objetivos de un cliente
 */
export const getClientObjectives = async (clientId: string): Promise<ClientObjective[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CLIENT_OBJECTIVES.filter(obj => obj.clientId === clientId);
};

/**
 * Obtiene un objetivo por ID
 */
export const getClientObjective = async (objectiveId: string): Promise<ClientObjective | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CLIENT_OBJECTIVES.find(obj => obj.id === objectiveId) || null;
};

/**
 * Crea un nuevo objetivo para un cliente
 */
export const createClientObjective = async (
  objective: Omit<ClientObjective, 'id' | 'createdAt' | 'updatedAt' | 'progress'>
): Promise<ClientObjective> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const progress = objective.targetValue > 0 
    ? Math.min(100, (objective.currentValue / objective.targetValue) * 100)
    : 0;
  
  const status: ClientObjective['status'] = 
    progress >= 100 ? 'achieved' :
    progress > 0 ? 'in_progress' :
    'not_started';
  
  const newObjective: ClientObjective = {
    id: `obj-${Date.now()}`,
    ...objective,
    progress,
    status,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  
  MOCK_CLIENT_OBJECTIVES.push(newObjective);
  return newObjective;
};

/**
 * Actualiza un objetivo de cliente
 */
export const updateClientObjective = async (
  objectiveId: string,
  updates: Partial<ClientObjective>
): Promise<ClientObjective> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENT_OBJECTIVES.findIndex(obj => obj.id === objectiveId);
  if (index === -1) throw new Error('Objective not found');
  
  const objective = MOCK_CLIENT_OBJECTIVES[index];
  const updatedObjective = { ...objective, ...updates };
  
  // Recalcular progreso y estado
  if (updates.currentValue !== undefined || updates.targetValue !== undefined) {
    const targetValue = updatedObjective.targetValue;
    const currentValue = updatedObjective.currentValue;
    updatedObjective.progress = targetValue > 0 
      ? Math.min(100, (currentValue / targetValue) * 100)
      : 0;
    
    updatedObjective.status = 
      updatedObjective.progress >= 100 ? 'achieved' :
      updatedObjective.progress > 0 ? 'in_progress' :
      'not_started';
  }
  
  updatedObjective.updatedAt = new Date().toISOString().split('T')[0];
  MOCK_CLIENT_OBJECTIVES[index] = updatedObjective;
  
  return updatedObjective;
};

/**
 * Elimina un objetivo de cliente
 */
export const deleteClientObjective = async (objectiveId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENT_OBJECTIVES.findIndex(obj => obj.id === objectiveId);
  if (index !== -1) {
    MOCK_CLIENT_OBJECTIVES.splice(index, 1);
  }
};

