import { ObjectiveDocument, DocumentType } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockDocuments: ObjectiveDocument[] = [];

/**
 * User Story 1: Obtener documentos adjuntos a un objetivo
 */
export const getObjectiveDocuments = async (objectiveId: string): Promise<ObjectiveDocument[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedDocuments = localStorage.getItem(`objective-documents-${objectiveId}`);
  if (savedDocuments) {
    return JSON.parse(savedDocuments);
  }
  
  return [];
};

/**
 * User Story 1: Adjuntar documento a un objetivo
 */
export const attachDocumentToObjective = async (
  objectiveId: string,
  file: File,
  documentData: {
    name: string;
    description?: string;
    type?: DocumentType;
    tags?: string[];
    uploadedBy?: string;
    uploadedByName?: string;
  }
): Promise<ObjectiveDocument> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, aquí se subiría el archivo a un servicio de almacenamiento
  // Por ahora, simulamos la URL del archivo
  const fileUrl = URL.createObjectURL(file);
  
  // Determinar el tipo de documento basado en el tipo MIME
  let documentType: DocumentType = 'other';
  if (file.type.includes('presentation') || file.name.match(/\.(ppt|pptx)$/i)) {
    documentType = 'presentation';
  } else if (file.type.includes('pdf') || file.name.match(/\.pdf$/i)) {
    documentType = 'brief';
  } else if (file.type.includes('spreadsheet') || file.name.match(/\.(xls|xlsx)$/i)) {
    documentType = 'spreadsheet';
  } else if (file.type.includes('image')) {
    documentType = 'image';
  } else if (file.type.includes('document') || file.name.match(/\.(doc|docx)$/i)) {
    documentType = 'document';
  }
  
  const document: ObjectiveDocument = {
    id: `doc_${Date.now()}`,
    objectiveId,
    name: documentData.name || file.name,
    description: documentData.description,
    type: documentData.type || documentType,
    fileUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
    uploadedBy: documentData.uploadedBy || 'user',
    uploadedByName: documentData.uploadedByName || 'Usuario',
    tags: documentData.tags || [],
  };
  
  // Guardar en localStorage
  const existingDocuments = await getObjectiveDocuments(objectiveId);
  existingDocuments.push(document);
  localStorage.setItem(`objective-documents-${objectiveId}`, JSON.stringify(existingDocuments));
  
  // Actualizar el objetivo para incluir el documento
  const { getObjective, updateObjective } = await import('./objectives');
  const objective = await getObjective(objectiveId);
  if (objective) {
    const documents = objective.documents || [];
    documents.push(document);
    await updateObjective(objectiveId, { documents });
    
    // User Story 2: Registrar en historial de auditoría
    try {
      const { recordAuditEntry } = await import('./auditHistory');
      await recordAuditEntry({
        entityType: 'objective',
        entityId: objectiveId,
        entityName: objective.title,
        action: 'attach_document',
        performedBy: document.uploadedBy,
        performedByName: document.uploadedByName,
        metadata: {
          documentId: document.id,
          documentName: document.name,
        },
      });
    } catch (error) {
      console.error('Error recording audit history:', error);
    }
  }
  
  return document;
};

/**
 * User Story 1: Eliminar documento de un objetivo
 */
export const removeDocumentFromObjective = async (
  objectiveId: string,
  documentId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const documents = await getObjectiveDocuments(objectiveId);
  const filtered = documents.filter(doc => doc.id !== documentId);
  localStorage.setItem(`objective-documents-${objectiveId}`, JSON.stringify(filtered));
  
  // Actualizar el objetivo
  const { getObjective, updateObjective } = await import('./objectives');
  const objective = await getObjective(objectiveId);
  if (objective) {
    const deletedDoc = documents.find(doc => doc.id === documentId);
    await updateObjective(objectiveId, { documents: filtered });
    
    // User Story 2: Registrar en historial de auditoría
    if (deletedDoc) {
      try {
        const { recordAuditEntry } = await import('./auditHistory');
        await recordAuditEntry({
          entityType: 'objective',
          entityId: objectiveId,
          entityName: objective.title,
          action: 'remove_document',
          performedBy: 'user', // En producción, usar el ID del usuario actual
          performedByName: 'Usuario', // En producción, usar el nombre del usuario actual
          metadata: {
            documentId: deletedDoc.id,
            documentName: deletedDoc.name,
          },
        });
      } catch (error) {
        console.error('Error recording audit history:', error);
      }
    }
  }
};

/**
 * User Story 1: Actualizar información de un documento
 */
export const updateDocument = async (
  objectiveId: string,
  documentId: string,
  updates: {
    name?: string;
    description?: string;
    tags?: string[];
  }
): Promise<ObjectiveDocument> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const documents = await getObjectiveDocuments(objectiveId);
  const index = documents.findIndex(doc => doc.id === documentId);
  
  if (index === -1) {
    throw new Error('Document not found');
  }
  
  documents[index] = {
    ...documents[index],
    ...updates,
  };
  
  localStorage.setItem(`objective-documents-${objectiveId}`, JSON.stringify(documents));
  
  // Actualizar el objetivo
  const { getObjective, updateObjective } = await import('./objectives');
  const objective = await getObjective(objectiveId);
  if (objective) {
    await updateObjective(objectiveId, { documents });
  }
  
  return documents[index];
};

/**
 * User Story 1: Descargar documento
 */
export const downloadDocument = (document: ObjectiveDocument): void => {
  // En producción, esto descargaría el archivo real
  // Por ahora, abrimos la URL del objeto
  if (typeof window !== 'undefined') {
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  } else {
    // Fallback: abrir en nueva pestaña
    window.open(document.fileUrl, '_blank');
  }
};

