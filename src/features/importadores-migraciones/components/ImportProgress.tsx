import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ImportJob } from '../types';

export interface ImportProgressProps {
  job: ImportJob;
}

export const ImportProgress: React.FC<ImportProgressProps> = ({ job }) => {
  const progress = job.progress || {
    totalRows: 0,
    processedRows: 0,
    successfulRows: 0,
    failedRows: 0,
  };

  const percentage = progress.totalRows > 0
    ? Math.round((progress.processedRows / progress.totalRows) * 100)
    : 0;

  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
      case 'completed_with_errors':
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'processing':
        return <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'completed':
        return 'Completado';
      case 'completed_with_errors':
        return 'Completado con errores';
      case 'failed':
        return 'Fallido';
      case 'processing':
        return 'Procesando...';
      default:
        return 'Pendiente';
    }
  };

  const isComplete = job.status === 'completed' || job.status === 'completed_with_errors' || job.status === 'failed';

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {getStatusText()}
            </h3>
            <p className="text-sm text-gray-600">
              {job.originalFilename}
            </p>
          </div>
        </div>

        {job.status === 'processing' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">
                  Progreso
                </span>
                <span className="text-sm text-gray-600">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {progress.processedRows}
                </p>
                <p className="text-xs text-gray-600">
                  de {progress.totalRows} procesados
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {progress.successfulRows}
                </p>
                <p className="text-xs text-gray-600">
                  exitosos
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {progress.failedRows}
                </p>
                <p className="text-xs text-gray-600">
                  errores
                </p>
              </div>
            </div>
          </>
        )}

        {isComplete && job.summary && (
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {job.summary.total}
              </p>
              <p className="text-xs text-gray-600">
                Total
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {job.summary.success}
              </p>
              <p className="text-xs text-gray-600">
                Importados
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {job.summary.failed}
              </p>
              <p className="text-xs text-gray-600">
                Errores
              </p>
            </div>
          </div>
        )}

        {job.status === 'processing' && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Por favor, no cierres esta página. El proceso continuará en segundo plano.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

