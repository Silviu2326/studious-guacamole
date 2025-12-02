import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { materialApi, BloqueoMantenimiento } from '../api';
import { Plus, Wrench, AlertCircle } from 'lucide-react';

export const BloqueosMantenimiento: React.FC = () => {
  const [bloqueos, setBloqueos] = useState<BloqueoMantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoBloqueo, setNuevoBloqueo] = useState<Partial<BloqueoMantenimiento>>({
    recursoTipo: 'material',
    estado: 'programado'
  });

  useEffect(() => {
    cargarBloqueos();
  }, []);

  const cargarBloqueos = async () => {
    try {
      setLoading(true);
      const datos = await materialApi.obtenerBloqueos();
      setBloqueos(datos);
    } catch (error) {
      console.error('Error al cargar bloqueos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearBloqueo = async () => {
    try {
      await materialApi.crearBloqueo(nuevoBloqueo);
      setModalAbierto(false);
      setNuevoBloqueo({ recursoTipo: 'material', estado: 'programado' });
      cargarBloqueos();
    } catch (error) {
      console.error('Error al crear bloqueo:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'programado':
        return <span className={`${clases} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>Programado</span>;
      case 'en_curso':
        return <span className={`${clases} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300`}>En Curso</span>;
      case 'completado':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Completado</span>;
      case 'cancelado':
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>Cancelado</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{estado}</span>;
    }
  };

  const columns = [
    {
      key: 'recursoNombre',
      label: 'Recurso',
      render: (value: string, row: BloqueoMantenimiento) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500 capitalize">{row.recursoTipo}</div>
        </div>
      )
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES')
    },
    {
      key: 'fechaFin',
      label: 'Fecha Fin',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES')
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value)
    },
    {
      key: 'responsableNombre',
      label: 'Responsable',
      render: (value: string) => value || 'Sin asignar'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={20} className="mr-2" />
          Nuevo Bloqueo
        </Button>
      </div>

      <Table
        data={bloqueos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay bloqueos programados"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setNuevoBloqueo({ recursoTipo: 'material', estado: 'programado' });
        }}
        title="Nuevo Bloqueo por Mantenimiento"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearBloqueo}>
              Crear Bloqueo
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Recurso</label>
            <Select
              options={[
                { value: 'sala', label: 'Sala' },
                { value: 'material', label: 'Material' }
              ]}
              value={nuevoBloqueo.recursoTipo || 'material'}
              onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, recursoTipo: e.target.value as any })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Recurso</label>
            <Input
              placeholder="Nombre del recurso"
              value={nuevoBloqueo.recursoNombre || ''}
              onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, recursoNombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Motivo</label>
            <Textarea
              placeholder="Describe el motivo del bloqueo..."
              value={nuevoBloqueo.motivo || ''}
              onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, motivo: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha Inicio</label>
              <Input
                type="datetime-local"
                value={nuevoBloqueo.fechaInicio || ''}
                onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha Fin</label>
              <Input
                type="datetime-local"
                value={nuevoBloqueo.fechaFin || ''}
                onChange={(e) => setNuevoBloqueo({ ...nuevoBloqueo, fechaFin: e.target.value })}
              />
            </div>
          </div>
          {bloqueos.length === 0 && (
            <Card className="border-blue-200 bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600">
                  No hay bloqueos existentes. Crea el primer bloqueo para comenzar.
                </p>
              </div>
            </Card>
          )}
        </div>
      </Modal>
    </div>
  );
};

