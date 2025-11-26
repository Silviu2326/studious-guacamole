import React, { useState, useMemo } from 'react';
import { MotivoBaja, CreateMotivoBajaRequest, UpdateMotivoBajaRequest } from '../types';
import { Card, Button, Input, Select, Modal, Table } from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

interface MotivosBajaProps {
  motivos: MotivoBaja[];
  onAddMotivo: (motivo: CreateMotivoBajaRequest) => Promise<void>;
  onUpdateMotivo: (id: string, motivo: UpdateMotivoBajaRequest) => Promise<void>;
  onDeleteMotivo: (id: string) => Promise<void>;
  loading?: boolean;
}

export const MotivosBaja: React.FC<MotivosBajaProps> = ({
  motivos,
  onAddMotivo,
  onUpdateMotivo,
  onDeleteMotivo,
  loading = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMotivo, setEditingMotivo] = useState<MotivoBaja | null>(null);
  const [formData, setFormData] = useState<CreateMotivoBajaRequest>({
    nombre: '',
    categoria: 'Motivos Economicos',
    descripcion: '',
  });

  const motivosPorCategoria = useMemo(() => {
    return motivos.reduce((acc, motivo) => {
      if (!acc[motivo.categoria]) {
        acc[motivo.categoria] = [];
      }
      acc[motivo.categoria].push(motivo);
      return acc;
    }, {} as Record<string, MotivoBaja[]>);
  }, [motivos]);

  const categoriasOptions = [
    { value: 'Motivos Economicos', label: 'Motivos Económicos' },
    { value: 'Motivos Personales', label: 'Motivos Personales' },
    { value: 'Motivos de Servicio', label: 'Motivos de Servicio' },
    { value: 'Motivos de Ubicacion', label: 'Motivos de Ubicación' },
    { value: 'Motivos de Salud', label: 'Motivos de Salud' },
  ];

  const handleSubmit = async () => {
    if (editingMotivo) {
      await onUpdateMotivo(editingMotivo.id, formData);
      setEditingMotivo(null);
    } else {
      await onAddMotivo(formData);
    }
    setFormData({ nombre: '', categoria: 'Motivos Economicos', descripcion: '' });
    setShowAddForm(false);
  };

  const handleEdit = (motivo: MotivoBaja) => {
    setEditingMotivo(motivo);
    setFormData({
      nombre: motivo.nombre,
      categoria: motivo.categoria,
      descripcion: motivo.descripcion || '',
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMotivo(null);
    setFormData({ nombre: '', categoria: 'Motivos Economicos', descripcion: '' });
  };

  const columns: TableColumn<MotivoBaja>[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (_, row) => <div className="font-semibold">{row.nombre}</div>,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (_, row) => (
        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
          {row.categoria}
        </span>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (_, row) => <div className="text-sm text-gray-600">{row.descripcion || '-'}</div>,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (_, row) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            row.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            <Edit size={20} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDeleteMotivo(row.id)}>
            <Trash2 size={20} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={20} className="mr-2" />
          Agregar Motivo
        </Button>
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={handleCancel}
        title={editingMotivo ? 'Editar Motivo de Baja' : 'Agregar Motivo de Baja'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Motivo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Precio elevado"
          />
          <Select
            label="Categoría"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value as typeof formData.categoria })
            }
            options={categoriasOptions}
          />
          <Input
            label="Descripción (opcional)"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción detallada del motivo"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              <X size={20} className="mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Check size={20} className="mr-2" />
              {editingMotivo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tabla de Motivos */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={motivos}
          columns={columns}
          loading={loading}
          emptyMessage="No hay motivos de baja configurados"
        />
      </Card>
    </div>
  );
};
