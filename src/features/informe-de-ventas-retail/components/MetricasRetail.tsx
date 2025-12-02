import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { getMetricasRetail, getMetricasPorTipo } from '../api';
import { MetricasRetailData, MetricaRetail } from '../types';
import { BarChart3, TrendingUp, DollarSign, Package, Percent, Clock, Users } from 'lucide-react';

export const MetricasRetail: React.FC = () => {
  const [metricas, setMetricas] = useState<MetricasRetailData | null>(null);
  const [metricasPorTipo, setMetricasPorTipo] = useState<MetricaRetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabActiva, setTabActiva] = useState('general');
  const [tipoMetrica, setTipoMetrica] = useState<MetricaRetail['tipo']>('conversion');

  useEffect(() => {
    cargarMetricas();
  }, []);

  useEffect(() => {
    if (tabActiva !== 'general') {
      cargarMetricasPorTipo();
    }
  }, [tabActiva, tipoMetrica]);

  const cargarMetricas = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];
      const data = await getMetricasRetail(fechaInicio, fechaFin);
      setMetricas(data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMetricasPorTipo = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];
      const data = await getMetricasPorTipo(tipoMetrica, fechaInicio, fechaFin);
      setMetricasPorTipo(data);
    } catch (error) {
      console.error('Error al cargar métricas por tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const tabs = [
    {
      id: 'general',
      label: 'Métricas Generales',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'conversion',
      label: 'Conversión',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'valor',
      label: 'Valor',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'rentabilidad',
      label: 'Rentabilidad',
      icon: <Percent className="w-4 h-4" />
    },
    {
      id: 'rendimiento',
      label: 'Rendimiento',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'tiempo',
      label: 'Tiempo',
      icon: <Clock className="w-4 h-4" />
    }
  ];

  const metricasGenerales = metricas ? [
    {
      id: 'conversion-rate',
      title: 'Tasa de Conversión',
      value: `${metricas.conversionRate}%`,
      subtitle: 'Visitantes que compran',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 5.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'ticket-promedio',
      title: 'Ticket Promedio',
      value: formatearMoneda(metricas.ticketPromedio),
      subtitle: 'Por transacción',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'valor-cliente',
      title: 'Valor por Cliente',
      value: formatearMoneda(metricas.valorPorCliente),
      subtitle: 'Promedio por cliente',
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 8.3,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'rotacion',
      title: 'Rotación de Inventario',
      value: `${metricas.rotacionInventario}x`,
      subtitle: 'Veces por año',
      icon: <Package className="w-6 h-6" />,
      color: 'warning' as const,
      trend: {
        value: 0.8,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'margen-bruto',
      title: 'Margen Bruto',
      value: `${metricas.margenBruto}%`,
      subtitle: 'Rentabilidad bruta',
      icon: <Percent className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 3.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'ventas-empleado',
      title: 'Ventas por Empleado',
      value: formatearMoneda(metricas.ventasPorEmpleado),
      subtitle: 'Promedio mensual',
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    }
  ] : [];

  const metricasTipoData = metricasPorTipo.map(m => ({
    id: m.id,
    title: m.nombre,
    value: m.unidad ? `${m.valor} ${m.unidad}` : m.valor.toString(),
    subtitle: m.tendencia?.periodo,
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'primary' as const,
    trend: m.tendencia ? {
      value: Math.abs(m.tendencia.valor),
      direction: m.tendencia.direccion,
      label: m.tendencia.periodo
    } : undefined
  }));

  return (
    <div className="space-y-6">
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones de métricas"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTabActiva(tab.id);
                  if (tab.id !== 'general') {
                    setTipoMetrica(tab.id as MetricaRetail['tipo']);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === tab.id
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-6">
        {tabActiva === 'general' && (
          <MetricCards
            data={metricasGenerales}
            columns={3}
          />
        )}

        {tabActiva !== 'general' && (
          <MetricCards
            data={metricasTipoData}
            columns={2}
          />
        )}

        {tabActiva === 'general' && metricas && (
          <Card className="p-4 bg-white shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Ventas por Hora
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metricas.ventasPorHora.map((hora, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {hora.hora}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(hora.ventas)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

