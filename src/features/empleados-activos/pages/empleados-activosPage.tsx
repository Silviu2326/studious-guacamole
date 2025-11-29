// Página principal para gestionar empleados activos de empresas corporativas

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCorporateEmployees } from '../hooks/useCorporateEmployees';
import { CorporateEmployeeTable } from '../components/CorporateEmployeeTable';
import { EmployeeActionsToolbar } from '../components/EmployeeActionsToolbar';
import { ImportEmployeesModal } from '../components/ImportEmployeesModal';
import { MetricCards, Button, ConfirmModal } from '../../../components/componentsreutilizables';
import { EmployeeFilters, EmployeeKPIs } from '../types';
import { Users, TrendingUp, UserPlus, UserMinus, Activity } from 'lucide-react';

const EmpleadosActivosPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    limit: 10,
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    isOpen: boolean;
    employeeId: string | null;
    newStatus: 'active' | 'inactive' | null;
  }>({
    isOpen: false,
    employeeId: null,
    newStatus: null,
  });

  const {
    employees,
    pagination,
    kpis,
    isLoading,
    kpisLoading,
    updateEmployeeStatus,
    importEmployees,
    exportEmployees,
    isUpdatingStatus,
    isImporting,
    isExporting,
    importResult,
  } = useCorporateEmployees({
    companyId: companyId || '',
    filters,
  });

  const handleFilterChange = (newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleStatusChange = (employeeId: string, newStatus: 'active' | 'inactive') => {
    setConfirmStatusChange({
      isOpen: true,
      employeeId,
      newStatus,
    });
  };

  const confirmStatusChangeAction = async () => {
    if (!confirmStatusChange.employeeId || !confirmStatusChange.newStatus) return;

    try {
      await updateEmployeeStatus(confirmStatusChange.employeeId, confirmStatusChange.newStatus);
      setConfirmStatusChange({
        isOpen: false,
        employeeId: null,
        newStatus: null,
      });
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  const handleViewDetails = (employeeId: string) => {
    // Navegar a la página de detalles del empleado
    navigate(`/corporate/employees/${employeeId}`);
  };

  const handleImport = async (file: File) => {
    return await importEmployees(file);
  };

  const handleExport = async () => {
    try {
      await exportEmployees();
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatKPIData = (kpis: EmployeeKPIs | null) => {
    if (!kpis) return [];
    return [
      {
        id: 'total-active',
        title: 'Empleados Activos',
        value: kpis.totalActive,
        icon: <Users className="w-6 h-6" />,
        color: 'primary' as const,
        loading: kpisLoading,
      },
      {
        id: 'utilization-rate',
        title: 'Tasa de Utilización',
        value: `${kpis.utilizationRate}%`,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'success' as const,
        loading: kpisLoading,
        subtitle: 'Con al menos 1 check-in (30 días)',
      },
      {
        id: 'avg-checkins',
        title: 'Promedio Check-ins',
        value: kpis.avgCheckInsPerEmployee.toFixed(1),
        icon: <Activity className="w-6 h-6" />,
        color: 'info' as const,
        loading: kpisLoading,
        subtitle: 'Por empleado activo (último mes)',
      },
      {
        id: 'new-employees',
        title: 'Nuevos Empleados',
        value: `+${kpis.newEmployeesThisMonth}`,
        icon: <UserPlus className="w-6 h-6" />,
        color: 'success' as const,
        loading: kpisLoading,
        subtitle: 'Este mes',
      },
      {
        id: 'deactivated',
        title: 'Desactivados',
        value: kpis.deactivatedThisMonth,
        icon: <UserMinus className="w-6 h-6" />,
        color: 'warning' as const,
        loading: kpisLoading,
        subtitle: 'Este mes',
      },
    ];
  };

  if (!companyId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-base text-gray-900">ID de empresa no proporcionado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Empleados Activos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona los empleados de la empresa asociada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* KPIs */}
        <div className="space-y-6">
          <MetricCards data={formatKPIData(kpis)} columns={5} />

          {/* Toolbar y Tabla */}
          <div>
            <EmployeeActionsToolbar
              filters={filters}
              onFilterChange={handleFilterChange}
              onImportClick={() => setIsImportModalOpen(true)}
              onExportClick={handleExport}
              isExporting={isExporting}
            />

            <CorporateEmployeeTable
              employees={employees}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              loading={isLoading}
            />

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <Card className="p-4 bg-white shadow-sm mt-6">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Importación */}
      <ImportEmployeesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Modal de Confirmación de Cambio de Estado */}
      <ConfirmModal
        isOpen={confirmStatusChange.isOpen}
        onClose={() =>
          setConfirmStatusChange({
            isOpen: false,
            employeeId: null,
            newStatus: null,
          })
        }
        onConfirm={confirmStatusChangeAction}
        title="Confirmar Cambio de Estado"
        message={
          confirmStatusChange.newStatus === 'active'
            ? '¿Está seguro de que desea activar este empleado?'
            : '¿Está seguro de que desea desactivar este empleado? El acceso al gimnasio será revocado.'
        }
        confirmText={confirmStatusChange.newStatus === 'active' ? 'Activar' : 'Desactivar'}
        variant={confirmStatusChange.newStatus === 'inactive' ? 'destructive' : 'primary'}
      />
    </div>
  );
};

export default EmpleadosActivosPage;

