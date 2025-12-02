import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SuppliersTable } from './SuppliersTable';
import { SupplierFormModal } from './SupplierFormModal';
import { Button, Card, Input, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Supplier, SupplierFormData, SuppliersFilter, SUPPLIER_CATEGORIES } from '../types';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

interface SuppliersDashboardContainerProps {
  gymId: string;
}

export const SuppliersDashboardContainer: React.FC<SuppliersDashboardContainerProps> = ({
  gymId,
}) => {
  const [filters, setFilters] = useState<SuppliersFilter>({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const { suppliers, isLoading, pagination, createSupplier, updateSupplier } = useSuppliers({
    gymId,
    filters: {
      ...filters,
      search: searchTerm || undefined,
    },
  });

  const handleCreate = () => {
    setSelectedSupplier(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleViewDetails = (supplierId: string) => {
    // TODO: Implementar vista de detalles
    console.log('View details for supplier:', supplierId);
  };

  const handleSubmit = async (formData: SupplierFormData) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, formData);
      } else {
        await createSupplier(formData);
      }
      setIsModalOpen(false);
      setSelectedSupplier(undefined);
    } catch (error) {
      console.error('Error saving supplier:', error);
      // TODO: Mostrar notificación de error
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(undefined);
  };

  const handleFilterChange = (key: keyof SuppliersFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  // Calcular métricas
  const totalSuppliers = pagination.total;
  const approvedSuppliers = suppliers.filter((s) => s.status === 'approved').length;
  const pendingSuppliers = suppliers.filter((s) => s.status === 'pending_approval').length;
  const averageRating =
    suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length
      : 0;

  const metrics = [
    {
      id: 'total',
      title: 'Total Proveedores',
      value: totalSuppliers.toString(),
      icon: <Building2 className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'approved',
      title: 'Aprobados',
      value: approvedSuppliers.toString(),
      icon: <Building2 className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'pending',
      title: 'Pendientes',
      value: pendingSuppliers.toString(),
      icon: <Building2 className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'rating',
      title: 'Calificación Media',
      value: averageRating > 0 ? averageRating.toFixed(1) : 'N/A',
      icon: <Building2 className="w-5 h-5" />,
      color: 'info' as const,
    },
  ];

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...SUPPLIER_CATEGORIES.map((cat) => ({
      value: cat,
      label: cat,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'pending_approval', label: 'Pendiente' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards metrics={metrics} />

      {/* Filtros y búsqueda */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Proveedores
            </h2>
            <Button onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
              Nuevo Proveedor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
                placeholder="Buscar por nombre, email, teléfono..."
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <Select
              label="Categoría"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              options={categoryOptions}
            />

            <Select
              label="Estado"
              value={filters.status || ''}
              onChange={(e) =>
                handleFilterChange(
                  'status',
                  (e.target.value || undefined) as SuppliersFilter['status']
                )
              }
              options={statusOptions}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de proveedores */}
      <SuppliersTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        loading={isLoading}
      />

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Card>
          <div className="p-4 flex items-center justify-between">
            <div className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} -{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} proveedores
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de formulario */}
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedSupplier}
        loading={isLoading}
      />
    </div>
  );
};

