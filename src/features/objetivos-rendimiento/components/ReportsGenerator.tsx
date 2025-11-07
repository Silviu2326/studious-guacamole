import React, { useState, useEffect } from 'react';
import { Report } from '../types';
import { getReports, generateReport, exportReport } from '../api/reports';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { FileText, Download, Calendar, RefreshCw, Loader2 } from 'lucide-react';

interface ReportsGeneratorProps {
  role: 'entrenador' | 'gimnasio';
}

export const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({ role }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type: Report['type']) => {
    setGenerating(true);
    try {
      const period = type === 'daily' ? new Date().toISOString().split('T')[0] :
                     type === 'weekly' ? `Semana ${getWeekNumber(new Date())}` :
                     type === 'monthly' ? new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) :
                     type === 'quarterly' ? `Q${Math.floor((new Date().getMonth() + 3) / 3)} ${new Date().getFullYear()}` :
                     new Date().getFullYear().toString();
      
      await generateReport(type, period, role);
      await loadReports();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const filename = await exportReport(reportId, format);
      alert(`Reporte exportado: ${filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el reporte');
    }
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const columns = [
    {
      key: 'title',
      label: 'Reporte',
      render: (value: string, row: Report) => (
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">
              {row.type} - {row.period}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'generatedAt',
      label: 'Generado',
      render: (value: string) => new Date(value).toLocaleString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Exportar',
      render: (_: any, row: Report) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleExport(row.id, 'pdf')}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            title="Exportar PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExport(row.id, 'excel')}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Exportar Excel"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button variant="secondary" onClick={loadReports} disabled={loading}>
          <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Card para generar reportes */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Generar Nuevo Reporte
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as Report['type'][]).map((type) => (
            <Button
              key={type}
              variant="secondary"
              onClick={() => handleGenerate(type)}
              disabled={generating}
              className="w-full"
            >
              <Calendar size={20} className="mr-2" />
              {type === 'daily' ? 'Diario' :
               type === 'weekly' ? 'Semanal' :
               type === 'monthly' ? 'Mensual' :
               type === 'quarterly' ? 'Trimestral' :
               'Anual'}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tabla de reportes */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : (
        <Table
          data={reports}
          columns={columns}
          loading={false}
          emptyMessage="No hay reportes generados"
        />
      )}
    </div>
  );
};

