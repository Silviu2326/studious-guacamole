/**
 * GestorSuscripcionesRecurrentes - Componente para gestión de suscripciones recurrentes
 * 
 * Este componente permite:
 * - Listar todas las suscripciones activas
 * - Ver detalles de cada suscripción (próxima fecha de cobro, estado, etc.)
 * - Pausar suscripciones temporalmente
 * - Cancelar suscripciones permanentemente
 * - Filtrar suscripciones por estado, cliente, frecuencia
 * 
 * INTEGRACIÓN FUTURA:
 * - A futuro se conectará con pasarelas de pago reales (Stripe, PayPal, etc.)
 *   para procesar los cobros automáticamente
 * - Los webhooks de la pasarela actualizarán el estado de las suscripciones
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Select, Input, Modal } from '../../../components/componentsreutilizables';
import { 
  SuscripcionRecurrente, 
  EstadoSuscripcion,
  FiltroSuscripciones 
} from '../types';
import { suscripcionesRecurrentesAPI } from '../api/suscripcionesRecurrentes';
import { 
  Repeat, 
  Pause, 
  XCircle, 
  Play, 
  Calendar, 
  DollarSign, 
  CreditCard,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GestorSuscripcionesRecurrentesProps {
  onRefresh?: () => void;
}

export const GestorSuscripcionesRecurrentes: React.FC<GestorSuscripcionesRecurrentesProps> = ({ 
  onRefresh 
}) => {
  const [suscripciones, setSuscripciones] = useState<SuscripcionRecurrente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltroSuscripciones>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<SuscripcionRecurrente | null>(null);
  const [mostrarModalAccion, setMostrarModalAccion] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<'pausar' | 'reanudar' | 'cancelar' | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarSuscripciones();
  }, [filtros]);

  const cargarSuscripciones = async () => {
    setLoading(true);
    try {
      const datos = await suscripcionesRecurrentesAPI.obtenerSuscripciones(filtros);
      setSuscripciones(datos);
    } catch (error) {
      console.error('Error al cargar suscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number, moneda: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(fecha));
  };

  const obtenerBadgeEstado = (estado: EstadoSuscripcion) => {
    const config: Record<EstadoSuscripcion, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }> = {
      activa: { label: 'Activa', variant: 'green' },
      pausada: { label: 'Pausada', variant: 'yellow' },
      cancelada: { label: 'Cancelada', variant: 'gray' },
      vencida: { label: 'Vencida', variant: 'red' },
      error_pago: { label: 'Error de Pago', variant: 'red' }
    };
    return config[estado] || { label: estado, variant: 'blue' as const };
  };

  const obtenerNombreFrecuencia = (frecuencia: string) => {
    const nombres: Record<string, string> = {
      diaria: 'Diaria',
      semanal: 'Semanal',
      quincenal: 'Quincenal',
      mensual: 'Mensual',
      bimestral: 'Bimestral',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual'
    };
    return nombres[frecuencia] || frecuencia;
  };

  const obtenerNombreMetodoPago = (metodo: string) => {
    const nombres: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      paypal: 'PayPal',
      stripe: 'Stripe',
      otro: 'Otro'
    };
    return nombres[metodo] || metodo;
  };

  const handlePausar = (suscripcion: SuscripcionRecurrente) => {
    setSuscripcionSeleccionada(suscripcion);
    setAccionPendiente('pausar');
    setMostrarModalAccion(true);
  };

  const handleReanudar = (suscripcion: SuscripcionRecurrente) => {
    setSuscripcionSeleccionada(suscripcion);
    setAccionPendiente('reanudar');
    setMostrarModalAccion(true);
  };

  const handleCancelar = (suscripcion: SuscripcionRecurrente) => {
    setSuscripcionSeleccionada(suscripcion);
    setAccionPendiente('cancelar');
    setMostrarModalAccion(true);
  };

  const confirmarAccion = async () => {
    if (!suscripcionSeleccionada || !accionPendiente) return;

    setProcesando(true);
    try {
      switch (accionPendiente) {
        case 'pausar':
          await suscripcionesRecurrentesAPI.pausarSuscripcion(suscripcionSeleccionada.id);
          break;
        case 'reanudar':
          await suscripcionesRecurrentesAPI.reanudarSuscripcion(suscripcionSeleccionada.id);
          break;
        case 'cancelar':
          await suscripcionesRecurrentesAPI.cancelarSuscripcion(suscripcionSeleccionada.id);
          break;
      }
      
      await cargarSuscripciones();
      setMostrarModalAccion(false);
      setSuscripcionSeleccionada(null);
      setAccionPendiente(null);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al procesar acción:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar la acción');
    } finally {
      setProcesando(false);
    }
  };

  const suscripcionesFiltradas = suscripciones.filter(s => {
    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();
    return (
      s.nombreCliente.toLowerCase().includes(termino) ||
      s.descripcion.toLowerCase().includes(termino) ||
      s.id.toLowerCase().includes(termino)
    );
  });

  const columnas = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div>
          <div className="font-semibold text-gray-900">{suscripcion.nombreCliente}</div>
          <div className="text-sm text-gray-500">{suscripcion.descripcion}</div>
        </div>
      )
    },
    {
      key: 'importe',
      label: 'Importe',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div className="font-semibold">
          {formatearMoneda(suscripcion.importe, suscripcion.moneda)}
        </div>
      )
    },
    {
      key: 'frecuencia',
      label: 'Frecuencia',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-gray-400" />
          <span>{obtenerNombreFrecuencia(suscripcion.frecuencia)}</span>
        </div>
      )
    },
    {
      key: 'proximoCobro',
      label: 'Próximo Cobro',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatearFecha(suscripcion.fechaProximoCobro)}</span>
        </div>
      )
    },
    {
      key: 'metodoPago',
      label: 'Método de Pago',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span>{obtenerNombreMetodoPago(suscripcion.metodoPagoPreferido)}</span>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (suscripcion: SuscripcionRecurrente) => {
        const config = obtenerBadgeEstado(suscripcion.estado);
        return <Badge variant={config.variant}>{config.label}</Badge>;
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (suscripcion: SuscripcionRecurrente) => (
        <div className="flex gap-2">
          {suscripcion.estado === 'activa' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePausar(suscripcion)}
              title="Pausar suscripción"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          {suscripcion.estado === 'pausada' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReanudar(suscripcion)}
              title="Reanudar suscripción"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          {suscripcion.estado !== 'cancelada' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCancelar(suscripcion)}
              title="Cancelar suscripción"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por cliente, descripción o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <Select
                  value={filtros.estado || ''}
                  onChange={(e) => setFiltros({
                    ...filtros,
                    estado: e.target.value ? e.target.value as EstadoSuscripcion : undefined
                  })}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'activa', label: 'Activa' },
                    { value: 'pausada', label: 'Pausada' },
                    { value: 'cancelada', label: 'Cancelada' },
                    { value: 'vencida', label: 'Vencida' },
                    { value: 'error_pago', label: 'Error de Pago' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia
                </label>
                <Select
                  value={filtros.frecuencia || ''}
                  onChange={(e) => setFiltros({
                    ...filtros,
                    frecuencia: e.target.value ? e.target.value as any : undefined
                  })}
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'diaria', label: 'Diaria' },
                    { value: 'semanal', label: 'Semanal' },
                    { value: 'quincenal', label: 'Quincenal' },
                    { value: 'mensual', label: 'Mensual' },
                    { value: 'bimestral', label: 'Bimestral' },
                    { value: 'trimestral', label: 'Trimestral' },
                    { value: 'semestral', label: 'Semestral' },
                    { value: 'anual', label: 'Anual' }
                  ]}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFiltros({});
                    setBusqueda('');
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Total Suscripciones</div>
          <div className="text-2xl font-bold text-gray-900">{suscripciones.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Activas</div>
          <div className="text-2xl font-bold text-green-600">
            {suscripciones.filter(s => s.estado === 'activa').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Pausadas</div>
          <div className="text-2xl font-bold text-yellow-600">
            {suscripciones.filter(s => s.estado === 'pausada').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Ingresos Recurrentes Mensuales</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatearMoneda(
              suscripciones
                .filter(s => s.estado === 'activa' && (s.frecuencia === 'mensual' || s.frecuencia === 'semanal' || s.frecuencia === 'quincenal'))
                .reduce((sum, s) => {
                  // Aproximación: mensual = 1x, semanal = 4x, quincenal = 2x
                  const multiplicador = s.frecuencia === 'semanal' ? 4 : s.frecuencia === 'quincenal' ? 2 : 1;
                  return sum + (s.importe * multiplicador);
                }, 0)
            )}
          </div>
        </Card>
      </div>

      {/* Tabla de suscripciones */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Cargando suscripciones...</span>
          </div>
        ) : suscripcionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Repeat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron suscripciones</p>
          </div>
        ) : (
          <Table
            columns={columnas}
            data={suscripcionesFiltradas}
          />
        )}
      </Card>

      {/* Modal de confirmación de acción */}
      <Modal
        isOpen={mostrarModalAccion}
        onClose={() => {
          if (!procesando) {
            setMostrarModalAccion(false);
            setSuscripcionSeleccionada(null);
            setAccionPendiente(null);
          }
        }}
        title={
          accionPendiente === 'pausar' ? 'Pausar Suscripción' :
          accionPendiente === 'reanudar' ? 'Reanudar Suscripción' :
          'Cancelar Suscripción'
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalAccion(false);
                setSuscripcionSeleccionada(null);
                setAccionPendiente(null);
              }}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={confirmarAccion}
              disabled={procesando}
            >
              {procesando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        }
      >
        {suscripcionSeleccionada && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">Cliente:</div>
              <div className="text-gray-700">{suscripcionSeleccionada.nombreCliente}</div>
              <div className="font-semibold text-gray-900 mt-3 mb-2">Descripción:</div>
              <div className="text-gray-700">{suscripcionSeleccionada.descripcion}</div>
              <div className="font-semibold text-gray-900 mt-3 mb-2">Importe:</div>
              <div className="text-gray-700">
                {formatearMoneda(suscripcionSeleccionada.importe, suscripcionSeleccionada.moneda)}
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                {accionPendiente === 'pausar' && (
                  <p>¿Estás seguro de pausar esta suscripción? No se realizarán más cobros hasta que se reanude.</p>
                )}
                {accionPendiente === 'reanudar' && (
                  <p>¿Estás seguro de reanudar esta suscripción? Se programará el próximo cobro según la frecuencia configurada.</p>
                )}
                {accionPendiente === 'cancelar' && (
                  <p>¿Estás seguro de cancelar esta suscripción? Esta acción no se puede deshacer.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

