import React, { useCallback, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';

export interface FileUploadDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMb?: number;
  selectedFile?: File | null;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  acceptedFormats = ['.csv', '.xlsx'],
  maxSizeMb = 10,
  selectedFile,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Validar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(extension)) {
      setError(`Formato no válido. Formatos aceptados: ${acceptedFormats.join(', ')}`);
      return false;
    }

    // Validar tamaño
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > maxSizeMb) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMb}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, acceptedFormats, maxSizeMb]
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, acceptedFormats, maxSizeMb]
  );

  const handleRemove = () => {
    onFileSelect(null as any);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      {selectedFile ? (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className={`bg-white shadow-sm cursor-pointer transition-shadow ${
            isDragActive ? 'ring-2 ring-blue-400' : ''
          }`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="p-12"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                isDragActive
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <Upload className={`w-10 h-10 ${
                  isDragActive
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`} />
              </div>
              
              <div className="text-center">
                <p className="text-base font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu archivo aquí'}
                </p>
                <p className="text-sm text-gray-600">
                  o haz clic para seleccionar
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <File className="w-4 h-4" />
                <span>Formatos: {acceptedFormats.join(', ')}</span>
                <span>•</span>
                <span>Máximo: {maxSizeMb}MB</span>
              </div>
            </div>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </Card>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

