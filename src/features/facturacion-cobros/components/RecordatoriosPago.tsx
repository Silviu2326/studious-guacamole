import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Select, Input, Badge, Tabs, TableColumn } from '../../../components/componentsreutilizables';
import { Factura, NotificacionFactura, CanalNotificacion, EstadoEnvio } from '../types';
import { recordatoriosAPI } from '../api/recordatorios';
import { getFacturas } from '../api/facturas';
import { Bell, Send, Mail, MessageCircle, Phone, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Loader2 } from 'lucide-react';

interface RecordatoriosPagoProps {
  onError?: (errorMessage: string) => void;
}

export const RecordatoriosPago: React.FC<RecordatoriosPagoProps> = ({ onError }) => {
  // Estados principales
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState<'manual' | 'historial'>('manual');
  
  // Estados para modal de envío manual
  const [mostrarModal, setMostrarModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [canalSeleccionado, setCanalSeleccionado] = useState<CanalNotificacion>('email');
  const [enviando, setEnviando] = useState(false);
  
  // Estados para historial de recordatorios
  const [recordatorios, setRecordatorios] = useState<NotificacionFactura[]>([]);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);
  const [facturaFiltro, setFacturaFiltro] = useState<string>('');
  const [recordatoriosFiltrados, setRecordatoriosFiltrados] = useState<NotificacionFactura[]>([]);
  
  // Cargar facturas al montar
  useEffect(() => {
    cargarFacturas();
  }, []);

  // Cargar recordatorios cuando cambia la tab
  useEffect(() => {
    if (tabActiva === 'historial') {
      cargarRecordatorios();
    }
  }, [tabActiva]);

  // Filtrar recordatorios cuando cambia el filtro
  useEffect(() => {
    if (facturaFiltro) {
      const filtrados = recordatorios.filter(r => 
        r.facturaId.toLowerCase().includes(facturaFiltro.toLowerCase()) ||
        facturas.find(f => f.id === r.facturaId)?.numero.toLowerCase().includes(facturaFiltro.toLowerCase())
      );
      setRecordatoriosFiltrados(filtrados);
    } else {
      setRecordatoriosFiltrados(recordatorios);
    }
  }, [facturaFiltro, recordatorios, facturas]);

  const cargarFacturas = async () => {
    setLoading(true);
    try {
      // Obtener solo facturas pendientes, vencidas o parcialmente pagadas
      const todasFacturas = await getFacturas();
      const facturasElegibles = todasFacturas.filter(f => 
        f.estado === 'pendiente' || 
        f.estado === 'vencida' || 
        f.estado === 'parcialmentePagada'
      );
      setFacturas(facturasElegibles);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las facturas';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarRecordatorios = async () => {
    setLoadingRecordatorios(true);
    try {
      // Obtener recordatorios de todas las facturas
      const todosRecordatorios: NotificacionFactura[] = [];
      
      for (const factura of facturas) {
        try {
          const recordatoriosFactura = await recordatoriosAPI.getRecordatoriosEnviados(factura.id);
          todosRecordatorios.push(...recordatoriosFactura);
        } catch (error) {
          console.warn(`Error al cargar recordatorios de factura ${factura.id}:`, error);
        }
      }
      
      // Ordenar por fecha descendente
      todosRecordatorios.sort((a, b) => 
        new Date(b.enviadoEn).getTime() - new Date(a.enviadoEn).getTime()
      );
      
      setRecordatorios(todosRecordatorios);
      setRecordatoriosFiltrados(todosRecordatorios);
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
      if (onError) {
        onError('No se pudieron cargar los recordatorios');
      }
    } finally {
      setLoadingRecordatorios(false);
    }
  };

  const abrirModal = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setCanalSeleccionado('email');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFacturaSeleccionada(null);
    setCanalSeleccionado('email');
  };

  const handleEnviarRecordatorio = async () => {
    if (!facturaSeleccionada) return;

    setEnviando(true);
    try {
      await recordatoriosAPI.enviarRecordatorioManual(
        facturaSeleccionada.id,
        canalSeleccionado
      );
      
      // Recargar recordatorios y facturas
      await cargarFacturas();
      if (tabActiva === 'historial') {
        await cargarRecordatorios();
      }
      
      cerrarModal();
      
      // Mostrar mensaje de éxito (podría usar un toast en lugar de alert)
      alert('Recordatorio enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el recordatorio';
      alert(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setEnviando(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const obtenerBadgeEstado = (estado: EstadoEnvio) => {
    const estados: Record<EstadoEnvio, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' }> = {
      enviado: { label: 'Enviado', variant: 'green' },
      fallido: { label: 'Fallido', variant: 'red' },
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      cancelado: { label: 'Cancelado', variant: 'blue' }
    };
    
    const estadoInfo = estados[estado] || { label: estado, variant: 'blue' as const };
    return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>;
  };

  const obtenerIconoCanal = (canal: CanalNotificacion) => {
    switch (canal) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const obtenerNumeroRecordatorios = (facturaId: string): number => {
    return recordatorios.filter(r => r.facturaId === facturaId && r.tipo === 'recordatorio').length;
  };

  // Columnas para tabla de facturas
  const columnasFacturas: TableColumn<Factura>[] = [
    {
      key: 'numero',
      label: 'Número Factura',
      render: (_: any, row: Factura) => (
        <span className="font-medium text-gray-900">{row.numero}</span>
      )
    },
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (_: any, row: Factura) => (
        <span className="text-gray-700">{row.nombreCliente}</span>
      )
    },
    {
      key: 'saldoPendiente',
      label: 'Saldo Pendiente',
      render: (_: any, row: Factura) => (
        <span className="font-medium text-orange-600">
          {formatearMoneda(row.saldoPendiente)}
        </span>
      ),
      align: 'right' as const
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_: any, row: Factura) => {
        const vencida = new Date(row.fechaVencimiento) < new Date();
        return (
          <div className="flex items-center gap-2">
            {vencida && <AlertCircle className="w-4 h-4 text-red-500" />}
            <span className={vencida ? 'text-red-600 font-medium' : 'text-gray-700'}>
              {new Date(row.fechaVencimiento).toLocaleDateString('es-ES')}
            </span>
          </div>
        );
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Factura) => {
        const estados: Record<string, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' }> = {
          pendiente: { label: 'Pendiente', variant: 'yellow' },
          vencida: { label: 'Vencida', variant: 'red' },
          parcialmentePagada: { label: 'Parcialmente Pagada', variant: 'blue' },
          pagada: { label: 'Pagada', variant: 'green' }
        };
        const estadoInfo = estados[row.estado] || { label: row.estado, variant: 'blue' as const };
        return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>;
      }
    },
    {
      key: 'recordatorios',
      label: 'Recordatorios Enviados',
      render: (_: any, row: Factura) => {
        const cantidad = obtenerNumeroRecordatorios(row.id);
        return (
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{cantidad}</span>
          </div>
        );
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Factura) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => abrirModal(row)}
        >
          <Send className="w-4 h-4 mr-1" />
          Enviar Recordatorio
        </Button>
      )
    }
  ];

  // Columnas para tabla de historial
  const columnasHistorial: TableColumn<NotificacionFactura>[] = [
    {
      key: 'fechaEnvio',
      label: 'Fecha Envío',
      render: (_: any, row: NotificacionFactura) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">
            {new Date(row.enviadoEn).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )
    },
    {
      key: 'factura',
      label: 'Factura',
      render: (_: any, row: NotificacionFactura) => {
        const factura = facturas.find(f => f.id === row.facturaId);
        return (
          <span className="font-medium text-gray-900">
            {factura?.numero || row.facturaId}
          </span>
        );
      }
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_: any, row: NotificacionFactura) => {
        const factura = facturas.find(f => f.id === row.facturaId);
        return (
          <span className="text-gray-700">
            {factura?.nombreCliente || 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'canal',
      label: 'Canal',
      render: (_: any, row: NotificacionFactura) => (
        <div className="flex items-center gap-2">
          {obtenerIconoCanal(row.canal)}
          <span className="capitalize text-gray-700">{row.canal}</span>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: NotificacionFactura) => obtenerBadgeEstado(row.estadoEnvio)
    }
  ];

  const opcionesCanales = [
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' }
  ];

  return (
    <div className="space-y-6">
      {/* Header con tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <Tabs
            items={[
              {
                id: 'manual',
                label: 'Enviar Recordatorio',
                icon: <Send className="w-4 h-4" />
              },
              {
                id: 'historial',
                label: 'Historial',
                icon: <Bell className="w-4 h-4" />
              }
            ]}
            activeTab={tabActiva}
            onTabChange={(id) => setTabActiva(id as 'manual' | 'historial')}
            variant="pills"
          />
        </div>

        <div className="p-6">
          {tabActiva === 'manual' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Facturas Pendientes de Pago
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona una factura para enviar un recordatorio de pago al cliente.
                </p>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : facturas.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay facturas pendientes de pago</p>
                  </Card>
                ) : (
                  <Table
                    data={facturas}
                    columns={columnasFacturas}
                    emptyMessage="No hay facturas pendientes"
                  />
                )}
              </div>
            </div>
          )}

          {tabActiva === 'historial' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Historial de Recordatorios Enviados
                </h3>
                
                {/* Filtro de búsqueda */}
                <div className="mb-4">
                  <Input
                    placeholder="Buscar por número de factura..."
                    leftIcon={<Search className="w-4 h-4" />}
                    value={facturaFiltro}
                    onChange={(e) => setFacturaFiltro(e.target.value)}
                  />
                </div>

                {loadingRecordatorios ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : recordatoriosFiltrados.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {facturaFiltro ? 'No se encontraron recordatorios' : 'No hay recordatorios enviados'}
                    </p>
                  </Card>
                ) : (
                  <Table
                    data={recordatoriosFiltrados}
                    columns={columnasHistorial}
                    emptyMessage="No hay recordatorios enviados"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de envío de recordatorio */}
      {mostrarModal && facturaSeleccionada && (
        <Modal
          isOpen={true}
          onClose={cerrarModal}
          title="Enviar Recordatorio de Pago"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={cerrarModal} disabled={enviando}>
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleEnviarRecordatorio} 
                loading={enviando}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Recordatorio
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Información de la factura */}
            <Card className="p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Factura:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {facturaSeleccionada.numero}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cliente:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {facturaSeleccionada.nombreCliente}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Saldo Pendiente:</span>
                  <span className="text-sm font-medium text-orange-600">
                    {formatearMoneda(facturaSeleccionada.saldoPendiente)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fecha Vencimiento:</span>
                  <span className={`text-sm font-medium ${
                    new Date(facturaSeleccionada.fechaVencimiento) < new Date()
                      ? 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    {new Date(facturaSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </Card>

            {/* Selección de canal */}
            <div>
              <Select
                label="Canal de Envío *"
                options={opcionesCanales}
                value={canalSeleccionado}
                onChange={(e) => setCanalSeleccionado(e.target.value as CanalNotificacion)}
              />
            </div>

            {/* Información adicional */}
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                Se enviará un recordatorio personalizado a través de {canalSeleccionado} al cliente 
                indicando el monto pendiente y la fecha de vencimiento de la factura.
              </p>
            </Card>
          </div>
        </Modal>
      )}
    </div>
  );
};

