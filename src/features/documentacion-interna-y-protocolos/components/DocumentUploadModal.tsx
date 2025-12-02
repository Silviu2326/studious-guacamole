// Componente DocumentUploadModal - Modal para subir/editar documentos
import React, { useState, useCallback } from 'react';
import { Document } from '../types';
import { Modal, Input, Select, Textarea, Button } from '../../../components/componentsreutilizables';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  documentToEdit?: Document | null;
  categories: Array<{ categoryId: string; name: string }>;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  documentToEdit,
  categories
}) => {
  const [title, setTitle] = useState(documentToEdit?.title || '');
  const [categoryId, setCategoryId] = useState(documentToEdit?.category.categoryId || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [content, setContent] = useState(documentToEdit?.content || '');
  const [documentType, setDocumentType] = useState<'upload' | 'text'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isRequired, setIsRequired] = useState(documentToEdit?.isRequired || false);
  const [requiredFor, setRequiredFor] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setDocumentType('upload');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentType('upload');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!categoryId) {
      setError('Debes seleccionar una categoría');
      return;
    }

    if (documentType === 'upload' && !selectedFile && !documentToEdit) {
      setError('Debes seleccionar un archivo o proporcionar contenido');
      return;
    }

    setIsUploading(true);

    try {
      // Aquí iría la llamada a la API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
      handleClose();
    } catch (err) {
      setError('Error al guardar el documento');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setCategoryId('');
    setSelectedFile(null);
    setContent('');
    setDocumentType('upload');
    setIsRequired(false);
    setRequiredFor('');
    setError('');
    onClose();
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.categoryId,
    label: cat.name
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={documentToEdit ? 'Editar Documento' : 'Nuevo Documento'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isUploading}
            disabled={isUploading}
          >
            {documentToEdit ? 'Guardar Cambios' : 'Crear Documento'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <Input
          label="Título del Documento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Protocolo de Primeros Auxilios"
          required
        />

        {/* Categoría */}
        <Select
          label="Categoría"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          required
        />

        {/* Tipo de contenido */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Documento
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDocumentType('upload')}
              className={`p-4 ring-2 rounded-xl transition-all ${
                documentType === 'upload'
                  ? 'ring-blue-400 bg-blue-50 border-blue-500'
                  : 'ring-slate-200 border-slate-200 hover:ring-slate-300 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-900">Subir Archivo</p>
            </button>
            <button
              type="button"
              onClick={() => setDocumentType('text')}
              className={`p-4 ring-2 rounded-xl transition-all ${
                documentType === 'text'
                  ? 'ring-blue-400 bg-blue-50 border-blue-500'
                  : 'ring-slate-200 border-slate-200 hover:ring-slate-300 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-900">Texto Enriquecido</p>
            </button>
          </div>
        </div>

        {/* Upload */}
        {documentType === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Archivo
            </label>
            {!selectedFile && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="ring-2 ring-dashed ring-slate-300 rounded-xl p-8 text-center cursor-pointer hover:ring-blue-400 transition-colors bg-slate-50"
              >
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    Arrastra un archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, DOC, DOCX, PNG, JPG
                  </p>
                </label>
              </div>
            )}
            {selectedFile && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text content */}
        {documentType === 'text' && (
          <Textarea
            label="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe aquí el contenido del documento..."
            rows={8}
          />
        )}

        {/* Requisitos */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 rounded ring-1 ring-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm font-medium text-slate-700">
              Marcarlo como lectura obligatoria
            </span>
          </label>

          {isRequired && (
            <Input
              value={requiredFor}
              onChange={(e) => setRequiredFor(e.target.value)}
              placeholder="Ej: Entrenadores, Recepción (separado por comas)"
              helperText="Especifica los roles que deben leer este documento"
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 ring-1 ring-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </form>
    </Modal>
  );
};
