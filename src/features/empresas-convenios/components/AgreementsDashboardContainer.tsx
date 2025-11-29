import React, { useState, useEffect } from 'react';
import { useAgreements } from '../hooks/useAgreements';
import { AgreementsTable } from './AgreementsTable';
import { CreateEditAgreementModal } from './CreateEditAgreementModal';
import { Button, Input, Select, MetricCards, ConfirmModal, Card } from '../../../components/componentsreutilizables';
import { CorporateAgreement, AgreementFormData, AgreementStatus } from '../types';
import { Plus, Search, Filter, Building2, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { useNavigate } from 'react-router-dom';

export const AgreementsDashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    agreements,
    pagination,
    isLoading,
    error,
    filters,
    loadAgreements,
    createAgreement,
    updateAgreement,
    updateFilters,
    clearError,
  } = useAgreements();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgreementForEdit, setSelectedAgreementForEdit] =
    useState<CorporateAgreement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgreementStatus | ''>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    agreementId: string | null;
  }>({
    isOpen: false,
    agreementId: null,
  });

  // Calcular métricas
  const activeAgreements = agreements.filter((a) => a.status === 'active').length;
  const totalMembers = agreements.reduce((sum, a) => sum + a.memberCount, 0);
  const expiringSoon = agreements.filter(
    (a) => a.status === 'expiringSoon' || a.status === 'active'
  ).length;

  const metrics = [
    {
      id: 'total-agreements',
      title: 'Total Convenios',
      value: agreements.length,
      color: 'info' as const,
    },
    {
      id: 'active-agreements',
      title: 'Convenios Activos',
      value: activeAgreements,
      color: 'success' as const,
    },
    {
      id: 'total-members',
      title: 'Total Miembros',
      value: totalMembers,
      color: 'info' as const,
    },
    {
      id: 'expiring-soon',
      title: 'Por Vencer',
      value: expiringSoon,
      color: 'warning' as const,
    },
  ];

  const handleCreateAgreement = async (formData: AgreementFormData) => {
    const result = await createAgreement(formData);
    if (result) {
      setIsCreateModalOpen(false);
      setSelectedAgreementForEdit(null);
    }
  };

  const handleEditAgreement = async (formData: AgreementFormData) => {
    if (selectedAgreementForEdit) {
      const result = await updateAgreement(selectedAgreementForEdit.id, formData);
      if (result) {
        setSelectedAgreementForEdit(null);
      }
    }
  };

  const handleEditClick = (agreement: CorporateAgreement) => {
    setSelectedAgreementForEdit(agreement);
    setIsCreateModalOpen(true);
  };

  const handleViewDetails = (agreementId: string) => {
    navigate(`/b2b/convenios/${agreementId}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value || undefined, page: 1 });
  };

  const handleStatusFilterChange = (value: string) => {
    const status = value === '' ? undefined : (value as AgreementStatus);
    setStatusFilter(value as AgreementStatus | '');
    updateFilters({ status, page: 1 });
  };

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'expiringSoon', label: 'Por Vencer' },
    { value: 'expired', label: 'Expirado' },
  ];

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  useEffect(() => {
    loadAgreements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Empresas / Convenios
                  </h1>
                  <p className="text-gray-600">
                    Gestiona los convenios corporativos y alianzas B2B
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Cerrar
                </Button>
              </div>
            </Card>
          )}

          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedAgreementForEdit(null);
                setIsCreateModalOpen(true);
              }}
            >
              <Plus size={20} className="mr-2" />
              Crear Convenio
            </Button>
          </div>

          {/* Métricas */}
          {!isLoading || agreements.length > 0 ? (
            <MetricCards data={metrics} />
          ) : null}

          {/* Estado de Carga */}
          {isLoading && agreements.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando convenios...</p>
            </Card>
          ) : (
            <>
              {/* Filtros */}
              <Card className="mb-6 bg-white shadow-sm p-0">
                <div className="px-4 py-3">
                  <div className="space-y-4">
                    {/* Barra de búsqueda */}
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                      <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="text"
                          placeholder="Buscar por nombre de empresa..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                        />
                      </div>
                      <div className="w-64">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Filter size={16} className="inline mr-1" />
                          Estado
                        </label>
                        <Select
                          value={statusFilter}
                          onChange={(e) => handleStatusFilterChange(e.target.value)}
                          options={statusOptions}
                        />
                      </div>
                      </div>
                    </div>

                    {/* Resumen de resultados */}
                    {pagination && (
                      <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                        <span>{pagination.total} resultados encontrados</span>
                        <span>
                          {(searchTerm || statusFilter) && `${[searchTerm && 'Búsqueda', statusFilter && 'Estado'].filter(Boolean).length} filtros aplicados`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Tabla de Convenios */}
              {agreements.length > 0 ? (
                <AgreementsTable
                  agreements={agreements}
                  onEdit={handleEditClick}
                  onViewDetails={handleViewDetails}
                  loading={isLoading}
                />
              ) : !isLoading ? (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay convenios disponibles
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comienza creando tu primer convenio corporativo
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedAgreementForEdit(null);
                      setIsCreateModalOpen(true);
                    }}
                  >
                    <Plus size={20} className="mr-2" />
                    Crear Convenio
                  </Button>
                </Card>
              ) : null}

              {/* Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <Card className="p-4 bg-white shadow-sm">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || isLoading}
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </Button>
                    
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || isLoading}
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateEditAgreementModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedAgreementForEdit(null);
        }}
        onSubmit={selectedAgreementForEdit ? handleEditAgreement : handleCreateAgreement}
        initialData={selectedAgreementForEdit || undefined}
      />
    </div>
  );
};

