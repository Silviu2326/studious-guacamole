/**
 * API para gestión de librería de objetivos predefinidos
 * User Story: Como manager quiero acceso a librerías de objetivos predefinidos
 */

import { Objective } from '../types';

export interface PredefinedObjectiveTemplate {
  id: string;
  title: string;
  description: string;
  metric: string;
  suggestedTargetValue: number;
  unit: string;
  category: string;
  industry?: string; // Sector/industria
  companySize?: 'pequeña' | 'mediana' | 'grande';
  role?: 'entrenador' | 'gimnasio';
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  bestPractices: string[];
  commonPitfalls: string[];
  relatedTemplates?: string[]; // IDs de templates relacionados
  usageCount: number; // Cuántas veces se ha usado
  successRate?: number; // Tasa de éxito (0-100)
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ObjectiveLibrary {
  id: string;
  name: string;
  description: string;
  category: string;
  templates: PredefinedObjectiveTemplate[];
  isOfficial: boolean; // Si es una librería oficial del sistema
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Simulación de datos - en producción vendría de una API real
const mockPredefinedTemplates: PredefinedObjectiveTemplate[] = [
  {
    id: 'template-1',
    title: 'Aumentar facturación mensual',
    description: 'Objetivo para incrementar la facturación mensual del centro',
    metric: 'Facturación mensual',
    suggestedTargetValue: 50000,
    unit: '€',
    category: 'finanzas',
    industry: 'fitness',
    companySize: 'mediana',
    role: 'gimnasio',
    difficulty: 'intermedio',
    bestPractices: [
      'Establecer un incremento realista basado en datos históricos',
      'Desglosar el objetivo por líneas de negocio',
      'Monitorear semanalmente el progreso',
    ],
    commonPitfalls: [
      'Establecer objetivos demasiado ambiciosos sin base',
      'No considerar factores estacionales',
      'No tener un plan de acción claro',
    ],
    usageCount: 234,
    successRate: 68,
    tags: ['facturacion', 'ingresos', 'finanzas'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-2',
    title: 'Mejorar adherencia de clientes',
    description: 'Aumentar el porcentaje de clientes que cumplen con sus sesiones programadas',
    metric: 'Tasa de adherencia',
    suggestedTargetValue: 75,
    unit: '%',
    category: 'operaciones',
    industry: 'fitness',
    companySize: 'mediana',
    role: 'gimnasio',
    difficulty: 'intermedio',
    bestPractices: [
      'Implementar recordatorios automáticos',
      'Ofrecer incentivos por cumplimiento',
      'Analizar patrones de no asistencia',
    ],
    commonPitfalls: [
      'No personalizar el seguimiento',
      'Ignorar feedback de clientes',
      'No adaptar estrategias según resultados',
    ],
    usageCount: 189,
    successRate: 72,
    tags: ['adherencia', 'retencion', 'clientes'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-3',
    title: 'Reducir tasa de bajas mensual',
    description: 'Disminuir el porcentaje de clientes que dan de baja su membresía',
    metric: 'Tasa de bajas',
    suggestedTargetValue: 5,
    unit: '%',
    category: 'retencion',
    industry: 'fitness',
    companySize: 'mediana',
    role: 'gimnasio',
    difficulty: 'avanzado',
    bestPractices: [
      'Identificar señales tempranas de riesgo',
      'Implementar programas de retención',
      'Mejorar la experiencia del cliente',
    ],
    commonPitfalls: [
      'Reaccionar demasiado tarde',
      'No entender las causas reales',
      'No personalizar las estrategias de retención',
    ],
    usageCount: 156,
    successRate: 65,
    tags: ['bajas', 'retencion', 'churn'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-4',
    title: 'Aumentar facturación personal',
    description: 'Incrementar los ingresos personales del entrenador',
    metric: 'Facturación personal',
    suggestedTargetValue: 8000,
    unit: '€',
    category: 'finanzas',
    industry: 'fitness',
    companySize: 'pequeña',
    role: 'entrenador',
    difficulty: 'principiante',
    bestPractices: [
      'Establecer objetivos mensuales realistas',
      'Diversificar servicios ofrecidos',
      'Mantener un seguimiento constante',
    ],
    commonPitfalls: [
      'No considerar la capacidad disponible',
      'Ignorar la calidad del servicio',
      'No planificar con anticipación',
    ],
    usageCount: 312,
    successRate: 75,
    tags: ['facturacion', 'entrenador', 'ingresos'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockLibraries: ObjectiveLibrary[] = [
  {
    id: 'lib-1',
    name: 'Objetivos Financieros',
    description: 'Librería de objetivos relacionados con finanzas y facturación',
    category: 'finanzas',
    templates: mockPredefinedTemplates.filter(t => t.category === 'finanzas'),
    isOfficial: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lib-2',
    name: 'Objetivos de Retención',
    description: 'Objetivos para mejorar la retención y reducir bajas',
    category: 'retencion',
    templates: mockPredefinedTemplates.filter(t => t.category === 'retencion'),
    isOfficial: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lib-3',
    name: 'Objetivos Operacionales',
    description: 'Objetivos relacionados con operaciones y eficiencia',
    category: 'operaciones',
    templates: mockPredefinedTemplates.filter(t => t.category === 'operaciones'),
    isOfficial: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getPredefinedTemplates = async (
  filters?: {
    category?: string;
    role?: 'entrenador' | 'gimnasio';
    industry?: string;
    companySize?: string;
  }
): Promise<PredefinedObjectiveTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...mockPredefinedTemplates];
  
  if (filters?.category) {
    filtered = filtered.filter(t => t.category === filters.category);
  }
  if (filters?.role) {
    filtered = filtered.filter(t => !t.role || t.role === filters.role);
  }
  if (filters?.industry) {
    filtered = filtered.filter(t => !t.industry || t.industry === filters.industry);
  }
  if (filters?.companySize) {
    filtered = filtered.filter(t => !t.companySize || t.companySize === filters.companySize);
  }
  
  return filtered;
};

export const getPredefinedTemplate = async (id: string): Promise<PredefinedObjectiveTemplate | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockPredefinedTemplates.find(t => t.id === id) || null;
};

export const getLibraries = async (): Promise<ObjectiveLibrary[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLibraries;
};

export const getLibrary = async (id: string): Promise<ObjectiveLibrary | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLibraries.find(l => l.id === id) || null;
};

export const createObjectiveFromTemplate = async (
  templateId: string,
  customizations?: {
    targetValue?: number;
    deadline?: string;
    responsible?: string;
  }
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const template = mockPredefinedTemplates.find(t => t.id === templateId);
  if (!template) {
    throw new Error('Template no encontrado');
  }
  
  // En producción, esto crearía un objetivo real
  const objective: Objective = {
    id: `obj-${Date.now()}`,
    title: template.title,
    description: template.description,
    metric: template.metric,
    targetValue: customizations?.targetValue || template.suggestedTargetValue,
    currentValue: 0,
    unit: template.unit,
    deadline: customizations?.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'not_started',
    responsible: customizations?.responsible,
    category: template.category,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return objective;
};

export const incrementTemplateUsage = async (templateId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, esto actualizaría el contador en la base de datos
  console.log(`Template ${templateId} usado`);
};

