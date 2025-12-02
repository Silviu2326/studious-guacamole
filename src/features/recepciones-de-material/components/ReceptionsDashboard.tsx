import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { Select, SelectOption } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { Modal } from '../../../components/componentsreutilizables';
import { ReceptionsTable } from './ReceptionsTable';
import { NewReceptionModal } from './NewReceptionModal';
import { receptionsApi } from '../api/receptionsApi';
import {
  Reception,
  ReceptionFilters,
  ReceptionDetailsResponse
} from '../types';
import {
  Package,
  Plus,
  Filter,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

export const ReceptionsDashboard: React.FC = () => {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReception, setSelectedReception] = useState<ReceptionDetailsResponse | null>(null);
  const [filters, setFilters] = useState<ReceptionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);

  // Métricas
  const [metrics, setMetrics] = useState<MetricCardData[]>([
    { id: 'total', title: 'Total Recepciones', value: '0', trend: { value: 0, direction: 'up' } },
    { id: 'completed', title: 'Completadas', value: '0', trend: { value: 0, direction: 'neutral' } },
    { id: 'partial', title: 'Parciales', value: '0', trend: { value: 0, direction: 'neutral' } },
    { id: 'discrepancies', title: 'Con Discrepancias', value: '0', trend: { value: 0, direction: 'down' } }
  ]);

  useEffect(() => {
    loadReceptions();
    loadSuppliers();
  }, [currentPage, filters]);

  const loadReceptions = async () => {
    setIsLoading(true);
    try {
      const response = await receptionsApi.getReceptions(filters, currentPage, 10);
      setReceptions(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
      updateMetrics(response.data);
    } catch (error) {
      console.error('Error loading receptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const supplierList = await receptionsApi.getSuppliers();
      setSuppliers(supplierList.map(s => ({
        value: s.id,
        label: s.name
      })));
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const updateMetrics = (data: Reception[]) => {
    const total = data.length;
    const completed = data.filter(r => r.status === 'completed').length;
    const partial = data.filter(r => r.status === 'partial').length;
    const withDiscrepancies = data.filter(r => (r.discrepancyCount || 0) > 0).length;

    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const partialPercent = total > 0 ? Math.round((partial / total) * 100) : 0;
    const discrepanciesPercent = total > 0 ? Math.round((withDiscrepancies / total) * 100) : 0;

    setMetrics([
      {
        id: 'total',
        title: 'Total Recepciones',
        value: total.toString(),
        subtitle: `de ${totalItems} totales`,
        trend: { value: 0, direction: 'up' }
      },
      {
        id: 'completed',
        title: 'Completadas',
        value: completed.toString(),
        subtitle: `${completedPercent}% del total`,
        trend: { value: completedPercent, direction: completed > 0 ? 'up' : 'neutral' }
      },
      {
        id: 'partial',
        title: 'Parciales',
        value: partial.toString(),
        subtitle: `${partialPercent}% del total`,
        trend: { value: partialPercent, direction: partial > 0 ? 'down' : 'neutral' }
      },
      {
        id: 'discrepancies',
        title: 'Con Discrepancias',
        value: withDiscrepancies.toString(),
        subtitle: `${discrepanciesPercent}% del total`,
        trend: { value: discrepanciesPercent, direction: 'down' }
      }
    ]);
  };

  const handleViewDetails = async (receptionId: string) => {
    try {
      const details = await receptionsApi.getReceptionById(receptionId);
      if (details) {
        setSelectedReception(details);
        setIsDetailsModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading reception details:', error);
    }
  };

  const handleReceptionCreated = () => {
    loadReceptions();
  };

  const handleFilterChange = (key: keyof ReceptionFilters, value: string) => {
    setFilters(prev => {
      if (value === '' || value === 'all') {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
    setCurrentPage(1);
  };

  // Alias para el icono Clock
  const ClockIcon = Clock;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'completed', label: 'Completadas' },
    { value: 'partial', label: 'Parciales' },
    { value: 'pending', label: 'Pendientes' }
  ];

  // Contar filtros activos
  const filtrosActivos = Object.values(filters).filter(
    v => v !== undefined && v !== '' && v !== null && v !== 'all'
  ).length;

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metrics} />

      {/* Toolbar superior */}
      <div className="flex items-center justify-end gap-3">
        <div className="relative inline-flex">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="w-5 h-5" />}
          >
            Filtros
          </Button>
          {filtrosActivos > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {filtrosActivos}
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Exportar
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Nueva Recepción
        </Button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="bg-white shadow-sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Proveedor
                </label>
                <Select
                  options={[{ value: 'all', label: 'Todos los proveedores' }, ...suppliers]}
                  value={filters.supplierId || 'all'}
                  onChange={(e) => handleFilterChange('supplierId', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <CheckCircle size={16} className="inline mr-1" />
                  Estado
                </label>
                <Select
                  options={statusOptions}
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Desde
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
            </div>

            {filters.dateTo && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha Hasta
                </label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tabla de Recepciones */}
      <ReceptionsTable
        receptions={receptions}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando página {currentPage} de {totalPages} ({totalItems} total)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal Nueva Recepción */}
      <NewReceptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReceptionCreated={handleReceptionCreated}
      />

      {/* Modal Detalles Recepción */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Detalles de Recepción"
        size="xl"
      >
        {selectedReception && (
          <div className="space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Fecha de Recepción
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(selectedReception.receptionDate)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Estado
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedReception.status)}
                  <Badge className={
                    selectedReception.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : selectedReception.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }>
                    {selectedReception.status === 'completed' ? 'Completada' : selectedReception.status === 'partial' ? 'Parcial' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Proveedor
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedReception.supplier.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Registrado por
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedReception.createdBy.name}
                </p>
              </div>
            </div>

            {/* Items Recibidos */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Items Recibidos
              </h3>
              <div className="space-y-3">
                {selectedReception.receivedItems.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <Badge className={
                        item.condition === 'ok'
                          ? 'bg-green-100 text-green-800'
                          : item.condition === 'damaged'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {item.condition === 'ok' ? 'OK' : item.condition === 'damaged' ? 'Dañado' : 'Faltante'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="text-sm text-gray-600">
                          Cantidad Esperada:
                        </span>
                        <p className="text-base font-medium text-gray-900">
                          {item.quantityExpected}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Cantidad Recibida:
                        </span>
                        <p className="text-base font-medium text-gray-900">
                          {item.quantityReceived}
                        </p>
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notas Generales */}
            {selectedReception.notes && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Notas
                </h3>
                <p className="text-base text-gray-600">
                  {selectedReception.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

