import React, { useState, useEffect } from 'react';
import { Table, TableColumn, Card, Badge } from '../../../components/componentsreutilizables';
import { accountingExportApi, AccountingExport, getExportHistory } from '../api';
import { Download, CheckCircle, Clock, XCircle, History } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ExportHistoryProps {
  onDownload?: (exportId: string) => void;
}

export const ExportHistory: React.FC<ExportHistoryProps> = ({ onDownload }) => {
  const [exports, setExports] = useState<AccountingExport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Usar getExportHistory de la API
      const history = await getExportHistory();
      
      // Convertir el formato de getExportHistory al formato AccountingExport
      const convertedExports: AccountingExport[] = history.map(item => {
        // Mapear formato 'excel' a 'xlsx' para compatibilidad
        let format: 'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx' = 'xlsx';
        if (item.formato === 'excel') {
          format = 'xlsx';
        } else if (['csv', 'pdf', 'a3', 'sage50'].includes(item.formato)) {
          format = item.formato as 'csv' | 'pdf' | 'a3' | 'sage50';
        }
        
        return {
          id: item.id,
          createdAt: item.fecha,
          generatedBy: item.usuario,
          dateRange: item.rangoFechas,
          format,
          status: 'completed' as const,
          downloadUrl: `/api/v1/finance/exports/${item.id}/download`
        };
      });
      
      setExports(convertedExports);
    } catch (error) {
      console.error('Error loading export history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (exportId: string, downloadUrl?: string) => {
    if (!downloadUrl) {
      console.warn('No download URL available for export:', exportId);
      return;
    }

    try {
      // Simular descarga del archivo
      // En producción, esto haría una llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Crear un blob simulado para la descarga
      const blob = new Blob(['Simulated export content'], { type: 'application/octet-stream' });
      const fileName = `export-${exportId}.${downloadUrl.split('.').pop() || 'xlsx'}`;
      saveAs(blob, fileName);
      
      // Llamar al callback si existe
      if (onDownload) {
        onDownload(exportId);
      }
    } catch (error) {
      console.error('Error downloading export:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="green" className="flex items-center w-fit">
            <CheckCircle size={12} className="mr-1" />
            Completado
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="yellow" className="flex items-center w-fit">
            <Clock size={12} className="mr-1" />
            Pendiente
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="red" className="flex items-center w-fit">
            <XCircle size={12} className="mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatLabel = (format: string): string => {
    const labels: Record<string, string> = {
      csv: 'CSV',
      pdf: 'PDF',
      a3: 'A3con',
      sage50: 'Sage 50'
    };
    return labels[format] || format.toUpperCase();
  };

  const columns: TableColumn<AccountingExport>[] = [
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      render: (_, row) => <span>{formatDate(row.createdAt)}</span>
    },
    {
      key: 'dateRange',
      label: 'Periodo',
      render: (value) => <span className="text-gray-900">{value as string}</span>
    },
    {
      key: 'format',
      label: 'Formato',
      render: (value) => (
        <Badge variant="blue">
          {formatLabel(value as string)}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => getStatusBadge(value as string)
    },
    {
      key: 'generatedBy',
      label: 'Generado por',
      render: (value) => <span className="text-gray-600">{value as string}</span>
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center' as const,
      render: (_, row) => (
        row.status === 'completed' && row.downloadUrl ? (
          <button
            onClick={() => handleDownload(row.id, row.downloadUrl)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download size={16} />
            Descargar de nuevo
          </button>
        ) : null
      )
    }
  ];

  return (
    <Card className="p-0 bg-white shadow-sm">
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <History size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Historial de Exportaciones
            </h3>
            <p className="text-sm text-gray-600">
              Listado de todas las exportaciones generadas
            </p>
          </div>
        </div>

        <Table
          data={exports}
          columns={columns}
          loading={loading}
          emptyMessage="No hay exportaciones realizadas aún"
        />
      </div>
    </Card>
  );
};

