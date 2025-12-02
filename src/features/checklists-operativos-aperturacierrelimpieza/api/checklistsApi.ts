// API para Checklists Operativos (Apertura/Cierre/Limpieza)

import {
  ChecklistTemplate,
  ChecklistInstance,
  ChecklistFilters,
  ChecklistItem,
  ChecklistTemplateTask
} from '../types';

const API_BASE = '/api/operations/checklists';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockTemplates: ChecklistTemplate[] = [
  {
    id: 'tmpl_abc123',
    name: 'Checklist de Apertura',
    description: 'Tareas a realizar antes de abrir el gimnasio.',
    taskCount: 15,
    tasks: [
      { id: 'task_1', text: 'Encender todas las luces principales', isCritical: true },
      { id: 'task_2', text: 'Activar sistema de aire acondicionado', isCritical: true },
      { id: 'task_3', text: 'Verificar estado de las máquinas cardiovasculares', isCritical: true },
      { id: 'task_4', text: 'Verificar equipos de audio y música', isCritical: false },
      { id: 'task_5', text: 'Comprobar que los baños estén limpios', isCritical: true },
      { id: 'task_6', text: 'Verificar que hay toallas disponibles', isCritical: false },
      { id: 'task_7', text: 'Revisar sistema de seguridad y cámaras', isCritical: true },
      { id: 'task_8', text: 'Verificar extintores y salidas de emergencia', isCritical: true },
      { id: 'task_9', text: 'Limpiar espejos y superficies principales', isCritical: false },
      { id: 'task_10', text: 'Verificar que las pesas están en orden', isCritical: false },
      { id: 'task_11', text: 'Activar sistema de iluminación LED', isCritical: false },
      { id: 'task_12', text: 'Verificar estado de las duchas', isCritical: true },
      { id: 'task_13', text: 'Comprobar suministro de agua y bebidas', isCritical: false },
      { id: 'task_14', text: 'Verificar sistema de check-in', isCritical: true },
      { id: 'task_15', text: 'Abrir puertas principales', isCritical: true }
    ],
    createdAt: '2023-10-27T08:00:00Z'
  },
  {
    id: 'tmpl_def456',
    name: 'Checklist de Cierre',
    description: 'Tareas a realizar al cerrar el gimnasio.',
    taskCount: 12,
    tasks: [
      { id: 'task_1', text: 'Apagar todas las luces no esenciales', isCritical: true },
      { id: 'task_2', text: 'Desactivar sistema de aire acondicionado', isCritical: false },
      { id: 'task_3', text: 'Recoger y guardar todos los equipos', isCritical: true },
      { id: 'task_4', text: 'Limpiar y desinfectar máquinas de cardio', isCritical: true },
      { id: 'task_5', text: 'Vaciar papeleras y contenedores', isCritical: true },
      { id: 'task_6', text: 'Verificar que no hay miembros en el gimnasio', isCritical: true },
      { id: 'task_7', text: 'Verificar el estado de baños y duchas', isCritical: true },
      { id: 'task_8', text: 'Cerrar y asegurar ventanas', isCritical: true },
      { id: 'task_9', text: 'Verificar caja y registrar ingresos del día', isCritical: true },
      { id: 'task_10', text: 'Apagar sistemas de audio', isCritical: false },
      { id: 'task_11', text: 'Verificar salidas de emergencia', isCritical: true },
      { id: 'task_12', text: 'Activar alarma de seguridad', isCritical: true }
    ],
    createdAt: '2023-10-27T09:00:00Z'
  },
  {
    id: 'tmpl_ghi789',
    name: 'Limpieza Semanal Profunda',
    description: 'Protocolo de limpieza profunda semanal.',
    taskCount: 20,
    tasks: [
      { id: 'task_1', text: 'Limpiar y desinfectar todas las máquinas de cardio', isCritical: true },
      { id: 'task_2', text: 'Limpiar y organizar zona de pesas libre', isCritical: true },
      { id: 'task_3', text: 'Desinfectar bancos y superficies de contacto', isCritical: true },
      { id: 'task_4', text: 'Limpiar espejos completamente', isCritical: false },
      { id: 'task_5', text: 'Limpiar y desinfectar baños a fondo', isCritical: true },
      { id: 'task_6', text: 'Limpiar duchas y zonas húmedas', isCritical: true },
      { id: 'task_7', text: 'Aspirar y limpiar pisos en todas las áreas', isCritical: true },
      { id: 'task_8', text: 'Limpiar ventiladores y filtros de aire', isCritical: false },
      { id: 'task_9', text: 'Verificar y limpiar sistema de iluminación', isCritical: false },
      { id: 'task_10', text: 'Organizar completamente la zona de recepción', isCritical: false },
      { id: 'task_11', text: 'Limpiar estanterías y almacenamiento', isCritical: false },
      { id: 'task_12', text: 'Verificar y limpiar sistema de audio', isCritical: false },
      { id: 'task_13', text: 'Desinfectar pomos de puertas y superficies', isCritical: true },
      { id: 'task_14', text: 'Limpiar ventanas y cristales', isCritical: false },
      { id: 'task_15', text: 'Verificar estado de equipos tras limpieza', isCritical: true },
      { id: 'task_16', text: 'Reponer suministros completos', isCritical: true },
      { id: 'task_17', text: 'Verificar extintores y equipos de seguridad', isCritical: true },
      { id: 'task_18', text: 'Limpiar y organizar área de lockers', isCritical: false },
      { id: 'task_19', text: 'Verificar sistema de cámaras de seguridad', isCritical: false },
      { id: 'task_20', text: 'Revisar y reportar estado general', isCritical: true }
    ],
    createdAt: '2023-10-27T10:00:00Z'
  }
];

