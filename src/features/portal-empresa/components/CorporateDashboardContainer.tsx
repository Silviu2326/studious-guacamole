import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';
import { useAnalytics } from '../hooks/useAnalytics';
import { useEmployees } from '../hooks/useEmployees';
import { KPIGrid } from './KPIGrid';
import { EmployeeDataTable } from './EmployeeDataTable';
import { InviteEmployeesModal } from './InviteEmployeesModal';
import { Button, Card, ConfirmModal } from '../../../components/componentsreutilizables';
import { UserPlus, Download, Calendar, TrendingUp, Users, Activity, BarChart3, Building2, Loader2 } from 'lucide-react';

export const CorporateDashboardContainer: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const id = companyId || 'abc-123';

  const { company, isLoading: loadingCompany, error: companyError } = useCompany(id);
  const { 
    analytics, 
    isLoading: loadingAnalytics, 
    dateRange, 
    loadAnalytics 
  } = useAnalytics(id);
  const { 
    employees, 
    isLoading: loadingEmployees, 
    pagination, 
    loadEmployees, 
    updateFilters,
    deactivateEmployee,
    resendInvite 
  } = useEmployees(id);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    employeeId: string | null;
  }>({ isOpen: false, employeeId: null });

  // Cargar analytics al montar
  React.useEffect(() => {
    loadAnalytics(dateRange);
  }, [loadAnalytics]);

  // Preparar KPIs
  const kpis = analytics ? [
    {
      title: 'Tasa de Adopción',
      value: analytics.adoption_rate,
    },
    {
      title: 'Asistencia Promedio',
      value: `${analytics.avg_attendance}/mes`,
    },
    {
      title: 'Empleados Activos',
      value: employees.filter(e => e.status === 'active').length,
    },
    {
      title: 'Total Empleados',
      value: employees.length,
    },
  ] : [];

  // Tab items
  const tabItems = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'employees', label: 'Empleados', icon: Users },
    { id: 'analytics', label: 'Analíticas', icon: TrendingUp },
  ];

  const handleSearch = (searchTerm: string) => {
    updateFilters({ search: searchTerm, page: 1 });
    loadEmployees({ search: searchTerm, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status || undefined, page: 1 });
    loadEmployees({ status: status || undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    loadEmployees({ page });
  };

  const handleDeactivateClick = (employeeId: string) => {
    setDeleteConfirm({ isOpen: true, employeeId });
  };

  const handleConfirmDeactivate = async () => {
    if (deleteConfirm.employeeId) {
      await deactivateEmployee(id, deleteConfirm.employeeId);
      setDeleteConfirm({ isOpen: false, employeeId: null });
    }
  };

  const handleInviteSuccess = () => {
    loadEmployees();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                {loadingCompany ? (
                  <>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Portal Empresa
                    </h1>
                    <p className="text-gray-600">Cargando información...</p>
                  </>
                ) : company ? (
                  <>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Portal Empresa - {company.name}
                    </h1>
                    <p className="text-gray-600">
                      Plan: {company.plan.name} • Máximo {company.plan.max_employees} empleados
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Portal Empresa
                    </h1>
                    <p className="text-gray-600">Gestión de empleados y analíticas corporativas</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Loading State */}
        {(loadingCompany || loadingAnalytics) && (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </Card>
        )}

        {/* Error State */}
        {companyError && (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Activity size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{companyError}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </Card>
        )}

        {/* Content */}
        {!loadingCompany && company && (
          <div className="space-y-6">
            {/* Sistema de Tabs */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  {tabItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Toolbar Superior */}
            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                <Button variant="secondary" leftIcon={<Calendar size={20} />}>
                  Cambiar Fechas
                </Button>
                <Button variant="secondary" leftIcon={<Download size={20} />}>
                  Exportar PDF
                </Button>
                {activeTab === 'employees' && (
                  <Button variant="primary" leftIcon={<UserPlus size={20} />} onClick={() => setIsInviteModalOpen(true)}>
                    Invitar Empleados
                  </Button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <KPIGrid kpis={kpis} loading={loadingAnalytics} />
                
                {/* Vista previa de gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card variant="hover" className="bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Evolución de Empleados Activos
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <BarChart3 size={64} className="text-gray-400" />
                    </div>
                  </Card>
                  <Card variant="hover" className="bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Clases Más Populares
                    </h3>
                    <div className="space-y-3">
                      {analytics?.popular_classes.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-blue-600 font-semibold">{item.count} asistencias</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                <EmployeeDataTable
                  employees={employees}
                  loading={loadingEmployees}
                  onDeactivate={handleDeactivateClick}
                  onResendInvite={(employeeId) => resendInvite(id, employeeId)}
                  onSearch={handleSearch}
                  onStatusFilter={handleStatusFilter}
                />
                
                {/* Paginación */}
                {pagination && pagination.totalPages > 1 && (
                  <Card className="p-4 bg-white shadow-sm">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-600 px-4">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="hover" className="bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribución por Servicio
                  </h3>
                  <div className="space-y-3">
                    {analytics && Object.entries(analytics.usage_by_service).map(([service, count]) => (
                      <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900 capitalize">{service === 'group_classes' ? 'Clases Grupales' : service}</span>
                        <span className="text-blue-600 font-semibold">{count} visitas</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card variant="hover" className="bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Evolución Mensual
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <Activity size={64} className="text-gray-400" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteEmployeesModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        companyId={id}
        onSuccess={handleInviteSuccess}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, employeeId: null })}
        onConfirm={handleConfirmDeactivate}
        title="Desactivar Empleado"
        message="¿Estás seguro de que deseas desactivar este empleado? Ya no podrá acceder a las instalaciones."
        confirmText="Desactivar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

