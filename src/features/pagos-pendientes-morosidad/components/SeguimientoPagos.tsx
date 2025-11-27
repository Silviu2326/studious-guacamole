import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { 
  PlanPago, 
  AccionCobro, 
  CuotaPlanPago, 
  PagoPendiente,
  EstadoPlanPagoGeneral,
  EstadoCuota
} from '../types';
import { planesPagoAPI } from '../api/planesPago';
import { accionesCobroAPI } from '../api/seguimiento';
import { morosidadAPI } from '../api/morosidad';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  FileText,
  XCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface SeguimientoPagosProps {
  onRefresh?: () => void;
}

/**
 * Vista centralizada de seguimiento de pagos parciales, compromisos de pago y alertas de incumplimiento.
 * 
 * Esta vista ayuda a priorizar acciones de cobro y complementa el dashboard general de morosidad.
 * Muestra para cada cliente con plan de pago o acciones recientes:
 * - Estado del plan de pago
 * - Últimas acciones de cobro realizadas
 * - Próximos vencimientos de cuotas
 * - Incumplimientos (cuotas vencidas, compromisos no cumplidos)
 * 
 * Los indicadores visuales de riesgo permiten identificar rápidamente los casos que requieren atención urgente.
 */
interface ClienteSeguimiento {
  clienteId: string;
  clienteNombre: string;
  planesPago: PlanPago[];
  accionesCobro: AccionCobro[];
  pagosPendientes: PagoPendiente[];
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  tieneIncumplimientos: boolean;
  cuotasVencidas: CuotaPlanPago[];
  proximasCuotas: CuotaPlanPago[];
  ultimaAccionCobro?: AccionCobro;
}

