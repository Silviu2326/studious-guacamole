// Tipos para el módulo de Evaluación de Proveedores

export interface SupplierEvaluation {
  id: string;
  supplierId: string;
  supplierName: string;
  evaluationDate: string | Date;
  overallScore: number; // 1-5
  criteriaRatings: {
    quality: number; // 1-5
    timeliness: number; // 1-5
    support: number; // 1-5
    costBenefit?: number; // 1-5
    communication?: number; // 1-5
  };
  notes?: string;
  evaluatorName: string;
  evaluatorId: string;
  concept?: string; // Descripción del producto/servicio evaluado
  attachments?: Attachment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  averageScore?: number;
  totalEvaluations?: number;
  category?: string;
  active?: boolean;
}

export interface EvaluationFilters {
  supplierId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  minScore?: number;
  maxScore?: number;
  category?: string;
  searchTerm?: string;
}

export interface EvaluationFormData {
  supplierId: string;
  supplierName?: string;
  evaluationDate: Date | string;
  concept?: string;
  criteriaRatings: {
    quality: number;
    timeliness: number;
    support: number;
    costBenefit?: number;
    communication?: number;
  };
  notes?: string;
  attachments?: File[];
}

export interface EvaluationStats {
  averageScore: number;
  totalEvaluations: number;
  evaluationsLast30Days: number;
  top3Suppliers: {
    supplierId: string;
    supplierName: string;
    averageScore: number;
  }[];
  bottom3Suppliers: {
    supplierId: string;
    supplierName: string;
    averageScore: number;
  }[];
  premiumSuppliersPercentage: number; // % con calificación > 4.5
  averageTimeWithoutEvaluation: number; // días
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedEvaluationsResponse {
  data: SupplierEvaluation[];
  pagination: PaginationMeta;
}

