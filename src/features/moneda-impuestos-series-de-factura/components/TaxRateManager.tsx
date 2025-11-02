import React, { useState } from 'react';
import { Button, Table, Modal, Input, ConfirmModal } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';
import { TaxRate, CreateTaxRequest, UpdateTaxRequest } from '../api/types';
import { Receipt, Plus, Pencil, Trash2, Star } from 'lucide-react';

interface TaxRateManagerProps {
  taxRates: TaxRate[];
  onAdd: (tax: CreateTaxRequest) => Promise<void>;
  onUpdate: (id: string, tax: UpdateTaxRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TaxRateManager: React.FC<TaxRateManagerProps> = ({
  taxRates,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  const [formData, setFormData] = useState({ name: '', rate: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenModal = (tax?: TaxRate) => {
    if (tax) {
      setEditingTaxRate(tax);
      setFormData({ name: tax.name, rate: tax.rate.toString() });
    } else {
      setEditingTaxRate(null);
      setFormData({ name: '', rate: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTaxRate(null);
    setFormData({ name: '', rate: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const rate = parseFloat(formData.rate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        alert('El porcentaje debe estar entre 0 y 100');
        return;
      }

      if (editingTaxRate) {
        await onUpdate(editingTaxRate.id, {
          name: formData.name,
          rate: rate,
        });
      } else {
        await onAdd({
          name: formData.name,
          rate: rate,
          is_default: taxRates.length === 0,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar impuesto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await onUpdate(id, { is_default: true });
    } catch (error) {
      console.error('Error al establecer como predeterminado:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error al eliminar impuesto:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: TaxRate) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          {row.is_default && (
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      key: 'rate',
      label: 'Tasa (%)',
      render: (value: number) => `${value}%`,
      align: 'right' as const,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: TaxRate) => (
        <div className="flex items-center gap-2">
          {!row.is_default && (
            <button
              onClick={() => handleSetDefault(row.id)}
              className="p-2 text-slate-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all"
              title="Establecer como predeterminado"
            >
              <Star size={16} />
            </button>
          )}
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          {!row.is_default && (
            <button
              onClick={() => setDeleteConfirmId(row.id)}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <>
      <Card className="p-0 bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Receipt size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Tipos de Impuesto
                </h3>
                <p className="text-gray-600">
                  Gestiona los tipos impositivos aplicables a tus productos y servicios
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleOpenModal()}
            >
              <Plus size={20} className="mr-2" />
              Añadir Impuesto
            </Button>
          </div>

          <Table
            data={taxRates}
            columns={columns}
            emptyMessage="No hay tipos de impuesto configurados"
          />
        </div>
      </Card>

      {/* Modal de formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTaxRate ? 'Editar Tipo de Impuesto' : 'Añadir Tipo de Impuesto'}
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isSaving}>
              {editingTaxRate ? 'Guardar Cambios' : 'Crear Impuesto'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Impuesto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: IVA General"
            required
          />
          <Input
            label="Tasa (%)"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            placeholder="Ej: 21"
            required
          />
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Eliminar Tipo de Impuesto"
        message="¿Estás seguro de que deseas eliminar este tipo de impuesto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
};