export const SeguimientoPagos: React.FC<SeguimientoPagosProps> = ({ onRefresh }) => {
  const [planesPago, setPlanesPago] = useState<PlanPago[]>([]);
  const [accionesCobro, setAccionesCobro] = useState<AccionCobro[]>([]);
  const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteSeguimiento | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [planes, pagos] = await Promise.all([
        planesPagoAPI.obtenerTodosPlanes(),
        morosidadAPI.obtenerPagosPendientes()
      ]);

      setPlanesPago(planes);
      setPagosPendientes(pagos);

      // Obtener acciones de cobro para todos los clientes únicos
      const clientesUnicos = new Set<string>();
      planes.forEach(plan => clientesUnicos.add(plan.clienteId));
      pagos.forEach(pago => clientesUnicos.add(pago.cliente.id));

      const accionesPromesas = Array.from(clientesUnicos).map(clienteId =>
        accionesCobroAPI.getAccionesCobroPorCliente(clienteId)
      );
      const accionesArrays = await Promise.all(accionesPromesas);
      setAccionesCobro(accionesArrays.flat());
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar datos por cliente y calcular métricas
  const clientesSeguimiento = useMemo<ClienteSeguimiento[]>(() => {
    const agrupados = new Map<string, ClienteSeguimiento>();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Procesar planes de pago
    planesPago.forEach(plan => {
      if (!agrupados.has(plan.clienteId)) {
        agrupados.set(plan.clienteId, {
          clienteId: plan.clienteId,
          clienteNombre: plan.clienteNombre || 'Cliente sin nombre',
          planesPago: [],
          accionesCobro: [],
          pagosPendientes: [],
          nivelRiesgo: 'bajo',
          tieneIncumplimientos: false,
          cuotasVencidas: [],
          proximasCuotas: []
        });
      }

      const cliente = agrupados.get(plan.clienteId)!;
      cliente.planesPago.push(plan);

      // Analizar cuotas
      if (plan.cuotas) {
        plan.cuotas.forEach(cuota => {
          const fechaVencimiento = new Date(cuota.fechaVencimiento);
          fechaVencimiento.setHours(0, 0, 0, 0);
          const diasVencida = Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));

          if (
            (cuota.estadoCuota === 'vencida' || cuota.estado === 'vencida') &&
            fechaVencimiento < hoy
          ) {
            cliente.cuotasVencidas.push(cuota);
            cliente.tieneIncumplimientos = true;
          } else if (
            (cuota.estadoCuota === 'pendiente' || cuota.estado === 'pendiente') &&
            fechaVencimiento >= hoy &&
            fechaVencimiento <= new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000) // Próximos 7 días
          ) {
            cliente.proximasCuotas.push(cuota);
          }
        });
      }

      // Determinar nivel de riesgo basado en estado del plan
      if (plan.estadoPlan === 'incumplido' || plan.estado === 'incumplido') {
        cliente.nivelRiesgo = 'critico';
        cliente.tieneIncumplimientos = true;
      } else if (cliente.cuotasVencidas.length > 0) {
        const maxDiasVencida = Math.max(
          ...cliente.cuotasVencidas.map(c => c.diasRetraso || 0)
        );
        if (maxDiasVencida > 30) {
          cliente.nivelRiesgo = 'critico';
        } else if (maxDiasVencida > 15) {
          cliente.nivelRiesgo = 'alto';
        } else {
          cliente.nivelRiesgo = 'medio';
        }
      }
    });

    // Procesar acciones de cobro
    accionesCobro.forEach(accion => {
      if (agrupados.has(accion.clienteId)) {
        const cliente = agrupados.get(accion.clienteId)!;
        cliente.accionesCobro.push(accion);
        
        // Actualizar última acción de cobro
        if (!cliente.ultimaAccionCobro || accion.fecha > cliente.ultimaAccionCobro.fecha) {
          cliente.ultimaAccionCobro = accion;
        }

        // Evaluar compromisos no cumplidos
        if (
          accion.resultado === 'compromisoPago' &&
          accion.fecha < new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000) // Compromiso de hace más de 7 días
        ) {
          // Verificar si hay pagos recientes (simplificado - en producción se verificaría contra pagos reales)
          const tienePagosRecientes = cliente.planesPago.some(plan =>
            plan.cuotas?.some(cuota =>
              cuota.fechaPago &&
              cuota.fechaPago > accion.fecha &&
              (cuota.estadoCuota === 'pagada' || cuota.estado === 'pagada')
            )
          );

          if (!tienePagosRecientes) {
            cliente.tieneIncumplimientos = true;
            if (cliente.nivelRiesgo === 'bajo') cliente.nivelRiesgo = 'medio';
          }
        }
      }
    });

    // Procesar pagos pendientes
    pagosPendientes.forEach(pago => {
      if (agrupados.has(pago.cliente.id)) {
        const cliente = agrupados.get(pago.cliente.id)!;
        cliente.pagosPendientes.push(pago);
        
        // Actualizar nivel de riesgo basado en pago pendiente
        if (pago.riesgo === 'critico' && cliente.nivelRiesgo !== 'critico') {
          cliente.nivelRiesgo = 'critico';
        } else if (pago.riesgo === 'alto' && cliente.nivelRiesgo === 'bajo') {
          cliente.nivelRiesgo = 'alto';
        } else if (pago.riesgo === 'medio' && cliente.nivelRiesgo === 'bajo') {
          cliente.nivelRiesgo = 'medio';
        }
      }
    });

    // Ordenar: primero los que tienen incumplimientos, luego por nivel de riesgo
    return Array.from(agrupados.values()).sort((a, b) => {
      if (a.tieneIncumplimientos !== b.tieneIncumplimientos) {
        return a.tieneIncumplimientos ? -1 : 1;
      }
      const ordenRiesgo = { critico: 0, alto: 1, medio: 2, bajo: 3 };
      return ordenRiesgo[a.nivelRiesgo] - ordenRiesgo[b.nivelRiesgo];
    });
  }, [planesPago, accionesCobro, pagosPendientes]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearFechaRelativa = (fecha: Date): string => {
    const hoy = new Date();
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays > 0) return `En ${diffDays} días`;
    return `Hace ${Math.abs(diffDays)} días`;
  };

  const obtenerBadgeRiesgo = (nivel: string) => {
    const estilos: Record<string, { variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red'; label: string }> = {
      bajo: { variant: 'green', label: 'Bajo Riesgo' },
      medio: { variant: 'yellow', label: 'Riesgo Medio' },
      alto: { variant: 'red', label: 'Alto Riesgo' },
      critico: { variant: 'red', label: 'Riesgo Crítico' }
    };
    const estilo = estilos[nivel] || estilos.bajo;
    return <Badge variant={estilo.variant} size="sm">{estilo.label}</Badge>;
  };

  const obtenerIconoTipoAccion = (tipo: string) => {
    const iconos: Record<string, React.ReactNode> = {
      llamada: <Phone className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      whatsapp: <MessageSquare className="w-4 h-4" />,
      visita: <MapPin className="w-4 h-4" />,
      carta: <FileText className="w-4 h-4" />,
      derivacionExterna: <AlertCircle className="w-4 h-4" />,
      suspensionServicio: <XCircle className="w-4 h-4" />
    };
    return iconos[tipo] || <MessageSquare className="w-4 h-4" />;
  };

  const obtenerBadgeResultado = (resultado: string) => {
    const resultados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      sinContacto: { label: 'Sin Contacto', variant: 'gray' },
      contactado: { label: 'Contactado', variant: 'blue' },
      compromisoPago: { label: 'Compromiso de Pago', variant: 'yellow' },
      pagoRealizado: { label: 'Pago Realizado', variant: 'green' },
      negativa: { label: 'Negativa', variant: 'red' },
      pendienteRespuesta: { label: 'Pendiente', variant: 'yellow' }
    };
    const resultadoInfo = resultados[resultado] || resultados.pendienteRespuesta;
    return (
      <Badge variant={resultadoInfo.variant} size="sm">
        {resultadoInfo.label}
      </Badge>
    );
  };

  const obtenerBadgeEstadoPlan = (estado: EstadoPlanPagoGeneral | string) => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      activo: { label: 'Activo', variant: 'blue' },
      completado: { label: 'Completado', variant: 'green' },
      incumplido: { label: 'Incumplido', variant: 'red' },
      renegociado: { label: 'Renegociado', variant: 'yellow' },
      cancelado: { label: 'Cancelado', variant: 'gray' }
    };
    const estadoInfo = estados[estado] || estados.activo;
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const handleVerDetalle = (cliente: ClienteSeguimiento) => {
    setClienteSeleccionado(cliente);
    setMostrarDetalle(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando seguimiento de pagos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Seguimiento de Pagos Parciales
          </h2>
          <p className="text-gray-600 max-w-3xl">
            Vista centralizada de pagos parciales, compromisos de pago y alertas de incumplimiento.
            Esta vista ayuda a priorizar acciones de cobro y complementa el dashboard general de morosidad.
          </p>
        </div>
        <Button variant="secondary" onClick={cargarDatos}>
          Actualizar
        </Button>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes con Plan</p>
              <p className="text-2xl font-bold text-gray-900">{clientesSeguimiento.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Incumplimientos</p>
              <p className="text-2xl font-bold text-red-600">
                {clientesSeguimiento.filter(c => c.tieneIncumplimientos).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cuotas Vencidas</p>
              <p className="text-2xl font-bold text-orange-600">
                {clientesSeguimiento.reduce((sum, c) => sum + c.cuotasVencidas.length, 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próximas Cuotas</p>
              <p className="text-2xl font-bold text-blue-600">
                {clientesSeguimiento.reduce((sum, c) => sum + c.proximasCuotas.length, 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Lista de clientes */}
      {clientesSeguimiento.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay clientes con planes de pago activos</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {clientesSeguimiento.map((cliente) => (
            <Card 
              key={cliente.clienteId} 
              className={`p-6 ${cliente.tieneIncumplimientos ? 'ring-2 ring-red-200 bg-red-50' : ''}`}
            >
              {/* Header del cliente */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cliente.clienteNombre}
                    </h3>
                    {obtenerBadgeRiesgo(cliente.nivelRiesgo)}
                    {cliente.tieneIncumplimientos && (
                      <Badge variant="red" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Incumplimiento
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {cliente.planesPago.length} plan{cliente.planesPago.length !== 1 ? 'es' : ''} de pago
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleVerDetalle(cliente)}
                >
                  Ver detalle
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Estado de planes */}
              <div className="space-y-2 mb-4">
                {cliente.planesPago.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Plan #{plan.id.slice(-6)}
                      </span>
                      {obtenerBadgeEstadoPlan(plan.estadoPlan || plan.estado)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>
                        {formatearMoneda(plan.montoPagado || 0)} / {formatearMoneda(plan.importeTotal || plan.montoTotal || 0)}
                      </span>
                      <span>
                        {plan.cuotasPagadas || 0}/{plan.numeroCuotas} cuotas
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alertas de incumplimientos */}
              {cliente.tieneIncumplimientos && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 mb-1">
                        Alertas de Incumplimiento
                      </p>
                      {cliente.cuotasVencidas.length > 0 && (
                        <p className="text-xs text-red-700">
                          {cliente.cuotasVencidas.length} cuota{cliente.cuotasVencidas.length !== 1 ? 's' : ''} vencida{cliente.cuotasVencidas.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Próximas cuotas */}
              {cliente.proximasCuotas.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Próximos Vencimientos</p>
                  <div className="space-y-1">
                    {cliente.proximasCuotas.slice(0, 2).map((cuota) => (
                      <div key={cuota.id} className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded">
                        <span className="text-gray-700">
                          Cuota #{cuota.numeroCuota} - {formatearMoneda(cuota.importeCuota || cuota.monto || 0)}
                        </span>
                        <span className="text-blue-700 font-medium">
                          {formatearFechaRelativa(cuota.fechaVencimiento)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Última acción de cobro */}
              {cliente.ultimaAccionCobro && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Última Acción de Cobro</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      {obtenerIconoTipoAccion(cliente.ultimaAccionCobro.tipoAccion)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {obtenerBadgeResultado(cliente.ultimaAccionCobro.resultado)}
                        <span className="text-xs text-gray-500">
                          {formatearFechaRelativa(cliente.ultimaAccionCobro.fecha)}
                        </span>
                      </div>
                      {cliente.ultimaAccionCobro.notas && (
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {cliente.ultimaAccionCobro.notas}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={mostrarDetalle}
        onClose={() => {
          setMostrarDetalle(false);
          setClienteSeleccionado(null);
        }}
        title={clienteSeleccionado ? `Detalle - ${clienteSeleccionado.clienteNombre}` : 'Detalle'}
        size="lg"
      >
        {clienteSeleccionado && (
          <div className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600 mb-1">Nivel de Riesgo</p>
                <div className="flex items-center gap-2">
                  {obtenerBadgeRiesgo(clienteSeleccionado.nivelRiesgo)}
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <p className="text-sm font-medium text-gray-900">
                  {clienteSeleccionado.tieneIncumplimientos ? 'Con Incumplimientos' : 'Al día'}
                </p>
              </Card>
            </div>

            {/* Planes de pago */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Planes de Pago</h4>
              <div className="space-y-3">
                {clienteSeleccionado.planesPago.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">Plan #{plan.id.slice(-6)}</p>
                        <p className="text-xs text-gray-600">
                          Creado: {plan.fechaCreacion ? formatearFecha(plan.fechaCreacion) : 'N/A'}
                        </p>
                      </div>
                      {obtenerBadgeEstadoPlan(plan.estadoPlan || plan.estado)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Monto Total</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatearMoneda(plan.importeTotal || plan.montoTotal || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Monto Pagado</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatearMoneda(plan.montoPagado || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Monto Pendiente</p>
                        <p className="text-sm font-medium text-red-600">
                          {formatearMoneda(plan.montoPendiente || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Progreso</p>
                        <p className="text-sm font-medium text-gray-900">
                          {plan.cuotasPagadas || 0}/{plan.numeroCuotas} cuotas
                        </p>
                      </div>
                    </div>
                    {plan.notas && (
                      <p className="text-xs text-gray-600 mt-2">{plan.notas}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Cuotas vencidas */}
            {clienteSeleccionado.cuotasVencidas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cuotas Vencidas ({clienteSeleccionado.cuotasVencidas.length})
                </h4>
                <div className="space-y-2">
                  {clienteSeleccionado.cuotasVencidas.map((cuota) => (
                    <div key={cuota.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            Cuota #{cuota.numeroCuota} - {formatearMoneda(cuota.importeCuota || cuota.monto || 0)}
                          </p>
                          <p className="text-xs text-red-700">
                            Vencida: {formatearFecha(cuota.fechaVencimiento)}
                            {cuota.diasRetraso && ` (${cuota.diasRetraso} días)`}
                          </p>
                        </div>
                        <Badge variant="red" size="sm">Vencida</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximas cuotas */}
            {clienteSeleccionado.proximasCuotas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Próximas Cuotas</h4>
                <div className="space-y-2">
                  {clienteSeleccionado.proximasCuotas.map((cuota) => (
                    <div key={cuota.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Cuota #{cuota.numeroCuota} - {formatearMoneda(cuota.importeCuota || cuota.monto || 0)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Vence: {formatearFecha(cuota.fechaVencimiento)} ({formatearFechaRelativa(cuota.fechaVencimiento)})
                          </p>
                        </div>
                        <Badge variant="blue" size="sm">Pendiente</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones de cobro */}
            {clienteSeleccionado.accionesCobro.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Acciones de Cobro ({clienteSeleccionado.accionesCobro.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {clienteSeleccionado.accionesCobro.slice(0, 10).map((accion) => (
                    <div key={accion.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {obtenerIconoTipoAccion(accion.tipoAccion)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {obtenerBadgeResultado(accion.resultado)}
                          <span className="text-xs text-gray-500">
                            {formatearFecha(accion.fecha)}
                          </span>
                        </div>
                        {accion.notas && (
                          <p className="text-xs text-gray-600">{accion.notas}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
