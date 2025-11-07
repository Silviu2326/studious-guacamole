import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { PipelineReport, BusinessType } from '../types';
import { getReports, generateReport } from '../api/reports';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';

interface PipelineReportsProps {
  businessType: BusinessType;
}

export const PipelineReports: React.FC<PipelineReportsProps> = ({ businessType }) => {
  const [reports, setReports] = useState<PipelineReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [businessType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports(businessType);
      setReports(data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();

    try {
      const report = await generateReport(
        `Reporte ${new Date().toLocaleDateString('es-ES')}`,
        { start: startDate, end: endDate },
        { businessType },
        businessType,
        'current_user'
      );
      setReports([...reports, report]);
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (report: PipelineReport) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{report.name}</span>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Período',
      render: (report: PipelineReport) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(report.period.start).toLocaleDateString('es-ES')} -{' '}
            {new Date(report.period.end).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'metrics',
      label: 'Métricas',
      render: (report: PipelineReport) => (
        <div className="text-sm">
          <div>{report.metrics.totalSales} ventas</div>
          <div className="text-gray-600 dark:text-gray-400">
            {report.metrics.totalValue.toLocaleString('es-ES')}€
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (report: PipelineReport) => (
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Descargar
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Reportes
            </h3>
          </div>
          <Button variant="primary" size="sm" onClick={handleGenerateReport}>
            <FileText size={18} className="mr-2" />
            Generar Reporte
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando reportes...</p>
          </Card>
        ) : (
          <Table
            data={reports}
            columns={columns}
            loading={loading}
            emptyMessage="No hay reportes disponibles"
          />
        )}
      </div>
    </Card>
  );
};

