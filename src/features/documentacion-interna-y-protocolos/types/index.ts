// Tipos para Documentación Interna y Protocolos

export type DocumentStatus = 'draft' | 'published' | 'archived';

export type DocumentType = 'pdf' | 'docx' | 'html' | 'txt' | 'image';

export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  documentCount?: number;
}

export interface Document {
  docId: string;
  title: string;
  category: Category;
  version: number;
  lastUpdatedAt: string;
  createdBy?: {
    userId: string;
    name: string;
  };
  hasAcknowledged?: boolean;
  documentType?: DocumentType;
  fileUrl?: string;
  content?: string;
  status: DocumentStatus;
  isRequired?: boolean;
  requiredFor?: string[];
}

export interface DocumentVersion {
  versionId: string;
  docId: string;
  version: number;
  content?: string;
  fileUrl?: string;
  createdBy: {
    userId: string;
    name: string;
  };
  createdAt: string;
  notes?: string;
}

export interface DocumentAcknowledgement {
  ackId: string;
  docId: string;
  versionId: string;
  userId: string;
  userName?: string;
  acknowledgedAt: string;
}

export interface DocumentFilters {
  category?: string;
  search?: string;
  status?: DocumentStatus;
}

export interface DocumentStats {
  totalDocuments: number;
  publishedDocuments: number;
  pendingAcknowledges: number;
  outdatedDocuments: number;
  complianceRate: number;
  averageAcknowledgeTime: number;
}
