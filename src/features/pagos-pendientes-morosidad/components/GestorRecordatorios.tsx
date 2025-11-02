import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Table, TableColumn, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { RecordatorioPago, PagoPendiente, TipoRecordatorio, MedioRecordatorio } from '../types';
import { recordatoriosAPI } from '../api/recordatorios';
import { morosidadAPI } from '../api/morosidad';
import { Send, Plus, Mail, MessageSquare, Phone, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface GestorRecordatoriosProps {
  onRefresh?: () => void;
}

export const GestorRecordatorios: React.FC<GestorRecordatoriosProps> = ({ onRefresh }) => {
  const [recordatorios, setRecordatorios] = useState<RecordatorioPago[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    tipo: 'amigable' as TipoRecordatorio,
    medio: 'email' as MedioRecordatorio,
    contenido: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [recordatoriosData, pagosData] = await Promise.all([
        recordatoriosAPI.obtenerTodosRecordatorios(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setRecordatorios(recordatoriosData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerContenidoPredeterminado = (tipo: TipoRecordatorio, pago: PagoPendiente): string => {
    const plantillas = {
      amigable: `Estimado/a ${pago.cliente.nombre},\n\nLe recordamos amablemente que tiene un pago pendiente por la factura ${pago.numeroFactura} con un monto de ${pago.montoPendiente.toLocaleString('es-CO')} COP.\n\nLa fecha de vencimiento fue el ${pago.fechaVencimiento.toLocaleDateString('es-ES')}.\n\nAgradecemos su pronta atención a este asunto.\n\nSaludos cordiales.`,
      firme: `Estimado/a ${pago.cliente.nombre},\n\nSu factura ${pago.numeroFactura} por un monto de ${pago.montoPendiente.toLocaleString('es-CO')} COP se encuentra vencida desde el ${pago.fechaVencimiento.toLocaleDateString('es-ES')} (${pago.diasRetraso} días de retraso).\n\nLe solicitamos realizar el pago a la brevedad posible para evitar mayores complicaciones.\n\nQuedamos atentos.`,
      urgente: `URGENTE: ${pago.cliente.nombre}\n\nSu factura ${pago.numeroFactura} está vencida hace ${pago.diasRetraso} días. Monto pendiente: ${pago.montoPendiente.toLocaleString('es-CO')} COP.\n\nEs necesario que contacte con nosotros inmediatamente para regularizar su situación.\n\nEste es un recordatorio urgente.`,
      escalado: `ATENCIÓN: ${pago.cliente.nombre}\n\nSu factura ${pago.numeroFactura} con ${pago.diasRetraso} días de retraso será escalada a gestión especial.\n\nMonto pendiente: ${pago.montoPendiente.toLocaleString('es-CO')} COP.\n\nContáctenos hoy mismo para evitar acciones adicionales.`
    };
    
    return plantillas[tipo] || plantillas.amigable;
  };

  const handleAbrirModal = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    const tipoRecomendado: TipoRecordatorio = 
      pago.diasRetraso <= 7 ? 'amigable' :
      pago.diasRetraso <= 15 ? 'firme' :
      pago.diasRetraso <= 30 ? 'urgente' : 'escalado';
    
    setNuevoRecordatorio({
      tipo: tipoRecomendado,
      medio: 'email',
      contenido: obtenerContenidoPredeterminado(tipoRecomendado, pago)
    });
    setMostrarModal(true);
  };

  const handleEnviarRecordatorio = async () => {
    if (!pagoSeleccionado) return;
    
    try {
      await recordatoriosAPI.crearRecordatorio({
        pagoPendienteId: pagoSeleccionado.id,
        tipo: nuevoRecordatorio.tipo,
        medio: nuevoRecordatorio.medio,
        contenido: nuevoRecordatorio.contenido,
        estado: 'pendiente'
      });
      
      await recordatoriosAPI.enviarRecordatorio(Date.now().toString());
      
      setMostrarModal(false);
      setPagoSeleccionado(null);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
    }
  };

  const obtenerIconoMedio = (medio: MedioRecordatorio) => {
    switch (medio) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'llamada':
        return <Phone className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const obtenerBadgeEstado = (estado: string) => {
    const estados: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      enviado: { label: 'Enviado', variant: 'green' },
      fallido: { label: 'Fallido', variant: 'red' },
      cancelado: { label: 'Cancelado', variant: 'gray' }
    };
    
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const columnas: TableColumn<RecordatorioPago>[] = [
    {
      key: 'fechaEnvio',
      label: 'Fecha',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.fechaEnvio.toLocaleDateString('es-ES')}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => (
        <Badge variant={row.tipo === 'urgente' || row.tipo === 'escalado' ? 'red' : row.tipo === 'firme' ? 'yellow' : 'green'} size="sm">
          {row.tipo}
        </Badge>
      )
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
      key: 'contenido',
      label: 'Contenido',
      render: (_, row) => (
        <div className="max-w-md truncate">
          {row.contenido}
        </div>
      )
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
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await recordatoriosAPI.enviarRecordatorio(row.id);
                cargarDatos();
              }}
              title="Enviar ahora"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Gestión de Recordatorios
          </h2>
          <p className="text-gray-600">
            Gestione recordatorios escalonados para pagos pendientes
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const pagoNoRecordado = pagos.find(p => p.recordatoriosEnviados === 0);
            if (pagoNoRecordado) {
              handleAbrirModal(pagoNoRecordado);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Recordatorio
        </Button>
      </div>

      <Table
        data={recordatorios}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay recordatorios registrados"
      />

      {pagos.filter(p => p.diasRetraso > 0 && p.recordatoriosEnviados < 3).length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Pagos que requieren recordatorio
            </h4>
            <div className="space-y-2">
              {pagos
                .filter(p => p.diasRetraso > 0 && p.recordatoriosEnviados < 3)
                .map(pago => (
                    <div
                      key={pago.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                    <div>
                      <span className="font-medium">{pago.numeroFactura}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        - {pago.cliente.nombre} ({pago.diasRetraso} días de retraso)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAbrirModal(pago)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Recordatorio
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setPagoSeleccionado(null);
        }}
        title="Enviar Recordatorio"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                setPagoSeleccionado(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleEnviarRecordatorio}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Recordatorio
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm">Monto: {pagoSeleccionado.montoPendiente.toLocaleString('es-CO')} COP</p>
              <p className="text-sm">Días de retraso: {pagoSeleccionado.diasRetraso}</p>
            </div>

            <Select
              label="Tipo de Recordatorio"
              value={nuevoRecordatorio.tipo}
              onChange={(e) => {
                const tipo = e.target.value as TipoRecordatorio;
                setNuevoRecordatorio({
                  ...nuevoRecordatorio,
                  tipo,
                  contenido: obtenerContenidoPredeterminado(tipo, pagoSeleccionado)
                });
              }}
              options={[
                { value: 'amigable', label: 'Amigable (1-7 días)' },
                { value: 'firme', label: 'Firme (8-15 días)' },
                { value: 'urgente', label: 'Urgente (16-30 días)' },
                { value: 'escalado', label: 'Escalado (+30 días)' }
              ]}
            />

            <Select
              label="Medio de Envío"
              value={nuevoRecordatorio.medio}
              onChange={(e) => setNuevoRecordatorio({
                ...nuevoRecordatorio,
                medio: e.target.value as MedioRecordatorio
              })}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'llamada', label: 'Llamada telefónica' }
              ]}
            />

            <Textarea
              label="Contenido del Recordatorio"
              value={nuevoRecordatorio.contenido}
              onChange={(e) => setNuevoRecordatorio({
                ...nuevoRecordatorio,
                contenido: e.target.value
              })}
              rows={8}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

