import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, Modal } from '../../../components/componentsreutilizables';
import { InventarioService } from '../services/inventarioService';
import { Producto, FiltroProductos } from '../types';
import { Package, Search, Plus, Edit, AlertCircle } from 'lucide-react';

interface ControlStockProps {
  onStockUpdate?: () => void;
}

export const ControlStock: React.FC<ControlStockProps> = ({ onStockUpdate }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltroProductos>({});
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [nuevoStock, setNuevoStock] = useState('');

  useEffect(() => {
    cargarProductos();
  }, [filtros]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await InventarioService.obtenerProductos(filtros);
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAjustarStock = async (producto: Producto) => {
    setProductoSeleccionado(producto);
    setNuevoStock(producto.stockActual.toString());
    setMostrarModalProducto(true);
  };

  const confirmarAjusteStock = async () => {
    if (!productoSeleccionado || !nuevoStock) return;

    try {
      const cantidad = parseInt(nuevoStock);
      if (isNaN(cantidad) || cantidad < 0) {
        alert('La cantidad debe ser un número positivo');
        return;
      }

      await InventarioService.actualizarStock(
        productoSeleccionado.id,
        cantidad,
        'Ajuste manual de stock'
      );
      
      setMostrarModalProducto(false);
      setProductoSeleccionado(null);
      setNuevoStock('');
      cargarProductos();
      onStockUpdate?.();
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      alert('Error al ajustar stock');
    }
  };

  const getEstadoBadge = (estado: Producto['estado']) => {
    const estados = {
      disponible: { label: 'Disponible', color: 'success' },
      bajo_stock: { label: 'Stock Bajo', color: 'warning' },
      agotado: { label: 'Agotado', color: 'error' },
      vencido: { label: 'Vencido', color: 'error' },
      deshabilitado: { label: 'Deshabilitado', color: 'info' },
    };
    return estados[estado] || estados.disponible;
  };

  const columns = [
    {
      key: 'codigo',
      label: 'Código',
      sortable: true,
    },
    {
      key: 'nombre',
      label: 'Producto',
      sortable: true,
      render: (value: string, row: Producto) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {row.nombre}
          </p>
          <p className="text-xs text-gray-500">
            {row.categoria}
          </p>
        </div>
      ),
    },
    {
      key: 'stockActual',
      label: 'Stock Actual',
      align: 'center' as const,
      render: (value: number, row: Producto) => (
        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">
            {value} {row.unidad}
          </p>
          <p className="text-xs text-gray-500">
            Mín: {row.stockMinimo}
          </p>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      align: 'center' as const,
      render: (value: Producto['estado'], row: Producto) => {
        const estado = getEstadoBadge(value);
        return (
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            estado.color === 'success'
              ? 'bg-green-100 text-green-700'
              : estado.color === 'warning'
              ? 'bg-yellow-100 text-yellow-700'
              : estado.color === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {estado.label}
          </span>
        );
      },
    },
    {
      key: 'fechaCaducidad',
      label: 'Caducidad',
      render: (value: Date | undefined, row: Producto) => {
        if (!row.tieneCaducidad || !value) {
          return <span className="text-gray-500">N/A</span>;
        }
        const hoy = new Date();
        const diasRestantes = Math.ceil((value.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        const esVencido = diasRestantes < 0;
        const esProximo = diasRestantes >= 0 && diasRestantes <= 30;
        
        return (
          <div>
            <p className={`text-sm ${
              esVencido
                ? 'text-red-600'
                : esProximo
                ? 'text-yellow-600'
                : 'text-gray-900'
            }`}>
              {value.toLocaleDateString('es-CO')}
            </p>
            {esVencido && (
              <p className="text-xs text-red-600">
                Vencido
              </p>
            )}
            {esProximo && !esVencido && (
              <p className="text-xs text-yellow-600">
                {diasRestantes} días restantes
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'center' as const,
      render: (_: any, row: Producto) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAjustarStock(row)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Ajustar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  value={filtros.busqueda || ''}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filtros.stockBajo ? 'primary' : 'secondary'}
                  onClick={() => setFiltros({ ...filtros, stockBajo: !filtros.stockBajo })}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Stock Bajo
                </Button>
                <Button
                  variant={filtros.proximosVencer ? 'primary' : 'secondary'}
                  onClick={() => setFiltros({ ...filtros, proximosVencer: !filtros.proximosVencer })}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Próximos a Vencer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de productos */}
      <Table
        data={productos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay productos en el inventario"
      />

      {/* Modal para ajustar stock */}
      <Modal
        isOpen={mostrarModalProducto}
        onClose={() => {
          setMostrarModalProducto(false);
          setProductoSeleccionado(null);
          setNuevoStock('');
        }}
        title="Ajustar Stock"
        size="md"
      >
        {productoSeleccionado && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Producto
              </p>
              <p className="text-base font-semibold text-gray-900">
                {productoSeleccionado.nombre}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Stock Actual
              </p>
              <p className="text-base text-gray-900">
                {productoSeleccionado.stockActual} {productoSeleccionado.unidad}
              </p>
            </div>
            <Input
              label="Nuevo Stock"
              type="number"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              min="0"
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalProducto(false);
                  setProductoSeleccionado(null);
                  setNuevoStock('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={confirmarAjusteStock}
              >
                Confirmar Ajuste
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
