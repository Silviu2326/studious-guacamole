import { Survey, SurveyResponse } from '../types';

// Simulación de datos - En producción esto sería llamadas HTTP reales
const surveysMock: Survey[] = [
  {
    id: '1',
    title: 'Encuesta NPS General',
    type: 'nps',
    description: 'Evaluación general de satisfacción del servicio',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    automation: {
      id: 'auto1',
      surveyId: '1',
      trigger: 'service_use',
      delay: 24,
      enabled: true,
    },
  },
  {
    id: '2',
    title: 'Evaluación de Clases',
    type: 'csat',
    area: 'clases',
    description: 'Evaluación de satisfacción con las clases',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    automation: {
      id: 'auto2',
      surveyId: '2',
      trigger: 'class_attendance',
      delay: 2,
      enabled: true,
    },
  },
  {
    id: '3',
    title: 'Evaluación de Instalaciones',
    type: 'csat',
    area: 'instalaciones',
    description: 'Evaluación de las instalaciones del gimnasio',
    status: 'active',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
  },
];

export const getSurveys = async (): Promise<Survey[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...surveysMock];
};

export const getSurvey = async (id: string): Promise<Survey | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return surveysMock.find((s) => s.id === id) || null;
};

export const createSurvey = async (
  survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Survey> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newSurvey: Survey = {
    ...survey,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  surveysMock.push(newSurvey);
  return newSurvey;
};

export const updateSurvey = async (
  id: string,
  updates: Partial<Survey>
): Promise<Survey> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const index = surveysMock.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Survey not found');
  
  surveysMock[index] = {
    ...surveysMock[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return surveysMock[index];
};

export const deleteSurvey = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = surveysMock.findIndex((s) => s.id === id);
  if (index !== -1) {
    surveysMock.splice(index, 1);
  }
};

export const sendSurvey = async (
  surveyId: string,
  clientIds: string[]
): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Encuesta enviada a ${clientIds.length} cliente(s) exitosamente`,
  };
};

