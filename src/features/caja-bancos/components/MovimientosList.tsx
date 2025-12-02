import React, { useState } from 'react';
import { Table, Button, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MovimientoCaja, FiltroMovimientos } from '../types';
import { useCajaBancos } from '../hooks/useCajaBancos';

interface MovimientosListProps {
  movimientos: MovimientoCaja[];
  loading: boolean;
  onRefresh: () => void;
}

export const MovimientosList: React.FC<MovimientosListProps> = ({
  movimientos,
  loading,
  onRefresh
}) => {
  const { cargarMovimientos, actualizarMovimiento, eliminarMovimiento } = useCajaBancos();
  const [filtros, setFiltros] = useState<FiltroMovimientos>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(fecha));
  };

  const getBadgeColor = (estado: MovimientoCaja['estado']) => {
    switch (estado) {
      case 'confirmado':
        return ds.badge.success;
      case 'pendiente':
        return ds.badge.warning;
      case 'cancelado':
        return ds.badge.error;
      default:
        return ds.badge.info;
    }
  };

  const getMetodoPagoIcon = (metodo: MovimientoCaja['metodoPago']) => {
    switch (metodo) {
      case 'efectivo':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'tarjeta':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'transferencia':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleFiltrar = async () => {
    await cargarMovimientos(filtros);
  };

  const handleLimpiarFiltros = async () => {
    setFiltros({});
    await cargarMovimientos();
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: MovimientoCaja['estado']) => {
    try {
      await actualizarMovimiento(id, { estado: nuevoEstado });
      onRefresh();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este movimiento?')) {
      try {
        await eliminarMovimiento(id);
        onRefresh();
      } catch (error) {
        console.error('Error al eliminar movimiento:', error);
      }
    }
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha: Date) => (
        <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          {formatearFecha(fecha)}
        </span>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (tipo: MovimientoCaja['tipo'], row: MovimientoCaja) => (
        <div className="flex items-center gap-2">
          {tipo === 'ingreso' ? (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          ) : (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
          <span className={`${ds.typography.bodySmall} font-medium capitalize`}>
            {tipo}
          </span>
        </div>
      )
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (concepto: string, row: MovimientoCaja) => (
        <div>
          <div className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {concepto}
          </div>
          {row.descripcion && (
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {row.descripcion}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'monto',
      label: 'Monto',
      align: 'right' as const,
      render: (monto: number, row: MovimientoCaja) => (
        <span className={`${ds.typography.body} font-semibold ${
          row.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.tipo === 'ingreso' ? '+' : '-'}{formatearMoneda(monto)}
        </span>
      )
    },
    {
      key: 'metodoPago',
      label: 'Método',
      render: (metodo: MovimientoCaja['metodoPago']) => (
        <div className="flex items-center gap-2">
          {getMetodoPagoIcon(metodo)}
          <span className={`${ds.typography.bodySmall} capitalize`}>
            {metodo}
          </span>
        </div>
      )
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (categoria: string) => (
        <span className={`${ds.badge.base} ${ds.badge.info}`}>
          {categoria}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: MovimientoCaja['estado']) => (
        <span className={`${ds.badge.base} ${getBadgeColor(estado)}`}>
          {estado}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: MovimientoCaja) => (
        <div className="flex items-center gap-2">
          {row.estado === 'pendiente' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCambiarEstado(row.id, 'confirmado')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEliminar(row.id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </Button>
              <Button
                variant="ghost"
                onClick={onRefresh}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </Button>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltros && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select
                  label="Tipo"
                  value={filtros.tipo || ''}
                  onChange={(value) => setFiltros(prev => ({ ...prev, tipo: value as any }))}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'ingreso', label: 'Ingresos' },
                    { value: 'egreso', label: 'Egresos' }
                  ]}
                />
                
                <Select
                  label="Método de Pago"
                  value={filtros.metodoPago || ''}
                  onChange={(value) => setFiltros(prev => ({ ...prev, metodoPago: value as any }))}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'efectivo', label: 'Efectivo' },
                    { value: 'tarjeta', label: 'Tarjeta' },
                    { value: 'transferencia', label: 'Transferencia' }
                  ]}
                />
                
                <Select
                  label="Estado"
                  value={filtros.estado || ''}
                  onChange={(value) => setFiltros(prev => ({ ...prev, estado: value as any }))}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'confirmado', label: 'Confirmado' },
                    { value: 'cancelado', label: 'Cancelado' }
                  ]}
                />
                
                <Input
                  label="Monto Mínimo"
                  type="number"
                  value={filtros.montoMin?.toString() || ''}
                  onChange={(e) => setFiltros(prev => ({ 
                    ...prev, 
                    montoMin: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="0"
                />
                
                <Input
                  label="Monto Máximo"
                  type="number"
                  value={filtros.montoMax?.toString() || ''}
                  onChange={(e) => setFiltros(prev => ({ 
                    ...prev, 
                    montoMax: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="Sin límite"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleFiltrar}>
                  Aplicar Filtros
                </Button>
                <Button variant="ghost" onClick={handleLimpiarFiltros}>
                  Limpiar
                </Button>
              </div>
              
              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{movimientos.length} resultados encontrados</span>
                <span>{Object.keys(filtros).filter(k => filtros[k as keyof FiltroMovimientos]).length} filtros aplicados</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de movimientos */}
      <Table
        data={movimientos}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay movimientos registrados"
      />
    </div>
  );
};