// Tipos para Normativa y Plantillas Globales

export type TemplateType = 
  | 'CONTRACT' 
  | 'POLICY' 
  | 'WORKOUT_PLAN' 
  | 'NUTRITION_GUIDE' 
  | 'EMAIL' 
  | 'PROTOCOL'
  | 'REGULATION';

export type TemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface GlobalTemplate {
  templateId: string;
  name: string;
  type: TemplateType;
  version: number;
  status: TemplateStatus;
  content: string | object;
  description?: string;
  createdBy: {
    userId: string;
    name: string;
  };
  createdAt: string;
  lastModified: string;
  publishedAt?: string;
  isMandatory: boolean;
  targetSites?: string[];
  categories?: string[];
}

export interface TemplateVersion {
  versionId: string;
  templateId: string;
  version: number;
  content: string | object;
  createdAt: string;
  createdBy: {
    userId: string;
    name: string;
  };
  notes?: string;
  status: TemplateStatus;
}

export interface TemplateDeployment {
  deploymentId: string;
  templateId: string;
  version: number;
  targetSites: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  completedAt?: string;
  acknowledgedSites: string[];
  failedSites: string[];
}

export interface TemplateCompliance {
  siteId: string;
  siteName: string;
  templateId: string;
  currentVersion: number;
  lastAcknowledged: string;
  isCompliant: boolean;
  daysOutdated: number;
}

export interface TemplateFilters {
  type?: TemplateType;
  status?: TemplateStatus;
  search?: string;
  isMandatory?: boolean;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TemplateStats {
  totalTemplates: number;
  publishedTemplates: number;
  draftTemplates: number;
  mandatoryTemplates: number;
  complianceRate: number;
  averageAdoptionTime: number;
  outdatedSites: number;
}

export interface TemplateDeploymentConfig {
  version: number;
  targetSites: string[] | 'ALL';
  notifySites: boolean;
  replaceActive: boolean;
}

