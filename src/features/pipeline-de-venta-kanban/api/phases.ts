import { Phase, BusinessType } from '../types';

// US-11: Fases actualizadas para entrenadores
const entrenadorPhases: Phase[] = [
  {
    id: '1',
    key: 'contacto_nuevo',
    name: 'Contacto Nuevo',
    description: 'Lead recién llegado, sin contacto previo',
    businessType: 'entrenador',
    order: 1,
    color: '#3B82F6',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    key: 'primera_charla',
    name: 'Primera Charla',
    description: 'Primera conversación realizada',
    businessType: 'entrenador',
    order: 2,
    color: '#8B5CF6',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    key: 'enviado_precio',
    name: 'Enviado Precio',
    description: 'Precio y propuesta enviados',
    businessType: 'entrenador',
    order: 3,
    color: '#F59E0B',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    key: 'llamada',
    name: 'Llamada',
    description: 'Llamada o reunión agendada',
    businessType: 'entrenador',
    order: 4,
    color: '#EC4899',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    key: 'cliente',
    name: 'Cliente',
    description: 'Convertido a cliente exitosamente',
    businessType: 'entrenador',
    order: 5,
    color: '#10B981',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    key: 'descartado',
    name: 'Descartado',
    description: 'Lead descartado o perdido',
    businessType: 'entrenador',
    order: 6,
    color: '#6B7280',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Fases por defecto para gimnasios
const gimnasioPhases: Phase[] = [
  {
    id: '5',
    key: 'tour_hecho',
    name: 'Tour Hecho',
    description: 'Visita al centro realizada',
    businessType: 'gimnasio',
    order: 1,
    color: '#3B82F6',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    key: 'oferta_enviada',
    name: 'Oferta Enviada',
    description: 'Propuesta comercial enviada',
    businessType: 'gimnasio',
    order: 2,
    color: '#8B5CF6',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    key: 'matricula_pendiente',
    name: 'Matrícula Pendiente',
    description: 'Esperando matrícula',
    businessType: 'gimnasio',
    order: 3,
    color: '#F59E0B',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    key: 'alta_cerrada',
    name: 'Alta Cerrada',
    description: 'Alta completada',
    businessType: 'gimnasio',
    order: 4,
    color: '#10B981',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getPhases = async (businessType: BusinessType): Promise<Phase[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return businessType === 'entrenador' ? [...entrenadorPhases] : [...gimnasioPhases];
};

export const createPhase = async (phase: Omit<Phase, 'id' | 'createdAt' | 'updatedAt'>): Promise<Phase> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newPhase: Phase = {
    ...phase,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  if (phase.businessType === 'entrenador') {
    entrenadorPhases.push(newPhase);
  } else {
    gimnasioPhases.push(newPhase);
  }
  
  return newPhase;
};

export const updatePhase = async (id: string, updates: Partial<Phase>): Promise<Phase> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allPhases = [...entrenadorPhases, ...gimnasioPhases];
  const phase = allPhases.find(p => p.id === id);
  
  if (!phase) {
    throw new Error('Fase no encontrada');
  }
  
  const updatedPhase = {
    ...phase,
    ...updates,
    updatedAt: new Date(),
  };
  
  const phaseList = phase.businessType === 'entrenador' ? entrenadorPhases : gimnasioPhases;
  const index = phaseList.findIndex(p => p.id === id);
  if (index !== -1) {
    phaseList[index] = updatedPhase;
  }
  
  return updatedPhase;
};

export const deletePhase = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allPhases = [...entrenadorPhases, ...gimnasioPhases];
  const phase = allPhases.find(p => p.id === id);
  
  if (!phase) {
    throw new Error('Fase no encontrada');
  }
  
  const phaseList = phase.businessType === 'entrenador' ? entrenadorPhases : gimnasioPhases;
  const index = phaseList.findIndex(p => p.id === id);
  if (index !== -1) {
    phaseList.splice(index, 1);
  }
};
