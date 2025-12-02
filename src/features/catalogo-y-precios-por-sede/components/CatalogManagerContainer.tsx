import React, { useState } from 'react';
import { useBranchCatalog } from '../hooks/useBranchCatalog';
import { BranchSelector } from './BranchSelector';
import { Table, Card, Button, MetricCards, Modal, Input, Badge } from '../../../components/componentsreutilizables';
import { branchesApi } from '../api/branches';
import { catalogApi } from '../api/catalog';
import { Branch, CatalogItem } from '../types';
import { Package, Plus, Search, TrendingUp, Percent, FileText, Edit, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import type { TableColumn } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';

export const CatalogManagerContainer: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [overrideActive, setOverrideActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { data: catalogData, isLoading, error, refetch } = useBranchCatalog(selectedBranchId);

  // Cargar branches al montar
  React.useEffect(() => {
    const loadBranches = async () => {
      const loadedBranches = await branchesApi.obtenerBranches();
      setBranches(loadedBranches);
    };
    loadBranches();
  }, []);

  // Filtrar items por búsqueda
  const filteredItems = React.useMemo(() => {
    if (!catalogData?.items) return [];
    if (!searchTerm) return catalogData.items;

    const term = searchTerm.toLowerCase();
    return catalogData.items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }, [catalogData?.items, searchTerm]);

  const handleEdit = (itemId: string) => {
    const item = catalogData?.items.find(i => i.itemId === itemId);
    if (item) {
      setEditingItem(item);
      setOverridePrice(item.branchPrice.toString());
      setOverrideActive(item.isActive);
      setIsEditModalOpen(true);
    }
  };

  const handleRevert = async (itemId: string) => {
    if (!selectedBranchId || !editingItem) return;

    const item = catalogData?.items.find(i => i.itemId === itemId);
    if (!item?.masterItemId) return;

    try {
      await catalogApi.eliminarOverride(selectedBranchId, item.masterItemId);
      refetch?.();
    } catch (error) {
      console.error('Error al revertir:', error);
    }
  };

  const handleSaveOverride = async () => {
    if (!selectedBranchId || !editingItem || !editingItem.masterItemId) return;

    setIsSaving(true);
    try {
      await catalogApi.crearOverride(selectedBranchId, editingItem.masterItemId, {
        price: parseFloat(overridePrice),
        isActive: overrideActive,
      });
      setIsEditModalOpen(false);
      setEditingItem(null);
      refetch?.();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const columns: TableColumn<CatalogItem>[] = [
    {
      key: 'name',
      label: 'Ítem',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_, item) => (
        <Badge
          variant={
            item.status === 'master' ? 'gray' :
            item.status === 'override' ? 'blue' : 'green'
          }
          size="sm"
        >
          {item.status === 'master' ? 'Heredado' :
           item.status === 'override' ? 'Sobrescrito' : 'Exclusivo'}
        </Badge>
      ),
    },
    {
      key: 'masterPrice',
      label: 'Precio Maestro',
      align: 'right',
      render: (value, item) => (
        item.status === 'exclusive' ? '-' : `€${value.toFixed(2)}`
      ),
    },
    {
      key: 'branchPrice',
      label: 'Precio Sede',
      align: 'right',
      render: (value, item) => (
        <div>
          <div className={`font-semibold ${
            item.status === 'override' && item.branchPrice !== item.masterPrice
              ? 'text-blue-600 dark:text-blue-400'
              : ''
          }`}>
            €{value.toFixed(2)}
          </div>
          {item.status === 'override' && item.branchPrice !== item.masterPrice && (
            <div className="text-xs text-gray-500">
              {item.branchPrice > item.masterPrice ? '+' : ''}
              {(((item.branchPrice - item.masterPrice) / item.masterPrice) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value) => (
        <Badge variant={value ? 'green' : 'red'} size="sm">
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item.itemId)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          {item.status === 'override' && item.masterItemId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevert(item.itemId)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Revertir
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Preparar métricas
  const metrics: MetricCardData[] = catalogData?.stats ? [
    {
      id: 'total-items',
      title: 'Total Ítems',
      value: catalogData.stats.totalItems.toString(),
      icon: <Package size={20} />,
      color: 'info',
    },
    {
      id: 'overridden-items',
      title: 'Ítems Sobrescritos',
      value: catalogData.stats.overriddenItems.toString(),
      subtitle: catalogData.stats.totalItems > 0
        ? `${((catalogData.stats.overriddenItems / catalogData.stats.totalItems) * 100).toFixed(1)}% del total`
        : undefined,
      icon: <TrendingUp size={20} />,
      color: 'warning',
    },
    {
      id: 'avg-deviation',
      title: 'Desviación Promedio',
      value: `${catalogData.stats.avgPriceDeviation > 0 ? '+' : ''}${catalogData.stats.avgPriceDeviation.toFixed(1)}%`,
      icon: <Percent size={20} />,
      color: catalogData.stats.avgPriceDeviation > 0 ? 'success' : 'error',
    },
    {
      id: 'exclusive-items',
      title: 'Ítems Exclusivos',
      value: catalogData.stats.exclusiveItems.toString(),
      icon: <FileText size={20} />,
      color: 'success',
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Selector de Sede */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <BranchSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onSelectBranch={setSelectedBranchId}
          />
        </div>
      </Card>

      {/* Métricas */}
      {catalogData && metrics.length > 0 && (
        <MetricCards data={metrics} columns={4} />
      )}

      {/* Tabla de Catálogo */}
      {selectedBranchId && (
        <>
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implementar modal para añadir ítem exclusivo
              }}
            >
              <Plus size={20} className="mr-2" />
              Añadir Ítem Exclusivo
            </Button>
          </div>

          {/* Sistema de Filtros */}
          <Card className="mb-6 bg-white shadow-sm">
            <div className="space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar ítems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen de resultados */}
              {filteredItems.length > 0 && (
                <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                  <span>{filteredItems.length} resultados encontrados</span>
                  <span>{searchTerm ? '1 filtro aplicado' : ''}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Tabla de Catálogo */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={() => refetch?.()}>Reintentar</Button>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay ítems en el catálogo</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'No hay ítems en el catálogo para esta sede'}
              </p>
              {!searchTerm && (
                <Button
                  variant="primary"
                  onClick={() => {
                    // TODO: Implementar modal para añadir ítem exclusivo
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Añadir Primer Ítem
                </Button>
              )}
            </Card>
          ) : (
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Catálogo: {catalogData?.branchName}
                  </h2>
                  <p className="text-gray-600">
                    Gestiona los ítems del catálogo para esta sede
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Table
                  data={filteredItems}
                  columns={columns}
                  loading={false}
                  emptyMessage="No hay ítems en el catálogo para esta sede"
                />
              </div>
            </Card>
          )}
        </>
      )}

      {!selectedBranchId && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una sede</h3>
          <p className="text-gray-600">
            Por favor, selecciona una sede para visualizar y gestionar su catálogo de productos.
          </p>
        </Card>
      )}

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? `Editar: ${editingItem.name}` : 'Editar Ítem'}
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingItem(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveOverride}
              loading={isSaving}
            >
              Guardar Cambios
            </Button>
          </div>
        }
      >
        {editingItem && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">
                Tipo: {editingItem.type} | Estado: {editingItem.status}
              </p>
              {editingItem.description && (
                <p className="text-gray-600">
                  {editingItem.description}
                </p>
              )}
            </div>

            <Input
              label="Precio en esta Sede"
              type="number"
              step="0.01"
              value={overridePrice}
              onChange={(e) => setOverridePrice(e.target.value)}
              placeholder="0.00"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={overrideActive}
                onChange={(e) => setOverrideActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Ítem activo en esta sede
              </label>
            </div>

            {editingItem.status === 'override' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-slate-600">
                  Precio Maestro: €{editingItem.masterPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
