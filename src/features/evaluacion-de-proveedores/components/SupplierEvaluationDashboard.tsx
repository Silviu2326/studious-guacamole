import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Input, Select, ConfirmModal } from '../../../components/componentsreutilizables';
import { SupplierEvaluation, EvaluationFilters, EvaluationFormData, EvaluationStats } from '../types';
import { EvaluationsTable } from './EvaluationsTable';
import { EvaluationFormModal } from './EvaluationFormModal';
import {
  getEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationStats,
} from '../api';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Search, Filter, Star, TrendingUp, Calendar, Users, AlertCircle, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface SupplierEvaluationDashboardProps {
  gymId: string;
}

export const SupplierEvaluationDashboard: React.FC<SupplierEvaluationDashboardProps> = ({
  gymId,
}) => {
  const { user } = useAuth();
  
  const [evaluationsData, setEvaluationsData] = useState<SupplierEvaluation[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EvaluationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<SupplierEvaluation | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadEvaluations();
    loadStats();
  }, [gymId, filters, currentPage]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        searchTerm: searchTerm || undefined,
      }));
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const loadEvaluations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEvaluations(gymId, filters, currentPage, 10, 'evaluationDate');
      setEvaluationsData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Error al cargar las evaluaciones');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getEvaluationStats(gymId);
      setStats(statsData);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const handleCreateEvaluation = () => {
    setSelectedEvaluation(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvaluation = (evaluation: SupplierEvaluation) => {
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleDeleteEvaluation = (evaluationId: string) => {
    setEvaluationToDelete(evaluationId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!evaluationToDelete) return;
    
    try {
      await deleteEvaluation(gymId, evaluationToDelete);
      loadEvaluations();
      loadStats();
      setDeleteConfirmOpen(false);
      setEvaluationToDelete(null);
    } catch (err) {
      console.error('Error eliminando evaluación:', err);
      setError('Error al eliminar la evaluación');
    }
  };

  const handleFormSubmit = async (formData: EvaluationFormData) => {
    try {
      if (selectedEvaluation) {
        await updateEvaluation(gymId, selectedEvaluation.id, formData);
      } else {
        await createEvaluation(
          gymId,
          formData,
          user?.id || 'user_unknown',
          user?.name || 'Usuario'
        );
      }
      setIsModalOpen(false);
      loadEvaluations();
      loadStats();
    } catch (err) {
      console.error('Error guardando evaluación:', err);
      throw err;
    }
  };

  const handleFilterChange = (field: keyof EvaluationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length;

  const metricCardsData = stats
    ? [
        {
          id: '1',
          title: 'Calificación Promedio',
          value: stats.averageScore.toFixed(1),
          color: 'info' as const,
        },
        {
          id: '2',
          title: 'Evaluaciones (30 días)',
          value: stats.evaluationsLast30Days.toString(),
          color: 'info' as const,
        },
        {
          id: '3',
          title: 'Total Evaluaciones',
          value: stats.totalEvaluations.toString(),
          color: 'info' as const,
        },
        {
          id: '4',
          title: '% Proveedores Premium',
          value: `${stats.premiumSuppliersPercentage.toFixed(1)}%`,
          color: 'success' as const,
        },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ClipboardCheck size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Evaluación de Proveedores
                  </h1>
                  <p className="text-gray-600">
                    Gestiona y analiza las evaluaciones de tus proveedores para tomar decisiones informadas
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleCreateEvaluation}
                size="lg"
              >
                <Plus size={20} className="mr-2" />
                Nueva Evaluación
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* KPIs */}
          {stats && (
            <MetricCards data={metricCardsData} />
          )}

          {/* Top 3 y Bottom 3 */}
          {stats && (stats.top3Suppliers.length > 0 || stats.bottom3Suppliers.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={18} className="text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top 3 Proveedores
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {stats.top3Suppliers.map((supplier, index) => (
                      <div
                        key={supplier.supplierId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {supplier.supplierName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {supplier.averageScore.toFixed(1)} / 5.0
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={18} className="text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Bottom 3 Proveedores
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {stats.bottom3Suppliers.map((supplier, index) => (
                      <div
                        key={supplier.supplierId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {supplier.supplierName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {supplier.averageScore.toFixed(1)} / 5.0
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Filtros y Búsqueda */}
          <Card className="mb-6 bg-white shadow-sm">
            <div className="space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar por proveedor, concepto o comentarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="relative"
                  >
                    <Filter size={18} className="mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                    {showAdvancedFilters ? (
                      <ChevronUp size={16} className="ml-2" />
                    ) : (
                      <ChevronDown size={16} className="ml-2" />
                    )}
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFilters({});
                        setSearchTerm('');
                      }}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              {/* Panel de filtros avanzados */}
              {showAdvancedFilters && (
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Fecha Desde
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom ? (typeof filters.dateFrom === 'string' ? filters.dateFrom : new Date(filters.dateFrom).toISOString().split('T')[0]) : ''}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Fecha Hasta
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo ? (typeof filters.dateTo === 'string' ? filters.dateTo : new Date(filters.dateTo).toISOString().split('T')[0]) : ''}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{pagination.total} resultados encontrados</span>
                {activeFiltersCount > 0 && (
                  <span>{activeFiltersCount} filtros aplicados</span>
                )}
              </div>
            </div>
          </Card>

          {/* Tabla de Evaluaciones */}
          {error && (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadEvaluations}>Reintentar</Button>
            </Card>
          )}

          {!error && (
            <EvaluationsTable
              evaluations={evaluationsData}
              onEdit={handleEditEvaluation}
              onDelete={handleDeleteEvaluation}
              loading={isLoading}
            />
          )}

          {/* Paginación */}
          {!error && pagination.totalPages > 1 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  Página {currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Formulario */}
      <EvaluationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvaluation(undefined);
        }}
        initialData={selectedEvaluation}
        onSubmit={handleFormSubmit}
        gymId={gymId}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEvaluationToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Evaluación"
        message="¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

