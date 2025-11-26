// API para Documentación Interna y Protocolos

import {
  Document,
  Category,
  DocumentVersion,
  DocumentAcknowledgement,
  DocumentFilters,
  DocumentStats
} from '../types';

const API_BASE = '/api/operations/documents';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Categories
const mockCategories: Category[] = [
  {
    categoryId: 'cat_security',
    name: 'Seguridad',
    description: 'Protocolos de seguridad y emergencia',
    documentCount: 5
  },
  {
    categoryId: 'cat_hr',
    name: 'Recursos Humanos',
    description: 'Manuales de personal y procedimientos de RRHH',
    documentCount: 3
  },
  {
    categoryId: 'cat_operations',
    name: 'Operaciones Diarias',
    description: 'Procedimientos operativos estándar (SOPs)',
    documentCount: 8
  },
  {
    categoryId: 'cat_equipment',
    name: 'Equipamiento',
    description: 'Manuales de equipos y mantenimiento',
    documentCount: 4
  },
  {
    categoryId: 'cat_policies',
    name: 'Políticas',
    description: 'Políticas y normativas del gimnasio',
    documentCount: 6
  }
];

// Mock Documents
const mockDocuments: Document[] = [
  {
    docId: 'doc_123',
    title: 'Protocolo de Primeros Auxilios y RCP',
    category: mockCategories[0],
    version: 3,
    lastUpdatedAt: '2024-10-15T10:00:00Z',
    createdBy: {
      userId: 'user_admin',
      name: 'Admin Sistema'
    },
    hasAcknowledged: false,
    documentType: 'pdf',
    fileUrl: '/documents/rcp-protocol.pdf',
    status: 'published',
    isRequired: true,
    requiredFor: ['entrenador', 'recepcion']
  },
  {
    docId: 'doc_124',
    title: 'Normativa de Uso de Equipamiento',
    category: mockCategories[3],
    version: 2,
    lastUpdatedAt: '2024-10-20T11:00:00Z',
    createdBy: {
      userId: 'user_admin',
      name: 'Admin Sistema'
    },
    hasAcknowledged: true,
    documentType: 'html',
    content: '<p>Guía completa sobre el uso correcto del equipamiento...</p>',
    status: 'published',
    isRequired: false
  },
  {
    docId: 'doc_125',
    title: 'Manual de Limpieza y Desinfección',
    category: mockCategories[2],
    version: 1,
    lastUpdatedAt: '2024-11-01T09:00:00Z',
    createdBy: {
      userId: 'user_manager',
      name: 'Elena García'
    },
    hasAcknowledged: false,
    documentType: 'pdf',
    fileUrl: '/documents/cleaning-manual.pdf',
    status: 'published',
    isRequired: true,
    requiredFor: ['limpieza', 'recepcion']
  },
  {
    docId: 'doc_126',
    title: 'Procedimientos de Apertura',
    category: mockCategories[2],
    version: 5,
    lastUpdatedAt: '2024-09-10T08:00:00Z',
    createdBy: {
      userId: 'user_admin',
      name: 'Admin Sistema'
    },
    hasAcknowledged: true,
    documentType: 'pdf',
    fileUrl: '/documents/opening-procedures.pdf',
    status: 'published',
    isRequired: true,
    requiredFor: ['recepcion']
  },
  {
    docId: 'doc_127',
    title: 'Política de Acceso de Invitados',
    category: mockCategories[4],
    version: 1,
    lastUpdatedAt: '2024-11-25T14:00:00Z',
    createdBy: {
      userId: 'user_manager',
      name: 'Elena García'
    },
    hasAcknowledged: false,
    documentType: 'txt',
    content: 'Normativa para el acceso de invitados...',
    status: 'draft',
    isRequired: false
  }
];

export const documentsApi = {
  // Get documents
  obtenerDocumentos: async (filters?: DocumentFilters): Promise<Document[]> => {
    await delay(500);
    let documents = [...mockDocuments];

    if (filters?.category) {
      documents = documents.filter(doc => doc.category.categoryId === filters.category);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      documents = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.category.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }

    return documents;
  },

  obtenerDocumentoPorId: async (docId: string): Promise<Document | null> => {
    await delay(500);
    return mockDocuments.find(doc => doc.docId === docId) || null;
  },

  // Create document
  crearDocumento: async (documentData: {
    title: string;
    categoryId: string;
    documentType: DocumentType;
    fileUrl?: string;
    content?: string;
    isRequired?: boolean;
    requiredFor?: string[];
  }): Promise<Document> => {
    await delay(500);
    const category = mockCategories.find(cat => cat.categoryId === documentData.categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    const newDocument: Document = {
      docId: `doc_${Date.now()}`,
      title: documentData.title,
      category: category,
      version: 1,
      lastUpdatedAt: new Date().toISOString(),
      createdBy: {
        userId: 'user_current',
        name: 'Usuario Actual'
      },
      hasAcknowledged: false,
      documentType: documentData.documentType,
      fileUrl: documentData.fileUrl,
      content: documentData.content,
      status: 'published',
      isRequired: documentData.isRequired || false,
      requiredFor: documentData.requiredFor || []
    };

    mockDocuments.push(newDocument);
    return newDocument;
  },

  // Update document
  actualizarDocumento: async (docId: string, documentData: {
    title?: string;
    categoryId?: string;
    fileUrl?: string;
    content?: string;
    versionNotes?: string;
    isRequired?: boolean;
    requiredFor?: string[];
  }): Promise<Document> => {
    await delay(500);
    const index = mockDocuments.findIndex(doc => doc.docId === docId);
    if (index === -1) {
      throw new Error('Documento no encontrado');
    }

    const currentDoc = mockDocuments[index];
    
    // Update category if changed
    if (documentData.categoryId) {
      const category = mockCategories.find(cat => cat.categoryId === documentData.categoryId);
      if (category) {
        currentDoc.category = category;
      }
    }

    mockDocuments[index] = {
      ...currentDoc,
      ...documentData,
      version: currentDoc.version + 1,
      lastUpdatedAt: new Date().toISOString(),
      hasAcknowledged: false // Reset acknowledgment on update
    };

    return mockDocuments[index];
  },

  // Delete document
  eliminarDocumento: async (docId: string): Promise<void> => {
    await delay(500);
    const index = mockDocuments.findIndex(doc => doc.docId === docId);
    if (index !== -1) {
      mockDocuments[index].status = 'archived';
    }
  },

  // Acknowledge document
  acknowledgeDocument: async (docId: string, versionId: string): Promise<DocumentAcknowledgement> => {
    await delay(500);
    const docIndex = mockDocuments.findIndex(doc => doc.docId === docId);
    if (docIndex !== -1) {
      mockDocuments[docIndex].hasAcknowledged = true;
    }

    const acknowledgement: DocumentAcknowledgement = {
      ackId: `ack_${Date.now()}`,
      docId: docId,
      versionId: versionId,
      userId: 'user_current',
      userName: 'Usuario Actual',
      acknowledgedAt: new Date().toISOString()
    };

    return acknowledgement;
  },

  // Categories
  obtenerCategorias: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },

  crearCategoria: async (categoryData: { name: string; description?: string }): Promise<Category> => {
    await delay(500);
    const newCategory: Category = {
      categoryId: `cat_${Date.now()}`,
      name: categoryData.name,
      description: categoryData.description,
      documentCount: 0
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  eliminarCategoria: async (categoryId: string): Promise<void> => {
    await delay(500);
    const index = mockCategories.findIndex(cat => cat.categoryId === categoryId);
    if (index !== -1) {
      mockCategories.splice(index, 1);
    }
  }
};
