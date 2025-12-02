import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { getAnalisisVentas } from '../api';
import { AnalisisVentas as AnalisisVentasType } from '../types';
import { TrendingUp, TrendingDown, BarChart3, Loader2 } from 'lucide-react';

export const AnalisisVentas: React.FC = () => {
  const [analisis, setAnalisis] = useState<AnalisisVentasType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAnalisis();
  }, []);

  const cargarAnalisis = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];
      const data = await getAnalisisVentas(fechaInicio, fechaFin);
      setAnalisis(data);
    } catch (error) {
      console.error('Error al cargar análisis:', error);
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

  const columnasProductos = [
    {
      key: 'productoNombre',
      label: 'Producto'
    },
    {
      key: 'cantidadVendida',
      label: 'Cantidad Vendida',
      align: 'right' as const
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'tendencia',
      label: 'Tendencia',
      align: 'center' as const,
      render: (valor: 'up' | 'down' | 'neutral') => {
        if (valor === 'up') {
          return <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />;
        } else if (valor === 'down') {
          return <TrendingDown className="w-5 h-5 text-red-500 mx-auto" />;
        }
        return <BarChart3 className="w-5 h-5 text-gray-500 mx-auto" />;
      }
    }
  ];

  const columnasComparativa = [
    {
      key: 'productoNombre',
      label: 'Producto'
    },
    {
      key: 'ventasActual',
      label: 'Ventas Actual',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'ventasAnterior',
      label: 'Ventas Anterior',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'variacion',
      label: 'Variación',
      align: 'right' as const,
      render: (valor: number) => {
        const color = valor >= 0 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={color}>
            {valor >= 0 ? '+' : ''}{valor.toFixed(1)}%
          </span>
        );
      }
    }
  ];

  const columnasEstacionalidad = [
    {
      key: 'mes',
      label: 'Mes'
    },
    {
      key: 'ventas',
      label: 'Ventas',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'porcentajeVariacion',
      label: 'Variación',
      align: 'right' as const,
      render: (valor: number) => {
        const color = valor >= 0 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={color}>
            {valor >= 0 ? '+' : ''}{valor.toFixed(1)}%
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Productos Más Vendidos */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Productos Más Vendidos
        </h3>
        <Table
          data={analisis?.productosMasVendidos || []}
          columns={columnasProductos}
          loading={loading}
          emptyMessage="No hay datos de productos vendidos"
        />
      </Card>

      {/* Comparativa de Productos */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparativa de Productos
        </h3>
        <Table
          data={analisis?.comparativaProductos || []}
          columns={columnasComparativa}
          loading={loading}
          emptyMessage="No hay datos de comparativa"
        />
      </Card>

      {/* Patrones Estacionales */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Patrones Estacionales
        </h3>
        <Table
          data={analisis?.patronesEstacionales || []}
          columns={columnasEstacionalidad}
          loading={loading}
          emptyMessage="No hay datos de estacionalidad"
        />
      </Card>

      {/* Gráfico de Tendencias (simplificado) */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendencias de Ventas
        </h3>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : analisis?.tendencias && analisis.tendencias.length > 0 ? (
          <div className="space-y-2">
            {analisis.tendencias.map((tendencia, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {new Date(tendencia.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-900">
                    {tendencia.unidades} unidades
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(tendencia.ventas)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center py-8">
            No hay datos de tendencias disponibles
          </p>
        )}
      </Card>
    </div>
  );
};

