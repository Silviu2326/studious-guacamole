// Tipos para el módulo de Impuestos & Export Contable

export interface FiscalProfile {
  legalName: string;
  taxId: string;
  address: string;
  taxRegime: string;
  country: string;
}

export interface TaxSummary {
  totalGross: number;
  totalNet: number;
  totalVat: number;
  transactionCount: number;
  currency: string;
}

export interface AccountingExport {
  id: string;
  createdAt: string;
  generatedBy: string;
  dateRange: string;
  format: 'csv' | 'pdf' | 'a3' | 'sage50';
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
}

export interface ExportRequest {
  dateFrom: string;
  dateTo: string;
  format: 'csv' | 'pdf' | 'a3' | 'sage50';
  reportType: 'simple' | 'detailedVat';
}

export interface ExportJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  statusUrl: string;
}

export type UserType = 'trainer' | 'gym';

