import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Input, Textarea, Table, TableColumn } from '../../../components/componentsreutilizables';
import { PlanPago, CuotaPlanPago, PagoPendiente, EstadoCuota, MetodoPago } from '../types';
import { planesPagoAPI } from '../api/planesPago';
import { morosidadAPI } from '../api/morosidad';
import { Plus, Calendar, Trash2 } from 'lucide-react';

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
  
  const [nuevoPlan, setNuevoPlan] = useState({
    numeroCuotas: 2,
    cuotas: [] as { monto: number; fechaVencimiento: string }[]
  });

  useEffect(() => {
    cargarDatos();
    // Actualizar cuotas vencidas al cargar
    planesPagoAPI.actualizarCuotasVencidas();
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

  const handleAbrirModalCrear = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setNuevoPlan({
      numeroCuotas: 2,
      cuotas: []
    });
    calcularCuotasIniciales(pago.montoPendiente, 2);
    setMostrarModalCrear(true);
  };

  const calcularCuotasIniciales = (montoTotal: number, numeroCuotas: number) => {
    const montoPorCuota = Math.floor(montoTotal / numeroCuotas);
    const resto = montoTotal - (montoPorCuota * numeroCuotas);
    
    const hoy = new Date();
    const cuotas: { monto: number; fechaVencimiento: string }[] = [];
    
    for (let i = 0; i < numeroCuotas; i++) {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() + i + 1);
      fecha.setDate(15); // Día 15 de cada mes
      
      cuotas.push({
        monto: i === 0 ? montoPorCuota + resto : montoPorCuota,
        fechaVencimiento: fecha.toISOString().split('T')[0]
      });
    }
    
    setNuevoPlan({
      numeroCuotas,
      cuotas
    });
  };

  const handleCambiarNumeroCuotas = (numero: number) => {
    if (numero < 1 || numero > 12) return;
    if (pagoSeleccionado) {
      calcularCuotasIniciales(pagoSeleccionado.montoPendiente, numero);
    }
  };

  const handleActualizarCuota = (index: number, campo: 'monto' | 'fechaVencimiento', valor: string | number) => {
    const nuevasCuotas = [...nuevoPlan.cuotas];
    nuevasCuotas[index] = {
      ...nuevasCuotas[index],
      [campo]: valor
    };
    setNuevoPlan({
      ...nuevoPlan,
      cuotas: nuevasCuotas
    });
  };

  const handleEliminarCuota = (index: number) => {
    const nuevasCuotas = nuevoPlan.cuotas.filter((_, i) => i !== index);
    setNuevoPlan({
      ...nuevoPlan,
      numeroCuotas: nuevasCuotas.length,
      cuotas: nuevasCuotas
    });
  };

  const handleAgregarCuota = () => {
    if (nuevoPlan.cuotas.length >= 12) return;
    
    const ultimaFecha = nuevoPlan.cuotas.length > 0
      ? new Date(nuevoPlan.cuotas[nuevoPlan.cuotas.length - 1].fechaVencimiento)
      : new Date();
    
    const nuevaFecha = new Date(ultimaFecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    
    setNuevoPlan({
      ...nuevoPlan,
      numeroCuotas: nuevoPlan.cuotas.length + 1,
      cuotas: [
        ...nuevoPlan.cuotas,
        {
          monto: 0,
          fechaVencimiento: nuevaFecha.toISOString().split('T')[0]
        }
      ]
    });
  };

  const handleCrearPlan = async () => {
    if (!pagoSeleccionado || nuevoPlan.cuotas.length === 0) return;
    
    const montoTotal = nuevoPlan.cuotas.reduce((sum, c) => sum + c.monto, 0);
    if (Math.abs(montoTotal - pagoSeleccionado.montoPendiente) > 100) {
      alert(`El monto total de las cuotas (${formatearMoneda(montoTotal)}) debe ser igual al monto pendiente (${formatearMoneda(pagoSeleccionado.montoPendiente)})`);
      return;
    }

    try {
      await planesPagoAPI.crearPlanPago({
        pagoPendienteId: pagoSeleccionado.id,
        clienteId: pagoSeleccionado.cliente.id,
        clienteNombre: pagoSeleccionado.cliente.nombre,
        montoTotal,
        cuotas: nuevoPlan.cuotas.map(c => ({
          monto: c.monto,
          fechaVencimiento: new Date(c.fechaVencimiento)
        })),
        notas: `Plan de pago acordado con el cliente debido a dificultades económicas`,
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

  const obtenerBadgeEstado = (estado: string) => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      activo: { label: 'Activo', variant: 'blue' },
      completado: { label: 'Completado', variant: 'green' },
      cancelado: { label: 'Cancelado', variant: 'gray' },
      vencido: { label: 'Vencido', variant: 'red' },
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      pagada: { label: 'Pagada', variant: 'green' },
      vencida: { label: 'Vencida', variant: 'red' }
    };
    
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const columnas: TableColumn<PlanPago>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div className="font-medium">{row.clienteNombre}</div>
      )
    },
    {
      key: 'montoTotal',
      label: 'Monto Total',
      render: (_, row) => (
        <div className="font-semibold">{formatearMoneda(row.montoTotal)}</div>
      )
    },
    {
      key: 'progreso',
      label: 'Progreso',
      render: (_, row) => {
        const porcentaje = (row.montoPagado / row.montoTotal) * 100;
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                {formatearMoneda(row.montoPagado)} / {formatearMoneda(row.montoTotal)}
              </span>
              <span className="text-sm font-medium text-gray-900">{porcentaje.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${porcentaje}%` }}
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
        const pagadas = row.cuotas.filter(c => c.estado === 'pagada').length;
        return (
          <div className="text-sm">
            <span className="font-medium text-green-600">{pagadas}</span>
            <span className="text-gray-500"> / {row.numeroCuotas}</span>
          </div>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estado)
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
          Ver Detalle
        </Button>
      )
    }
  ];

  const pagosSinPlan = pagos.filter(pago => {
    return !planes.some(plan => plan.pagoPendienteId === pago.id);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Planes de Pago
          </h2>
          <p className="text-gray-600">
            Acuerda planes de pago con clientes que tienen dificultades económicas
          </p>
        </div>
        {pagosSinPlan.length > 0 && (
          <Button
            variant="primary"
            onClick={() => {
              if (pagosSinPlan.length > 0) {
                handleAbrirModalCrear(pagosSinPlan[0]);
              }
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Plan de Pago
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando planes de pago...</div>
        </div>
      ) : planes.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hay planes de pago creados</p>
          {pagosSinPlan.length > 0 && (
            <Button
              variant="primary"
              onClick={() => {
                if (pagosSinPlan.length > 0) {
                  handleAbrirModalCrear(pagosSinPlan[0]);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Plan
            </Button>
          )}
        </Card>
      ) : (
        <Table
          data={planes}
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
              disabled={nuevoPlan.cuotas.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Plan
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm text-gray-600">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                Monto pendiente: {formatearMoneda(pagoSeleccionado.montoPendiente)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Número de cuotas:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCambiarNumeroCuotas(nuevoPlan.numeroCuotas - 1)}
                  disabled={nuevoPlan.numeroCuotas <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{nuevoPlan.numeroCuotas}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCambiarNumeroCuotas(nuevoPlan.numeroCuotas + 1)}
                  disabled={nuevoPlan.numeroCuotas >= 12}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Cuotas del plan:</h4>
              {nuevoPlan.cuotas.map((cuota, index) => {
                const montoTotal = nuevoPlan.cuotas.reduce((sum, c) => sum + c.monto, 0);
                const diferencia = pagoSeleccionado.montoPendiente - montoTotal;
                
                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Cuota {index + 1} - Monto
                          </label>
                          <Input
                            type="number"
                            value={cuota.monto || ''}
                            onChange={(e) => handleActualizarCuota(index, 'monto', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Fecha de vencimiento
                          </label>
                          <Input
                            type="date"
                            value={cuota.fechaVencimiento}
                            onChange={(e) => handleActualizarCuota(index, 'fechaVencimiento', e.target.value)}
                          />
                        </div>
                      </div>
                      {nuevoPlan.cuotas.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarCuota(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
              
              {nuevoPlan.cuotas.length < 12 && (
                <Button
                  variant="secondary"
                  onClick={handleAgregarCuota}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Cuota
                </Button>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Total cuotas:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatearMoneda(nuevoPlan.cuotas.reduce((sum, c) => sum + c.monto, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monto pendiente:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatearMoneda(pagoSeleccionado.montoPendiente)}
                  </span>
                </div>
                {Math.abs(nuevoPlan.cuotas.reduce((sum, c) => sum + c.monto, 0) - pagoSeleccionado.montoPendiente) > 100 && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ El total de las cuotas debe ser igual al monto pendiente
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de detalle del plan */}
      <Modal
        isOpen={mostrarModalDetalle}
        onClose={() => {
          setMostrarModalDetalle(false);
          setPlanSeleccionado(null);
        }}
        title="Detalle del Plan de Pago"
        size="lg"
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
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Cliente</p>
                  <p className="text-sm font-medium text-gray-900">{planSeleccionado.clienteNombre}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Estado</p>
                  <div className="mt-1">{obtenerBadgeEstado(planSeleccionado.estado)}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Monto Total</p>
                  <p className="text-sm font-semibold text-gray-900">{formatearMoneda(planSeleccionado.montoTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Progreso</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatearMoneda(planSeleccionado.montoPagado)} / {formatearMoneda(planSeleccionado.montoTotal)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Cuotas:</h4>
              <div className="space-y-2">
                {planSeleccionado.cuotas.map((cuota) => (
                  <Card key={cuota.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">Cuota {cuota.numeroCuota}</span>
                          {obtenerBadgeEstado(cuota.estado)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Monto: </span>
                            <span className="font-medium text-gray-900">{formatearMoneda(cuota.monto)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Vencimiento: </span>
                            <span className="font-medium text-gray-900">{formatearFecha(cuota.fechaVencimiento)}</span>
                          </div>
                          {cuota.fechaPago && (
                            <div>
                              <span className="text-gray-600">Fecha de pago: </span>
                              <span className="font-medium text-green-600">{formatearFecha(cuota.fechaPago)}</span>
                            </div>
                          )}
                          {cuota.metodoPago && (
                            <div>
                              <span className="text-gray-600">Método: </span>
                              <span className="font-medium text-gray-900 capitalize">{cuota.metodoPago}</span>
                            </div>
                          )}
                        </div>
                        {cuota.nota && (
                          <p className="text-xs text-gray-600 mt-2">{cuota.nota}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

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

