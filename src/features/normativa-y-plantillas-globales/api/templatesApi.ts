// API para Normativa y Plantillas Globales

import {
  GlobalTemplate,
  TemplateType,
  TemplateStatus,
  TemplateVersion,
  TemplateDeployment,
  TemplateCompliance,
  TemplateFilters,
  TemplateStats,
  TemplateDeploymentConfig
} from '../types';

const API_BASE = '/api/corporate/templates';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Templates
const mockTemplates: GlobalTemplate[] = [
  {
    templateId: 'tpl_001',
    name: 'Contrato Membresía Premium 2024',
    type: 'CONTRACT',
    version: 3,
    status: 'PUBLISHED',
    description: 'Contrato estándar para membresías premium anuales',
    content: '<p>CONTRATO DE ADHESIÓN PARA MEMBRESÍA PREMIUM...</p>',
    createdBy: {
      userId: 'user_admin',
      name: 'Admin Corporativo'
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-05-20T10:00:00Z',
    publishedAt: '2024-05-20T10:00:00Z',
    isMandatory: true,
    targetSites: [],
    categories: ['legal', 'membership']
  },
  {
    templateId: 'tpl_002',
    name: 'Plan Nutricional Definición',
    type: 'NUTRITION_GUIDE',
    version: 1,
    status: 'PUBLISHED',
    description: 'Programa nutricional de 8 semanas para definición muscular',
    content: {
      macros: 'Proteínas: 2g/kg, Carbohidratos: 1.5g/kg, Grasas: 0.8g/kg',
      meals: [
        { meal: 'Desayuno', time: '08:00', foods: ['Avena, claras de huevo, frutas'] },
        { meal: 'Media Mañana', time: '11:00', foods: ['Proteína, frutos secos'] },
        { meal: 'Almuerzo', time: '14:00', foods: ['Pollo, arroz, verduras'] },
        { meal: 'Pre-entreno', time: '17:00', foods: ['Plátano, cafeína'] },
        { meal: 'Post-entreno', time: '19:00', foods: ['Whey protein, arroz'] },
        { meal: 'Cena', time: '21:00', foods: ['Pescado, verduras'] }
      ],
      supplements: ['Multivitamínico', 'Omega-3', 'Vitamina D']
    },
    createdBy: {
      userId: 'user_nutritionist',
      name: 'Dra. María González'
    },
    createdAt: '2024-03-10T09:00:00Z',
    lastModified: '2024-03-10T09:00:00Z',
    publishedAt: '2024-03-15T09:00:00Z',
    isMandatory: false,
    targetSites: ['site_001', 'site_003'],
    categories: ['nutrition', 'training']
  },
  {
    templateId: 'tpl_003',
    name: 'Política de Cancelación de Membresías',
    type: 'POLICY',
    version: 2,
    status: 'PUBLISHED',
    description: 'Política actualizada según ley XYZ del consumidor',
    content: '<div><h1>POLÍTICA DE CANCELACIÓN</h1><p>Derechos del socio...</p></div>',
    createdBy: {
      userId: 'user_legal',
      name: 'Departamento Legal'
    },
    createdAt: '2023-12-05T14:00:00Z',
    lastModified: '2024-05-21T11:00:00Z',
    publishedAt: '2024-05-21T11:00:00Z',
    isMandatory: true,
    targetSites: [],
    categories: ['legal', 'policy']
  },
  {
    templateId: 'tpl_004',
    name: 'Programa Entrenamiento Hipertrofia 12 Semanas',
    type: 'WORKOUT_PLAN',
    version: 2,
    status: 'PUBLISHED',
    description: 'Plan estructurado de 12 semanas para ganancia de masa muscular',
    content: {
      duration: '12 semanas',
      frequency: '4-5 sesiones/semana',
      split: 'Push/Pull/Legs',
      phases: [
        {
          phase: 'Fase 1 - Adaptación',
          weeks: '1-3',
          focus: 'Acondicionamiento y técnica',
          volume: 'Moderado'
        },
        {
          phase: 'Fase 2 - Hipertrofia',
          weeks: '4-8',
          focus: 'Ganancia de masa',
          volume: 'Alto'
        },
        {
          phase: 'Fase 3 - Intensificación',
          weeks: '9-12',
          focus: 'Fuerza y potencia',
          volume: 'Moderado-alto'
        }
      ]
    },
    createdBy: {
      userId: 'user_fitness',
      name: 'Director de Fitness'
    },
    createdAt: '2024-02-01T10:00:00Z',
    lastModified: '2024-04-15T10:00:00Z',
    publishedAt: '2024-04-20T10:00:00Z',
    isMandatory: false,
    targetSites: [],
    categories: ['training', 'workout']
  },
  {
    templateId: 'tpl_005',
    name: 'Email Bienvenida Nuevo Socio',
    type: 'EMAIL',
    version: 1,
    status: 'DRAFT',
    description: 'Email de bienvenida automatizado para nuevos miembros',
    content: 'Estimado/a [NOMBRE],\n\n¡Bienvenido/a a nuestro gimnasio!...',
    createdBy: {
      userId: 'user_marketing',
      name: 'Equipo de Marketing'
    },
    createdAt: '2024-10-15T09:00:00Z',
    lastModified: '2024-10-15T09:00:00Z',
    isMandatory: false,
    targetSites: [],
    categories: ['communication', 'marketing']
  },
  {
    templateId: 'tpl_006',
    name: 'Protocolo de Seguridad COVID-19',
    type: 'PROTOCOL',
    version: 1,
    status: 'ARCHIVED',
    description: 'Protocolos de seguridad e higiene (obsoleto)',
    content: '<p>MEDIDAS DE SEGURIDAD...</p>',
    createdBy: {
      userId: 'user_admin',
      name: 'Admin Corporativo'
    },
    createdAt: '2020-06-01T08:00:00Z',
    lastModified: '2021-05-01T08:00:00Z',
    isMandatory: true,
    targetSites: [],
    categories: ['safety', 'hygiene']
  }
];

const mockVersions: TemplateVersion[] = [];

const mockDeployments: TemplateDeployment[] = [];

const mockCompliance: TemplateCompliance[] = [
  {
    siteId: 'site_001',
    siteName: 'Gimnasio Centro',
    templateId: 'tpl_001',
    currentVersion: 3,
    lastAcknowledged: '2024-05-25T10:00:00Z',
    isCompliant: true,
    daysOutdated: 0
  },
  {
    siteId: 'site_002',
    siteName: 'Gimnasio Norte',
    templateId: 'tpl_001',
    currentVersion: 2,
    lastAcknowledged: '2024-04-15T10:00:00Z',
    isCompliant: false,
    daysOutdated: 40
  },
  {
    siteId: 'site_003',
    siteName: 'Gimnasio Sur',
    templateId: 'tpl_001',
    currentVersion: 3,
    lastAcknowledged: '2024-05-21T10:00:00Z',
    isCompliant: true,
    daysOutdated: 0
  }
];

export const templatesApi = {
  // Get templates
  obtenerPlantillas: async (filters?: TemplateFilters): Promise<GlobalTemplate[]> => {
    await delay(500);
    let templates = [...mockTemplates];

    if (filters?.type) {
      templates = templates.filter(t => t.type === filters.type);
    }

    if (filters?.status) {
      templates = templates.filter(t => t.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.isMandatory !== undefined) {
      templates = templates.filter(t => t.isMandatory === filters.isMandatory);
    }

    return templates;
  },

  obtenerPlantillaPorId: async (templateId: string): Promise<GlobalTemplate | null> => {
    await delay(300);
    return mockTemplates.find(t => t.templateId === templateId) || null;
  },

  // Create template
  crearPlantilla: async (templateData: {
    name: string;
    type: TemplateType;
    description?: string;
    content: string | object;
    isMandatory: boolean;
    targetSites?: string[];
    categories?: string[];
  }): Promise<GlobalTemplate> => {
    await delay(800);
    const newTemplate: GlobalTemplate = {
      templateId: `tpl_${Date.now()}`,
      name: templateData.name,
      type: templateData.type,
      version: 1,
      status: 'DRAFT',
      description: templateData.description,
      content: templateData.content,
      createdBy: {
        userId: 'user_current',
        name: 'Usuario Actual'
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isMandatory: templateData.isMandatory || false,
      targetSites: templateData.targetSites,
      categories: templateData.categories
    };

    mockTemplates.push(newTemplate);
    return newTemplate;
  },

  // Update template (creates new version)
  actualizarPlantilla: async (templateId: string, templateData: {
    name?: string;
    description?: string;
    content?: string | object;
    isMandatory?: boolean;
    targetSites?: string[];
    categories?: string[];
    notes?: string;
  }): Promise<GlobalTemplate> => {
    await delay(800);
    const index = mockTemplates.findIndex(t => t.templateId === templateId);
    if (index === -1) {
      throw new Error('Plantilla no encontrada');
    }

    const currentTemplate = mockTemplates[index];
    
    // Save current version
    const newVersion: TemplateVersion = {
      versionId: `v_${Date.now()}`,
      templateId: currentTemplate.templateId,
      version: currentTemplate.version,
      content: currentTemplate.content,
      createdAt: currentTemplate.lastModified,
      createdBy: currentTemplate.createdBy,
      notes: templateData.notes,
      status: currentTemplate.status
    };
    mockVersions.push(newVersion);

    mockTemplates[index] = {
      ...currentTemplate,
      ...templateData,
      version: currentTemplate.version + 1,
      lastModified: new Date().toISOString()
    };

    return mockTemplates[index];
  },

  // Delete/Archive template
  eliminarPlantilla: async (templateId: string): Promise<void> => {
    await delay(500);
    const index = mockTemplates.findIndex(t => t.templateId === templateId);
    if (index !== -1) {
      mockTemplates[index].status = 'ARCHIVED';
    }
  },

  // Publish/Deploy template
  publicarPlantilla: async (templateId: string, config: TemplateDeploymentConfig): Promise<TemplateDeployment> => {
    await delay(1000);
    const template = mockTemplates.find(t => t.templateId === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    template.status = 'PUBLISHED';
    if (!template.publishedAt) {
      template.publishedAt = new Date().toISOString();
    }

    const deployment: TemplateDeployment = {
      deploymentId: `dep_${Date.now()}`,
      templateId: templateId,
      version: config.version,
      targetSites: config.targetSites === 'ALL' ? ['site_001', 'site_002', 'site_003'] : config.targetSites,
      status: 'COMPLETED',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      acknowledgedSites: [],
      failedSites: []
    };

    mockDeployments.push(deployment);
    return deployment;
  },

  // Get versions
  obtenerVersiones: async (templateId: string): Promise<TemplateVersion[]> => {
    await delay(300);
    return mockVersions.filter(v => v.templateId === templateId);
  },

  // Get compliance
  obtenerCumplimiento: async (templateId?: string): Promise<TemplateCompliance[]> => {
    await delay(500);
    if (templateId) {
      return mockCompliance.filter(c => c.templateId === templateId);
    }
    return mockCompliance;
  },

  // Get stats
  obtenerEstadisticas: async (): Promise<TemplateStats> => {
    await delay(400);
    return {
      totalTemplates: mockTemplates.length,
      publishedTemplates: mockTemplates.filter(t => t.status === 'PUBLISHED').length,
      draftTemplates: mockTemplates.filter(t => t.status === 'DRAFT').length,
      mandatoryTemplates: mockTemplates.filter(t => t.isMandatory).length,
      complianceRate: 95.5,
      averageAdoptionTime: 3.2,
      outdatedSites: 1
    };
  }
};

