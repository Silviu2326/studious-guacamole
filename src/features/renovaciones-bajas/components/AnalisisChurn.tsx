import React, { useMemo } from 'react';
import { ChurnData } from '../types';
import { Card, Button, Select, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { TrendingDown, TrendingUp, Download, BarChart3 } from 'lucide-react';

interface AnalisisChurnProps {
  datosChurn: ChurnData[];
  periodo: 'mensual' | 'trimestral' | 'anual';
  onCambiarPeriodo: (periodo: string) => void;
  onExportReporte: () => Promise<void>;
  loading?: boolean;
}

export const AnalisisChurn: React.FC<AnalisisChurnProps> = ({
  datosChurn,
  periodo,
  onCambiarPeriodo,
  onExportReporte,
  loading = false,
}) => {
  const calcularMetricas = () => {
    const totalBajas = datosChurn.reduce((sum, data) => sum + data.bajas, 0);
    const totalSocios = datosChurn.reduce((sum, data) => sum + data.sociosIniciales, 0);
    const tasaChurn = totalSocios > 0 ? (totalBajas / totalSocios) * 100 : 0;

    const motivosMasComunes = datosChurn.reduce((acc, data) => {
      data.motivosBaja.forEach(motivo => {
        acc[motivo] = (acc[motivo] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const motivoPrincipal = Object.entries(motivosMasComunes).sort((a, b) => b[1] - a[1])[0];

    return {
      tasaChurn,
      totalBajas,
      totalSocios,
      motivoPrincipal: motivoPrincipal ? motivoPrincipal[0] : 'N/A',
      motivosMasComunes,
    };
  };

  const metricas = calcularMetricas();

  const metricCards: MetricCardData[] = [
    {
      id: 'tasa-churn',
      title: 'Tasa de Churn',
      value: `${metricas.tasaChurn.toFixed(2)}%`,
      subtitle: 'Porcentaje de bajas sobre socios iniciales',
      color: metricas.tasaChurn > 5 ? 'error' : metricas.tasaChurn > 2 ? 'warning' : 'success',
      icon: <TrendingDown className="w-6 h-6" />,
      trend: {
        value: Math.abs(metricas.tasaChurn),
        direction: metricas.tasaChurn > 2 ? 'up' : 'down',
        label: 'vs período anterior',
      },
    },
    {
      id: 'total-bajas',
      title: 'Total Bajas',
      value: metricas.totalBajas.toString(),
      subtitle: 'Bajas registradas en el período',
      color: 'error',
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      id: 'total-socios',
      title: 'Total Socios',
      value: metricas.totalSocios.toString(),
      subtitle: 'Socios al inicio del período',
      color: 'info',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 'motivo-principal',
      title: 'Motivo Principal',
      value: metricas.motivoPrincipal,
      subtitle: 'Motivo más común de baja',
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Select
            value={periodo}
            onChange={(e) => onCambiarPeriodo(e.target.value)}
            options={[
              { value: 'mensual', label: 'Mensual' },
              { value: 'trimestral', label: 'Trimestral' },
              { value: 'anual', label: 'Anual' },
            ]}
            className="w-48"
            fullWidth={false}
          />
          <Button onClick={onExportReporte}>
            <Download size={20} className="mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas/KPIs */}
      <MetricCards data={metricCards} columns={4} />

      {/* Motivos de Baja Más Comunes */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Motivos de Baja Más Comunes
        </h3>
        <div className="space-y-2">
          {Object.entries(metricas.motivosMasComunes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([motivo, cantidad], index) => (
              <div
                key={motivo}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{motivo}</span>
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {cantidad}
                </span>
              </div>
            ))}
        </div>
      </Card>

      {/* Gráfico de Evolución de Tasa Churn */}
      {datosChurn.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Evolución de Tasa Churn
          </h3>
          <div className="space-y-4">
            {datosChurn.map((data, index) => {
              const maxChurn = Math.max(...datosChurn.map(d => d.tasaChurn));
              const percentage = (data.tasaChurn / maxChurn) * 100;
              const color = data.tasaChurn > 5 ? 'bg-red-500' : data.tasaChurn > 2 ? 'bg-yellow-500' : 'bg-green-500';
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{data.periodo}</span>
                    <span className="font-semibold text-gray-900">
                      {data.tasaChurn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Evolución por Período */}
      {datosChurn.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución por Período
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Período</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Socios Iniciales</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Bajas</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Tasa Churn</th>
                </tr>
              </thead>
              <tbody>
                {datosChurn.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-900">{data.periodo}</td>
                    <td className="text-right py-3 px-4 text-gray-900">{data.sociosIniciales}</td>
                    <td className="text-right py-3 px-4 text-gray-900">{data.bajas}</td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-900">
                      {data.tasaChurn.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
