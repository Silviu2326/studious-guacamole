export type SurveyType = 'nps' | 'csat' | 'area';

export type SurveyArea = 
  | 'servicio_general'
  | 'clases'
  | 'instalaciones'
  | 'atencion_recepcion'
  | 'equipamiento';

export type NPSClassification = 'promotor' | 'neutral' | 'detractor';

export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  area?: SurveyArea;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
  automation?: AutomationRule;
}

export interface AutomationRule {
  id: string;
  surveyId: string;
  trigger: 'class_attendance' | 'service_use' | 'manual' | 'periodic';
  delay?: number; // en horas
  enabled: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  clientId: string;
  clientName: string;
  score: number;
  classification?: NPSClassification;
  comments?: string;
  area?: SurveyArea;
  respondedAt: string;
}

export interface NPSSurveyResponse extends SurveyResponse {
  score: number; // 0-10
  classification: NPSClassification;
}

export interface CSATSurveyResponse extends SurveyResponse {
  score: number; // 1-5
}

export interface SatisfactionMetrics {
  nps: {
    score: number;
    promotors: number;
    neutrals: number;
    detractors: number;
    total: number;
  };
  csat: {
    average: number;
    total: number;
    distribution: Record<number, number>; // score -> count
  };
  byArea: Record<SurveyArea, {
    nps?: number;
    csat?: number;
    total: number;
  }>;
  trends: {
    period: string;
    nps?: number;
    csat?: number;
  }[];
}

export interface ComparisonReport {
  period: string;
  team?: string;
  department?: string;
  metrics: SatisfactionMetrics;
}

