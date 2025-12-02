import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from '../../../components/componentsreutilizables';
import { getRentabilidadProductos } from '../api';
import { ProductoRentabilidad } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export const RentabilidadProductos: React.FC = () => {
  const [productos, setProductos] = useState<ProductoRentabilidad[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarRentabilidad();
  }, []);

  const cargarRentabilidad = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];
      const data = await getRentabilidadProductos(fechaInicio, fechaFin);
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar rentabilidad:', error);
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

  const getColorRecomendacion = (recomendacion: ProductoRentabilidad['recomendacion']): 'yellow' | 'blue' | 'green' | 'red' => {
    switch (recomendacion) {
      case 'aumentar-precio':
        return 'yellow';
      case 'promocionar':
        return 'blue';
      case 'reducir-stock':
        return 'yellow';
      case 'mantener':
        return 'green';
      case 'eliminar':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getLabelRecomendacion = (recomendacion: ProductoRentabilidad['recomendacion']) => {
    switch (recomendacion) {
      case 'aumentar-precio':
        return 'Aumentar Precio';
      case 'promocionar':
        return 'Promocionar';
      case 'reducir-stock':
        return 'Reducir Stock';
      case 'mantener':
        return 'Mantener';
      case 'eliminar':
        return 'Eliminar';
      default:
        return recomendacion;
    }
  };

  const columnas = [
    {
      key: 'productoNombre',
      label: 'Producto'
    },
    {
      key: 'categoria',
      label: 'Categoría'
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'costos',
      label: 'Costos',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'margenBruto',
      label: 'Margen Bruto',
      align: 'right' as const,
      render: (valor: number) => {
        const color = valor >= 40 ? 'text-green-600' : valor >= 30 ? 'text-yellow-600' : 'text-red-600';
        return <span className={color}>{valor.toFixed(1)}%</span>;
      }
    },
    {
      key: 'margenNeto',
      label: 'Margen Neto',
      align: 'right' as const,
      render: (valor: number) => {
        const color = valor >= 25 ? 'text-green-600' : valor >= 15 ? 'text-yellow-600' : 'text-red-600';
        return <span className={color}>{valor.toFixed(1)}%</span>;
      }
    },
    {
      key: 'roi',
      label: 'ROI',
      align: 'right' as const,
      render: (valor: number) => {
        const color = valor >= 100 ? 'text-green-600' : valor >= 50 ? 'text-yellow-600' : 'text-red-600';
        return <span className={color}>{valor.toFixed(1)}%</span>;
      }
    },
    {
      key: 'rotacion',
      label: 'Rotación',
      align: 'right' as const,
      render: (valor: number) => `${valor.toFixed(1)}x`
    },
    {
      key: 'recomendacion',
      label: 'Recomendación',
      render: (valor: ProductoRentabilidad['recomendacion']) => (
        <Badge variant={getColorRecomendacion(valor)}>
          {getLabelRecomendacion(valor)}
        </Badge>
      )
    }
  ];

  const productosBuenos = productos.filter(p => p.margenNeto >= 25 && p.roi >= 100);
  const productosRegulares = productos.filter(p => p.margenNeto >= 15 && p.margenNeto < 25);
  const productosMalos = productos.filter(p => p.margenNeto < 15 || p.roi < 50);

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-gray-600">
              Productos Rentables
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {productosBuenos.length}
          </p>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-yellow-600" />
            <p className="text-sm text-gray-600">
              Productos Regulares
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {productosRegulares.length}
          </p>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-red-600" />
            <p className="text-sm text-gray-600">
              Productos Problemáticos
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {productosMalos.length}
          </p>
        </Card>
      </div>

      {/* Tabla de Rentabilidad */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análisis de Rentabilidad por Producto
        </h3>
        <Table
          data={productos}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay datos de rentabilidad disponibles"
        />
      </Card>

      {/* Recomendaciones */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recomendaciones Estratégicas
        </h3>
        <div className="space-y-4">
          {productos.filter(p => p.recomendacion !== 'mantener').length > 0 ? (
            productos
              .filter(p => p.recomendacion !== 'mantener')
              .map((producto) => (
                <div
                  key={producto.productoId}
                  className={`p-4 rounded-xl ring-1 ${
                    producto.recomendacion === 'eliminar'
                      ? 'bg-red-50 ring-red-200'
                      : producto.recomendacion === 'aumentar-precio'
                      ? 'bg-yellow-50 ring-yellow-200'
                      : 'bg-blue-50 ring-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {producto.productoNombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getLabelRecomendacion(producto.recomendacion)}: Margen neto {producto.margenNeto.toFixed(1)}%, ROI {producto.roi.toFixed(1)}%
                      </p>
                    </div>
                    <Badge variant={getColorRecomendacion(producto.recomendacion)}>
                      {getLabelRecomendacion(producto.recomendacion)}
                    </Badge>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">No hay recomendaciones pendientes</p>
          )}
        </div>
      </Card>
    </div>
  );
};

