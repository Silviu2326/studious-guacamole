// Página principal de Objetivos y Comisiones
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ds } from '../../adherencia/ui/ds';
import { AlertCircle, Plus, Target, TrendingUp, DollarSign, Download } from 'lucide-react';
import { Button, Card, Tabs, MetricCards, Table, Modal, ConfirmModal } from '../../../components/componentsreutilizables';
import { useIncentivesApi } from '../hooks/useIncentivesApi';
import { IncentiveSchemeBuilder, EmployeePerformanceCard, ObjectivesAssignmentModal } from '../components';
import type { IncentiveScheme, ObjectiveAssignmentData } from '../types';

/**
 * Página de Objetivos & Comisiones
 * 
 * Esta página está diseñada exclusivamente para administradores o gerentes de gimnasios.
 * Permite gestionar esquemas de incentivos, asignar objetivos y ver el rendimiento del equipo.
 */
export default function ObjetivosComisionesPage() {
  const { user } = useAuth();
  const {
    schemes,
    objectives,
    employeePerformance,
    isLoading,
    error,
    loadSchemes,
    createScheme,
    updateScheme,
    removeScheme,
    assignObjectiveToEmployee,
    loadEmployeePerformance,
    generatePayoutReport,
  } = useIncentivesApi();

  const [activeTab, setActiveTab] = useState('schemes');
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<IncentiveScheme | null>(null);
  const [schemeToDelete, setSchemeToDelete] = useState<string | null>(null);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [payoutReport, setPayoutReport] = useState<any>(null);

  // Verificar que el usuario sea un gimnasio
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'entrenador') {
    return (
      <div className={`${ds.card} ${ds.cardPad} text-center`}>
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Acceso Restringido
        </h2>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Esta funcionalidad está disponible solo para administradores de gimnasios.
        </p>
      </div>
    );
  }

  const handleCreateScheme = () => {
    setSelectedScheme(null);
    setIsSchemeModalOpen(true);
  };

  const handleEditScheme = (scheme: IncentiveScheme) => {
    setSelectedScheme(scheme);
    setIsSchemeModalOpen(true);
  };

  const handleDeleteScheme = async () => {
    if (schemeToDelete) {
      await removeScheme(schemeToDelete);
      setSchemeToDelete(null);
      loadSchemes();
    }
  };

  const handleSaveScheme = async () => {
    // Aquí se guardaría el esquema usando createScheme o updateScheme
    // Por ahora simplemente cerramos el modal y recargamos
    setIsSchemeModalOpen(false);
    await loadSchemes();
    setSelectedScheme(null);
  };

  const handleAssignObjective = async (data: ObjectiveAssignmentData) => {
    for (const employeeId of data.employee_ids) {
      await assignObjectiveToEmployee(employeeId, {
        description: data.description,
        metric: data.metric,
        target_value: data.target_value,
        due_date: data.due_date,
      });
    }
    await loadEmployeePerformance();
  };

  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    try {
      const report = await generatePayoutReport(reportStartDate, reportEndDate);
      setPayoutReport(report);
      setIsReportModalOpen(true);
    } catch (err) {
      console.error('Error al generar reporte:', err);
    }
  };

  const handleExportReport = () => {
    if (!payoutReport) return;

    const csvContent = [
      ['Empleado', 'Comisiones', 'Bonus', 'Total'],
      ...payoutReport.payouts_by_employee.map((emp: any) => [
        emp.employee_name,
        emp.breakdown.commissions,
        emp.breakdown.bonuses,
        emp.total_payout,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-incentivos-${reportStartDate}-${reportEndDate}.csv`;
    link.click();
  };

  // Calcular KPIs
  const totalPendingPayout = employeePerformance.reduce(
    (sum, perf) => sum + perf.totalPayout,
    0
  );

  const completedObjectives = objectives.filter((obj) => obj.status === 'completed').length;
  const totalObjectives = objectives.length;
  const completionRate =
    totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  const totalRevenue = employeePerformance.reduce((sum, perf) => {
    // Simulación: asumimos que cada comisión representa un ingreso de 10x
    return sum + perf.totalCommissions * 10;
  }, 0);

  const topEmployees = [...employeePerformance]
    .sort((a, b) => b.totalPayout - a.totalPayout)
    .slice(0, 5);

  const metrics = [
    {
      id: '1',
      title: 'Total Pendiente de Pago',
      value: totalPendingPayout.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }),
      subtitle: 'Mes actual',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: '2',
      title: 'Tasa de Cumplimiento',
      value: `${completionRate.toFixed(1)}%`,
      subtitle: `${completedObjectives} de ${totalObjectives} objetivos`,
      icon: <Target className="w-6 h-6" />,
      color: completionRate >= 80 ? ('success' as const) : ('warning' as const),
    },
    {
      id: '3',
      title: 'Ingresos Generados',
      value: totalRevenue.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }),
      subtitle: 'Por ventas comisionables',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Top Empleados',
      value: topEmployees.length.toString(),
      subtitle: 'Por incentivos ganados',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
    },
  ];

  const schemeColumns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'commission'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {value === 'commission' ? 'Comisión' : 'Bonus'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: IncentiveScheme) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditScheme(row)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setSchemeToDelete(row.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const employeesList = Array.from(
    new Set(employeePerformance.map((p) => ({ id: p.employee.id, name: p.employee.name })))
  );

  const tabItems = [
    {
      id: 'schemes',
      label: 'Esquemas de Incentivos',
    },
    {
      id: 'objectives',
      label: 'Objetivos',
    },
    {
      id: 'performance',
      label: 'Rendimiento',
    },
    {
      id: 'reports',
      label: 'Reportes',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Target size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Objetivos & Comisiones
                </h1>
                <p className="text-gray-600">
                  Gestiona esquemas de incentivos, objetivos y rendimiento del equipo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* KPIs */}
        <MetricCards data={metrics} columns={4} />

      {/* Tabs */}
      <Card className="p-0 bg-white shadow-sm mt-6">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabItems.map((tab) => {
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
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de tabs */}
      <div className="mt-6 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tab: Esquemas de Incentivos */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={handleCreateScheme}>
              <Plus size={20} className="mr-2" />
              Crear Nuevo Esquema
            </Button>
          </div>

          <Card padding="lg">
            <Table
              data={schemes}
              columns={schemeColumns}
              loading={isLoading}
              emptyMessage="No hay esquemas de incentivos configurados"
            />
          </Card>
        </div>
      )}

      {/* Tab: Objetivos */}
      {activeTab === 'objectives' && (
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={() => setIsObjectiveModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Asignar Objetivo
            </Button>
          </div>

          <Card padding="lg">
            <div className="space-y-4">
              {objectives.map((objective) => {
                const progress = (objective.current_value / objective.target_value) * 100;
                const getProgressColor = () => {
                  if (objective.status === 'completed') return 'bg-green-600';
                  if (objective.status === 'failed') return 'bg-red-600';
                  return 'bg-blue-600';
                };
                return (
                  <div key={objective.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {objective.description}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {objective.employee_name} • Vence: {new Date(objective.due_date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          objective.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : objective.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {objective.status === 'completed'
                          ? 'Completado'
                          : objective.status === 'failed'
                          ? 'Fallido'
                          : 'En Progreso'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          Progreso: {objective.current_value} / {objective.target_value}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {objectives.length === 0 && (
                <div className="text-center py-12">
                  <Target size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No hay objetivos asignados
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Rendimiento */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employeePerformance.map((performance) => (
            <EmployeePerformanceCard
              key={performance.employee.id}
              performance={performance}
            />
          ))}
          {employeePerformance.length === 0 && (
            <div className="col-span-full text-center py-12">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No hay datos de rendimiento disponibles
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Reportes */}
      {activeTab === 'reports' && (
        <Card padding="lg" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            Reporte de Pagos de Incentivos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>
          <Button onClick={handleGenerateReport} fullWidth>
            <Download size={20} className="mr-2" />
            Generar Reporte
          </Button>
        </Card>
      )}

      {/* Modal: Crear/Editar Esquema */}
      {isSchemeModalOpen && (
        <Modal
          isOpen={isSchemeModalOpen}
          onClose={() => {
            setIsSchemeModalOpen(false);
            setSelectedScheme(null);
          }}
          title={selectedScheme ? 'Editar Esquema' : 'Crear Nuevo Esquema'}
          size="xl"
        >
          <IncentiveSchemeBuilder
            schemeId={selectedScheme?.id || null}
            onSave={handleSaveScheme}
            initialData={selectedScheme || undefined}
            onCancel={() => {
              setIsSchemeModalOpen(false);
              setSelectedScheme(null);
            }}
          />
        </Modal>
      )}

      {/* Modal: Asignar Objetivo */}
      <ObjectivesAssignmentModal
        isOpen={isObjectiveModalOpen}
        onClose={() => setIsObjectiveModalOpen(false)}
        onObjectiveAssigned={() => {
          setIsObjectiveModalOpen(false);
        }}
        employees={employeesList}
        onAssign={handleAssignObjective}
      />

      {/* Modal: Confirmar Eliminación */}
      <ConfirmModal
        isOpen={!!schemeToDelete}
        onClose={() => setSchemeToDelete(null)}
        onConfirm={handleDeleteScheme}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este esquema? Esta acción no se puede deshacer."
        variant="destructive"
      />

      {/* Modal: Reporte de Pagos */}
      {isReportModalOpen && payoutReport && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title="Reporte de Pagos de Incentivos"
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsReportModalOpen(false)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                  Total Pago
                </p>
                <p className={`${ds.typography.h3} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {payoutReport.summary.total_payout.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                  Comisiones
                </p>
                <p className={`${ds.typography.h3} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {payoutReport.summary.total_commissions.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                  Bonus
                </p>
                <p className={`${ds.typography.h3} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {payoutReport.summary.total_bonuses.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Desglose por Empleado
              </h4>
              {payoutReport.payouts_by_employee.map((emp: any) => (
                <div
                  key={emp.employee_id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {emp.employee_name}
                    </p>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
                      Comisiones: {emp.breakdown.commissions.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })} • Bonus: {emp.breakdown.bonuses.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                  </div>
                  <p className={`${ds.typography.bodyLarge} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {emp.total_payout.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      </div>
      </div>
    </div>
  );
}

