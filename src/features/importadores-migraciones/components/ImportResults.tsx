import React from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { CheckCircle2, XCircle, Download, AlertCircle } from 'lucide-react';
import { ImportResults as ImportResultsType } from '../types';

export interface ImportResultsProps {
  results: ImportResultsType;
  onDownloadReport?: () => void;
  onStartNew?: () => void;
}

export const ImportResults: React.FC<ImportResultsProps> = ({
  results,
  onDownloadReport,
  onStartNew,
}) => {
  const isSuccess = results.status === 'completed' && results.summary.failed === 0;
  const hasErrors = results.summary.failed > 0;

  const columns = [
    {
      key: 'row',
      label: 'Fila',
      width: '80px',
      align: 'center' as const,
    },
    {
      key: 'column',
      label: 'Columna',
    },
    {
      key: 'value',
      label: 'Valor',
    },
    {
      key: 'error',
      label: 'Error',
      render: (value: string) => (
        <span className="text-red-600">{value}</span>
      ),
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          {isSuccess ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          ) : hasErrors ? (
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isSuccess ? 'Importación Completada' : hasErrors ? 'Importación con Errores' : 'Importación Fallida'}
            </h3>
            <p className="text-gray-600">
              {isSuccess
                ? 'Todos los registros se importaron correctamente.'
                : hasErrors
                ? `${results.summary.success} registros importados, ${results.summary.failed} con errores.`
                : 'La importación falló. Revisa los errores y vuelve a intentarlo.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              Total de Registros
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {results.summary.total}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              Importados Correctamente
            </p>
            <p className="text-2xl font-bold text-green-600">
              {results.summary.success}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              Con Errores
            </p>
            <p className="text-2xl font-bold text-red-600">
              {results.summary.failed}
            </p>
          </div>
        </div>

        {hasErrors && results.errors && results.errors.length > 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Detalle de Errores
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Revisa los errores encontrados y corrige los datos en tu archivo antes de reintentar la importación.
              </p>
            </div>
            <Table
              data={results.errors}
              columns={columns}
              emptyMessage="No hay errores para mostrar"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            {hasErrors && onDownloadReport && (
              <Button variant="secondary" onClick={onDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Descargar Informe de Errores
              </Button>
            )}
          </div>
          <div>
            {onStartNew && (
              <Button variant="primary" onClick={onStartNew}>
                Iniciar Nueva Importación
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