const mockInstances: ChecklistInstance[] = [
  {
    id: 'inst_xyz789',
    templateId: 'tmpl_abc123',
    templateName: 'Checklist de Apertura',
    assignedTo: { id: 'user_staff1', name: 'Juan Pérez' },
    dueDate: '2024-11-28T06:00:00Z',
    status: 'in_progress',
    completionPercentage: 40,
    startedAt: '2024-11-28T05:30:00Z'
  },
  {
    id: 'inst_abc456',
    templateId: 'tmpl_abc123',
    templateName: 'Checklist de Apertura',
    assignedTo: { id: 'user_staff2', name: 'Ana García' },
    dueDate: '2024-11-29T06:00:00Z',
    status: 'pending',
    completionPercentage: 0
  },
  {
    id: 'inst_def123',
    templateId: 'tmpl_def456',
    templateName: 'Checklist de Cierre',
    assignedTo: { id: 'user_staff1', name: 'Juan Pérez' },
    dueDate: '2024-11-27T22:00:00Z',
    status: 'completed',
    completionPercentage: 100,
    startedAt: '2024-11-27T21:30:00Z',
    completedAt: '2024-11-27T21:55:00Z'
  }
];

const mockInstanceItems: Record<string, ChecklistItem[]> = {
  'inst_xyz789': [
    {
      id: 'item_1',
      text: 'Encender todas las luces principales',
      status: 'completed',
      completedAt: '2024-11-28T05:31:00Z'
    },
    {
      id: 'item_2',
      text: 'Activar sistema de aire acondicionado',
      status: 'completed',
      completedAt: '2024-11-28T05:32:00Z'
    },
    {
      id: 'item_3',
      text: 'Verificar estado de las máquinas cardiovasculares',
      status: 'issue_reported',
      notes: 'Cinta 3 hace ruido extraño, requiere revisión',
      attachments: ['url/to/photo.jpg'],
      completedAt: '2024-11-28T05:35:00Z'
    },
    {
      id: 'item_4',
      text: 'Verificar equipos de audio y música',
      status: 'pending'
    },
    {
      id: 'item_5',
      text: 'Comprobar que los baños estén limpios',
      status: 'pending'
    }
  ]
};

