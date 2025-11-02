import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Table } from '../../../components/componentsreutilizables';
import { InventarioService } from '../services/inventarioService';
import { Producto, AlertaStock } from '../types';
import { ControlStock } from './ControlStock';
import { AlertasCaducidad } from './AlertasCaducidad';
import { MovimientosStock } from './MovimientosStock';
import { ReportesInventario } from './ReportesInventario';
import { Package, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';

export const InventarioManager: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    productosBajoStock: 0,
    productosAgotados: 0,
    productosProximosVencer: 0,
    valorTotal: 0,
    movimientosUltimos7Dias: 0,
  });
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [stats, alertasData] = await Promise.all([
        InventarioService.obtenerEstadisticas(),
        InventarioService.obtenerAlertas({ resuelta: false }),
      ]);
      setEstadisticas(stats);
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'control',
      label: 'Control de Stock',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'alertas',
      label: 'Alertas de Caducidad',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'movimientos',
      label: 'Movimientos',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  const metricas = [
    {
      id: 'total-productos',
      title: 'Total de Productos',
      value: estadisticas.totalProductos,
      subtitle: 'En inventario',
      icon: <Package className="w-6 h-6" />,
      color: 'primary' as const
    },
    {
      id: 'productos-bajo-stock',
      title: 'Stock Bajo',
      value: estadisticas.productosBajoStock,
      subtitle: 'Necesitan reposición',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: estadisticas.productosBajoStock > 0 ? 'warning' as const : 'success' as const,
      trend: estadisticas.productosBajoStock > 0 ? {
        value: estadisticas.productosBajoStock,
        direction: 'up' as const,
        label: 'requieren atención'
      } : undefined
    },
    {
      id: 'productos-agotados',
      title: 'Productos Agotados',
      value: estadisticas.productosAgotados,
      subtitle: 'Sin stock disponible',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: estadisticas.productosAgotados > 0 ? 'error' as const : 'success' as const
    },
    {
      id: 'valor-total',
      title: 'Valor Total Inventario',
      value: formatearMoneda(estadisticas.valorTotal),
      subtitle: 'Costo de reposición',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <MetricCards data={metricas} columns={4} />

      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones de inventario"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => {
              const activo = tabActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setTabActiva(tab.id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <span className={activo ? 'opacity-100' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de la pestaña activa */}
      <div className="mt-6">
        {tabActiva === 'dashboard' && (
          <div className="space-y-6">
            {/* Alertas críticas */}
            {alertas.length > 0 && (
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Alertas Activas
                  </h3>
                  <div className="space-y-3">
                    {alertas.slice(0, 5).map((alerta) => (
                      <div
                        key={alerta.id}
                        className={`p-4 rounded-xl border ${
                          alerta.severidad === 'critica'
                            ? 'bg-red-50 border-red-200'
                            : alerta.severidad === 'alta'
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {alerta.productoNombre}
                            </p>
                            <p className="text-sm text-gray-600">
                              {alerta.mensaje}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            alerta.severidad === 'critica'
                              ? 'bg-red-100 text-red-700'
                              : alerta.severidad === 'alta'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alerta.severidad.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Resumen de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resumen
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Productos próximos a vencer (30 días)
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {estadisticas.productosProximosVencer}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Movimientos últimos 7 días
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {estadisticas.movimientosUltimos7Dias}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        {tabActiva === 'control' && <ControlStock onStockUpdate={cargarDatos} />}
        {tabActiva === 'alertas' && <AlertasCaducidad onAlertUpdate={cargarDatos} />}
        {tabActiva === 'movimientos' && <MovimientosStock />}
        {tabActiva === 'reportes' && <ReportesInventario />}
      </div>
    </div>
  );
};
