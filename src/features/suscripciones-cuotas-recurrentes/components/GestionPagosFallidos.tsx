import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { 
  getPagosFallidos, 
  gestionarPagoFallido, 
  programarReintentoPago, 
  marcarCuotaComoIrrecuperable 
} from '../api/cuotas';
import { getSuscripciones, pausarAccesoPorPagoFallido, limitarAccesoPorPagoFallido } from '../api/suscripciones';
import { createAlert } from '../../../features/tareas-alertas/api/alerts';
import { PagoFallido, GestionarPagoFallidoRequest, Suscripcion } from '../types';
import { 
  AlertCircle, 
  RefreshCw, 
  CreditCard, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  Filter,
  TrendingDown,
  DollarSign,
  Clock,
  Pause,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestionPagosFallidosProps {
  onSuccess?: () => void;
}

interface KPIs {
  totalPagosFallidos: number;
  importeTotalEnRiesgo: number;
  porcentajeRecuperado: number;
  pagosCriticos: number;
}

export const GestionPagosFallidos: React.FC<GestionPagosFallidosProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [pagosFallidos, setPagosFallidos] = useState<PagoFallido[]>([]);
  const [pagosFallidosFiltrados, setPagosFallidosFiltrados] = useState<PagoFallido[]>([]);
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoFallido | null>(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState<GestionarPagoFallidoRequest['accion'] | 'programar_reintento' | 'pausar_servicio' | 'enviar_notificacion' | null>(null);
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState<'tarjeta' | 'transferencia' | 'domiciliacion' | ''>('');
  const [notas, setNotas] = useState('');
  const [procesando, setProcesando] = useState(false);
  
  // Filtros
  const [filtroPlan, setFiltroPlan] = useState<string>('todos');
  const [filtroAntiguedad, setFiltroAntiguedad] = useState<string>('todos');
  const [mostrarIrrecuperables, setMostrarIrrecuperables] = useState(true);
  const [fechaReintento, setFechaReintento] = useState<string>('');
  const [canalNotificacion, setCanalNotificacion] = useState<'email' | 'whatsapp'>('email');

  // Obtener planes únicos
  const planesUnicos = useMemo(() => {
    const planes = new Set<string>();
    suscripciones.forEach(s => {
      if (s.planId) planes.add(s.planId);
    });
    return Array.from(planes).sort();
  }, [suscripciones]);

  useEffect(() => {
    loadData();
    
    // Verificar cada 5 minutos
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    aplicarFiltros();
  }, [pagosFallidos, filtroPlan, filtroAntiguedad, mostrarIrrecuperables]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pagos, subs] = await Promise.all([
        getPagosFallidos(user?.id, {
          incluirIrrecuperables: mostrarIrrecuperables,
        }),
        getSuscripciones('entrenador', user?.id),
      ]);
      setPagosFallidos(pagos);
      setSuscripciones(subs);
      
      // Crear alertas automáticas para nuevos pagos fallidos
      for (const pago of pagos) {
        await createAlert({
          type: 'pago-pendiente',
          title: `Pago fallido: ${pago.clienteNombre}`,
          message: `El pago automático de ${pago.monto}€ de ${pago.clienteNombre} ha fallado. Motivo: ${pago.motivoFallo || 'Desconocido'}`,
          priority: 'alta',
          role: 'entrenador',
          actionUrl: `/suscripciones-cuotas-recurrentes?tab=pagos-fallidos`,
          relatedEntityId: pago.cuotaId,
          relatedEntityType: 'pago',
          userId: user?.id,
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...pagosFallidos];

    // Filtro por plan
    if (filtroPlan !== 'todos') {
      filtrados = filtrados.filter(pago => {
        const suscripcion = suscripciones.find(s => s.id === pago.suscripcionId);
        return suscripcion?.planId === filtroPlan;
      });
    }

    // Filtro por antigüedad
    if (filtroAntiguedad !== 'todos') {
      const hoy = new Date();
      const diasLimite = filtroAntiguedad === '7' ? 7 : filtroAntiguedad === '30' ? 30 : 90;
      const fechaLimite = new Date(hoy);
      fechaLimite.setDate(fechaLimite.getDate() - diasLimite);

      filtrados = filtrados.filter(pago => {
        const fechaFallo = new Date(pago.fechaIntento || pago.fechaVencimiento);
        return fechaFallo <= fechaLimite;
      });
    }

    setPagosFallidosFiltrados(filtrados);
  };

  // Calcular KPIs
  const kpis: KPIs = useMemo(() => {
    const total = pagosFallidosFiltrados.length;
    const importeTotal = pagosFallidosFiltrados.reduce((sum, p) => sum + p.monto, 0);
    
    // Simular recuperación (en producción vendría de la API)
    const diasRecuperacion = 30;
    const pagosRecuperados = pagosFallidosFiltrados.filter(p => {
      const fechaFallo = new Date(p.fechaIntento || p.fechaVencimiento);
      const diasDesdeFallo = Math.floor((Date.now() - fechaFallo.getTime()) / (1000 * 60 * 60 * 24));
      // Simular que algunos pagos se recuperaron
      return diasDesdeFallo <= diasRecuperacion && Math.random() > 0.6;
    }).length;
    
    const porcentajeRecuperado = total > 0 ? (pagosRecuperados / total) * 100 : 0;
    
    // Pagos críticos: más de 30 días sin resolver o más de 3 intentos
    const criticos = pagosFallidosFiltrados.filter(p => {
      const fechaFallo = new Date(p.fechaIntento || p.fechaVencimiento);
      const diasDesdeFallo = Math.floor((Date.now() - fechaFallo.getTime()) / (1000 * 60 * 60 * 24));
      return diasDesdeFallo > 30 || p.intentos > 3;
    }).length;

    return {
      totalPagosFallidos: total,
      importeTotalEnRiesgo: importeTotal,
      porcentajeRecuperado,
      pagosCriticos: criticos,
    };
  }, [pagosFallidosFiltrados]);

  const esCritico = (pago: PagoFallido): boolean => {
    const fechaFallo = new Date(pago.fechaIntento || pago.fechaVencimiento);
    const diasDesdeFallo = Math.floor((Date.now() - fechaFallo.getTime()) / (1000 * 60 * 60 * 24));
    return diasDesdeFallo > 30 || pago.intentos > 3;
  };

  const handleAbrirModal = (pago: PagoFallido, accion: string) => {
    setPagoSeleccionado(pago);
    setAccionSeleccionada(accion as any);
    setNuevoMetodoPago('');
    setNotas('');
    setFechaReintento('');
    setModalOpen(true);
  };

  const handleGestionarPago = async () => {
    if (!pagoSeleccionado || !accionSeleccionada) return;

    setProcesando(true);
    try {
      if (accionSeleccionada === 'programar_reintento') {
        await programarReintentoPago(
          pagoSeleccionado.cuotaId,
          fechaReintento || undefined
        );
      } else if (accionSeleccionada === 'pausar_servicio') {
        await pausarAccesoPorPagoFallido(
          pagoSeleccionado.suscripcionId,
          notas || `Acceso pausado por pago fallido - ${pagoSeleccionado.monto}€`
        );
      } else if (accionSeleccionada === 'enviar_notificacion') {
        // Simular envío de notificación
        if (canalNotificacion === 'email' && pagoSeleccionado.clienteEmail) {
          window.location.href = `mailto:${pagoSeleccionado.clienteEmail}?subject=Pago fallido - ${pagoSeleccionado.monto}€&body=Hola ${pagoSeleccionado.clienteNombre}, el pago automático de ${pagoSeleccionado.monto}€ ha fallado. Por favor, actualiza tu método de pago o contacta con nosotros.`;
        } else if (canalNotificacion === 'whatsapp' && pagoSeleccionado.clienteTelefono) {
          const mensaje = encodeURIComponent(`Hola ${pagoSeleccionado.clienteNombre}, el pago automático de ${pagoSeleccionado.monto}€ ha fallado. Por favor, actualiza tu método de pago o contacta con nosotros.`);
          window.open(`https://wa.me/${pagoSeleccionado.clienteTelefono.replace(/[^0-9]/g, '')}?text=${mensaje}`, '_blank');
        }
      } else {
        const request: GestionarPagoFallidoRequest = {
          cuotaId: pagoSeleccionado.cuotaId,
          accion: accionSeleccionada as any,
          nuevoMetodoPago: nuevoMetodoPago || undefined,
          notas: notas || undefined,
        };
        await gestionarPagoFallido(request);
      }
      
      setModalOpen(false);
      await loadData();
      onSuccess?.();
    } catch (error) {
      console.error('Error gestionando pago fallido:', error);
      alert('Error al gestionar el pago. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleMarcarIrrecuperable = async (pago: PagoFallido) => {
    if (!window.confirm(`¿Estás seguro de marcar este pago como irrecuperable?`)) return;
    
    try {
      await marcarCuotaComoIrrecuperable(pago.cuotaId, notas || 'Marcado manualmente como irrecuperable');
      await loadData();
      onSuccess?.();
    } catch (error) {
      console.error('Error marcando cuota como irrecuperable:', error);
      alert('Error al marcar la cuota. Por favor, intenta de nuevo.');
    }
  };

  const getMotivoFalloColor = (motivo?: string) => {
    if (!motivo) return 'error';
    if (motivo.toLowerCase().includes('expirada')) return 'warning';
    if (motivo.toLowerCase().includes('insuficientes')) return 'error';
    return 'error';
  };

  const getDiasDesdeFallo = (pago: PagoFallido): number => {
    const fechaFallo = new Date(pago.fechaIntento || pago.fechaVencimiento);
    return Math.floor((Date.now() - fechaFallo.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos fallidos...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos Fallidos</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.totalPagosFallidos}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Importe en Riesgo</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.importeTotalEnRiesgo.toFixed(2)}€</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">% Recuperado (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.porcentajeRecuperado.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos Críticos</p>
                <p className="text-2xl font-bold text-red-600">{kpis.pagosCriticos}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={filtroPlan}
                onChange={(e) => setFiltroPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los planes</option>
                {planesUnicos.map(planId => {
                  const suscripcion = suscripciones.find(s => s.planId === planId);
                  return (
                    <option key={planId} value={planId}>
                      {suscripcion?.planNombre || planId}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antigüedad
              </label>
              <select
                value={filtroAntiguedad}
                onChange={(e) => setFiltroAntiguedad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todas las fechas</option>
                <option value="7">Más de 7 días</option>
                <option value="30">Más de 30 días</option>
                <option value="90">Más de 90 días</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="mostrarIrrecuperables"
                checked={mostrarIrrecuperables}
                onChange={(e) => setMostrarIrrecuperables(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="mostrarIrrecuperables" className="text-sm text-gray-700">
                Mostrar irrecuperables
              </label>
            </div>
          </div>
        </Card>

        {/* Lista de pagos fallidos */}
        {pagosFallidosFiltrados.length === 0 ? (
          <Card className="bg-white shadow-sm p-6">
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay pagos fallidos
              </h3>
              <p className="text-gray-600">
                {pagosFallidos.length === 0 
                  ? 'Todos los pagos automáticos se están procesando correctamente.'
                  : 'No hay pagos que coincidan con los filtros seleccionados.'}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Gestión de Pagos Fallidos
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pagosFallidosFiltrados.length} pago(s) fallido(s) requieren atención
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {pagosFallidosFiltrados.map((pago) => {
                const critico = esCritico(pago);
                const diasDesdeFallo = getDiasDesdeFallo(pago);
                const suscripcion = suscripciones.find(s => s.id === pago.suscripcionId);
                
                return (
                  <div
                    key={pago.cuotaId}
                    className={`border rounded-lg p-4 transition-colors ${
                      critico
                        ? 'border-red-500 bg-red-50/50 hover:border-red-600'
                        : 'border-red-200 bg-red-50/30 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <h4 className="text-lg font-semibold text-gray-900">
                            {pago.clienteNombre}
                          </h4>
                          <Badge color={critico ? 'error' : 'warning'}>
                            {critico ? 'Crítico' : 'Pago Fallido'}
                          </Badge>
                          {suscripcion && (
                            <Badge color="secondary">
                              {suscripcion.planNombre}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>
                              Monto: <strong>{pago.monto}€</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Vencimiento: {new Date(pago.fechaVencimiento).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {diasDesdeFallo} día(s) desde el fallo
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span>
                              Intentos: <strong>{pago.intentos}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Badge color={getMotivoFalloColor(pago.motivoFallo)}>
                            {pago.motivoFallo || 'Motivo desconocido'}
                          </Badge>
                          {pago.metodoPago && (
                            <span className="ml-2 text-sm text-gray-600">
                              Método: {pago.metodoPago}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {pago.clienteEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{pago.clienteEmail}</span>
                            </div>
                          )}
                          {pago.clienteTelefono && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{pago.clienteTelefono}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAbrirModal(pago, 'programar_reintento')}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Programar Reintento
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAbrirModal(pago, 'enviar_notificacion')}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Notificar Cliente
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAbrirModal(pago, 'pausar_servicio')}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar Servicio
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAbrirModal(pago, 'actualizar_metodo')}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Actualizar Método
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAbrirModal(pago, 'marcar_resuelto')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar Resuelto
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarcarIrrecuperable(pago)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Marcar Irrecuperable
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Modal de acciones */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          accionSeleccionada === 'programar_reintento'
            ? 'Programar Reintento de Pago'
            : accionSeleccionada === 'pausar_servicio'
            ? 'Pausar Acceso al Servicio'
            : accionSeleccionada === 'enviar_notificacion'
            ? 'Enviar Notificación al Cliente'
            : accionSeleccionada === 'reintentar'
            ? 'Reintentar Pago'
            : accionSeleccionada === 'actualizar_metodo'
            ? 'Actualizar Método de Pago'
            : accionSeleccionada === 'marcar_resuelto'
            ? 'Marcar como Resuelto'
            : 'Gestionar Pago Fallido'
        }
        size="md"
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cliente:</p>
              <p className="font-semibold text-gray-900">{pagoSeleccionado.clienteNombre}</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Monto:</p>
              <p className="font-semibold text-gray-900">{pagoSeleccionado.monto}€</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Motivo del fallo:</p>
              <p className="text-sm text-gray-900">{pagoSeleccionado.motivoFallo || 'Desconocido'}</p>
            </div>

            {accionSeleccionada === 'programar_reintento' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Reintento (opcional)
                </label>
                <input
                  type="date"
                  value={fechaReintento}
                  onChange={(e) => setFechaReintento(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si no se especifica, se programará para 3 días desde hoy
                </p>
              </div>
            )}

            {accionSeleccionada === 'enviar_notificacion' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal de Notificación
                </label>
                <select
                  value={canalNotificacion}
                  onChange={(e) => setCanalNotificacion(e.target.value as 'email' | 'whatsapp')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                {canalNotificacion === 'email' && !pagoSeleccionado.clienteEmail && (
                  <p className="text-xs text-red-500 mt-1">No hay email disponible para este cliente</p>
                )}
                {canalNotificacion === 'whatsapp' && !pagoSeleccionado.clienteTelefono && (
                  <p className="text-xs text-red-500 mt-1">No hay teléfono disponible para este cliente</p>
                )}
              </div>
            )}

            {accionSeleccionada === 'actualizar_metodo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Método de Pago
                </label>
                <select
                  value={nuevoMetodoPago}
                  onChange={(e) => setNuevoMetodoPago(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un método</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="domiciliacion">Domiciliación</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Añade notas sobre esta acción..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setModalOpen(false)}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGestionarPago}
                disabled={
                  procesando || 
                  (accionSeleccionada === 'actualizar_metodo' && !nuevoMetodoPago) ||
                  (accionSeleccionada === 'enviar_notificacion' && 
                   ((canalNotificacion === 'email' && !pagoSeleccionado.clienteEmail) ||
                    (canalNotificacion === 'whatsapp' && !pagoSeleccionado.clienteTelefono)))
                }
              >
                {procesando ? 'Procesando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
