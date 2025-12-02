import { 
  AutomationTrigger,
  TriggerEvent,
  TriggerCondition
} from '../types';

export const createAutomationTrigger = async (trigger: Omit<AutomationTrigger, 'id'>): Promise<AutomationTrigger> => {
  // Simular creación de trigger
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    ...trigger,
    id: `trigger_${Date.now()}`
  };
};

export const updateAutomationTrigger = async (id: string, updates: Partial<AutomationTrigger>): Promise<AutomationTrigger> => {
  // Simular actualización de trigger
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    id,
    name: 'Trigger Actualizado',
    event: 'user_signup',
    ...updates
  } as AutomationTrigger;
};

export const deleteAutomationTrigger = async (id: string): Promise<void> => {
  // Simular eliminación de trigger
  await new Promise(resolve => setTimeout(resolve, 400));
};

export const getAutomationTriggers = async (): Promise<AutomationTrigger[]> => {
  // Simular obtención de triggers
  await new Promise(resolve => setTimeout(resolve, 400));
  return [];
};

export const testAutomationTrigger = async (triggerId: string): Promise<{ success: boolean; testResults: any }> => {
  // Simular prueba de trigger
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    testResults: {
      contactsMatched: 5,
      message: 'Trigger probado exitosamente'
    }
  };
};