export const checklistsApi = {
  // Templates
  obtenerTemplates: async (): Promise<ChecklistTemplate[]> => {
    await delay(500);
    return mockTemplates;
  },

  crearTemplate: async (templateData: {
    name: string;
    description: string;
    tasks: ChecklistTemplateTask[];
  }): Promise<ChecklistTemplate> => {
    await delay(500);
    const newTemplate: ChecklistTemplate = {
      id: `tmpl_${Date.now()}`,
      name: templateData.name,
      description: templateData.description,
      taskCount: templateData.tasks.length,
      tasks: templateData.tasks,
      createdAt: new Date().toISOString()
    };
    mockTemplates.push(newTemplate);
    return newTemplate;
  },

  actualizarTemplate: async (id: string, templateData: Partial<ChecklistTemplate>): Promise<ChecklistTemplate> => {
    await delay(500);
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    mockTemplates[index] = { ...mockTemplates[index], ...templateData };
    return mockTemplates[index];
  },

  eliminarTemplate: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTemplates.splice(index, 1);
    }
  },

  // Instances
  obtenerInstances: async (filters?: ChecklistFilters): Promise<ChecklistInstance[]> => {
    await delay(500);
    let instances = [...mockInstances];

    if (filters?.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      instances = instances.filter(inst => {
        const instDate = new Date(inst.dueDate).toISOString().split('T')[0];
        return instDate === filterDate;
      });
    }

    if (filters?.assignedTo) {
      instances = instances.filter(inst => inst.assignedTo.id === filters.assignedTo);
    }

    if (filters?.status) {
      instances = instances.filter(inst => inst.status === filters.status);
    }

    return instances;
  },

  obtenerInstanceById: async (instanceId: string): Promise<ChecklistInstance | null> => {
    await delay(500);
    const instance = mockInstances.find(inst => inst.id === instanceId);
    if (!instance) return null;

    return {
      ...instance,
      items: mockInstanceItems[instanceId] || []
    };
  },

  actualizarItemStatus: async (
    instanceId: string,
    itemId: string,
    updateData: { status: string; notes?: string; attachments?: string[] }
  ): Promise<ChecklistItem> => {
    await delay(500);
    
    if (!mockInstanceItems[instanceId]) {
      throw new Error('Instance not found');
    }

    const items = mockInstanceItems[instanceId];
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const updatedItem: ChecklistItem = {
      ...items[itemIndex],
      ...updateData,
      completedAt: updateData.status === 'completed' || updateData.status === 'issue_reported' 
        ? new Date().toISOString() 
        : undefined
    };

    items[itemIndex] = updatedItem;

    // Actualizar porcentaje de completitud
    const instance = mockInstances.find(inst => inst.id === instanceId);
    if (instance) {
      const completedCount = items.filter(item => 
        item.status === 'completed' || item.status === 'issue_reported'
      ).length;
      instance.completionPercentage = Math.round((completedCount / items.length) * 100);
      
      if (instance.completionPercentage === 100) {
        instance.status = 'completed';
        instance.completedAt = new Date().toISOString();
      } else if (instance.completionPercentage > 0) {
        instance.status = 'in_progress';
      }
    }

    return updatedItem;
  },

  crearInstance: async (instanceData: {
    templateId: string;
    assignedToId: string;
    assignedToName: string;
    dueDate: string;
  }): Promise<ChecklistInstance> => {
    await delay(500);
    const template = mockTemplates.find(t => t.id === instanceData.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newInstance: ChecklistInstance = {
      id: `inst_${Date.now()}`,
      templateId: instanceData.templateId,
      templateName: template.name,
      assignedTo: {
        id: instanceData.assignedToId,
        name: instanceData.assignedToName
      },
      dueDate: instanceData.dueDate,
      status: 'pending',
      completionPercentage: 0
    };

    mockInstances.push(newInstance);
    return newInstance;
  }
};

