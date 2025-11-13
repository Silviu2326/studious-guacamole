import React, { useState, useEffect } from 'react';
import { ObjectiveDocument, DocumentType } from '../types';
import { 
  getObjectiveDocuments, 
  attachDocumentToObjective, 
  removeDocumentFromObjective, 
  updateDocument,
  downloadDocument 
} from '../api/documents';
import { Card, Button, Modal, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Upload, 
  X, 
  Download, 
  Edit2, 
  Trash2, 
  File, 
  Image as ImageIcon, 
  Presentation, 
  FileSpreadsheet,
  Tag,
  Loader2
} from 'lucide-react';

interface ObjectiveDocumentsManagerProps {
  objectiveId: string;
  objectiveTitle: string;
  onDocumentsChange?: () => void;
}

const documentTypeIcons: Record<DocumentType, React.ReactNode> = {
  presentation: <Presentation className="w-5 h-5" />,
  brief: <FileText className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
  spreadsheet: <FileSpreadsheet className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  other: <File className="w-5 h-5" />,
};

const documentTypeLabels: Record<DocumentType, string> = {
  presentation: 'Presentación',
  brief: 'Brief',
  document: 'Documento',
  spreadsheet: 'Hoja de Cálculo',
  image: 'Imagen',
  other: 'Otro',
};

export const ObjectiveDocumentsManager: React.FC<ObjectiveDocumentsManagerProps> = ({
  objectiveId,
  objectiveTitle,
  onDocumentsChange,
}) => {
  const [documents, setDocuments] = useState<ObjectiveDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ObjectiveDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('document');
  const [documentTags, setDocumentTags] = useState('');
  
  // Edit form states
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [objectiveId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getObjectiveDocuments(objectiveId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo');
      return;
    }

    if (!documentName.trim()) {
      alert('Por favor, ingresa un nombre para el documento');
      return;
    }

    setUploading(true);
    try {
      const tags = documentTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      await attachDocumentToObjective(objectiveId, selectedFile, {
        name: documentName,
        description: documentDescription || undefined,
        type: documentType,
        tags: tags.length > 0 ? tags : undefined,
        uploadedBy: 'user', // En producción, usar el usuario actual
        uploadedByName: 'Usuario',
      });

      // Limpiar formulario
      setSelectedFile(null);
      setDocumentName('');
      setDocumentDescription('');
      setDocumentType('document');
      setDocumentTags('');
      setIsUploadModalOpen(false);
      
      // Recargar documentos
      await loadDocuments();
      onDocumentsChange?.();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error al adjuntar el documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este documento?')) {
      return;
    }

    try {
      await removeDocumentFromObjective(objectiveId, documentId);
      await loadDocuments();
      onDocumentsChange?.();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error al eliminar el documento');
    }
  };

  const handleEdit = (document: ObjectiveDocument) => {
    setEditingDocument(document);
    setEditName(document.name);
    setEditDescription(document.description || '');
    setEditTags(document.tags?.join(', ') || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingDocument || !editName.trim()) {
      alert('Por favor, ingresa un nombre para el documento');
      return;
    }

    try {
      const tags = editTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      await updateDocument(objectiveId, editingDocument.id, {
        name: editName,
        description: editDescription || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      setIsEditModalOpen(false);
      setEditingDocument(null);
      await loadDocuments();
      onDocumentsChange?.();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error al actualizar el documento');
    }
  };

  const handleDownload = (document: ObjectiveDocument) => {
    try {
      downloadDocument(document);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar el documento');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documentación Adjunta</h3>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Adjuntar Documento
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay documentos adjuntos</p>
          <p className="text-sm">Adjunta presentaciones, briefs u otros documentos relevantes</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-blue-600">
                    {documentTypeIcons[doc.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {documentTypeLabels[doc.type]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(doc)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {doc.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {doc.description}
                </p>
              )}

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {doc.tags.map((tag, idx) => (
                    <Badge key={idx} variant="blue" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(doc)}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de subida */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Adjuntar Documento"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Archivo *
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="w-full border rounded-lg p-2"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Documento *
            </label>
            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ej: Presentación Q1 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Documento
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full border rounded-lg p-2"
            >
              <option value="presentation">Presentación</option>
              <option value="brief">Brief</option>
              <option value="document">Documento</option>
              <option value="spreadsheet">Hoja de Cálculo</option>
              <option value="image">Imagen</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <Textarea
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Descripción opcional del documento"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Etiquetas (separadas por comas)
            </label>
            <Input
              value={documentTags}
              onChange={(e) => setDocumentTags(e.target.value)}
              placeholder="Ej: Q1, Estrategia, Marketing"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !documentName.trim()}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Adjuntar'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Documento"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Documento *
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Etiquetas (separadas por comas)
            </label>
            <Input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editName.trim()}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

