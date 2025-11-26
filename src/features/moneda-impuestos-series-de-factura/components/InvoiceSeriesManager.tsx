import React, { useState } from 'react';
import { Button, Table, Card } from '../../../components/componentsreutilizables';
import { InvoiceSeriesForm } from './InvoiceSeriesForm';
import { ConfirmModal } from '../../../components/componentsreutilizables';
import { InvoiceSeries, Location, CreateInvoiceSeriesRequest, UpdateInvoiceSeriesRequest } from '../api/types';
import { FileText, Plus, Pencil, Trash2, Star, MapPin } from 'lucide-react';

interface InvoiceSeriesManagerProps {
  invoiceSeries: InvoiceSeries[];
  locations?: Location[];
  isGym: boolean;
  onAdd: (data: CreateInvoiceSeriesRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateInvoiceSeriesRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const InvoiceSeriesManager: React.FC<InvoiceSeriesManagerProps> = ({
  invoiceSeries,
  locations = [],
  isGym,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<InvoiceSeries | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenForm = (series?: InvoiceSeries) => {
    setEditingSeries(series || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSeries(null);
  };

  const handleSubmit = async (data: CreateInvoiceSeriesRequest | UpdateInvoiceSeriesRequest) => {
    if (editingSeries) {
      await onUpdate(editingSeries.id, data as UpdateInvoiceSeriesRequest);
    } else {
      await onAdd(data as CreateInvoiceSeriesRequest);
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error al eliminar serie:', error);
    }
  };

  const getLocationName = (locationId: string | null): string => {
    if (!locationId) return 'General';
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : 'Desconocida';
  };

  const formatPreview = (series: InvoiceSeries): string => {
    return series.format
      .replace('{YYYY}', new Date().getFullYear().toString())
      .replace('{####}', series.next_number.toString().padStart(4, '0'));
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: string, row: InvoiceSeries) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          {row.is_default && (
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      key: 'format',
      label: 'Formato',
      render: (value: string, row: InvoiceSeries) => (
        <code className="text-sm bg-slate-100 px-2 py-1 rounded-lg text-slate-900">
          {value}
        </code>
      ),
    },
    {
      key: 'preview',
      label: 'Vista Previa',
      render: (_: any, row: InvoiceSeries) => (
        <span className="font-medium">{formatPreview(row)}</span>
      ),
    },
    {
      key: 'next_number',
      label: 'Próximo Número',
      render: (value: number) => value.toString(),
      align: 'right' as const,
    },
    ...(isGym
      ? [
          {
            key: 'location_id',
            label: 'Sede',
            render: (_: any, row: InvoiceSeries) => (
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin size={16} />
                <span>{getLocationName(row.location_id)}</span>
              </div>
            ),
          },
        ]
      : []),
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: InvoiceSeries) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenForm(row)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteConfirmId(row.id)}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
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
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Series de Facturación
                </h3>
                <p className="text-gray-600">
                  Gestiona los formatos y contadores para la numeración de facturas
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleOpenForm()}
            >
              <Plus size={20} className="mr-2" />
              Añadir Serie
            </Button>
          </div>

          <Table
            data={invoiceSeries}
            columns={columns}
            emptyMessage="No hay series de facturación configuradas"
          />
        </div>
      </Card>

      <InvoiceSeriesForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingSeries || undefined}
        locations={locations}
        isGym={isGym}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Eliminar Serie de Facturación"
        message="¿Estás seguro de que deseas eliminar esta serie? Esta acción no se puede deshacer. Las facturas ya emitidas no se verán afectadas."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
};

