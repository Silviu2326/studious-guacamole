import { SurveyResponse, NPSSurveyResponse, CSATSurveyResponse } from '../types';

// Simulación de respuestas
const responsesMock: SurveyResponse[] = [
  {
    id: 'r1',
    surveyId: '1',
    clientId: 'c1',
    clientName: 'Juan Pérez',
    score: 9,
    classification: 'promotor',
    comments: 'Excelente servicio, muy satisfecho',
    respondedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'r2',
    surveyId: '1',
    clientId: 'c2',
    clientName: 'María González',
    score: 7,
    classification: 'neutral',
    respondedAt: '2024-01-19T15:30:00Z',
  },
  {
    id: 'r3',
    surveyId: '1',
    clientId: 'c3',
    clientName: 'Carlos López',
    score: 4,
    classification: 'detractor',
    comments: 'Necesita mejorar en algunos aspectos',
    respondedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 'r4',
    surveyId: '2',
    clientId: 'c4',
    clientName: 'Ana Martínez',
    score: 5,
    area: 'clases',
    comments: 'Las clases son buenas pero podrían ser más dinámicas',
    respondedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: 'r5',
    surveyId: '2',
    clientId: 'c1',
    clientName: 'Juan Pérez',
    score: 4,
    area: 'clases',
    respondedAt: '2024-01-19T11:00:00Z',
  },
];

export const getResponses = async (surveyId?: string): Promise<SurveyResponse[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (surveyId) {
    return responsesMock.filter((r) => r.surveyId === surveyId);
  }
  return [...responsesMock];
};

export const getNPSResponses = async (): Promise<NPSSurveyResponse[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return responsesMock.filter(
    (r): r is NPSSurveyResponse => r.score >= 0 && r.score <= 10 && r.classification !== undefined
  ) as NPSSurveyResponse[];
};

export const getCSATResponses = async (): Promise<CSATSurveyResponse[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return responsesMock.filter(
    (r): r is CSATSurveyResponse => r.score >= 1 && r.score <= 5
  ) as CSATSurveyResponse[];
};

