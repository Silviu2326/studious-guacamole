import React, { useState, useEffect } from 'react';
import { KPI } from '../types';
import { getKPIs, createKPI, updateKPI } from '../api/metrics';
import { Card, Button, Table, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Settings, Plus, Edit2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

interface KPIConfiguratorProps {
  role: 'entrenador' | 'gimnasio';
}

export const KPIConfigurator: React.FC<KPIConfiguratorProps> = ({ role }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);

  useEffect(() => {
    loadKPIs();
  }, [role]);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const data = await getKPIs(role);
      setKpis(data);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingKPI(null);
    setIsModalOpen(true);
  };

  const handleEdit = (kpi: KPI) => {
    setEditingKPI(kpi);
    setIsModalOpen(true);
  };

  const handleToggle = async (kpi: KPI) => {
    try {
      await updateKPI(kpi.id, { enabled: !kpi.enabled });
      loadKPIs();
    } catch (error) {
      console.error('Error toggling KPI:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'KPI',
      render: (value: string, row: KPI) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {row.description && (
            <div className="text-xs text-gray-500 mt-1">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (value: string) => (
        <Badge variant="blue">{value}</Badge>
      ),
    },
    {
      key: 'unit',
      label: 'Unidad',
    },
    {
      key: 'enabled',
      label: 'Estado',
      render: (value: boolean, row: KPI) => (
        <button
          onClick={() => handleToggle(row)}
          className="flex items-center gap-2"
        >
          {value ? (
            <ToggleRight className="w-6 h-6 text-green-600" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
          <Badge variant={value ? 'green' : 'gray'}>
            {value ? 'Activo' : 'Inactivo'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: KPI) => (
        <button
          onClick={() => handleEdit(row)}
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Nuevo KPI
        </Button>
      </div>

      {/* Tabla de KPIs */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : (
        <Table
          data={kpis}
          columns={columns}
          loading={false}
          emptyMessage="No hay KPIs configurados"
        />
      )}

      <KPIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKPI(null);
        }}
        onSave={loadKPIs}
        kpi={editingKPI}
        role={role}
      />
    </div>
  );
};

interface KPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpi?: KPI | null;
  role: 'entrenador' | 'gimnasio';
}

const KPIModal: React.FC<KPIModalProps> = ({ isOpen, onClose, onSave, kpi, role }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metric: '',
    unit: '',
    category: '',
    enabled: true,
    target: '',
  });

  useEffect(() => {
    if (kpi) {
      setFormData({
        name: kpi.name,
        description: kpi.description || '',
        metric: kpi.metric,
        unit: kpi.unit,
        category: kpi.category,
        enabled: kpi.enabled,
        target: kpi.target?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        metric: '',
        unit: '',
        category: '',
        enabled: true,
        target: '',
      });
    }
  }, [kpi, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (kpi) {
        await updateKPI(kpi.id, {
          ...formData,
          target: formData.target ? parseFloat(formData.target) : undefined,
        });
      } else {
        await createKPI({
          ...formData,
          target: formData.target ? parseFloat(formData.target) : undefined,
          role: [role],
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving KPI:', error);
      alert('Error al guardar el KPI');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={kpi ? 'Editar KPI' : 'Nuevo KPI'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          label="Métrica"
          value={formData.metric}
          onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
          placeholder="facturacion, adherencia, ocupacion..."
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unidad"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="€, %, clientes..."
            required
          />
          <Input
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="financiero, operacional..."
            required
          />
        </div>
        <Input
          label="Objetivo (opcional)"
          type="number"
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          placeholder="Valor objetivo"
        />
      </form>
    </Modal>
  );
};

