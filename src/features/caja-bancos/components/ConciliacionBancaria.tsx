import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Table, MetricCards, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { MovimientoBancario, ConciliacionBancaria as ConciliacionType } from '../types';
import { ImportarMovimientosModal } from './ImportarMovimientosModal';
import { NuevaConciliacionModal } from './NuevaConciliacionModal';

export const ConciliacionBancaria: React.FC = () => {
  const {
    movimientosBancarios,
    conciliaciones,
    cuentasBancarias,
    loading,
    error,
    cargarMovimientosBancarios,
    marcarConciliado,
    obtenerEstadisticasBancarias,
    limpiarError
  } = useCajaBancos();

  const [tabActiva, setTabActiva] = useState('movimientos');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState('');
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [mostrarNuevaConciliacion, setMostrarNuevaConciliacion] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    saldoNeto: 0,
    movimientosPendientes: 0,
    porcentajeConciliado: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticasBancarias('mes');
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

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

  const handleMarcarConciliado = async (movimientoId: string) => {
    try {
      await marcarConciliado(movimientoId);
      cargarEstadisticas();
    } catch (error) {
      console.error('Error al marcar como conciliado:', error);
    }
  };

  const movimientosFiltrados = cuentaSeleccionada
    ? movimientosBancarios.filter(m => m.cuenta === cuentaSeleccionada)
    : movimientosBancarios;

  const metricas = [
    {
      id: 'ingresos-bancarios',
      title: 'Ingresos Bancarios',
      value: formatearMoneda(estadisticas.totalIngresos),
      subtitle: 'Este mes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      color: 'success' as const
    },
    {
      id: 'egresos-bancarios',
      title: 'Egresos Bancarios',
      value: formatearMoneda(estadisticas.totalEgresos),
      subtitle: 'Este mes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      color: 'warning' as const
    },
    {
      id: 'pendientes',
      title: 'Movimientos Pendientes',
      value: estadisticas.movimientosPendientes.toString(),
      subtitle: 'Por conciliar',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'error' as const
    },
    {
      id: 'conciliado',
      title: 'Conciliación',
      value: `${estadisticas.porcentajeConciliado.toFixed(1)}%`,
      subtitle: 'Completado',
      trend: {
        value: 5.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: estadisticas.porcentajeConciliado >= 90 ? 'success' as const : 'warning' as const
    }
  ];

  const columnasMovimientos = [
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
      key: 'banco',
      label: 'Banco',
      render: (banco: string, row: MovimientoBancario) => (
        <div>
          <div className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {banco}
          </div>
          <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {row.cuenta}
          </div>
        </div>
      )
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (concepto: string, row: MovimientoBancario) => (
        <div>
          <div className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {concepto}
          </div>
          {row.referencia && (
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Ref: {row.referencia}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (tipo: MovimientoBancario['tipo']) => (
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
      key: 'monto',
      label: 'Monto',
      align: 'right' as const,
      render: (monto: number, row: MovimientoBancario) => (
        <span className={`${ds.typography.body} font-semibold ${
          row.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.tipo === 'ingreso' ? '+' : '-'}{formatearMoneda(monto)}
        </span>
      )
    },
    {
      key: 'conciliado',
      label: 'Estado',
      render: (conciliado: boolean, row: MovimientoBancario) => (
        <div className="flex items-center gap-2">
          <span className={`${ds.badge.base} ${
            conciliado ? ds.badge.success : ds.badge.warning
          }`}>
            {conciliado ? 'Conciliado' : 'Pendiente'}
          </span>
          {row.fechaConciliacion && (
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {formatearFecha(row.fechaConciliacion)}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: MovimientoBancario) => (
        <div className="flex items-center gap-2">
          {!row.conciliado && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleMarcarConciliado(row.id)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
        </div>
      )
    }
  ];

  const columnasConciliaciones = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha: Date) => formatearFecha(fecha)
    },
    {
      key: 'banco',
      label: 'Banco',
      render: (banco: string, row: ConciliacionType) => (
        <div>
          <div className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {banco}
          </div>
          <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {row.cuenta}
          </div>
        </div>
      )
    },
    {
      key: 'saldoInicial',
      label: 'Saldo Inicial',
      align: 'right' as const,
      render: (saldo: number) => formatearMoneda(saldo)
    },
    {
      key: 'saldoFinal',
      label: 'Saldo Final',
      align: 'right' as const,
      render: (saldo: number) => formatearMoneda(saldo)
    },
    {
      key: 'movimientosConciliados',
      label: 'Conciliados',
      align: 'center' as const,
      render: (movimientos: string[]) => movimientos.length
    },
    {
      key: 'movimientosPendientes',
      label: 'Pendientes',
      align: 'center' as const,
      render: (movimientos: string[]) => movimientos.length
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: ConciliacionType['estado']) => (
        <span className={`${ds.badge.base} ${
          estado === 'completada' ? ds.badge.success :
          estado === 'revisada' ? ds.badge.info :
          ds.badge.warning
        }`}>
          {estado}
        </span>
      )
    }
  ];

  const tabs = [
    {
      id: 'movimientos',
      label: 'Movimientos Bancarios',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      id: 'conciliaciones',
      label: 'Conciliaciones',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Error al cargar datos bancarios
          </h3>
          <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            {error}
          </p>
          <Button onClick={limpiarError} variant="primary">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Conciliación Bancaria
          </h1>
          <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Gestión y conciliación de movimientos bancarios
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setMostrarImportar(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Importar Movimientos
          </Button>
          <Button
            variant="primary"
            onClick={() => setMostrarNuevaConciliacion(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Conciliación
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Select
            label="Cuenta Bancaria"
            value={cuentaSeleccionada}
            onChange={setCuentaSeleccionada}
            options={[
              { value: '', label: 'Todas las cuentas' },
              ...cuentasBancarias.map(cuenta => ({
                value: cuenta.numeroCuenta,
                label: `${cuenta.banco} - ${cuenta.numeroCuenta}`
              }))
            ]}
          />
          <Button
            variant="ghost"
            onClick={() => cargarMovimientosBancarios()}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Contenido principal */}
      <Card>
        <div className="p-6">
          <Tabs
            items={tabs}
            activeTab={tabActiva}
            onTabChange={setTabActiva}
          />
          
          <div className="mt-6">
            {tabActiva === 'movimientos' && (
              <Table
                data={movimientosFiltrados}
                columns={columnasMovimientos}
                loading={loading}
                emptyMessage="No hay movimientos bancarios registrados"
              />
            )}
            
            {tabActiva === 'conciliaciones' && (
              <Table
                data={conciliaciones}
                columns={columnasConciliaciones}
                loading={loading}
                emptyMessage="No hay conciliaciones registradas"
              />
            )}
          </div>
        </div>
      </Card>

      {/* Modales */}
      {mostrarImportar && (
        <ImportarMovimientosModal
          onClose={() => setMostrarImportar(false)}
          onImportComplete={() => {
            cargarMovimientosBancarios();
            cargarEstadisticas();
          }}
        />
      )}

      {mostrarNuevaConciliacion && (
        <NuevaConciliacionModal
          onClose={() => setMostrarNuevaConciliacion(false)}
          cuentasBancarias={cuentasBancarias}
          onConciliacionCreada={() => {
            cargarEstadisticas();
          }}
        />
      )}
    </div>
  );
};