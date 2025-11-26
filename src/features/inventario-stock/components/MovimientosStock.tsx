import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input } from '../../../components/componentsreutilizables';
import { InventarioService } from '../services/inventarioService';
import { MovimientoStock, FiltroMovimientos } from '../types';
import { TrendingUp, TrendingDown, ArrowLeftRight, Search, Calendar } from 'lucide-react';

export const MovimientosStock: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltroMovimientos>({});

  useEffect(() => {
    cargarMovimientos();
  }, [filtros]);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      const data = await InventarioService.obtenerMovimientos(filtros);
      setMovimientos(data);
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: MovimientoStock['tipo']) => {
    switch (tipo) {
      case 'entrada':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'salida':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'ajuste':
        return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      case 'transferencia':
        return <ArrowLeftRight className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getTipoColor = (tipo: MovimientoStock['tipo']) => {
    switch (tipo) {
      case 'entrada':
        return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20';
      case 'salida':
        return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20';
      case 'ajuste':
        return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'transferencia':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20';
      default:
        return '';
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      render: (value: Date) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {value.toLocaleDateString('es-CO')}
          </p>
          <p className="text-xs text-gray-500">
            {value.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: MovimientoStock['tipo']) => (
        <div className="flex items-center gap-2">
          {getTipoIcon(value)}
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTipoColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'productoNombre',
      label: 'Producto',
      sortable: true,
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      align: 'center' as const,
      render: (value: number, row: MovimientoStock) => (
        <div className="text-center">
          <p className={`text-base font-semibold ${
            row.tipo === 'entrada'
              ? 'text-green-600'
              : row.tipo === 'salida'
              ? 'text-red-600'
              : 'text-gray-900'
          }`}>
            {row.tipo === 'entrada' ? '+' : row.tipo === 'salida' ? '-' : '±'}
            {value}
          </p>
        </div>
      ),
    },
    {
      key: 'cantidadAnterior',
      label: 'Stock Anterior',
      align: 'center' as const,
      render: (value: number, row: MovimientoStock) => (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {value}
          </p>
          <p className="text-xs text-gray-500">
            →
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {row.cantidadNueva}
          </p>
        </div>
      ),
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value: string) => (
        <span className="text-gray-900">{value}</span>
      ),
    },
    {
      key: 'referencia',
      label: 'Referencia',
      render: (value: string | undefined) => (
        value ? (
          <span className="text-sm text-gray-600">
            {value}
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )
      ),
    },
    {
      key: 'usuario',
      label: 'Usuario',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar por producto..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  value={filtros.productoId || ''}
                  onChange={(e) => setFiltros({ ...filtros, productoId: e.target.value || undefined })}
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filtros.tipo === 'entrada' ? 'primary' : 'secondary'}
                  onClick={() => setFiltros({ 
                    ...filtros, 
                    tipo: filtros.tipo === 'entrada' ? undefined : 'entrada' 
                  })}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Entradas
                </Button>
                <Button
                  variant={filtros.tipo === 'salida' ? 'primary' : 'secondary'}
                  onClick={() => setFiltros({ 
                    ...filtros, 
                    tipo: filtros.tipo === 'salida' ? undefined : 'salida' 
                  })}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Salidas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de movimientos */}
      <Table
        data={movimientos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay movimientos registrados"
      />
    </div>
  );
};
