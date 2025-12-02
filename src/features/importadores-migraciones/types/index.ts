export type UserType = 'trainer' | 'gym';
export type ImportStep = 'upload' | 'mapping' | 'progress' | 'results';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'completed_with_errors';
export type ImportEntity = 'members' | 'classes' | 'subscriptions' | 'check_ins';

export interface FieldMapping {
  sourceColumn: string;
  targetField: string;
}

export interface ImportJob {
  jobId: string;
  status: ImportStatus;
  submittedAt: string;
  completedAt?: string;
  originalFilename: string;
  entity: ImportEntity;
  summary?: {
    total: number;
    success: number;
    failed: number;
  };
  reportUrl?: string;
  progress?: {
    totalRows: number;
    processedRows: number;
    successfulRows: number;
    failedRows: number;
  };
}

export interface TargetField {
  key: string;
  label: string;
  required: boolean;
  type?: 'string' | 'number' | 'date' | 'email' | 'phone';
}

export interface ImportResults {
  jobId: string;
  status: ImportStatus;
  summary: {
    total: number;
    success: number;
    failed: number;
  };
  errors?: Array<{
    row: number;
    column: string;
    value: string;
    error: string;
  }>;
  reportUrl?: string;
}

