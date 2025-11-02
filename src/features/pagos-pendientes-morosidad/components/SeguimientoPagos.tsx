import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Table, TableColumn, Modal, Textarea, Input, Select } from '../../../components/componentsreutilizables';
import { SeguimientoPago, PagoPendiente } from '../types';
import { seguimientoAPI } from '../api/seguimiento';
import { morosidadAPI } from '../api/morosidad';
import { Plus, Calendar, User, FileText, Phone, Mail, Briefcase, Scale, Clock } from 'lucide-react';

interface SeguimientoPagosProps {
  onRefresh?: () => void;
}

export const SeguimientoPagos: React.FC<SeguimientoPagosProps> = ({ onRefresh }) => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoPago[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    tipo: 'contacto' as const,
    accion: '',
    notas: '',
    proximaSeguimiento: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [seguimientosData, pagosData] = await Promise.all([
        seguimientoAPI.obtenerTodosSeguimientos(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setSeguimientos(seguimientosData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setNuevoSeguimiento({
      tipo: 'contacto',
      accion: '',
      notas: '',
      proximaSeguimiento: ''
    });
    setMostrarModal(true);
  };

  const handleCrearSeguimiento = async () => {
    if (!pagoSeleccionado) return;
    
    try {
      await seguimientoAPI.crearSeguimiento({
        pagoPendienteId: pagoSeleccionado.id,
        accion: nuevoSeguimiento.accion,
        tipo: nuevoSeguimiento.tipo,
        usuario: 'usuario1', // TODO: obtener del contexto de auth
        notas: nuevoSeguimiento.notas,
        proximaSeguimiento: nuevoSeguimiento.proximaSeguimiento ? new Date(nuevoSeguimiento.proximaSeguimiento) : undefined
      });
      
      setMostrarModal(false);
      setPagoSeleccionado(null);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al crear seguimiento:', error);
    }
  };

  const obtenerIconoTipo = (tipo: string) => {
    const iconos: Record<string, React.ReactNode> = {
      recordatorio: <Mail className="w-4 h-4" />,
      contacto: <Phone className="w-4 h-4" />,
      negociacion: <Briefcase className="w-4 h-4" />,
      pago_parcial: <Clock className="w-4 h-4" />,
      pago_completo: <Clock className="w-4 h-4" />,
      legal: <Scale className="w-4 h-4" />,
      otro: <FileText className="w-4 h-4" />
    };
    return iconos[tipo] || <FileText className="w-4 h-4" />;
  };

  const obtenerBadgeTipo = (tipo: string) => {
    const tipos: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      recordatorio: { label: 'Recordatorio', variant: 'blue' },
      contacto: { label: 'Contacto', variant: 'blue' },
      negociacion: { label: 'Negociación', variant: 'yellow' },
      pago_parcial: { label: 'Pago Parcial', variant: 'green' },
      pago_completo: { label: 'Pago Completo', variant: 'green' },
      legal: { label: 'Legal', variant: 'red' },
      otro: { label: 'Otro', variant: 'gray' }
    };
    
    const tipoInfo = tipos[tipo] || tipos.otro;
    return (
      <Badge variant={tipoInfo.variant} size="sm">
        {tipoInfo.label}
      </Badge>
    );
  };

  const columnas: TableColumn<SeguimientoPago>[] = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.fecha.toLocaleDateString('es-ES')}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {obtenerIconoTipo(row.tipo)}
          {obtenerBadgeTipo(row.tipo)}
        </div>
      )
    },
    {
      key: 'accion',
      label: 'Acción',
      render: (_, row) => (
        <div className="font-medium">{row.accion}</div>
      )
    },
    {
      key: 'usuario',
      label: 'Usuario',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{row.usuario}</span>
        </div>
      )
    },
    {
      key: 'notas',
      label: 'Notas',
      render: (_, row) => (
        <div className="max-w-md truncate text-gray-600">
          {row.notas || '-'}
        </div>
      )
    },
    {
      key: 'proximaSeguimiento',
      label: 'Próximo Seguimiento',
      render: (_, row) => row.proximaSeguimiento ? (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{row.proximaSeguimiento.toLocaleDateString('es-ES')}</span>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Seguimiento de Pagos
          </h2>
          <p className="text-gray-600">
            Registre y gestione el seguimiento de cada pago pendiente
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const pagoVencido = pagos.find(p => p.diasRetraso > 0);
            if (pagoVencido) {
              handleAbrirModal(pagoVencido);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Seguimiento
        </Button>
      </div>

      <Table
        data={seguimientos}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay seguimientos registrados"
      />

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setPagoSeleccionado(null);
        }}
        title="Registrar Seguimiento"
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
              onClick={handleCrearSeguimiento}
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Seguimiento
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg ring-1 ring-slate-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm text-gray-600">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm text-gray-600">Monto Pendiente: {pagoSeleccionado.montoPendiente.toLocaleString('es-CO')} COP</p>
              <p className="text-sm text-gray-600">Días de retraso: {pagoSeleccionado.diasRetraso}</p>
            </div>

            <Select
              label="Tipo de Seguimiento"
              value={nuevoSeguimiento.tipo}
              onChange={(e) => setNuevoSeguimiento({
                ...nuevoSeguimiento,
                tipo: e.target.value as any
              })}
              options={[
                { value: 'recordatorio', label: 'Recordatorio' },
                { value: 'contacto', label: 'Contacto' },
                { value: 'negociacion', label: 'Negociación' },
                { value: 'pago_parcial', label: 'Pago Parcial' },
                { value: 'pago_completo', label: 'Pago Completo' },
                { value: 'legal', label: 'Legal' },
                { value: 'otro', label: 'Otro' }
              ]}
            />

            <Input
              label="Acción Realizada"
              value={nuevoSeguimiento.accion}
              onChange={(e) => setNuevoSeguimiento({
                ...nuevoSeguimiento,
                accion: e.target.value
              })}
              placeholder="Ej: Llamada telefónica realizada, Reunión programada..."
            />

            <Textarea
              label="Notas"
              value={nuevoSeguimiento.notas}
              onChange={(e) => setNuevoSeguimiento({
                ...nuevoSeguimiento,
                notas: e.target.value
              })}
              rows={4}
              placeholder="Detalles adicionales del seguimiento..."
            />

            <Input
              label="Próximo Seguimiento (opcional)"
              type="date"
              value={nuevoSeguimiento.proximaSeguimiento}
              onChange={(e) => setNuevoSeguimiento({
                ...nuevoSeguimiento,
                proximaSeguimiento: e.target.value
              })}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

