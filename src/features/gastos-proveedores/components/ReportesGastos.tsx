import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getGastos } from '../api/gastos';
import { MetricCards } from '../../../components/componentsreutilizables';
import { Gasto } from '../types';
import { FileText, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export const ReportesGastos: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [periodo, setPeriodo] = useState('mensual');
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date();
      const fechaFin = new Date();

      if (periodo === 'mensual') {
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      } else if (periodo === 'trimestral') {
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
      } else if (periodo === 'anual') {
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
      }

      const data = await getGastos({ fechaInicio, fechaFin });
      setGastos(data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const gastosOperativos = gastos.filter(g => g.tipo === 'operativo').reduce((sum, g) => sum + g.monto, 0);
  const gastosInversion = gastos.filter(g => g.tipo === 'inversion').reduce((sum, g) => sum + g.monto, 0);
  const gastosMantenimiento = gastos.filter(g => g.tipo === 'mantenimiento').reduce((sum, g) => sum + g.monto, 0);

  const gastosPorCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>);

  const categoriaTop = Object.entries(gastosPorCategoria)
    .sort(([, a], [, b]) => b - a)[0];

  const metricas = [
    {
      id: 'total-gastos',
      title: 'Total Gastos',
      value: formatearMoneda(totalGastos),
      subtitle: `Período ${periodo}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'gastos-operativos',
      title: 'Gastos Operativos',
      value: formatearMoneda(gastosOperativos),
      subtitle: `${totalGastos > 0 ? ((gastosOperativos / totalGastos) * 100).toFixed(1) : 0}% del total`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: 'gastos-mantenimiento',
      title: 'Mantenimiento',
      value: formatearMoneda(gastosMantenimiento),
      subtitle: `${totalGastos > 0 ? ((gastosMantenimiento / totalGastos) * 100).toFixed(1) : 0}% del total`,
      icon: <PieChart className="w-6 h-6" />,
      color: 'warning' as const,
    },
    {
      id: 'categoria-top',
      title: 'Categoría Principal',
      value: categoriaTop ? categoriaTop[0] : 'N/A',
      subtitle: categoriaTop ? formatearMoneda(categoriaTop[1]) : 'Sin datos',
      icon: <FileText className="w-6 h-6" />,
      color: 'success' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <div className="w-48">
          <Select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            options={[
              { value: 'mensual', label: 'Último Mes' },
              { value: 'trimestral', label: 'Último Trimestre' },
              { value: 'anual', label: 'Último Año' },
            ]}
          />
        </div>
      </div>

      {/* Métricas/KPIs */}
      <MetricCards data={metricas} columns={4} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gastos por Tipo
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Operativos</span>
                  <span className="text-sm font-semibold">{formatearMoneda(gastosOperativos)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${totalGastos > 0 ? (gastosOperativos / totalGastos) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Inversión</span>
                  <span className="text-sm font-semibold">{formatearMoneda(gastosInversion)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${totalGastos > 0 ? (gastosInversion / totalGastos) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Mantenimiento</span>
                  <span className="text-sm font-semibold">{formatearMoneda(gastosMantenimiento)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${totalGastos > 0 ? (gastosMantenimiento / totalGastos) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Categorías
            </h3>
            <div className="space-y-3">
              {Object.entries(gastosPorCategoria)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([categoria, monto]) => (
                  <div key={categoria} className="flex justify-between items-center">
                    <span className="text-sm">{categoria}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${totalGastos > 0 ? (monto / totalGastos) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-24 text-right">
                        {formatearMoneda(monto)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

