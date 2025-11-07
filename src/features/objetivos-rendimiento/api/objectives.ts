import { Objective, ObjectiveFilters } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockObjectives: Objective[] = [
  {
    id: '1',
    title: 'Facturación Mensual',
    description: 'Alcanzar objetivo de facturación mensual',
    metric: 'facturacion',
    targetValue: 50000,
    currentValue: 35000,
    unit: '€',
    deadline: '2024-12-31',
    status: 'in_progress',
    responsible: 'user',
    category: 'financiero',
    progress: 70,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
  },
  {
    id: '2',
    title: 'Adherencia de Clientes',
    description: 'Mantener adherencia superior al 80%',
    metric: 'adherencia',
    targetValue: 80,
    currentValue: 75,
    unit: '%',
    deadline: '2024-12-31',
    status: 'in_progress',
    responsible: 'user',
    category: 'operacional',
    progress: 93.75,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
  },
];

export const getObjectives = async (filters?: ObjectiveFilters, role?: 'entrenador' | 'gimnasio'): Promise<Objective[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...mockObjectives];
  
  if (filters?.status) {
    filtered = filtered.filter(obj => obj.status === filters.status);
  }
  
  if (filters?.category) {
    filtered = filtered.filter(obj => obj.category === filters.category);
  }
  
  // Filtrar por rol - ajustar objetivos según el tipo de usuario
  if (role === 'entrenador') {
    filtered = filtered.filter(obj => 
      ['facturacion', 'adherencia', 'retencion'].includes(obj.metric)
    );
  } else if (role === 'gimnasio') {
    filtered = filtered.filter(obj => 
      ['facturacion', 'ocupacion', 'tasa_bajas', 'objetivos_comerciales'].includes(obj.metric)
    );
  }
  
  return filtered;
};

export const getObjective = async (id: string): Promise<Objective | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockObjectives.find(obj => obj.id === id) || null;
};

export const createObjective = async (objective: Omit<Objective, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newObjective: Objective = {
    ...objective,
    id: Date.now().toString(),
    progress: Math.min((objective.currentValue / objective.targetValue) * 100, 100),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockObjectives.push(newObjective);
  return newObjective;
};

export const updateObjective = async (id: string, updates: Partial<Objective>): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockObjectives.findIndex(obj => obj.id === id);
  if (index === -1) throw new Error('Objective not found');
  
  const updated = {
    ...mockObjectives[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  if (updates.currentValue !== undefined || updates.targetValue !== undefined) {
    updated.progress = Math.min((updated.currentValue / updated.targetValue) * 100, 100);
    
    if (updated.progress >= 100) {
      updated.status = 'achieved';
    } else if (updated.progress < 50 && updated.status === 'in_progress') {
      updated.status = 'at_risk';
    }
  }
  
  mockObjectives[index] = updated;
  return updated;
};

export const deleteObjective = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = mockObjectives.findIndex(obj => obj.id === id);
  if (index !== -1) {
    mockObjectives.splice(index, 1);
  }
};

export const getObjectiveProgress = async (id: string): Promise<{ progress: number; status: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const objective = mockObjectives.find(obj => obj.id === id);
  if (!objective) throw new Error('Objective not found');
  
  return {
    progress: objective.progress,
    status: objective.status,
  };
};

