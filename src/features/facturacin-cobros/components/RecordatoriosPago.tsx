import React, { useState } from 'react';
import { Card, Button, Table, TableColumn, Modal, Select, SelectOption, Badge } from '../../../components/componentsreutilizables';
import { Factura, RecordatorioPago } from '../types';
import { recordatoriosAPI } from '../api/recordatorios';
import { Bell, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RecordatoriosPagoProps {
  facturas: Factura[];
  onRefresh: () => void;
}

export const RecordatoriosPago: React.FC<RecordatoriosPagoProps> = ({ facturas, onRefresh }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [medio, setMedio] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [loading, setLoading] = useState(false);
  const [recordatorios, setRecordatorios] = useState<RecordatorioPago[]>([]);

  const facturasConRecordatorios = facturas.filter(f => 
    f.estado === 'pendiente' || f.estado === 'vencida'
  );

  React.useEffect(() => {
    cargarRecordatorios();
  }, [facturas]);

  const cargarRecordatorios = async () => {
    try {
      const todos = await recordatoriosAPI.obtenerRecordatorios();
      setRecordatorios(todos);
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
    }
  };

  const medios: SelectOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const abrirModal = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFacturaSeleccionada(null);
    setMedio('email');
  };

  const handleEnviarRecordatorio = async () => {
    if (!facturaSeleccionada) return;

    setLoading(true);
    try {
      await recordatoriosAPI.enviarRecordatorio({
        facturaId: facturaSeleccionada.id,
        tipo: 'manual',
        medio,
        estado: 'pendiente'
      });

      // Actualizar contador de recordatorios en factura
      await recordatoriosAPI.obtenerRecordatoriosFactura(facturaSeleccionada.id);
      
      cerrarModal();
      cargarRecordatorios();
      onRefresh();
      
      alert('Recordatorio enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
      alert('Error al enviar el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const obtenerBadgeEstado = (estado: string) => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      enviado: { label: 'Enviado', variant: 'green' },
      fallido: { label: 'Fallido', variant: 'red' },
      pendiente: { label: 'Pendiente', variant: 'yellow' }
    };
    
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const obtenerIconoMedio = (medio: string) => {
    switch (medio) {
      case 'email':
        return <Send className="w-4 h-4" />;
      case 'sms':
        return <Bell className="w-4 h-4" />;
      case 'whatsapp':
        return <Send className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const columnas: TableColumn<Factura>[] = [
    {
      key: 'numeroFactura',
      label: 'Número',
      sortable: true
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => row.cliente.nombre
    },
    {
      key: 'montoPendiente',
      label: 'Pendiente',
      render: (_, row) => (
        <span className="font-medium">
          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(row.montoPendiente)}
        </span>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (_, row) => {
        const vencida = new Date(row.fechaVencimiento) < new Date();
        return (
          <span className={vencida ? 'text-red-600 font-medium' : ''}>
            {row.fechaVencimiento.toLocaleDateString('es-ES')}
          </span>
        );
      },
      sortable: true
    },
    {
      key: 'recordatoriosEnviados',
      label: 'Recordatorios',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span>{row.recordatoriosEnviados}</span>
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
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

  const columnasRecordatorios: TableColumn<RecordatorioPago>[] = [
    {
      key: 'fechaEnvio',
      label: 'Fecha Envío',
      render: (_, row) => row.fechaEnvio.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sortable: true
    },
    {
      key: 'medio',
      label: 'Medio',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {obtenerIconoMedio(row.medio)}
          <span className="capitalize">{row.medio}</span>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => (
        <Badge variant={row.tipo === 'automatico' ? 'blue' : 'gray'} size="sm">
          {row.tipo === 'automatico' ? 'Automático' : 'Manual'}
        </Badge>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estado)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Facturas pendientes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Facturas Pendientes
          </h4>
          <Table
            data={facturasConRecordatorios}
            columns={columnas}
            emptyMessage="No hay facturas pendientes"
          />
        </div>
      </Card>

      {/* Historial de recordatorios */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Historial de Recordatorios
          </h4>
          <Table
            data={recordatorios}
            columns={columnasRecordatorios}
            emptyMessage="No hay recordatorios enviados"
          />
        </div>
      </Card>

      {/* Modal de envío */}
      {mostrarModal && facturaSeleccionada && (
        <Modal
          isOpen={true}
          onClose={cerrarModal}
          title="Enviar Recordatorio de Pago"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleEnviarRecordatorio} loading={loading}>
                <Send className="w-4 h-4 mr-2" />
                Enviar Recordatorio
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Factura:</span>
                  <span className="font-medium">{facturaSeleccionada.numeroFactura}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{facturaSeleccionada.cliente.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{facturaSeleccionada.cliente.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto Pendiente:</span>
                  <span className="font-medium text-orange-600">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(facturaSeleccionada.montoPendiente)}
                  </span>
                </div>
              </div>
            </div>

            <Select
              label="Medio de Envío *"
              options={medios}
              value={medio}
              onChange={(e) => setMedio(e.target.value as 'email' | 'sms' | 'whatsapp')}
            />

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Se enviará un recordatorio personalizado a través de {medio} al cliente indicando el monto pendiente y fecha de vencimiento.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

