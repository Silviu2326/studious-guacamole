import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useEstadisticasProductos, useStock } from '../hooks/useProductos';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Eye,
  EyeOff,
  ShoppingCart,
  Tag,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const EstadisticasProductos: React.FC = () => {
  const { estadisticas, loading, error } = useEstadisticasProductos();
  const { alertas, marcarAlertaLeida } = useStock();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse bg-white shadow-sm">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !estadisticas) {
    return (
      <Card className="p-6 text-center bg-white shadow-sm">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-gray-600">Error al cargar estadísticas</p>
      </Card>
    );
  }

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  const metricas = [
    {
      titulo: 'Total Productos',
      valor: estadisticas.estadisticas.totalProductos,
      icono: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      descripcion: 'Productos en catálogo'
    },
    {
      titulo: 'Productos Activos',
      valor: estadisticas.estadisticas.productosActivos,
      icono: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      descripcion: 'Disponibles para venta'
    },
    {
      titulo: 'Sin Stock',
      valor: estadisticas.estadisticas.productosSinStock,
      icono: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      descripcion: 'Requieren reposición'
    },
    {
      titulo: 'Stock Bajo',
      valor: estadisticas.estadisticas.productosStockBajo,
      icono: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      descripcion: 'Por debajo del mínimo'
    },
    {
      titulo: 'Valor Inventario',
      valor: formatearMoneda(estadisticas.estadisticas.valorTotalInventario),
      icono: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      descripcion: 'Valor total del stock'
    },
    {
      titulo: 'Precio Promedio',
      valor: formatearMoneda(estadisticas.estadisticas.promedioPrecios),
      icono: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      descripcion: 'Precio medio de productos'
    },
    {
      titulo: 'Categoría Principal',
      valor: estadisticas.estadisticas.categoriaConMasProductos,
      icono: Tag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      descripcion: 'Con más productos'
    },
    {
      titulo: 'Productos Inactivos',
      valor: estadisticas.estadisticas.productosInactivos,
      icono: EyeOff,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      descripcion: 'No disponibles'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index} className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metrica.titulo}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {metrica.valor}
                </p>
                <p className="text-xs text-gray-500">
                  {metrica.descripcion}
                </p>
              </div>
              <div className={`p-3 rounded-full ${metrica.bgColor}`}>
                <metrica.icono size={24} className={metrica.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alertas de stock */}
      {alertas.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-yellow-500" />
              Alertas de Stock ({alertas.length})
            </h3>
          </div>

          <div className="space-y-3">
            {alertas.slice(0, 5).map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alerta.tipo === 'sin_stock'
                    ? 'bg-red-50 border-red-400'
                    : alerta.tipo === 'stock_bajo'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-orange-50 border-orange-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <AlertTriangle 
                        size={16} 
                        className={
                          alerta.tipo === 'sin_stock'
                            ? 'text-red-500 mr-2'
                            : alerta.tipo === 'stock_bajo'
                            ? 'text-yellow-500 mr-2'
                            : 'text-orange-500 mr-2'
                        }
                      />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        alerta.tipo === 'sin_stock'
                          ? 'bg-red-100 text-red-800'
                          : alerta.tipo === 'stock_bajo'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {alerta.tipo === 'sin_stock' ? 'Sin Stock' : 
                         alerta.tipo === 'stock_bajo' ? 'Stock Bajo' : 'Stock Crítico'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(alerta.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => marcarAlertaLeida(alerta.id)}
                    className="ml-4"
                  >
                    <CheckCircle size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {alertas.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  Ver todas las alertas ({alertas.length - 5} más)
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Movimientos recientes */}
      {estadisticas.movimientosRecientes.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock size={20} className="mr-2" />
            Movimientos Recientes
          </h3>

          <div className="space-y-3">
            {estadisticas.movimientosRecientes.map((movimiento) => (
              <div
                key={movimiento.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    movimiento.tipo === 'entrada'
                      ? 'bg-green-100 text-green-600'
                      : movimiento.tipo === 'salida'
                      ? 'bg-red-100 text-red-600'
                      : movimiento.tipo === 'venta'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {movimiento.tipo === 'entrada' ? (
                      <TrendingUp size={16} />
                    ) : movimiento.tipo === 'salida' ? (
                      <XCircle size={16} />
                    ) : movimiento.tipo === 'venta' ? (
                      <ShoppingCart size={16} />
                    ) : (
                      <Package size={16} />
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {movimiento.tipo === 'entrada' ? 'Entrada' :
                       movimiento.tipo === 'salida' ? 'Salida' :
                       movimiento.tipo === 'venta' ? 'Venta' : 'Ajuste'} 
                      - {movimiento.cantidad} unidades
                    </p>
                    <p className="text-xs text-gray-500">
                      {movimiento.motivo}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {movimiento.cantidadAnterior} → {movimiento.cantidadNueva}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resumen rápido */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen del Catálogo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round((estadisticas.estadisticas.productosActivos / estadisticas.estadisticas.totalProductos) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Productos activos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {estadisticas.estadisticas.totalProductos - estadisticas.estadisticas.productosSinStock}
            </div>
            <div className="text-sm text-gray-600">Con stock disponible</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatearMoneda(estadisticas.estadisticas.valorTotalInventario / estadisticas.estadisticas.totalProductos)}
            </div>
            <div className="text-sm text-gray-600">Valor promedio por producto</div>
          </div>
        </div>
      </Card>
    </div>
  );
};