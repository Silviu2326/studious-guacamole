import React, { useState } from 'react';
import { Card, Button, Select, MetricCards } from '../../../components/componentsreutilizables';
import { FileText, Download } from 'lucide-react';
import { ReporteCompliance } from '../types';

export const ReportesCompliance: React.FC = () => {
  const [periodo, setPeriodo] = useState('ultimo-mes');
  const [reporte, setReporte] = useState<ReporteCompliance | null>(null);

  const handleGenerar = () => {
    setReporte({
      periodo: periodo,
      totalRestricciones: 0,
      totalAlertas: 0,
      alertasResueltas: 0,
      alertasPendientes: 0,
      clientesAfectados: 0,
      tiempoPromedioResolucion: 0,
      cumplimientoNormativo: 0,
    });
  };

  const metricas = reporte ? [
    {
      title: 'Total Restricciones',
      value: reporte.totalRestricciones.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Total Alertas',
      value: reporte.totalAlertas.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+0%',
      color: 'red' as const,
    },
    {
      title: 'Cumplimiento Normativo',
      value: `${reporte.cumplimientoNormativo}%`,
      icon: <FileText className="w-5 h-5" />,
      trend: 'neutral',
      trendValue: '0%',
      color: 'green' as const,
    },
    {
      title: 'Clientes Afectados',
      value: reporte.clientesAfectados.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+0%',
      color: 'purple' as const,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Controles de reporte */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Reportes de Compliance
          </h2>
          <p className="text-gray-600 text-sm">
            Genera reportes de cumplimiento normativo y seguridad alimentaria
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Período
              </label>
              <Select
                options={[
                  { value: 'ultimo-mes', label: 'Último Mes' },
                  { value: 'ultimos-3-meses', label: 'Últimos 3 Meses' },
                  { value: 'ultimo-ano', label: 'Último Año' },
                ]}
                value={periodo}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement;
                  setPeriodo(target.value);
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerar}>
                Generar Reporte
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas y descarga */}
      {reporte && (
        <div className="space-y-6">
          <MetricCards data={metricas} />
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex justify-end">
              <Button variant="secondary">
                <Download size={20} className="mr-2" />
                Descargar Reporte
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

