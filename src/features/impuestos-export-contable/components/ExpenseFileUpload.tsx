import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File, Trash2, Eye } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ArchivoAdjunto, ExpenseAttachment } from '../types/expenses';
import { updateExpense } from '../api/expenses';

interface ExpenseFileUploadProps {
  archivos: ArchivoAdjunto[];
  onFilesChange: (archivos: ArchivoAdjunto[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  expenseId?: string; // ID del gasto al que asociar los adjuntos (opcional)
  onAttachmentAssociated?: (attachment: ExpenseAttachment) => void; // Callback cuando se asocia un adjunto
}

export const ExpenseFileUpload: React.FC<ExpenseFileUploadProps> = ({
  archivos = [],
  onFilesChange,
  maxFiles = 10,
  maxSizeMB = 10,
  expenseId,
  onAttachmentAssociated
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.heic', '.heif'];
    
    if (!allowedExtensions.some(ext => extension === ext)) {
      return `Formato no válido. Formatos aceptados: PDF, JPG, PNG, HEIC`;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`;
    }

    // Validar cantidad de archivos
    if (archivos.length >= maxFiles) {
      return `Máximo ${maxFiles} archivos permitidos`;
    }

    return null;
  };

  const getFileType = (file: File): string => {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'pdf';
    return 'other';
  };

  /**
   * Función mock para asociar un adjunto a un Expense existente
   * En producción, esto subiría el archivo al servidor y lo asociaría al gasto
   */
  const asociarAdjuntoAExpense = async (
    expenseId: string,
    archivo: ArchivoAdjunto
  ): Promise<ExpenseAttachment> => {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Convertir ArchivoAdjunto a ExpenseAttachment
    const attachment: ExpenseAttachment = {
      id: archivo.id,
      expenseId: expenseId,
      url: archivo.url,
      nombreArchivo: archivo.nombre,
      tipoArchivo: archivo.tipo === 'image' ? 'image/jpeg' : 
                   archivo.tipo === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      fechaSubida: archivo.fechaSubida,
      tamaño: archivo.tamaño
    };
    
    // Si hay un expenseId, actualizar el gasto con el nuevo adjunto
    if (expenseId) {
      try {
        // Obtener el gasto actual (esto es mock, en producción vendría de la API)
        // Por ahora, solo simulamos la asociación
        // En producción: await updateExpense(expenseId, { adjuntos: [...existingAttachments, attachment] });
        
        // Callback para notificar que se asoció el adjunto
        if (onAttachmentAssociated) {
          onAttachmentAssociated(attachment);
        }
      } catch (error) {
        console.error('Error al asociar adjunto al gasto:', error);
        throw error;
      }
    }
    
    return attachment;
  };

  const handleFileUpload = async (file: File): Promise<ArchivoAdjunto> => {
    // Simular upload - En producción, esto debería subir el archivo al servidor
    return new Promise((resolve) => {
      setTimeout(() => {
        // En producción, la URL vendría del servidor
        const url = URL.createObjectURL(file);
        const nuevoArchivo: ArchivoAdjunto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nombre: file.name,
          url: url,
          tipo: getFileType(file),
          tamaño: file.size,
          fechaSubida: new Date()
        };
        
        // Si hay un expenseId, asociar el adjunto al gasto
        if (expenseId) {
          asociarAdjuntoAExpense(expenseId, nuevoArchivo).catch(error => {
            console.error('Error al asociar adjunto:', error);
          });
        }
        
        resolve(nuevoArchivo);
      }, 500);
    });
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      setUploading(true);
      setError(null);

      try {
        const validFiles: File[] = [];
        for (const file of files) {
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          setUploading(false);
          return;
        }

        // Limitar a maxFiles
        const filesToUpload = validFiles.slice(0, maxFiles - archivos.length);
        const uploadedFiles = await Promise.all(
          filesToUpload.map(file => handleFileUpload(file))
        );

        onFilesChange([...archivos, ...uploadedFiles]);
        setError(null);
      } catch (err) {
        setError('Error al subir los archivos');
        console.error('Error uploading files:', err);
      } finally {
        setUploading(false);
      }
    },
    [archivos, maxFiles, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setUploading(true);
      setError(null);

      try {
        const validFiles: File[] = [];
        for (const file of files) {
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          setUploading(false);
          return;
        }

        // Limitar a maxFiles
        const filesToUpload = validFiles.slice(0, maxFiles - archivos.length);
        const uploadedFiles = await Promise.all(
          filesToUpload.map(file => handleFileUpload(file))
        );

        onFilesChange([...archivos, ...uploadedFiles]);
        setError(null);
      } catch (err) {
        setError('Error al subir los archivos');
        console.error('Error uploading files:', err);
      } finally {
        setUploading(false);
        // Reset input
        if (e.target) {
          e.target.value = '';
        }
      }
    },
    [archivos, maxFiles, onFilesChange]
  );

  const handleRemoveFile = (id: string) => {
    onFilesChange(archivos.filter(archivo => archivo.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Archivos Adjuntos (Recibos/Facturas)
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Sube fotos o PDFs de tus recibos y facturas. Máximo {maxFiles} archivos, {maxSizeMB}MB por archivo.
      </p>

      {/* Dropzone */}
      {archivos.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            type="file"
            className="hidden"
            id="expense-file-upload"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
            onChange={handleFileInput}
            disabled={uploading}
          />
          <label htmlFor="expense-file-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {uploading ? 'Subiendo archivos...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, PNG, HEIC (máx. {maxSizeMB}MB)
            </p>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Files List */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Archivos adjuntos ({archivos.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(archivo.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {archivo.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(archivo.tamaño)} • {new Date(archivo.fechaSubida).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(archivo.url, '_blank')}
                    title="Ver archivo"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(archivo.id)}
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


