import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Table, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { MovimientoBancario, ConciliacionBancaria as ConciliacionType } from '../types';
import { ImportarMovimientosModal } from './ImportarMovimientosModal';
import { NuevaConciliacionModal } from './NuevaConciliacionModal';
import { ArrowUp, ArrowDown, Clock, CheckCircle, ArrowLeftRight, Upload, Plus, RefreshCw, AlertCircle } from 'lucide-react';

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
      icon: <ArrowUp className="w-6 h-6" />,
      color: 'success' as const
    },
    {
      id: 'egresos-bancarios',
      title: 'Egresos Bancarios',
      value: formatearMoneda(estadisticas.totalEgresos),
      subtitle: 'Este mes',
      icon: <ArrowDown className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'pendientes',
      title: 'Movimientos Pendientes',
      value: estadisticas.movimientosPendientes.toString(),
      subtitle: 'Por conciliar',
      icon: <Clock className="w-6 h-6" />,
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
      icon: <CheckCircle className="w-6 h-6" />,
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
              <CheckCircle className="w-4 h-4" />
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
      icon: <ArrowLeftRight className="w-4 h-4" />
    },
    {
      id: 'conciliaciones',
      label: 'Conciliaciones',
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar datos bancarios
        </h3>
        <p className="text-gray-600 mb-4">
          {error}
        </p>
        <Button onClick={limpiarError} variant="primary">
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setMostrarImportar(true)}
          >
            <Upload size={20} className="mr-2" />
            Importar Movimientos
          </Button>
          <Button
            variant="primary"
            onClick={() => setMostrarNuevaConciliacion(true)}
          >
            <Plus size={20} className="mr-2" />
            Nueva Conciliación
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <MetricCards data={metricas} />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1">
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
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => cargarMovimientosBancarios()}
              >
                <RefreshCw size={20} className="mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Contenido principal */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tabActiva === tab.id
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                {tab.icon && (
                  <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 pb-6">
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