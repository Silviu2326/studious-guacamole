import axios from 'axios';
import { Template, TemplatesResponse, TemplateFilters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Datos falsos para las plantillas
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Rutina Hipertrofia 4 Semanas',
    description: 'Programa completo de hipertrofia muscular para principiantes e intermedios. Enfoque en técnica y progresión gradual.',
    durationWeeks: 4,
    tags: ['hipertrofia', 'principiante', 'full-body'],
    assignmentCount: 24,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    structure: {
      phases: [
        {
          name: 'Adaptación',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Día Superior',
                  exercises: [
                    { id: 'e1', name: 'Press Banca', sets: 3, reps: '8-10', restSeconds: 90, weight: '60-70%', order: 1 },
                    { id: 'e2', name: 'Remo con Barra', sets: 3, reps: '8-10', restSeconds: 90, weight: '60-70%', order: 2 },
                    { id: 'e3', name: 'Elevaciones Laterales', sets: 3, reps: '12-15', restSeconds: 60, order: 3 },
                  ],
                },
                {
                  dayNumber: 2,
                  name: 'Día Inferior',
                  exercises: [
                    { id: 'e4', name: 'Sentadillas', sets: 3, reps: '8-10', restSeconds: 120, weight: '60-70%', order: 1 },
                    { id: 'e5', name: 'Peso Muerto', sets: 3, reps: '6-8', restSeconds: 120, weight: '60-70%', order: 2 },
                    { id: 'e6', name: 'Extensiones de Cuádriceps', sets: 3, reps: '12-15', restSeconds: 60, order: 3 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Programa Fuerza Avanzado',
    description: 'Rutina especializada en desarrollo de fuerza máxima. Ideal para atletas experimentados.',
    durationWeeks: 8,
    tags: ['fuerza', 'avanzado'],
    assignmentCount: 12,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z',
    structure: {
      phases: [
        {
          name: 'Acumulación',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Press + Tracción',
                  exercises: [
                    { id: 'e7', name: 'Press Militar', sets: 5, reps: '5', restSeconds: 180, weight: '85%', order: 1 },
                    { id: 'e8', name: 'Dominadas', sets: 4, reps: '6-8', restSeconds: 120, order: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: '3',
    name: 'Rutina Pérdida de Peso',
    description: 'Programa diseñado para quemar grasa mientras se mantiene masa muscular. Combinación de entrenamiento de fuerza y cardio.',
    durationWeeks: 6,
    tags: ['pérdida de peso', 'resistencia', 'full-body'],
    assignmentCount: 38,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-02-25T10:20:00Z',
    structure: {
      phases: [
        {
          name: 'Quema de Grasa',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Circuito Full Body',
                  exercises: [
                    { id: 'e9', name: 'Burpees', sets: 3, reps: '15', restSeconds: 45, order: 1 },
                    { id: 'e10', name: 'Mountain Climbers', sets: 3, reps: '20', restSeconds: 45, order: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: '4',
    name: 'Push Pull Legs (PPL)',
    description: 'División clásica de entrenamiento: empuje, tracción y piernas. 6 días de entrenamiento por semana.',
    durationWeeks: 4,
    tags: ['hipertrofia', 'avanzado'],
    assignmentCount: 19,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-02-18T12:00:00Z',
    structure: {
      phases: [
        {
          name: 'Ciclo 1',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Push',
                  exercises: [
                    { id: 'e11', name: 'Press Banca', sets: 4, reps: '6-8', restSeconds: 120, weight: '75-80%', order: 1 },
                    { id: 'e12', name: 'Press Inclinado', sets: 3, reps: '8-10', restSeconds: 90, weight: '70%', order: 2 },
                  ],
                },
                {
                  dayNumber: 2,
                  name: 'Pull',
                  exercises: [
                    { id: 'e13', name: 'Peso Muerto', sets: 4, reps: '5', restSeconds: 180, weight: '85%', order: 1 },
                    { id: 'e14', name: 'Remo T', sets: 3, reps: '8-10', restSeconds: 90, weight: '70%', order: 2 },
                  ],
                },
                {
                  dayNumber: 3,
                  name: 'Legs',
                  exercises: [
                    { id: 'e15', name: 'Sentadillas', sets: 5, reps: '6-8', restSeconds: 150, weight: '75-80%', order: 1 },
                    { id: 'e16', name: 'Prensa', sets: 4, reps: '10-12', restSeconds: 90, weight: '70%', order: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: '5',
    name: 'Rutina Principiante 3 Meses',
    description: 'Programa completo de 12 semanas para personas que comienzan en el gimnasio. Enfoque en aprendizaje de técnica.',
    durationWeeks: 12,
    tags: ['principiante', 'full-body'],
    assignmentCount: 45,
    createdAt: '2024-01-01T07:00:00Z',
    updatedAt: '2024-02-28T09:30:00Z',
    structure: {
      phases: [
        {
          name: 'Fase 1: Aprendizaje',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Entrenamiento A',
                  exercises: [
                    { id: 'e17', name: 'Press Banca con Barra', sets: 3, reps: '10-12', restSeconds: 90, weight: '50%', order: 1, notes: 'Enfocar en técnica correcta' },
                    { id: 'e18', name: 'Sentadillas con Barra', sets: 3, reps: '10-12', restSeconds: 90, weight: '50%', order: 2, notes: 'Profundidad completa' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: '6',
    name: 'Resistencia Cardiovascular',
    description: 'Programa enfocado en mejorar la capacidad aeróbica y resistencia. Ideal para corredores y ciclistas.',
    durationWeeks: 6,
    tags: ['resistencia'],
    assignmentCount: 8,
    createdAt: '2024-01-25T13:00:00Z',
    updatedAt: '2024-02-22T11:15:00Z',
    structure: {
      phases: [
        {
          name: 'Base Aeróbica',
          weeks: [
            {
              weekNumber: 1,
              days: [
                {
                  dayNumber: 1,
                  name: 'Cardio Moderado',
                  exercises: [
                    { id: 'e19', name: 'Cinta de Correr', sets: 1, reps: '30 min', restSeconds: 0, order: 1 },
                    { id: 'e20', name: 'Bicicleta', sets: 1, reps: '20 min', restSeconds: 0, order: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

// GET /api/training/templates
export const getTemplates = async (filters?: TemplateFilters): Promise<TemplatesResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredTemplates = [...MOCK_TEMPLATES];
  
  // Aplicar filtros
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredTemplates = filteredTemplates.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    filteredTemplates = filteredTemplates.filter(t =>
      filters.tags!.some(tag => t.tags.includes(tag))
    );
  }
  
  if (filters?.durationWeeks) {
    filteredTemplates = filteredTemplates.filter(t => t.durationWeeks === filters.durationWeeks);
  }
  
  // Paginación
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(filteredTemplates.length / limit);
  
  return {
    data: paginatedTemplates,
    pagination: {
      total: filteredTemplates.length,
      page,
      limit,
      totalPages,
    },
  };
};

// POST /api/training/templates
export const createTemplate = async (templateData: Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTemplate: Template = {
    ...templateData,
    id: String(MOCK_TEMPLATES.length + 1),
    assignmentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  MOCK_TEMPLATES.push(newTemplate);
  return newTemplate;
};

// PUT /api/training/templates/{templateId}
export const updateTemplate = async (templateId: string, updateData: Partial<Template>): Promise<Template> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_TEMPLATES.findIndex(t => t.id === templateId);
  if (index === -1) {
    throw new Error('Template not found');
  }
  
  const updatedTemplate: Template = {
    ...MOCK_TEMPLATES[index],
    ...updateData,
    id: templateId,
    updatedAt: new Date().toISOString(),
  };
  
  MOCK_TEMPLATES[index] = updatedTemplate;
  return updatedTemplate;
};

// DELETE /api/training/templates/{templateId}
export const deleteTemplate = async (templateId: string): Promise<{ status: string; message: string }> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = MOCK_TEMPLATES.findIndex(t => t.id === templateId);
  if (index === -1) {
    throw new Error('Template not found');
  }
  
  MOCK_TEMPLATES.splice(index, 1);
  return { status: 'success', message: 'Template deleted successfully' };
};

// GET /api/training/templates/{templateId}
export const getTemplateById = async (templateId: string): Promise<Template> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const template = MOCK_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error('Template not found');
  }
  
  return template;
};

// Duplicar plantilla
export const duplicateTemplate = async (templateId: string, newName?: string): Promise<Template> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const template = await getTemplateById(templateId);
  const duplicatedTemplate: Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'> = {
    ...template,
    name: newName || `${template.name} (Copia)`,
  };
  return await createTemplate(duplicatedTemplate);
};

// Función para obtener estadísticas de analytics
export const getTemplateAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const totalTemplates = MOCK_TEMPLATES.length;
  const totalAssignments = MOCK_TEMPLATES.reduce((sum, t) => sum + (t.assignmentCount || 0), 0);
  const avgAssignments = totalAssignments / totalTemplates;
  
  // Estadísticas por tag
  const tagStats: Record<string, number> = {};
  MOCK_TEMPLATES.forEach(t => {
    t.tags.forEach(tag => {
      tagStats[tag] = (tagStats[tag] || 0) + (t.assignmentCount || 0);
    });
  });
  
  // Plantillas más asignadas
  const topTemplates = [...MOCK_TEMPLATES]
    .sort((a, b) => (b.assignmentCount || 0) - (a.assignmentCount || 0))
    .slice(0, 5);
  
  // Distribución por duración
  const durationDistribution = {
    '4 semanas': MOCK_TEMPLATES.filter(t => t.durationWeeks === 4).length,
    '6 semanas': MOCK_TEMPLATES.filter(t => t.durationWeeks === 6).length,
    '8 semanas': MOCK_TEMPLATES.filter(t => t.durationWeeks === 8).length,
    '12 semanas': MOCK_TEMPLATES.filter(t => t.durationWeeks === 12).length,
  };
  
  // Tendencias mensuales (últimos 6 meses)
  const monthlyTrends = [
    { month: 'Sep 2023', templates: 2, assignments: 15 },
    { month: 'Oct 2023', templates: 3, assignments: 28 },
    { month: 'Nov 2023', templates: 4, assignments: 42 },
    { month: 'Dic 2023', templates: 5, assignments: 58 },
    { month: 'Ene 2024', templates: 6, assignments: 85 },
    { month: 'Feb 2024', templates: 6, assignments: 116 },
  ];
  
  return {
    totalTemplates,
    totalAssignments,
    avgAssignments: Math.round(avgAssignments * 10) / 10,
    tagStats,
    topTemplates,
    durationDistribution,
    monthlyTrends,
  };
};
