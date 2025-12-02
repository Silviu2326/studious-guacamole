import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getPresupuestos } from '../api/presupuesto';
import { Presupuesto } from '../types';
import { DollarSign, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export const ControlPresupuesto: React.FC = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const año = new Date().getFullYear();
      const mes = new Date().getMonth() + 1;
      const data = await getPresupuestos(año, mes);
      setPresupuestos(data);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const totalAsignado = presupuestos.reduce((sum, p) => sum + p.montoAsignado, 0);
  const totalGastado = presupuestos.reduce((sum, p) => sum + p.montoGastado, 0);
  const totalDisponible = totalAsignado - totalGastado;
  const porcentajeUsado = totalAsignado > 0 ? (totalGastado / totalAsignado) * 100 : 0;
  const presupuestosConAlerta = presupuestos.filter(p => p.alertas && p.porcentajeUsado >= (p.limiteAlerta || 80));

  const metricas = [
    {
      id: 'total-asignado',
      title: 'Presupuesto Total',
      value: formatearMoneda(totalAsignado),
      subtitle: 'Asignado este mes',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'total-gastado',
      title: 'Total Gastado',
      value: formatearMoneda(totalGastado),
      subtitle: `${porcentajeUsado.toFixed(1)}% del presupuesto`,
      trend: {
        value: porcentajeUsado,
        direction: porcentajeUsado > 80 ? 'up' : porcentajeUsado > 50 ? 'neutral' : 'down',
        label: 'del presupuesto',
      },
      icon: <TrendingUp className="w-6 h-6" />,
      color: porcentajeUsado > 80 ? 'error' : porcentajeUsado > 50 ? 'warning' : 'success' as const,
    },
    {
      id: 'disponible',
      title: 'Disponible',
      value: formatearMoneda(totalDisponible),
      subtitle: `${presupuestosConAlerta.length} alertas`,
      icon: presupuestosConAlerta.length > 0 ? (
        <AlertTriangle className="w-6 h-6" />
      ) : (
        <CheckCircle className="w-6 h-6" />
      ),
      color: presupuestosConAlerta.length > 0 ? 'warning' : 'success' as const,
    },
  ];

  const getColorPorcentaje = (porcentaje: number, limite?: number) => {
    const limiteAlerta = limite || 80;
    if (porcentaje >= limiteAlerta) return 'bg-red-500';
    if (porcentaje >= limiteAlerta * 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Métricas/KPIs */}
      <MetricCards data={metricas} columns={3} />

      {/* Presupuestos por Categoría */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Presupuestos por Categoría
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando presupuestos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {presupuestos.map((presupuesto) => (
                <div key={presupuesto.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{presupuesto.categoria}</p>
                      <p className="text-sm text-gray-600">
                        {formatearMoneda(presupuesto.montoGastado)} de {formatearMoneda(presupuesto.montoAsignado)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{presupuesto.porcentajeUsado.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">
                        {formatearMoneda(presupuesto.montoDisponible)} disponible
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getColorPorcentaje(presupuesto.porcentajeUsado, presupuesto.limiteAlerta)}`}
                      style={{ width: `${Math.min(presupuesto.porcentajeUsado, 100)}%` }}
                    />
                  </div>
                  {presupuesto.alertas && presupuesto.porcentajeUsado >= (presupuesto.limiteAlerta || 80) && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Alerta: Presupuesto cerca del límite
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

