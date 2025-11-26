import { ClientFeedback } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_CLIENT_FEEDBACK: ClientFeedback[] = [
  {
    id: 'feedback-1',
    clientId: 'client_1',
    sessionId: 'session-1',
    reservationId: 'reserva-1',
    rating: 5,
    comment: 'Excelente sesión, muy motivador',
    category: 'session',
    submittedAt: '2024-10-27T10:30:00Z',
    trainerId: '1',
  },
  {
    id: 'feedback-2',
    clientId: 'client_1',
    sessionId: 'session-2',
    reservationId: 'reserva-2',
    rating: 4,
    comment: 'Buen entrenamiento, pero me gustaría más variedad en los ejercicios',
    category: 'session',
    submittedAt: '2024-10-20T14:00:00Z',
    trainerId: '1',
  },
];

/**
 * Obtiene el feedback de un cliente
 */
export const getClientFeedback = async (clientId: string): Promise<ClientFeedback[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CLIENT_FEEDBACK.filter(fb => fb.clientId === clientId);
};

/**
 * Obtiene el feedback de una sesión/reserva específica
 */
export const getFeedbackByReservation = async (reservationId: string): Promise<ClientFeedback | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CLIENT_FEEDBACK.find(fb => fb.reservationId === reservationId) || null;
};

/**
 * Crea un nuevo feedback de cliente
 */
export const createClientFeedback = async (
  feedback: Omit<ClientFeedback, 'id' | 'submittedAt'>
): Promise<ClientFeedback> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newFeedback: ClientFeedback = {
    id: `feedback-${Date.now()}`,
    ...feedback,
    submittedAt: new Date().toISOString(),
  };
  
  MOCK_CLIENT_FEEDBACK.push(newFeedback);
  return newFeedback;
};

/**
 * Actualiza un feedback de cliente
 */
export const updateClientFeedback = async (
  feedbackId: string,
  updates: Partial<ClientFeedback>
): Promise<ClientFeedback> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENT_FEEDBACK.findIndex(fb => fb.id === feedbackId);
  if (index === -1) throw new Error('Feedback not found');
  
  MOCK_CLIENT_FEEDBACK[index] = { ...MOCK_CLIENT_FEEDBACK[index], ...updates };
  return MOCK_CLIENT_FEEDBACK[index];
};

/**
 * Elimina un feedback de cliente
 */
export const deleteClientFeedback = async (feedbackId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_CLIENT_FEEDBACK.findIndex(fb => fb.id === feedbackId);
  if (index !== -1) {
    MOCK_CLIENT_FEEDBACK.splice(index, 1);
  }
};

