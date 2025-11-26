import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { materialApi, MantenimientoPreventivo as MantenimientoType, Material } from '../api';
import { Plus, Wrench, AlertTriangle } from 'lucide-react';

export const MantenimientoPreventivo: React.FC = () => {
  const [mantenimientos, setMantenimientos] = useState<MantenimientoType[]>([]);
  const [material, setMaterial] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoMantenimiento, setNuevoMantenimiento] = useState<Partial<MantenimientoType>>({
    estado: 'programado',
    frecuencia: 'mensual'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [mantenimientosData, materialData] = await Promise.all([
        materialApi.obtenerMantenimientosPreventivos(),
        materialApi.obtenerMaterial()
      ]);
      setMantenimientos(mantenimientosData);
      setMaterial(materialData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearMantenimiento = async () => {
    try {
      await materialApi.crearMantenimientoPreventivo(nuevoMantenimiento);
      setModalAbierto(false);
      setNuevoMantenimiento({ estado: 'programado', frecuencia: 'mensual' });
      cargarDatos();
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'programado':
        return <span className={`${clases} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>Programado</span>;
      case 'completado':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Completado</span>;
      case 'atrasado':
        return <span className={`${clases} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>Atrasado</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{estado}</span>;
    }
  };

  const getTipoNombre = (tipo: string) => {
    const nombres: Record<string, string> = {
      limpieza: 'Limpieza',
      revision: 'Revisión',
      calibracion: 'Calibración',
      reparacion: 'Reparación',
      sustitucion: 'Sustitución'
    };
    return nombres[tipo] || tipo;
  };

  const getFrecuenciaNombre = (frecuencia: string) => {
    const nombres: Record<string, string> = {
      diaria: 'Diaria',
      semanal: 'Semanal',
      mensual: 'Mensual',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual'
    };
    return nombres[frecuencia] || frecuencia;
  };

  const mantenimientosAtrasados = mantenimientos.filter(m => {
    if (m.estado === 'atrasado') return true;
    const fechaProxima = new Date(m.fechaProxima);
    const hoy = new Date();
    return fechaProxima < hoy && m.estado !== 'completado';
  });

  const columns = [
    {
      key: 'materialNombre',
      label: 'Material',
      render: (value: string, row: MantenimientoType) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{getTipoNombre(row.tipo)}</div>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => getTipoNombre(value)
    },
    {
      key: 'frecuencia',
      label: 'Frecuencia',
      render: (value: string) => getFrecuenciaNombre(value)
    },
    {
      key: 'fechaUltima',
      label: 'Último',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES')
    },
    {
      key: 'fechaProxima',
      label: 'Próximo',
      render: (value: string, row: MantenimientoType) => {
        const fecha = new Date(value);
        const hoy = new Date();
        const estaAtrasado = fecha < hoy && row.estado !== 'completado';
        
        return (
          <div className="flex items-center gap-2">
            {estaAtrasado && <AlertTriangle className="w-4 h-4 text-red-500" />}
            <span className={estaAtrasado ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
              {fecha.toLocaleDateString('es-ES')}
            </span>
          </div>
        );
      }
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
          Nuevo Mantenimiento
        </Button>
      </div>

      {mantenimientosAtrasados.length > 0 && (
        <Card className="border-red-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-600">
              Mantenimientos Atrasados
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {mantenimientosAtrasados.length} {mantenimientosAtrasados.length === 1 ? 'mantenimiento está' : 'mantenimientos están'} atrasado{mantenimientosAtrasados.length > 1 ? 's' : ''}. 
            Por favor, programa su ejecución.
          </p>
        </Card>
      )}

      <Table
        data={mantenimientos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay mantenimientos programados"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setNuevoMantenimiento({ estado: 'programado', frecuencia: 'mensual' });
        }}
        title="Nuevo Mantenimiento Preventivo"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearMantenimiento}>
              Crear Mantenimiento
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Material</label>
            <Select
              options={[
                { value: '', label: 'Selecciona un material', disabled: true },
                ...material.map(item => ({
                  value: item.id,
                  label: `${item.nombre} - ${item.ubicacion}`
                }))
              ]}
              value={nuevoMantenimiento.materialId || ''}
              onChange={(e) => {
                const materialSeleccionado = material.find(m => m.id === e.target.value);
                setNuevoMantenimiento({ 
                  ...nuevoMantenimiento, 
                  materialId: e.target.value,
                  materialNombre: materialSeleccionado?.nombre
                });
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <Select
                options={[
                  { value: 'limpieza', label: 'Limpieza' },
                  { value: 'revision', label: 'Revisión' },
                  { value: 'calibracion', label: 'Calibración' },
                  { value: 'reparacion', label: 'Reparación' },
                  { value: 'sustitucion', label: 'Sustitución' }
                ]}
                value={nuevoMantenimiento.tipo || ''}
                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, tipo: e.target.value as any })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Frecuencia</label>
              <Select
                options={[
                  { value: 'diaria', label: 'Diaria' },
                  { value: 'semanal', label: 'Semanal' },
                  { value: 'mensual', label: 'Mensual' },
                  { value: 'trimestral', label: 'Trimestral' },
                  { value: 'semestral', label: 'Semestral' },
                  { value: 'anual', label: 'Anual' }
                ]}
                value={nuevoMantenimiento.frecuencia || ''}
                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, frecuencia: e.target.value as any })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha Última</label>
              <Input
                type="date"
                value={nuevoMantenimiento.fechaUltima ? nuevoMantenimiento.fechaUltima.split('T')[0] : ''}
                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, fechaUltima: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha Próxima</label>
              <Input
                type="date"
                value={nuevoMantenimiento.fechaProxima ? nuevoMantenimiento.fechaProxima.split('T')[0] : ''}
                onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, fechaProxima: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

