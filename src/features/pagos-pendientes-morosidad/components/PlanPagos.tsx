/**
 * PlanPagos.tsx
 * 
 * Componente para crear y gestionar planes de pago de clientes morosos.
 * Este componente se muestra en el tab "Planes de Pago" de la página principal
 * de Pagos Pendientes & Morosidad.
 * 
 * Funcionalidades:
 * - Listar todos los planes de pago existentes (por cliente o globalmente)
 * - Crear nuevos planes de pago (importe total, número de cuotas, fechas aproximadas)
 * - Mostrar las cuotas generadas (CuotaPlanPago) con su estado
 * - Mostrar el estado del plan (activo, completado, incumplido, renegociado, cancelado)
 * - Visualización de cuotas en formato calendario/lista con estados (pendiente/pagada/vencida)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal, Input, Textarea, Table, TableColumn, Select } from '../../../components/componentsreutilizables';
import { PlanPago, CuotaPlanPago, PagoPendiente, EstadoCuotaPlanPago, MetodoPago, EstadoPlanPagoGeneral } from '../types';
import { planesPagoAPI } from '../api/planesPago';
import { morosidadAPI } from '../api/morosidad';
import { Plus, Calendar, Trash2, Search, Filter, X, Eye, Clock, CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface PlanPagosProps {
  onRefresh?: () => void;
}

export const PlanPagos: React.FC<PlanPagosProps> = ({ onRefresh }) => {
  const [planes, setPlanes] = useState<PlanPago[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanPago | null>(null);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  // Filtros
  const [filtroCliente, setFiltroCliente] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para crear nuevo plan
  const [nuevoPlan, setNuevoPlan] = useState({
    importeTotal: 0,
    numeroCuotas: 2,
    fechaInicio: new Date().toISOString().split('T')[0],
    notas: '',
    clienteId: '',
    clienteNombre: ''
  });

  useEffect(() => {
    cargarDatos();
    // Actualizar cuotas vencidas periódicamente
    const interval = setInterval(() => {
      planesPagoAPI.actualizarCuotasVencidas();
      cargarDatos();
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [planesData, pagosData] = await Promise.all([
        planesPagoAPI.obtenerTodosPlanes(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setPlanes(planesData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de clientes
  const clientesUnicos = useMemo(() => {
    const clientes = new Map<string, string>();
    planes.forEach(plan => {
      if (plan.clienteId && plan.clienteNombre) {
        clientes.set(plan.clienteId, plan.clienteNombre);
      }
    });
    return Array.from(clientes.entries()).map(([id, nombre]) => ({ value: id, label: nombre }));
  }, [planes]);

  // Filtrar planes
  const planesFiltrados = useMemo(() => {
    let filtrados = [...planes];

    // Filtro por cliente
    if (filtroCliente !== 'todos') {
      filtrados = filtrados.filter(plan => plan.clienteId === filtroCliente);
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(plan => {
        const estado = plan.estadoPlan || plan.estado;
        return estado === filtroEstado;
      });
    }

    // Búsqueda por nombre de cliente
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(plan => 
        plan.clienteNombre?.toLowerCase().includes(busquedaLower)
      );
    }

    return filtrados;
  }, [planes, filtroCliente, filtroEstado, busqueda]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatearFechaCorta = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleAbrirModalCrear = (pago?: PagoPendiente) => {
    if (pago) {
      setPagoSeleccionado(pago);
      setNuevoPlan({
        importeTotal: pago.montoPendiente,
        numeroCuotas: 2,
        fechaInicio: new Date().toISOString().split('T')[0],
        notas: '',
        clienteId: pago.cliente.id,
        clienteNombre: pago.cliente.nombre
      });
    } else {
      setPagoSeleccionado(null);
      setNuevoPlan({
        importeTotal: 0,
        numeroCuotas: 2,
        fechaInicio: new Date().toISOString().split('T')[0],
        notas: '',
        clienteId: '',
        clienteNombre: ''
      });
    }
    setMostrarModalCrear(true);
  };

  const calcularFechasCuotas = (fechaInicio: string, numeroCuotas: number): Date[] => {
    const fechas: Date[] = [];
    const inicio = new Date(fechaInicio);
    
    for (let i = 0; i < numeroCuotas; i++) {
      const fecha = new Date(inicio);
      fecha.setMonth(fecha.getMonth() + i);
      fechas.push(fecha);
    }
    
    return fechas;
  };

  const handleCrearPlan = async () => {
    if (!nuevoPlan.clienteId || nuevoPlan.importeTotal <= 0 || nuevoPlan.numeroCuotas < 1) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const resultado = await planesPagoAPI.crearPlanPago({
        clienteId: nuevoPlan.clienteId,
        importeTotal: nuevoPlan.importeTotal,
        numeroCuotas: nuevoPlan.numeroCuotas,
        fechaInicio: new Date(nuevoPlan.fechaInicio),
        clienteNombre: nuevoPlan.clienteNombre,
        notas: nuevoPlan.notas,
        creadoPor: 'usuario1' // TODO: obtener del contexto de auth
      });
      
      setMostrarModalCrear(false);
      setPagoSeleccionado(null);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al crear plan de pago:', error);
      alert('Error al crear el plan de pago');
    }
  };

  const obtenerBadgeEstadoPlan = (estado: string | undefined): { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' } => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      activo: { label: 'Activo', variant: 'blue' },
      completado: { label: 'Completado', variant: 'green' },
      incumplido: { label: 'Incumplido', variant: 'red' },
      renegociado: { label: 'Renegociado', variant: 'yellow' },
      cancelado: { label: 'Cancelado', variant: 'gray' },
      vencido: { label: 'Vencido', variant: 'red' }
    };
    
    return estados[estado || 'activo'] || estados.activo;
  };

  const obtenerBadgeEstadoCuota = (estado: string | undefined): { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red'; icon: React.ReactNode } => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red'; icon: React.ReactNode }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow', icon: <Clock className="w-3 h-3" /> },
      pagada: { label: 'Pagada', variant: 'green', icon: <CheckCircle2 className="w-3 h-3" /> },
      vencida: { label: 'Vencida', variant: 'red', icon: <AlertCircle className="w-3 h-3" /> },
      parcialmentePagada: { label: 'Parcial', variant: 'blue', icon: <RefreshCw className="w-3 h-3" /> },
      cancelada: { label: 'Cancelada', variant: 'gray', icon: <XCircle className="w-3 h-3" /> }
    };
    
    return estados[estado || 'pendiente'] || estados.pendiente;
  };

  const esCuotaVencida = (cuota: CuotaPlanPago): boolean => {
    if (cuota.estadoCuota === 'pagada') return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(cuota.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    return fechaVencimiento < hoy;
  };

  const columnas: TableColumn<PlanPago>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div className="font-medium">{row.clienteNombre || 'Sin nombre'}</div>
      )
    },
    {
      key: 'montoTotal',
      label: 'Monto Total',
      render: (_, row) => (
        <div className="font-semibold">{formatearMoneda(row.montoTotal || row.importeTotal || 0)}</div>
      )
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (_, row) => {
        const montoTotal = row.montoTotal || row.importeTotal || 0;
        const montoPagado = row.montoPagado || 0;
        const porcentaje = montoTotal > 0 ? (montoPagado / montoTotal) * 100 : 0;
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {formatearMoneda(montoPagado)} / {formatearMoneda(montoTotal)}
              </span>
              <span className="text-sm font-medium text-gray-900">{porcentaje.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(porcentaje, 100)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'cuotas',
      label: 'Cuotas',
      render: (_, row) => {
        const cuotas = row.cuotas || [];
        const pagadas = cuotas.filter(c => c.estadoCuota === 'pagada' || c.estado === 'pagada').length;
        const vencidas = cuotas.filter(c => esCuotaVencida(c)).length;
        return (
          <div className="text-sm">
            <div>
              <span className="font-medium text-green-600">{pagadas}</span>
              <span className="text-gray-500"> / {row.numeroCuotas}</span>
            </div>
            {vencidas > 0 && (
              <div className="text-xs text-red-600 mt-1">
                {vencidas} vencida{vencidas > 1 ? 's' : ''}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => {
        const estadoInfo = obtenerBadgeEstadoPlan(row.estadoPlan || row.estado);
        return <Badge variant={estadoInfo.variant} size="sm">{estadoInfo.label}</Badge>;
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPlanSeleccionado(row);
            setMostrarModalDetalle(true);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver Detalle
        </Button>
      )
    }
  ];

  const pagosSinPlan = pagos.filter(pago => {
    return !planes.some(plan => plan.pagoPendienteId === pago.id);
  });

  // Componente para mostrar cuotas en formato calendario/lista
  const CuotasCalendario: React.FC<{ cuotas: CuotaPlanPago[] }> = ({ cuotas }) => {
    const cuotasOrdenadas = [...cuotas].sort((a, b) => 
      new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
    );

    return (
      <div className="space-y-2">
        {cuotasOrdenadas.map((cuota) => {
          const estadoInfo = obtenerBadgeEstadoCuota(cuota.estadoCuota || cuota.estado);
          const vencida = esCuotaVencida(cuota);
          const importe = cuota.importeCuota || cuota.monto || 0;
          const pagado = cuota.importePagado || 0;

          return (
            <Card 
              key={cuota.id} 
              className={`p-3 transition-all ${
                vencida && cuota.estadoCuota !== 'pagada' 
                  ? 'ring-2 ring-red-200 bg-red-50' 
                  : cuota.estadoCuota === 'pagada'
                  ? 'bg-green-50 ring-1 ring-green-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {estadoInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        Cuota {cuota.numeroCuota || 'N/A'}
                      </span>
                      <Badge variant={estadoInfo.variant} size="sm">
                        {estadoInfo.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Vencimiento: </span>
                        <span className={`font-medium ${
                          vencida && cuota.estadoCuota !== 'pagada' ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {formatearFechaCorta(cuota.fechaVencimiento)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monto: </span>
                        <span className="font-medium text-gray-900">
                          {formatearMoneda(importe)}
                        </span>
                      </div>
                      {cuota.fechaPago && (
                        <div>
                          <span className="text-gray-600">Pagado: </span>
                          <span className="font-medium text-green-600">
                            {formatearFechaCorta(cuota.fechaPago)}
                          </span>
                        </div>
                      )}
                      {pagado > 0 && pagado < importe && (
                        <div>
                          <span className="text-gray-600">Parcial: </span>
                          <span className="font-medium text-blue-600">
                            {formatearMoneda(pagado)}
                          </span>
                        </div>
                      )}
                    </div>
                    {vencida && cuota.estadoCuota !== 'pagada' && (
                      <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Cuota vencida
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Planes de Pago
          </h2>
          <p className="text-gray-600">
            Crea y gestiona planes de pago para clientes morosos. Visualiza el estado de cada cuota y el progreso del plan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={cargarDatos}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAbrirModalCrear()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Plan de Pago
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Buscar cliente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Nombre del cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Filtrar por cliente</label>
            <Select
              options={[
                { value: 'todos', label: 'Todos los clientes' },
                ...clientesUnicos
              ]}
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Filtrar por estado</label>
            <Select
              options={[
                { value: 'todos', label: 'Todos los estados' },
                { value: 'activo', label: 'Activo' },
                { value: 'completado', label: 'Completado' },
                { value: 'incumplido', label: 'Incumplido' },
                { value: 'renegociado', label: 'Renegociado' },
                { value: 'cancelado', label: 'Cancelado' }
              ]}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Lista de planes */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando planes de pago...</div>
        </div>
      ) : planesFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {planes.length === 0 
              ? 'No hay planes de pago creados'
              : 'No se encontraron planes con los filtros seleccionados'}
          </p>
          {planes.length === 0 && (
            <Button
              variant="primary"
              onClick={() => handleAbrirModalCrear()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Plan
            </Button>
          )}
        </Card>
      ) : (
        <Table
          data={planesFiltrados}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay planes de pago"
        />
      )}

      {/* Modal para crear plan de pago */}
      <Modal
        isOpen={mostrarModalCrear}
        onClose={() => {
          setMostrarModalCrear(false);
          setPagoSeleccionado(null);
        }}
        title="Crear Plan de Pago"
        size="xl"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalCrear(false);
                setPagoSeleccionado(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearPlan}
              disabled={!nuevoPlan.clienteId || nuevoPlan.importeTotal <= 0 || nuevoPlan.numeroCuotas < 1}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Plan
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {pagoSeleccionado ? (
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm text-gray-600">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                Monto pendiente: {formatearMoneda(pagoSeleccionado.montoPendiente)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Cliente</label>
                <Select
                  options={[
                    { value: '', label: 'Seleccionar cliente...' },
                    ...pagos.map(p => ({
                      value: p.cliente.id,
                      label: `${p.cliente.nombre} - ${formatearMoneda(p.montoPendiente)} pendiente`
                    }))
                  ]}
                  value={nuevoPlan.clienteId}
                  onChange={(e) => {
                    const pago = pagos.find(p => p.cliente.id === e.target.value);
                    setNuevoPlan({
                      ...nuevoPlan,
                      clienteId: e.target.value,
                      clienteNombre: pago?.cliente.nombre || '',
                      importeTotal: pago?.montoPendiente || 0
                    });
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Importe Total</label>
              <Input
                type="number"
                value={nuevoPlan.importeTotal || ''}
                onChange={(e) => setNuevoPlan({ ...nuevoPlan, importeTotal: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                disabled={!!pagoSeleccionado}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Número de Cuotas</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setNuevoPlan({ ...nuevoPlan, numeroCuotas: Math.max(1, nuevoPlan.numeroCuotas - 1) })}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={nuevoPlan.numeroCuotas}
                  onChange={(e) => setNuevoPlan({ ...nuevoPlan, numeroCuotas: Math.max(1, Math.min(12, parseInt(e.target.value) || 1)) })}
                  className="text-center"
                  min={1}
                  max={12}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setNuevoPlan({ ...nuevoPlan, numeroCuotas: Math.min(12, nuevoPlan.numeroCuotas + 1) })}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha de Inicio (aproximada)</label>
            <Input
              type="date"
              value={nuevoPlan.fechaInicio}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, fechaInicio: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notas (opcional)</label>
            <Textarea
              value={nuevoPlan.notas}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, notas: e.target.value })}
              placeholder="Notas sobre el plan de pago..."
              rows={3}
            />
          </div>

          {/* Vista previa de cuotas */}
          {nuevoPlan.importeTotal > 0 && nuevoPlan.numeroCuotas > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Vista previa de cuotas generadas:</h4>
              <div className="space-y-2">
                {calcularFechasCuotas(nuevoPlan.fechaInicio, nuevoPlan.numeroCuotas).map((fecha, index) => {
                  const importeCuota = Math.floor(nuevoPlan.importeTotal / nuevoPlan.numeroCuotas);
                  const diferencia = nuevoPlan.importeTotal - (importeCuota * nuevoPlan.numeroCuotas);
                  const monto = index === nuevoPlan.numeroCuotas - 1 ? importeCuota + diferencia : importeCuota;
                  
                  return (
                    <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                      <span className="text-gray-700">Cuota {index + 1}</span>
                      <span className="font-medium text-gray-900">{formatearMoneda(monto)}</span>
                      <span className="text-gray-600">{formatearFechaCorta(fecha)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-300 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatearMoneda(nuevoPlan.importeTotal)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de detalle del plan */}
      <Modal
        isOpen={mostrarModalDetalle}
        onClose={() => {
          setMostrarModalDetalle(false);
          setPlanSeleccionado(null);
        }}
        title="Detalle del Plan de Pago"
        size="xl"
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setMostrarModalDetalle(false);
              setPlanSeleccionado(null);
            }}
          >
            Cerrar
          </Button>
        }
      >
        {planSeleccionado && (
          <div className="space-y-6">
            {/* Información general */}
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Cliente</p>
                  <p className="text-sm font-medium text-gray-900">{planSeleccionado.clienteNombre || 'Sin nombre'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Estado del Plan</p>
                  <div className="mt-1">
                    {(() => {
                      const estadoInfo = obtenerBadgeEstadoPlan(planSeleccionado.estadoPlan || planSeleccionado.estado);
                      return <Badge variant={estadoInfo.variant} size="sm">{estadoInfo.label}</Badge>;
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Monto Total</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(planSeleccionado.montoTotal || planSeleccionado.importeTotal || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Progreso</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatearMoneda(planSeleccionado.montoPagado || 0)} / {formatearMoneda(planSeleccionado.montoTotal || planSeleccionado.importeTotal || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cuotas</p>
                  <p className="text-sm font-medium text-gray-900">
                    {planSeleccionado.cuotasPagadas || 0} / {planSeleccionado.numeroCuotas} pagadas
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Fecha de Inicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatearFecha(planSeleccionado.fechaInicio)}
                  </p>
                </div>
              </div>
            </div>

            {/* Calendario/Lista de cuotas */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Calendario de Cuotas:</h4>
              {planSeleccionado.cuotas && planSeleccionado.cuotas.length > 0 ? (
                <CuotasCalendario cuotas={planSeleccionado.cuotas} />
              ) : (
                <Card className="p-4 text-center text-gray-500">
                  No hay cuotas registradas
                </Card>
              )}
            </div>

            {/* Notas */}
            {planSeleccionado.notas && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Notas:</p>
                <p className="text-sm text-gray-600">{planSeleccionado.notas}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
