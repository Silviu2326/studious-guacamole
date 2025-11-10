import React, { useState, useEffect } from 'react';
import { Suscripcion, PropuestaCambioRenovacion as PropuestaCambioRenovacionType } from '../types';
import { Card, Button, Select, Badge, Modal, Table, Textarea } from '../../../components/componentsreutilizables';
import {
  getSuscripciones,
  crearPropuestaCambioRenovacion,
  getPropuestasCambioRenovacion,
  aceptarPropuestaCambio,
  rechazarPropuestaCambio,
} from '../api/suscripciones';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Send,
  Calendar,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface PropuestaCambioRenovacionProps {
  onSuccess?: () => void;
}

// Planes PT disponibles
const PLANES_PT = [
  {
    id: 'pt-4',
    nombre: 'Paquete Mensual 4 Sesiones',
    sesiones: 4,
    precio: 150,
    descripcion: 'Ideal para mantenimiento',
  },
  {
    id: 'pt-8',
    nombre: 'Paquete Mensual 8 Sesiones',
    sesiones: 8,
    precio: 280,
    descripcion: 'La opción más popular',
  },
  {
    id: 'pt-12',
    nombre: 'Paquete Mensual 12 Sesiones',
    sesiones: 12,
    precio: 480,
    descripcion: 'Máxima intensidad',
  },
];

