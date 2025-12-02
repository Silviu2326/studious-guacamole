/**
 * GestorRecordatorios.tsx
 * 
 * Componente central de gestión de recordatorios del módulo de morosidad.
 * 
 * Este componente se utiliza en el tab "Recordatorios" de la página principal de 
 * Pagos Pendientes & Morosidad. Proporciona un centro de control completo para 
 * gestionar todos los recordatorios del sistema.
 * 
 * Funcionalidades:
 * - Listado de recordatorios filtrable por estadoEnvio, tipo, canal y rango de fechas
 * - Programación de nuevos recordatorios manuales
 * - Marcar recordatorios como enviados
 * - Visualización clara de información: cliente, fecha programada, canal, tipo, estado
 * 
 * @component
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Table, TableColumn, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Recordatorio, PagoPendiente } from '../types';
import { recordatoriosMorosidadAPI, FiltrosRecordatoriosProgramados } from '../api/recordatorios';
import { morosidadAPI } from '../api/morosidad';
import { 
  Send, 
  Plus, 
  Mail, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  X,
  Search
} from 'lucide-react';

interface GestorRecordatoriosProps {
  onRefresh?: () => void;
}

interface RecordatorioConCliente extends Recordatorio {
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  facturaNumero?: string;
}

export const GestorRecordatorios: React.FC<GestorRecordatoriosProps> = ({ onRefresh }) => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  // Filtros
  const [filtros, setFiltros] = useState<FiltrosRecordatoriosProgramados>({});
  const [busquedaCliente, setBusquedaCliente] = useState('');
  
  // Formulario nuevo recordatorio
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    clienteId: '',
    facturaId: '',
    planPagoId: '',
    fechaProgramada: new Date(),
    canal: 'email' as Recordatorio['canal'],
    tipo: 'recordatorioVencido' as Recordatorio['tipo'],
    mensaje: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [recordatoriosData, pagosData] = await Promise.all([
        recordatoriosMorosidadAPI.getRecordatoriosProgramados(filtros),
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

  // Enriquecer recordatorios con información del cliente
  const recordatoriosEnriquecidos = useMemo<RecordatorioConCliente[]>(() => {
    return recordatorios.map(recordatorio => {
      const pago = pagos.find(p => 
        (recordatorio.facturaId && p.facturaId === recordatorio.facturaId) ||
        p.cliente.id === recordatorio.clienteId
      );
      
      return {
        ...recordatorio,
        clienteNombre: pago?.cliente.nombre || 'Cliente no encontrado',
        clienteEmail: pago?.cliente.email,
        clienteTelefono: pago?.cliente.telefono,
        facturaNumero: pago?.numeroFactura
      };
    });
  }, [recordatorios, pagos]);

  // Filtrar por búsqueda de cliente
  const recordatoriosFiltrados = useMemo(() => {
    if (!busquedaCliente.trim()) {
      return recordatoriosEnriquecidos;
    }
    
    const busqueda = busquedaCliente.toLowerCase();
    return recordatoriosEnriquecidos.filter(r => 
      r.clienteNombre?.toLowerCase().includes(busqueda) ||
      r.clienteEmail?.toLowerCase().includes(busqueda) ||
      r.facturaNumero?.toLowerCase().includes(busqueda)
    );
  }, [recordatoriosEnriquecidos, busquedaCliente]);

  const handleProgramarRecordatorio = async () => {
    if (!nuevoRecordatorio.clienteId || !nuevoRecordatorio.mensaje.trim()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      await recordatoriosMorosidadAPI.programarRecordatorio({
        clienteId: nuevoRecordatorio.clienteId,
        facturaId: nuevoRecordatorio.facturaId || undefined,
        planPagoId: nuevoRecordatorio.planPagoId || undefined,
        fechaProgramada: nuevoRecordatorio.fechaProgramada,
        canal: nuevoRecordatorio.canal,
        tipo: nuevoRecordatorio.tipo,
        mensaje: nuevoRecordatorio.mensaje
      });
      
      setMostrarModal(false);
      setPagoSeleccionado(null);
      resetearFormulario();
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al programar recordatorio:', error);
      alert('Error al programar el recordatorio');
    }
  };

  const handleMarcarComoEnviado = async (id: string) => {
    try {
      await recordatoriosMorosidadAPI.marcarRecordatorioEnviado(id);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al marcar recordatorio como enviado:', error);
      alert('Error al actualizar el recordatorio');
    }
  };

  const resetearFormulario = () => {
    setNuevoRecordatorio({
      clienteId: '',
      facturaId: '',
      planPagoId: '',
      fechaProgramada: new Date(),
      canal: 'email',
      tipo: 'recordatorioVencido',
      mensaje: ''
    });
  };

  const handleAbrirModal = (pago?: PagoPendiente) => {
    if (pago) {
      setPagoSeleccionado(pago);
      setNuevoRecordatorio({
        clienteId: pago.cliente.id,
        facturaId: pago.facturaId,
        planPagoId: '',
        fechaProgramada: new Date(),
        canal: 'email',
        tipo: 'recordatorioVencido',
        mensaje: `Estimado/a ${pago.cliente.nombre},\n\nLe recordamos que tiene un pago pendiente por la factura ${pago.numeroFactura} con un monto de ${pago.montoPendiente.toLocaleString('es-CO')} COP.\n\nLa fecha de vencimiento fue el ${pago.fechaVencimiento.toLocaleDateString('es-ES')}.\n\nAgradecemos su pronta atención.`
      });
    }
    setMostrarModal(true);
  };

  const obtenerIconoCanal = (canal: Recordatorio['canal']) => {
    switch (canal) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'telefono':
        return <Phone className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const obtenerBadgeEstado = (estado: Recordatorio['estadoEnvio']) => {
    const estados: Record<Recordatorio['estadoEnvio'], { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      enviado: { label: 'Enviado', variant: 'green' },
      error: { label: 'Error', variant: 'red' }
    };
    
    const estadoInfo = estados[estado];
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const obtenerBadgeTipo = (tipo: Recordatorio['tipo']) => {
    const tipos: Record<Recordatorio['tipo'], { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      recordatorioVencido: { label: 'Vencido', variant: 'red' },
      recordatorioPlan: { label: 'Plan de Pago', variant: 'blue' },
      recordatorioGeneral: { label: 'General', variant: 'gray' }
    };
    
    const tipoInfo = tipos[tipo];
    return (
      <Badge variant={tipoInfo.variant} size="sm">
        {tipoInfo.label}
      </Badge>
    );
  };

  const limpiarFiltros = () => {
    setFiltros({});
    setBusquedaCliente('');
  };

  const columnas: TableColumn<RecordatorioConCliente>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.clienteNombre || 'N/A'}</div>
          {row.facturaNumero && (
            <div className="text-sm text-gray-500">Factura: {row.facturaNumero}</div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: 'fechaProgramada',
      label: 'Fecha Programada',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.fechaProgramada.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'canal',
      label: 'Canal',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {obtenerIconoCanal(row.canal)}
          <span className="capitalize">{row.canal}</span>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => obtenerBadgeTipo(row.tipo)
    },
    {
      key: 'estadoEnvio',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estadoEnvio)
    },
    {
      key: 'fechaEnviado',
      label: 'Fecha Envío',
      render: (_, row) => row.fechaEnviado ? (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.fechaEnviado.toLocaleDateString('es-ES')}</span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">-</span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.estadoEnvio === 'pendiente' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarcarComoEnviado(row.id)}
              title="Marcar como enviado"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Gestor de Recordatorios
          </h2>
          <p className="text-gray-600">
            Centro de control para gestionar todos los recordatorios del módulo de morosidad
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            variant="primary"
            onClick={() => handleAbrirModal()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Programar Recordatorio
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Buscar cliente"
                placeholder="Nombre, email o factura"
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
              
              <Select
                label="Estado de Envío"
                value={filtros.estadoEnvio?.[0] || ''}
                onChange={(e) => {
                  const estado = e.target.value as Recordatorio['estadoEnvio'];
                  setFiltros({
                    ...filtros,
                    estadoEnvio: estado ? [estado] : undefined
                  });
                }}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'enviado', label: 'Enviado' },
                  { value: 'error', label: 'Error' }
                ]}
              />
              
              <Select
                label="Tipo"
                value={filtros.tipo?.[0] || ''}
                onChange={(e) => {
                  const tipo = e.target.value as Recordatorio['tipo'];
                  setFiltros({
                    ...filtros,
                    tipo: tipo ? [tipo] : undefined
                  });
                }}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'recordatorioVencido', label: 'Vencido' },
                  { value: 'recordatorioPlan', label: 'Plan de Pago' },
                  { value: 'recordatorioGeneral', label: 'General' }
                ]}
              />
              
              <Select
                label="Canal"
                value={filtros.canal?.[0] || ''}
                onChange={(e) => {
                  const canal = e.target.value as Recordatorio['canal'];
                  setFiltros({
                    ...filtros,
                    canal: canal ? [canal] : undefined
                  });
                }}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'email', label: 'Email' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'telefono', label: 'Teléfono' }
                ]}
              />
              
              <Input
                label="Fecha Desde"
                type="date"
                value={filtros.fechaDesde ? filtros.fechaDesde.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  setFiltros({
                    ...filtros,
                    fechaDesde: e.target.value ? new Date(e.target.value) : undefined
                  });
                }}
              />
              
              <Input
                label="Fecha Hasta"
                type="date"
                value={filtros.fechaHasta ? filtros.fechaHasta.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  setFiltros({
                    ...filtros,
                    fechaHasta: e.target.value ? new Date(e.target.value) : undefined
                  });
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de Recordatorios */}
      <Card>
        <Table
          data={recordatoriosFiltrados}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay recordatorios registrados"
        />
      </Card>

      {/* Modal para programar nuevo recordatorio */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setPagoSeleccionado(null);
          resetearFormulario();
        }}
        title="Programar Nuevo Recordatorio"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                setPagoSeleccionado(null);
                resetearFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleProgramarRecordatorio}
            >
              <Plus className="w-4 h-4 mr-2" />
              Programar Recordatorio
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {pagoSeleccionado && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm">Monto: {pagoSeleccionado.montoPendiente.toLocaleString('es-CO')} COP</p>
              <p className="text-sm">Días de retraso: {pagoSeleccionado.diasRetraso}</p>
            </div>
          )}

          {!pagoSeleccionado && (
            <Select
              label="Cliente"
              value={nuevoRecordatorio.clienteId}
              onChange={(e) => {
                const clienteId = e.target.value;
                const pago = pagos.find(p => p.cliente.id === clienteId);
                setNuevoRecordatorio({
                  ...nuevoRecordatorio,
                  clienteId,
                  facturaId: pago?.facturaId || ''
                });
              }}
              options={[
                { value: '', label: 'Seleccione un cliente' },
                ...Array.from(new Set(pagos.map(p => p.cliente.id))).map(clienteId => {
                  const pago = pagos.find(p => p.cliente.id === clienteId);
                  return {
                    value: clienteId,
                    label: pago?.cliente.nombre || clienteId
                  };
                })
              ]}
            />
          )}

          <Select
            label="Canal"
            value={nuevoRecordatorio.canal}
            onChange={(e) => setNuevoRecordatorio({
              ...nuevoRecordatorio,
              canal: e.target.value as Recordatorio['canal']
            })}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'telefono', label: 'Teléfono' }
            ]}
          />

          <Select
            label="Tipo"
            value={nuevoRecordatorio.tipo}
            onChange={(e) => setNuevoRecordatorio({
              ...nuevoRecordatorio,
              tipo: e.target.value as Recordatorio['tipo']
            })}
            options={[
              { value: 'recordatorioVencido', label: 'Recordatorio Vencido' },
              { value: 'recordatorioPlan', label: 'Recordatorio Plan de Pago' },
              { value: 'recordatorioGeneral', label: 'Recordatorio General' }
            ]}
          />

          <Input
            label="Fecha Programada"
            type="datetime-local"
            value={nuevoRecordatorio.fechaProgramada.toISOString().slice(0, 16)}
            onChange={(e) => setNuevoRecordatorio({
              ...nuevoRecordatorio,
              fechaProgramada: new Date(e.target.value)
            })}
          />

          <Textarea
            label="Mensaje"
            value={nuevoRecordatorio.mensaje}
            onChange={(e) => setNuevoRecordatorio({
              ...nuevoRecordatorio,
              mensaje: e.target.value
            })}
            rows={6}
            placeholder="Ingrese el mensaje del recordatorio..."
          />
        </div>
      </Modal>
    </div>
  );
};

