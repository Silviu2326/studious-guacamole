import React from 'react';
import { Card, Table, Button, Badge } from '../../../components/componentsreutilizables';
import { Download, RefreshCw, FileText } from 'lucide-react';
import { ImportJob } from '../types';

export interface ImportHistoryProps {
  jobs: ImportJob[];
  loading?: boolean;
  onDownloadReport?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export const ImportHistory: React.FC<ImportHistoryProps> = ({
  jobs,
  loading = false,
  onDownloadReport,
  onViewDetails,
}) => {
  const getStatusBadge = (status: ImportJob['status']) => {
    const variants: Record<ImportJob['status'], { label: string; color: 'green' | 'yellow' | 'red' | 'blue' }> = {
      completed: { label: 'Completado', color: 'green' },
      completed_with_errors: { label: 'Completado con errores', color: 'yellow' },
      failed: { label: 'Fallido', color: 'red' },
      processing: { label: 'Procesando', color: 'blue' },
      pending: { label: 'Pendiente', color: 'blue' },
    };

    const variant = variants[status] || variants.pending;
    return <Badge variant={variant.color}>{variant.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const columns = [
    {
      key: 'originalFilename',
      label: 'Archivo',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'entity',
      label: 'Entidad',
      render: (value: string) => {
        const labels: Record<string, string> = {
          members: 'Socios',
          classes: 'Clases',
          subscriptions: 'Suscripciones',
          check_ins: 'Asistencias',
        };
        return <span>{labels[value] || value}</span>;
      },
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: ImportJob['status']) => getStatusBadge(value),
    },
    {
      key: 'summary',
      label: 'Resumen',
      render: (value: ImportJob['summary'], row: ImportJob) => {
        if (!value) return '-';
        return (
          <span className="text-sm">
            <span className="text-green-600 font-semibold">{value.success}</span>
            {' / '}
            <span className="text-red-600 font-semibold">{value.failed}</span>
            {' / '}
            <span className="text-gray-600">{value.total}</span>
          </span>
        );
      },
    },
    {
      key: 'submittedAt',
      label: 'Fecha',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: ImportJob) => (
        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(row.jobId)}
            >
              Ver Detalles
            </Button>
          )}
          {row.reportUrl && onDownloadReport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownloadReport(row.jobId)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Historial de Importaciones
            </h3>
            <p className="text-sm text-gray-600">
              Revisa todas tus importaciones anteriores y descarga los informes de resultados.
            </p>
          </div>
        </div>

        <Table
          data={jobs}
          columns={columns}
          loading={loading}
          emptyMessage="No hay importaciones realizadas aún"
        />
      </div>
    </Card>
  );
};