export const PropuestaCambioRenovacion: React.FC<PropuestaCambioRenovacionProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [propuestas, setPropuestas] = useState<PropuestaCambioRenovacionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);
  const [tipoCambio, setTipoCambio] = useState<'plan' | 'precio' | 'descuento'>('plan');
  const [nuevoPlanId, setNuevoPlanId] = useState<string>('');
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);
  const [nuevoDescuento, setNuevoDescuento] = useState<{ tipo: 'porcentaje' | 'fijo'; valor: number }>({ tipo: 'porcentaje', valor: 0 });
  const [mensajePersonalizado, setMensajePersonalizado] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, props] = await Promise.all([
        getSuscripciones('entrenador', user?.id),
        getPropuestasCambioRenovacion(user?.id),
      ]);
      setSuscripciones(subs);
      setPropuestas(props);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar suscripciones próximas a renovar (próximos 7-30 días)
  const suscripcionesProximasRenovacion = suscripciones.filter(s => {
    if (!s.proximaRenovacion || s.estado !== 'activa') return false;
    const hoy = new Date();
    const fechaRenovacion = new Date(s.proximaRenovacion);
    const diffDias = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 30;
  });

  const handleCrearPropuesta = async () => {
    if (!suscripcionSeleccionada) return;

    setLoadingAction(true);
    try {
      let datosPropuesta: any = {
        suscripcionId: suscripcionSeleccionada.id,
        tipoCambio,
        mensajePersonalizado: mensajePersonalizado || undefined,
      };

      if (tipoCambio === 'plan') {
        const nuevoPlan = PLANES_PT.find(p => p.id === nuevoPlanId);
        if (!nuevoPlan) {
          alert('Por favor selecciona un plan válido');
          return;
        }
        datosPropuesta.nuevoPlanId = nuevoPlanId;
        datosPropuesta.nuevoPrecio = nuevoPlan.precio;
        datosPropuesta.nuevoSesiones = nuevoPlan.sesiones;
      } else if (tipoCambio === 'precio') {
        if (nuevoPrecio <= 0) {
          alert('Por favor ingresa un precio válido');
          return;
        }
        datosPropuesta.nuevoPrecio = nuevoPrecio;
      } else if (tipoCambio === 'descuento') {
        if (nuevoDescuento.valor <= 0) {
          alert('Por favor ingresa un descuento válido');
          return;
        }
        datosPropuesta.descuento = nuevoDescuento;
      }

      await crearPropuestaCambioRenovacion(datosPropuesta);
      await loadData();
      setModalOpen(false);
      resetForm();
      onSuccess?.();
      alert('Propuesta creada y enviada al cliente correctamente');
    } catch (error) {
      console.error('Error creando propuesta:', error);
      alert('Error al crear la propuesta. Por favor, intenta de nuevo.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAceptarPropuesta = async (propuestaId: string) => {
    if (!confirm('¿Estás seguro de que quieres aceptar esta propuesta? El cambio se aplicará inmediatamente.')) {
      return;
    }

    try {
      await aceptarPropuestaCambio(propuestaId);
      await loadData();
      onSuccess?.();
      alert('Propuesta aceptada correctamente');
    } catch (error) {
      console.error('Error aceptando propuesta:', error);
      alert('Error al aceptar la propuesta');
    }
  };

  const handleRechazarPropuesta = async (propuestaId: string) => {
    if (!confirm('¿Estás seguro de que quieres rechazar esta propuesta?')) {
      return;
    }

    try {
      await rechazarPropuestaCambio(propuestaId);
      await loadData();
      alert('Propuesta rechazada correctamente');
    } catch (error) {
      console.error('Error rechazando propuesta:', error);
      alert('Error al rechazar la propuesta');
    }
  };

  const resetForm = () => {
    setSuscripcionSeleccionada(null);
    setTipoCambio('plan');
    setNuevoPlanId('');
    setNuevoPrecio(0);
    setNuevoDescuento({ tipo: 'porcentaje', valor: 0 });
    setMensajePersonalizado('');
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      pendiente: { label: 'Pendiente', color: 'warning' },
      aceptada: { label: 'Aceptada', color: 'success' },
      rechazada: { label: 'Rechazada', color: 'error' },
      expirada: { label: 'Expirada', color: 'error' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  const calcularDiasHastaRenovacion = (fechaRenovacion: string) => {
    const hoy = new Date();
    const renovacion = new Date(fechaRenovacion);
    const diffTime = renovacion.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const columnsPropuestas = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: PropuestaCambioRenovacionType) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.clienteEmail}</div>
        </div>
      ),
    },
    {
      key: 'tipoCambio',
      label: 'Tipo de Cambio',
      render: (value: string) => {
        const tipos: Record<string, string> = {
          plan: 'Cambio de Plan',
          precio: 'Cambio de Precio',
          descuento: 'Aplicar Descuento',
        };
        return <span className="text-sm text-gray-700">{tipos[value] || value}</span>;
      },
    },
    {
      key: 'detalles',
      label: 'Detalles',
      render: (value: any, row: PropuestaCambioRenovacionType) => {
        if (row.tipoCambio === 'plan') {
          return (
            <div className="text-sm">
              <div className="font-medium text-gray-900">{row.nuevoPlanNombre}</div>
              <div className="text-gray-600">{row.nuevoPrecio} €/mes</div>
            </div>
          );
        } else if (row.tipoCambio === 'precio') {
          return (
            <div className="text-sm">
              <div className="text-gray-900">Nuevo precio: <span className="font-semibold">{row.nuevoPrecio} €</span></div>
            </div>
          );
        } else if (row.tipoCambio === 'descuento') {
          return (
            <div className="text-sm">
              <div className="text-gray-900">
                Descuento: {row.descuento?.tipo === 'porcentaje' ? `${row.descuento.valor}%` : `${row.descuento?.valor} €`}
              </div>
            </div>
          );
        }
        return <span className="text-sm text-gray-600">-</span>;
      },
    },
    {
      key: 'fechaRenovacion',
      label: 'Renovación',
      render: (value: string) => {
        const dias = calcularDiasHastaRenovacion(value);
        return (
          <div className="text-sm">
            <div className="text-gray-900">{new Date(value).toLocaleDateString('es-ES')}</div>
            <div className="text-gray-500">{dias} días</div>
          </div>
        );
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha Creación',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: any, row: PropuestaCambioRenovacionType) => (
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRechazarPropuesta(row.id)}
                title="Rechazar propuesta"
              >
                <XCircle className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
          {row.estado === 'aceptada' && (
            <Badge color="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Aplicada
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Renovaciones Próximas</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {suscripcionesProximasRenovacion.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Propuestas Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {propuestas.filter(p => p.estado === 'pendiente').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Propuestas Aceptadas</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {propuestas.filter(p => p.estado === 'aceptada').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Acción principal */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Proponer Cambio de Plan o Precio
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Crea una propuesta de cambio para clientes con renovaciones próximas
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Crear Propuesta
          </Button>
        </div>

        {/* Lista de suscripciones próximas a renovar */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Suscripciones Próximas a Renovar (próximos 30 días)</h4>
          {suscripcionesProximasRenovacion.length === 0 ? (
            <p className="text-sm text-gray-500">No hay suscripciones próximas a renovar</p>
          ) : (
            <div className="space-y-2">
              {suscripcionesProximasRenovacion.map(suscripcion => {
                const dias = calcularDiasHastaRenovacion(suscripcion.proximaRenovacion!);
                const tienePropuesta = propuestas.some(p => p.suscripcionId === suscripcion.id && p.estado === 'pendiente');
                
                return (
                  <div
                    key={suscripcion.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{suscripcion.clienteNombre}</div>
                        {tienePropuesta && (
                          <Badge color="info">Propuesta enviada</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Plan actual: {suscripcion.planNombre} • {suscripcion.precio} €/mes
                      </div>
                      <div className="text-sm text-gray-600">
                        Renovación: {new Date(suscripcion.proximaRenovacion!).toLocaleDateString('es-ES')} ({dias} días)
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSuscripcionSeleccionada(suscripcion);
                        setModalOpen(true);
                      }}
                      disabled={tienePropuesta}
                    >
                      {tienePropuesta ? 'Propuesta Enviada' : 'Crear Propuesta'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de propuestas */}
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Historial de Propuestas
        </h3>
        <Table
          data={propuestas}
          columns={columnsPropuestas}
          loading={loading}
          emptyMessage="No hay propuestas creadas"
        />
      </Card>

      {/* Modal para crear propuesta */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!loadingAction) {
            setModalOpen(false);
            resetForm();
          }
        }}
        title="Crear Propuesta de Cambio"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
              disabled={loadingAction}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearPropuesta}
              disabled={loadingAction || !suscripcionSeleccionada}
              loading={loadingAction}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Propuesta
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Selección de suscripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <Select
              value={suscripcionSeleccionada?.id || ''}
              onChange={(e) => {
                const suscripcion = suscripciones.find(s => s.id === e.target.value);
                setSuscripcionSeleccionada(suscripcion || null);
              }}
              options={[
                { value: '', label: 'Seleccionar cliente...' },
                ...suscripcionesProximasRenovacion.map(s => ({
                  value: s.id,
                  label: `${s.clienteNombre} - ${s.planNombre} (Renovación: ${new Date(s.proximaRenovacion!).toLocaleDateString('es-ES')})`,
                })),
              ]}
            />
          </div>

          {suscripcionSeleccionada && (
            <>
              {/* Información del plan actual */}
              <Card className="bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Plan Actual</p>
                <div className="text-sm text-gray-900">
                  <div className="font-semibold">{suscripcionSeleccionada.planNombre}</div>
                  <div className="text-gray-600">
                    {suscripcionSeleccionada.sesionesIncluidas || 0} sesiones/mes • {suscripcionSeleccionada.precio} €/mes
                  </div>
                  <div className="text-gray-600 mt-1">
                    Renovación: {new Date(suscripcionSeleccionada.proximaRenovacion!).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </Card>

              {/* Tipo de cambio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cambio
                </label>
                <Select
                  value={tipoCambio}
                  onChange={(e) => setTipoCambio(e.target.value as 'plan' | 'precio' | 'descuento')}
                  options={[
                    { value: 'plan', label: 'Cambio de Plan' },
                    { value: 'precio', label: 'Cambio de Precio' },
                    { value: 'descuento', label: 'Aplicar Descuento' },
                  ]}
                />
              </div>

              {/* Opciones según el tipo de cambio */}
              {tipoCambio === 'plan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Plan
                  </label>
                  <Select
                    value={nuevoPlanId}
                    onChange={(e) => setNuevoPlanId(e.target.value)}
                    options={[
                      { value: '', label: 'Seleccionar plan...' },
                      ...PLANES_PT.filter(p => p.id !== suscripcionSeleccionada.planId).map(plan => ({
                        value: plan.id,
                        label: `${plan.nombre} - ${plan.sesiones} sesiones/mes - ${plan.precio} €/mes`,
                      })),
                    ]}
                  />
                  {nuevoPlanId && (() => {
                    const nuevoPlan = PLANES_PT.find(p => p.id === nuevoPlanId);
                    const planActual = PLANES_PT.find(p => p.id === suscripcionSeleccionada.planId);
                    if (!nuevoPlan || !planActual) return null;
                    const diferenciaPrecio = nuevoPlan.precio - planActual.precio;
                    const diferenciaSesiones = nuevoPlan.sesiones - planActual.sesiones;
                    return (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Resumen del Cambio</span>
                        </div>
                        <div className="text-sm text-blue-800 space-y-1">
                          <div>Nuevo plan: {nuevoPlan.nombre}</div>
                          <div>
                            Diferencia: {diferenciaSesiones > 0 ? '+' : ''}{diferenciaSesiones} sesiones/mes •{' '}
                            {diferenciaPrecio > 0 ? '+' : ''}{diferenciaPrecio} €/mes
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {tipoCambio === 'precio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo Precio Mensual (€)
                  </label>
                  <input
                    type="number"
                    value={nuevoPrecio || ''}
                    onChange={(e) => setNuevoPrecio(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 250"
                    min="0"
                    step="0.01"
                  />
                  {nuevoPrecio > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Diferencia: {nuevoPrecio - suscripcionSeleccionada.precio > 0 ? '+' : ''}
                      {(nuevoPrecio - suscripcionSeleccionada.precio).toFixed(2)} €/mes
                    </div>
                  )}
                </div>
              )}

              {tipoCambio === 'descuento' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Descuento
                    </label>
                    <Select
                      value={nuevoDescuento.tipo}
                      onChange={(e) => setNuevoDescuento({ ...nuevoDescuento, tipo: e.target.value as 'porcentaje' | 'fijo' })}
                      options={[
                        { value: 'porcentaje', label: 'Porcentaje (%)' },
                        { value: 'fijo', label: 'Cantidad Fija (€)' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor del Descuento
                    </label>
                    <input
                      type="number"
                      value={nuevoDescuento.valor || ''}
                      onChange={(e) => setNuevoDescuento({ ...nuevoDescuento, valor: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={nuevoDescuento.tipo === 'porcentaje' ? 'Ej: 10' : 'Ej: 20'}
                      min="0"
                      step={nuevoDescuento.tipo === 'porcentaje' ? '1' : '0.01'}
                      max={nuevoDescuento.tipo === 'porcentaje' ? '100' : undefined}
                    />
                    {nuevoDescuento.valor > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Precio con descuento:{' '}
                        {nuevoDescuento.tipo === 'porcentaje'
                          ? (suscripcionSeleccionada.precio * (1 - nuevoDescuento.valor / 100)).toFixed(2)
                          : (suscripcionSeleccionada.precio - nuevoDescuento.valor).toFixed(2)}{' '}
                        €/mes
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mensaje personalizado */}
              <div>
                <Textarea
                  label="Mensaje Personalizado (opcional)"
                  value={mensajePersonalizado}
                  onChange={(e) => setMensajePersonalizado(e.target.value)}
                  placeholder="Ej: Te ofrecemos este cambio especial por tu fidelidad. Esta oferta es válida hasta la fecha de renovación."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este mensaje se incluirá en la propuesta enviada al cliente
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

