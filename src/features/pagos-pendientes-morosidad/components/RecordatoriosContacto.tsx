import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableColumn, Badge, Modal, Input, Textarea } from '../../../components/componentsreutilizables';
import { RecordatorioContacto, PagoPendiente } from '../types';
import { recordatoriosContactoAPI } from '../api/recordatoriosContacto';
import { morosidadAPI } from '../api/morosidad';
import { Calendar, Plus, CheckCircle, Clock, X } from 'lucide-react';

interface RecordatoriosContactoProps {
  onRefresh?: () => void;
}

export const RecordatoriosContacto: React.FC<RecordatoriosContactoProps> = ({ onRefresh }) => {
  const [recordatorios, setRecordatorios] = useState<RecordatorioContacto[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    fechaRecordatorio: '',
    nota: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [recordatoriosData, pagosData] = await Promise.all([
        recordatoriosContactoAPI.obtenerTodos(),
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

  const handleAbrirModal = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    // Establecer fecha por defecto: hoy
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    setNuevoRecordatorio({
      fechaRecordatorio: fechaStr,
      nota: ''
    });
    setMostrarModal(true);
  };

  const handleCrearRecordatorio = async () => {
    if (!pagoSeleccionado || !nuevoRecordatorio.fechaRecordatorio) {
      return;
    }
    
    try {
      await recordatoriosContactoAPI.crear({
        pagoPendienteId: pagoSeleccionado.id,
        clienteId: pagoSeleccionado.cliente.id,
        clienteNombre: pagoSeleccionado.cliente.nombre,
        fechaRecordatorio: new Date(nuevoRecordatorio.fechaRecordatorio),
        nota: nuevoRecordatorio.nota.trim() || undefined,
        creadoPor: 'usuario_actual'
      });
      
      setMostrarModal(false);
      setPagoSeleccionado(null);
      setNuevoRecordatorio({ fechaRecordatorio: '', nota: '' });
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al crear recordatorio:', error);
    }
  };

  const handleMarcarCompletado = async (id: string) => {
    try {
      await recordatoriosContactoAPI.marcarCompletado(id);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al marcar como completado:', error);
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este recordatorio?')) {
      try {
        await recordatoriosContactoAPI.eliminar(id);
        cargarDatos();
        onRefresh?.();
      } catch (error) {
        console.error('Error al eliminar recordatorio:', error);
      }
    }
  };

  const obtenerEstadoRecordatorio = (recordatorio: RecordatorioContacto) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaRec = new Date(recordatorio.fechaRecordatorio);
    fechaRec.setHours(0, 0, 0, 0);
    
    if (recordatorio.completado) {
      return { label: 'Completado', variant: 'green' as const, icon: CheckCircle };
    } else if (fechaRec < hoy) {
      return { label: 'Vencido', variant: 'red' as const, icon: Clock };
    } else if (fechaRec.getTime() === hoy.getTime()) {
      return { label: 'Hoy', variant: 'yellow' as const, icon: Clock };
    } else {
      return { label: 'Pendiente', variant: 'blue' as const, icon: Calendar };
    }
  };

  const columnas: TableColumn<RecordatorioContacto>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div className="font-medium">{row.clienteNombre}</div>
      )
    },
    {
      key: 'fechaRecordatorio',
      label: 'Fecha Recordatorio',
      render: (_, row) => {
        const estado = obtenerEstadoRecordatorio(row);
        const Icon = estado.icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span>{row.fechaRecordatorio.toLocaleDateString('es-ES')}</span>
          </div>
        );
      },
      sortable: true
    },
    {
      key: 'nota',
      label: 'Nota',
      render: (_, row) => (
        <div className="max-w-md">
          {row.nota ? (
            <span className="text-sm text-gray-700">{row.nota}</span>
          ) : (
            <span className="text-sm text-gray-400 italic">Sin nota</span>
          )}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => {
        const estado = obtenerEstadoRecordatorio(row);
        return (
          <Badge variant={estado.variant} size="sm">
            {estado.label}
          </Badge>
        );
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          {!row.completado && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarcarCompletado(row.id)}
              title="Marcar como completado"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(row.id)}
            title="Eliminar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Recordatorios de Contacto
          </h2>
          <p className="text-gray-600">
            Programe recordatorios para contactar a clientes en fechas específicas
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const primerPago = pagos.find(p => p.estado !== 'pagado');
            if (primerPago) {
              handleAbrirModal(primerPago);
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
        emptyMessage="No hay recordatorios programados"
      />

      {/* Lista de pagos pendientes para crear recordatorios rápidos */}
      {pagos.filter(p => p.estado !== 'pagado').length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Pagos pendientes - Crear recordatorio rápido
            </h4>
            <div className="space-y-2">
              {pagos
                .filter(p => p.estado !== 'pagado')
                .slice(0, 5)
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
                      <Plus className="w-4 h-4 mr-2" />
                      Programar Recordatorio
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
          setNuevoRecordatorio({ fechaRecordatorio: '', nota: '' });
        }}
        title="Programar Recordatorio de Contacto"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                setPagoSeleccionado(null);
                setNuevoRecordatorio({ fechaRecordatorio: '', nota: '' });
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearRecordatorio}
              disabled={!nuevoRecordatorio.fechaRecordatorio}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Programar Recordatorio
            </Button>
          </div>
        }
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Cliente: {pagoSeleccionado.cliente.nombre}</p>
              <p className="text-sm">Factura: {pagoSeleccionado.numeroFactura}</p>
              <p className="text-sm">Monto Pendiente: {pagoSeleccionado.montoPendiente.toLocaleString('es-CO')} COP</p>
              <p className="text-sm">Días de retraso: {pagoSeleccionado.diasRetraso}</p>
            </div>

            <Input
              label="Fecha del Recordatorio"
              type="date"
              value={nuevoRecordatorio.fechaRecordatorio}
              onChange={(e) => setNuevoRecordatorio({
                ...nuevoRecordatorio,
                fechaRecordatorio: e.target.value
              })}
              required
            />

            <Textarea
              label="Nota (opcional)"
              value={nuevoRecordatorio.nota}
              onChange={(e) => setNuevoRecordatorio({
                ...nuevoRecordatorio,
                nota: e.target.value
              })}
              rows={4}
              placeholder="Ej: Cliente prometió pagar esta semana, recordar contactar..."
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

