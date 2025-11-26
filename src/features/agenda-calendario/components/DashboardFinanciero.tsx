import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, MetricCards, Table, Button, Input, Select, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  ResumenFinanciero,
  ProyeccionFinanciera,
  AlertaPagoPendiente,
  PagoSesion,
  FiltrosFinancieros,
  EstadisticasFinancierasCliente,
  EstadoPago,
  TipoCita,
} from '../types';
import {
  getResumenFinanciero,
  getProyeccionFinanciera,
  getAlertasPagosPendientes,
  getPagosSesiones,
  getEstadisticasFinancierasCliente,
  marcarPagoComoPagado,
} from '../api/finanzas';
import { ClienteAutocomplete } from './ClienteAutocomplete';
import { useAuth } from '../../../context/AuthContext';

export const DashboardFinanciero: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null);
  const [proyeccion, setProyeccion] = useState<ProyeccionFinanciera | null>(null);
  const [alertas, setAlertas] = useState<AlertaPagoPendiente[]>([]);
  const [pagos, setPagos] = useState<PagoSesion[]>([]);
  const [estadisticasClientes, setEstadisticasClientes] = useState<EstadisticasFinancierasCliente[]>([]);
  const [filtros, setFiltros] = useState<FiltrosFinancieros>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoSesion | null>(null);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia' | 'otro'>('efectivo');
  const [notasPago, setNotasPago] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resumenData, proyeccionData, alertasData, pagosData, estadisticasData] = await Promise.all([
        getResumenFinanciero(undefined, undefined, user?.id),
        getProyeccionFinanciera(user?.id),
        getAlertasPagosPendientes(user?.id),
        getPagosSesiones(filtros, user?.id),
        getEstadisticasFinancierasCliente(filtros.clienteId, user?.id),
      ]);

      setResumen(resumenData);
      setProyeccion(proyeccionData);
      setAlertas(alertasData);
      setPagos(pagosData);
      setEstadisticasClientes(estadisticasData);
    } catch (error) {
      console.error('Error cargando datos financieros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarPago = async () => {
    if (!pagoSeleccionado) return;

    try {
      await marcarPagoComoPagado(pagoSeleccionado.id, metodoPago, notasPago, user?.id);
      setMostrarModalPago(false);
      setPagoSeleccionado(null);
      setMetodoPago('efectivo');
      setNotasPago('');
      cargarDatos();
    } catch (error) {
      console.error('Error marcando pago:', error);
    }
  };

  const metricasData = [
    {
      id: 'ingresos',
      title: 'Ingresos del Mes',
      value: resumen ? `€${resumen.ingresosTotales.toFixed(2)}` : '€0.00',
      subtitle: resumen?.ingresosPendientes ? `€${resumen.ingresosPendientes.toFixed(2)} pendientes` : '',
      trend: resumen?.crecimientoPorcentaje ? {
        value: Math.abs(resumen.crecimientoPorcentaje),
        direction: resumen.crecimientoPorcentaje > 0 ? 'up' : 'down',
        label: `vs mes anterior`,
      } : undefined,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success' as const,
      loading,
    },
    {
      id: 'sesiones-cobradas',
      title: 'Sesiones Cobradas',
      value: resumen?.sesionesCobradas || 0,
      subtitle: `${resumen?.sesionesPendientes || 0} pendientes`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'success' as const,
      loading,
    },
    {
      id: 'proyeccion',
      title: 'Proyección Mensual',
      value: proyeccion ? `€${proyeccion.ingresosProyectados.toFixed(2)}` : '€0.00',
      subtitle: `${proyeccion?.diasRestantes || 0} días restantes`,
      trend: proyeccion ? {
        value: 0,
        direction: proyeccion.tendencia === 'subiendo' ? 'up' : proyeccion.tendencia === 'bajando' ? 'down' : 'neutral',
        label: proyeccion.tendencia,
      } : undefined,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const,
      loading,
    },
    {
      id: 'alertas',
      title: 'Pagos Pendientes',
      value: alertas.length,
      subtitle: `${alertas.filter(a => a.prioridad === 'critica').length} críticos`,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: alertas.length > 0 ? 'error' as const : 'success' as const,
      loading,
    },
  ];

  const columnasPagos = [
    {
      key: 'fechaSesion',
      label: 'Fecha Sesión',
      render: (pago: PagoSesion) => new Date(pago.fechaSesion).toLocaleDateString('es-ES'),
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (pago: PagoSesion) => pago.clienteNombre,
    },
    {
      key: 'tipoSesion',
      label: 'Tipo',
      render: (pago: PagoSesion) => (
        <Badge variant="secondary">{pago.tipoSesion}</Badge>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (pago: PagoSesion) => `€${pago.monto.toFixed(2)}`,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (pago: PagoSesion) => {
        const estados = {
          pagado: { label: 'Pagado', variant: 'success' as const },
          pendiente: { label: 'Pendiente', variant: 'warning' as const },
          vencido: { label: 'Vencido', variant: 'error' as const },
          cancelado: { label: 'Cancelado', variant: 'secondary' as const },
        };
        const estado = estados[pago.estado];
        return <Badge variant={estado.variant}>{estado.label}</Badge>;
      },
    },
    {
      key: 'fechaPago',
      label: 'Fecha Pago',
      render: (pago: PagoSesion) => 
        pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-ES') : '-',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (pago: PagoSesion) => (
        pago.estado !== 'pagado' && pago.estado !== 'cancelado' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setPagoSeleccionado(pago);
              setMostrarModalPago(true);
            }}
          >
            Marcar Pagado
          </Button>
        ) : null
      ),
    },
  ];

  const columnasAlertas = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (alerta: AlertaPagoPendiente) => alerta.clienteNombre,
    },
    {
      key: 'fechaSesion',
      label: 'Fecha Sesión',
      render: (alerta: AlertaPagoPendiente) => new Date(alerta.fechaSesion).toLocaleDateString('es-ES'),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (alerta: AlertaPagoPendiente) => `€${alerta.monto.toFixed(2)}`,
    },
    {
      key: 'diasVencido',
      label: 'Días Vencido',
      render: (alerta: AlertaPagoPendiente) => alerta.diasVencido,
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (alerta: AlertaPagoPendiente) => {
        const prioridades = {
          critica: { label: 'Crítica', variant: 'error' as const },
          alta: { label: 'Alta', variant: 'error' as const },
          media: { label: 'Media', variant: 'warning' as const },
          baja: { label: 'Baja', variant: 'secondary' as const },
        };
        const prioridad = prioridades[alerta.prioridad];
        return <Badge variant={prioridad.variant}>{prioridad.label}</Badge>;
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (alerta: AlertaPagoPendiente) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            const pago = pagos.find(p => p.id === alerta.id);
            if (pago) {
              setPagoSeleccionado(pago);
              setMostrarModalPago(true);
            }
          }}
        >
          Marcar Pagado
        </Button>
      ),
    },
  ];

  const columnasEstadisticas = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (est: EstadisticasFinancierasCliente) => est.clienteNombre,
    },
    {
      key: 'totalIngresos',
      label: 'Total Ingresos',
      render: (est: EstadisticasFinancierasCliente) => `€${est.totalIngresos.toFixed(2)}`,
    },
    {
      key: 'sesionesPagadas',
      label: 'Sesiones Pagadas',
      render: (est: EstadisticasFinancierasCliente) => est.sesionesPagadas,
    },
    {
      key: 'sesionesPendientes',
      label: 'Sesiones Pendientes',
      render: (est: EstadisticasFinancierasCliente) => est.sesionesPendientes,
    },
    {
      key: 'montoPendiente',
      label: 'Monto Pendiente',
      render: (est: EstadisticasFinancierasCliente) => `€${est.montoPendiente.toFixed(2)}`,
    },
    {
      key: 'promedioSesion',
      label: 'Promedio/Sesión',
      render: (est: EstadisticasFinancierasCliente) => `€${est.promedioSesion.toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <MetricCards data={metricasData} columns={4} />

      {/* Proyección Mensual */}
      {proyeccion && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Proyección del Mes</h2>
              <div className="flex items-center gap-2">
                {proyeccion.tendencia === 'subiendo' && (
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                )}
                {proyeccion.tendencia === 'bajando' && (
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  proyeccion.tendencia === 'subiendo' ? 'text-green-600' : 
                  proyeccion.tendencia === 'bajando' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {proyeccion.tendencia}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ingresos Actuales</p>
                <p className="text-2xl font-bold text-gray-900">€{proyeccion.ingresosActuales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Proyección Total</p>
                <p className="text-2xl font-bold text-blue-600">€{proyeccion.ingresosProyectados.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sesiones Programadas</p>
                <p className="text-2xl font-bold text-gray-900">{proyeccion.sesionesProgramadas}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
            <Button
              variant="secondary"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
          {mostrarFiltros && (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente
                </label>
                <ClienteAutocomplete
                  value={filtros.clienteId || ''}
                  onChange={(id) => setFiltros({ ...filtros, clienteId: id || undefined })}
                  label=""
                  placeholder="Todos los clientes"
                  role="entrenador"
                  userId={user?.id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Pago
                </label>
                <Select
                  value={filtros.estadoPago || ''}
                  onChange={(e) => setFiltros({ 
                    ...filtros, 
                    estadoPago: e.target.value ? e.target.value as EstadoPago : undefined 
                  })}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'pagado', label: 'Pagado' },
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'vencido', label: 'Vencido' },
                    { value: 'cancelado', label: 'Cancelado' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={filtros.fechaInicio ? new Date(filtros.fechaInicio).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFiltros({ 
                    ...filtros, 
                    fechaInicio: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={filtros.fechaFin ? new Date(filtros.fechaFin).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFiltros({ 
                    ...filtros, 
                    fechaFin: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Alertas de Pagos Pendientes */}
      {alertas.length > 0 && (
        <Card className="bg-white shadow-sm border-l-4 border-red-500">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Alertas de Pagos Pendientes
              </h2>
              <Badge variant="error">{alertas.length} alertas</Badge>
            </div>
            <Table
              data={alertas}
              columns={columnasAlertas}
            />
          </div>
        </Card>
      )}

      {/* Pagos de Sesiones */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pagos de Sesiones</h2>
          <Table
            data={pagos}
            columns={columnasPagos}
          />
        </div>
      </Card>

      {/* Estadísticas por Cliente */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estadísticas por Cliente</h2>
          <Table
            data={estadisticasClientes}
            columns={columnasEstadisticas}
          />
        </div>
      </Card>

      {/* Modal para Marcar Pago */}
      <Modal
        isOpen={mostrarModalPago}
        onClose={() => {
          setMostrarModalPago(false);
          setPagoSeleccionado(null);
          setMetodoPago('efectivo');
          setNotasPago('');
        }}
        title="Marcar Pago como Pagado"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalPago(false);
                setPagoSeleccionado(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleMarcarPago}
            >
              Confirmar Pago
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="text-lg font-semibold">{pagoSeleccionado.clienteNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto</p>
              <p className="text-lg font-semibold">€{pagoSeleccionado.monto.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as any)}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'otro', label: 'Otro' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <Input
                value={notasPago}
                onChange={(e) => setNotasPago(e.target.value)}
                placeholder="Notas adicionales sobre el pago..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


