// API para gestión de automatizaciones de SMS/WhatsApp

export interface Automation {
  id: string;
  name: string;
  triggerType: AutomationTriggerType;
  actionCount: number;
  status: 'active' | 'paused' | 'draft';
  stats: {
    sentLast30d: number;
    deliveryRate?: number;
    failureRate?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutomationDetails extends Automation {
  trigger: TriggerState;
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
}

export type AutomationTriggerType = 
  | 'APPOINTMENT_UPCOMING'
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CANCELLED'
  | 'CLIENT_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_DUE'
  | 'PAYMENT_OVERDUE'
  | 'GOAL_ACHIEVED'
  | 'CLIENT_INACTIVE'
  | 'CHECK_IN_COMPLETED';

export interface TriggerState {
  type: AutomationTriggerType;
  config: Record<string, any>;
}

export interface AutomationAction {
  id: string;
  type: 'SEND_SMS' | 'SEND_WHATSAPP' | 'WAIT' | 'SEND_EMAIL';
  order: number;
  config: {
    message?: string;
    template?: string;
    delayHours?: number;
    delayDays?: number;
    channel?: 'sms' | 'whatsapp';
  };
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface AutomationLog {
  logId: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  status: 'sent' | 'failed' | 'pending';
  providerMessageId?: string;
  error?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getAutomations = async (status?: string): Promise<Automation[]> => {
  // Simulación - en producción esto haría una llamada real a GET /api/automations
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  return [
    // En producción, retornaría datos reales desde el backend
  ];
};

export const getAutomationDetails = async (id: string): Promise<AutomationDetails | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/automations/{id}
  return null;
};

export const createAutomation = async (automationData: Partial<AutomationDetails>): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/automations
  // Validación de datos y creación del registro
  const newAutomation: Automation = {
    id: `auto-${Date.now()}`,
    name: automationData.name || 'Nueva Automatización',
    triggerType: automationData.triggerType || 'APPOINTMENT_CREATED',
    actionCount: automationData.actions?.length || 0,
    status: 'draft',
    stats: {
      sentLast30d: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newAutomation;
};

export const updateAutomation = async (
  automationId: string, 
  updateData: Partial<AutomationDetails>
): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: PUT /api/automations/{automationId}
  console.log('Actualizando automatización:', automationId, updateData);
  
  // Retornar automatización actualizada
  return {
    id: automationId,
    name: updateData.name || 'Automatización Actualizada',
    triggerType: updateData.triggerType || 'APPOINTMENT_CREATED',
    actionCount: updateData.actions?.length || 0,
    status: updateData.status || 'draft',
    stats: {
      sentLast30d: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const deleteAutomation = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/automations/{id}
  console.log('Eliminando automatización:', id);
};

export const getAutomationLogs = async (
  automationId: string, 
  page?: number
): Promise<AutomationLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/automations/{automationId}/logs?page={page}
  return [];
};

export const activateAutomation = async (id: string): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/automations/{id}/activate
  return {
    id,
    name: 'Automatización',
    triggerType: 'APPOINTMENT_CREATED',
    actionCount: 1,
    status: 'active',
    stats: { sentLast30d: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const pauseAutomation = async (id: string): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/automations/{id}/pause
  return {
    id,
    name: 'Automatización',
    triggerType: 'APPOINTMENT_CREATED',
    actionCount: 1,
    status: 'paused',
    stats: { sentLast30d: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};



















