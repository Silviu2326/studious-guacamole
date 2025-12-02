import { Automation, CreateAutomationData, UpdateAutomationData } from '../types';

// Mock data para desarrollo
const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Email de Bienvenida',
    description: 'Envía un email de bienvenida cuando se crea un nuevo miembro',
    is_active: true,
    trigger_type: 'MEMBER_CREATED',
    trigger_config: {},
    action_type: 'SEND_EMAIL',
    action_config: {
      template_id: 'welcome-001',
      subject: 'Bienvenido al gimnasio',
      message: 'Gracias por unirte a nosotros...'
    },
    executions_last_30d: 45,
    success_rate: 98.5,
    last_execution: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Recordatorio de Pago',
    description: 'Envía SMS cuando falla un pago',
    is_active: true,
    trigger_type: 'PAYMENT_FAILED',
    trigger_config: {},
    action_type: 'SEND_SMS',
    action_config: {
      message: 'Tu pago no se pudo procesar. Por favor, actualiza tu método de pago.'
    },
    executions_last_30d: 12,
    success_rate: 95.0,
    last_execution: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Alerta de Inactividad',
    description: 'Notifica cuando un miembro está inactivo por más de 30 días',
    is_active: false,
    trigger_type: 'MEMBER_INACTIVITY',
    trigger_config: {
      days: 30
    },
    action_type: 'CREATE_TASK',
    action_config: {
      assign_to: 'user-123'
    },
    executions_last_30d: 0,
    success_rate: 0,
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-01-05')
  }
];

let automationIdCounter = mockAutomations.length + 1;

export const getAutomations = async (): Promise<Automation[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockAutomations];
};

export const getAutomation = async (id: string): Promise<Automation | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAutomations.find(a => a.id === id) || null;
};

export const createAutomation = async (data: CreateAutomationData): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newAutomation: Automation = {
    id: `auto-${automationIdCounter++}`,
    name: data.name,
    description: data.description,
    is_active: data.is_active ?? true,
    trigger_type: data.trigger_type,
    trigger_config: data.trigger_config,
    action_type: data.action_type,
    action_config: data.action_config,
    executions_last_30d: 0,
    success_rate: 0,
    created_at: new Date(),
    updated_at: new Date()
  };

  mockAutomations.push(newAutomation);
  return newAutomation;
};

export const updateAutomation = async (
  id: string,
  data: UpdateAutomationData
): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockAutomations.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Automation no encontrada');
  }

  const updated: Automation = {
    ...mockAutomations[index],
    ...data,
    updated_at: new Date()
  };

  mockAutomations[index] = updated;
  return updated;
};

export const deleteAutomation = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockAutomations.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Automation no encontrada');
  }

  mockAutomations.splice(index, 1);
  return true;
};

export const getAutomationStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const total = mockAutomations.length;
  const active = mockAutomations.filter(a => a.is_active).length;
  const totalExecutions = mockAutomations.reduce((sum, a) => sum + a.executions_last_30d, 0);
  const avgSuccessRate = total > 0
    ? mockAutomations.reduce((sum, a) => sum + a.success_rate, 0) / total
    : 0;

  return {
    total_automations: total,
    active_automations: active,
    total_executions_30d: totalExecutions,
    success_rate: avgSuccessRate,
    most_executed: mockAutomations.length > 0
      ? {
          id: mockAutomations[0].id,
          name: mockAutomations[0].name,
          executions: mockAutomations[0].executions_last_30d
        }
      : undefined,
    time_saved_hours: Math.round(totalExecutions * 0.5),
    members_impacted: Math.round(totalExecutions * 1.2)
  };
};
