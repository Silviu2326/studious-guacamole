// Modal para importar empleados desde CSV

import React, { useState, useRef } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BulkImportResult } from '../types';

interface ImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<BulkImportResult>;
  companyName?: string;
}

export const ImportEmployeesModal: React.FC<ImportEmployeesModalProps> = ({
  isOpen,
  onClose,
  onImport,
  companyName,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('El archivo debe ser un CSV');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('El archivo debe ser un CSV');
        return;
      }
      setFile(droppedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const importResult = await onImport(file);
      setResult(importResult);
      if (importResult.status === 'success' || importResult.status === 'partial') {
        // Limpiar después de 3 segundos y cerrar
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al importar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar Empleados"
      size="lg"
      footer={
        !result ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!file || isLoading}
              loading={isLoading}
            >
              Importar
            </Button>
          </div>
        ) : (
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        )
      }
    >
      {!result ? (
        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-base text-gray-600 mb-2">
              Importa empleados masivamente desde un archivo CSV. El archivo debe contener las siguientes columnas:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-700">
                firstName, lastName, email, employeeExternalId
              </code>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center
              ${file ? 'border-green-500 bg-green-50' : 'border-gray-300'}
              ${error ? 'border-red-500 bg-red-50' : ''}
              transition-colors cursor-pointer
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 mx-auto text-green-600" />
                <p className="font-semibold text-green-700">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-gray-600">
                  Arrastra y suelta el archivo CSV aquí
                </p>
                <p className="text-sm text-gray-500">
                  o haz clic para seleccionar
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {result.status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
              <p className="font-semibold">Importación completada exitosamente</p>
            </div>
          )}

          {result.status === 'partial' && (
            <div className="flex items-center gap-2 text-yellow-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <p className="font-semibold">Importación completada con errores parciales</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Nuevos empleados:</span>
              <span className="font-semibold text-green-600">{result.newEmployees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Empleados actualizados:</span>
              <span className="font-semibold text-blue-600">{result.updatedEmployees}</span>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2 text-red-600">
                Errores encontrados ({result.errors.length}):
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {result.errors.map((error, index) => (
                  <div
                    key={index}
                    className="bg-red-50 p-2 rounded text-sm"
                  >
                    <p>
                      <span className="font-semibold">Línea {error.line}:</span>{' '}
                      {error.email && <span>{error.email} - </span>}
                      {error.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

