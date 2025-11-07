import { RetentionAction, RetentionReason } from '../types';

const MOCK_RETENTION_ACTIONS: RetentionAction[] = [
  {
    id: '1',
    clientId: '2',
    type: 'email',
    scheduledDate: '2024-10-29',
    status: 'pending',
    notes: 'Enviar email de recordatorio',
  },
  {
    id: '2',
    clientId: '2',
    type: 'whatsapp',
    scheduledDate: '2024-10-30',
    status: 'pending',
    notes: 'Mensaje personalizado de seguimiento',
  },
];

export const getRetentionActions = async (clientId?: string): Promise<RetentionAction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (clientId) {
    return MOCK_RETENTION_ACTIONS.filter(a => a.clientId === clientId);
  }
  return MOCK_RETENTION_ACTIONS;
};

export const createRetentionAction = async (action: Omit<RetentionAction, 'id'>): Promise<RetentionAction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newAction: RetentionAction = {
    id: Date.now().toString(),
    ...action,
  };
  
  MOCK_RETENTION_ACTIONS.push(newAction);
  return newAction;
};

export const updateRetentionAction = async (
  actionId: string,
  updates: Partial<RetentionAction>
): Promise<RetentionAction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_RETENTION_ACTIONS.findIndex(a => a.id === actionId);
  if (index === -1) throw new Error('Retention action not found');
  
  MOCK_RETENTION_ACTIONS[index] = { ...MOCK_RETENTION_ACTIONS[index], ...updates };
  return MOCK_RETENTION_ACTIONS[index];
};

export const markClientAsLost = async (
  clientId: string,
  reason: RetentionReason,
  notes?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // En producción, esto actualizaría el estado del cliente
  console.log('Marking client as lost:', clientId, reason, notes);
};

export const recoverClient = async (clientId: string, notes?: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // En producción, esto cambiaría el estado del cliente de 'en-riesgo' o 'perdido' a 'activo'
  console.log('Recovering client:', clientId, notes);
};

