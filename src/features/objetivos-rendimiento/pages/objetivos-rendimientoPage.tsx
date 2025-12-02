import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
  ObjectivesManager,
  PerformanceDashboard,
  MetricsChart,
  GoalTracker,
  ReportsGenerator,
  AlertsManager,
  ComparisonTool,
  KPIConfigurator,
} from '../components';
import { getPerformanceOverview } from '../api/performance';
import { PerformanceData, Alert } from '../types';
import { Target, BarChart2, TrendingUp, FileText, AlertTriangle, GitCompare, Settings, Loader2, AlertCircle, Activity, Info, RefreshCw, ArrowLeft, Layers3, Workflow, Users } from 'lucide-react';
import type { PeriodType } from '../components/MetricsChart';
import { FeatureCard } from '../../CampanasAutomatizacion/components/shared/FeatureCard';

/**
 * Página principal de Objetivos y Rendimiento
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Enfocados en facturación personal, adherencia de clientes y retención
 * - Gimnasios: Enfocados en objetivos comerciales globales, ocupación y tasa de bajas
 */
export default function ObjetivosRendimientoPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  // Estado de navegación principal (Menu por defecto)
  const [currentView, setCurrentView] = useState<string>('menu');

  // Estado para sub-tabs dentro de la vista de Objetivos
  const [objetivosSubTab, setObjetivosSubTab] = useState<string>('seguimiento');

  // Estados de carga y error a nivel de página
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de error parcial por sección
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});

  // Datos de rendimiento
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [dashboardAlerts, setDashboardAlerts] = useState<Alert[]>([]);

  // Estados compartidos para el tab de Seguimiento
  const [seguimientoPeriod, setSeguimientoPeriod] = useState<PeriodType>('month');
  const [seguimientoCategory, setSeguimientoCategory] = useState<string>('all');

  // Cargar datos críticos al montar el componente
  useEffect(() => {
    loadCriticalData();
  }, [role]);

  // Cargar datos del dashboard cuando se activa la vista (si no están cargados)
  useEffect(() => {
    if (currentView === 'dashboard' && !performanceData && !loading && !error) {
      loadDashboardData();
    }
  }, [currentView, role]);

  // Función para cargar datos críticos (performance overview)
  const loadCriticalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPerformanceOverview(role, 'month');
      setPerformanceData(data);

      // Generar alertas desde objetivos en riesgo
      const alerts: Alert[] = data.objectives
        .filter(obj => obj.status === 'at_risk' || obj.status === 'off_track')
        .slice(0, 5)
        .map(obj => ({
          id: `alert-${obj.id}`,
          type: obj.status === 'at_risk' ? 'warning' : 'error',
          title: `Objetivo en riesgo: ${obj.title}`,
          message: `Progreso: ${obj.progress.toFixed(0)}% (${obj.currentValue} / ${obj.targetValue} ${obj.unit})`,
          objectiveId: obj.id,
          severity: obj.status === 'at_risk' ? 'medium' : 'high',
          createdAt: obj.updatedAt,
          read: false,
        }));
      setDashboardAlerts(alerts);
    } catch (err) {
      console.error('Error loading critical data:', err);
      setError('No se pudieron cargar los datos críticos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      const data = await getPerformanceOverview(role, 'month');
      setPerformanceData(data);

      const alerts: Alert[] = data.objectives
        .filter(obj => obj.status === 'at_risk' || obj.status === 'off_track')
        .slice(0, 5)
        .map(obj => ({
          id: `alert-${obj.id}`,
          type: obj.status === 'at_risk' ? 'warning' : 'error',
          title: `Objetivo en riesgo: ${obj.title}`,
          message: `Progreso: ${obj.progress.toFixed(0)}% (${obj.currentValue} / ${obj.targetValue} ${obj.unit})`,
          objectiveId: obj.id,
          severity: obj.status === 'at_risk' ? 'medium' : 'high',
          createdAt: obj.updatedAt,
          read: false,
        }));
      setDashboardAlerts(alerts);
      setSectionErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dashboard;
        return newErrors;
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setSectionErrors(prev => ({
        ...prev,
        dashboard: 'No se pudieron cargar los datos del dashboard'
      }));
    }
  };

  const handleSectionError = (section: string, errorMessage: string) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: errorMessage
    }));
  };

  const clearSectionError = (section: string) => {
    setSectionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[section];
      return newErrors;
    });
  };

  // Componente unificado para estados de loading con skeleton
  const LoadingPlaceholder = ({ message, skeleton }: { message?: string; skeleton?: boolean }) => {
    if (skeleton) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 bg-white shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </Card>
            ))}
          </div>
          <Card className="p-6 bg-white shadow-sm">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </Card>
        </div>
      );
    }

    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">{message || 'Cargando contenido...'}</p>
      </Card>
    );
  };

  // Componente unificado para estados de error global con retry
  const ErrorPlaceholder = ({
    message,
    onRetry,
    retryLabel = 'Reintentar'
  }: {
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
  }) => (
    <Card className="p-8 text-center bg-white shadow-sm border-l-4 border-l-red-500">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
      <p className="text-gray-600 mb-6">{message || 'No se pudo cargar el contenido. Por favor, intenta de nuevo.'}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </Button>
      )}
    </Card>
  );

  // Componente para errores parciales de secciones secundarias
  const SectionErrorPlaceholder = ({
    section,
    message,
    onRetry,
    onDismiss
  }: {
    section: string;
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  }) => (
    <Card className="p-6 bg-white shadow-sm border-l-4 border-l-yellow-500">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Error en esta sección</h3>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          <div className="flex items-center gap-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </Button>
            )}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Omitir
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  // Renderizado del menú principal de cards
  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Dashboard */}
      <FeatureCard
        title="Dashboard"
        description="Visión general del rendimiento y métricas clave."
        icon={<BarChart2 size={24} />}
        color="indigo"
        onClick={() => setCurrentView('dashboard')}
        stats={[
          { label: 'Estado', value: 'Activo' }
        ]}
      />

      {/* 2. Objetivos (Agrupa Seguimiento, Métricas, Comparación) */}
      <FeatureCard
        title="Objetivos"
        description="Gestiona seguimiento, métricas detalladas y comparativas."
        icon={<Target size={24} />}
        color="purple"
        onClick={() => setCurrentView('objetivos')}
        stats={[
          { label: 'En curso', value: performanceData?.objectives.length || 0 },
          { label: 'Riesgo', value: dashboardAlerts.length }
        ]}
      />

      {/* 3. Reportes */}
      <FeatureCard
        title="Reportes"
        description="Genera informes detallados de rendimiento."
        icon={<FileText size={24} />}
        color="sky"
        onClick={() => setCurrentView('reportes')}
        stats={[
          { label: 'Informes', value: 'Generar' },
          { label: 'Histórico', value: 'Ver' }
        ]}
      />

      {/* 4. Alertas */}
      <FeatureCard
        title="Alertas"
        description="Centro de notificaciones y avisos importantes."
        icon={<AlertTriangle size={24} />}
        color="orange"
        onClick={() => setCurrentView('alertas')}
        stats={[
          { label: 'Activas', value: dashboardAlerts.length }
        ]}
      />
    </div>
  );

  // Renderizado de la vista de Objetivos (con sub-tabs)
  const renderObjetivosView = () => {
    const subTabs = [
      { id: 'seguimiento', label: 'Seguimiento', icon: Activity },
      { id: 'metricas', label: 'Métricas', icon: TrendingUp },
      { id: 'comparacion', label: 'Comparación', icon: GitCompare },
    ];

    return (
      <div className="space-y-6">
        {/* Sub-navigation Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
              {subTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = objetivosSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setObjetivosSubTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${isActive
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                  >
                    <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Content based on sub-tab */}
        {objetivosSubTab === 'seguimiento' && (
          <div className="space-y-6">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-sm">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Vista de Seguimiento de Objetivos
                  </h3>
                  <p className="text-sm text-gray-700">
                    Monitorea el progreso de tus objetivos y analiza el rendimiento en tiempo real.
                  </p>
                </div>
              </div>
            </Card>

            {(sectionErrors.seguimiento_objetivos || sectionErrors.seguimiento_metricas) && (
              <div className="space-y-4">
                {sectionErrors.seguimiento_objetivos && (
                  <SectionErrorPlaceholder
                    section="seguimiento_objetivos"
                    message={sectionErrors.seguimiento_objetivos}
                    onDismiss={() => clearSectionError('seguimiento_objetivos')}
                  />
                )}
              </div>
            )}

            <GoalTracker
              role={role}
              category={seguimientoCategory !== 'all' ? seguimientoCategory : undefined}
              onError={(errorMsg) => handleSectionError('seguimiento_objetivos', errorMsg)}
            />
          </div>
        )}

        {objetivosSubTab === 'metricas' && (
          <div className="space-y-6">
            {sectionErrors.metricas && (
              <SectionErrorPlaceholder
                section="metricas"
                message={sectionErrors.metricas}
                onDismiss={() => clearSectionError('metricas')}
              />
            )}
            <MetricsChart
              role={role}
              onError={(errorMsg) => handleSectionError('metricas', errorMsg)}
            />
          </div>
        )}

        {objetivosSubTab === 'comparacion' && (
          <div className="space-y-6">
            {sectionErrors.comparacion && (
              <SectionErrorPlaceholder
                section="comparacion"
                message={sectionErrors.comparacion}
                onDismiss={() => clearSectionError('comparacion')}
              />
            )}
            <ComparisonTool
              role={role}
              onError={(errorMsg) => handleSectionError('comparacion', errorMsg)}
            />
          </div>
        )}
      </div>
    );
  };

  // Renderizado de contenido principal
  const renderContent = () => {
    if (currentView === 'menu') {
      return renderMenu();
    }

    if (loading && currentView === 'dashboard') {
      return <LoadingPlaceholder message="Cargando datos críticos..." skeleton={true} />;
    }

    if (error && (currentView === 'dashboard' || currentView === 'objetivos')) {
      return (
        <ErrorPlaceholder
          message={error}
          onRetry={loadCriticalData}
          retryLabel="Reintentar carga de datos"
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {sectionErrors.dashboard && (
              <SectionErrorPlaceholder
                section="dashboard"
                message={sectionErrors.dashboard}
                onRetry={loadDashboardData}
                onDismiss={() => clearSectionError('dashboard')}
              />
            )}
            <PerformanceDashboard
              role={role}
              performanceData={performanceData || undefined}
              alerts={dashboardAlerts.length > 0 ? dashboardAlerts : undefined}
              onError={(errorMsg) => handleSectionError('dashboard', errorMsg)}
            />
          </div>
        );
      case 'objetivos':
        return renderObjetivosView();
      case 'reportes':
        return (
          <div className="space-y-6">
            {sectionErrors.reportes && (
              <SectionErrorPlaceholder
                section="reportes"
                message={sectionErrors.reportes}
                onDismiss={() => clearSectionError('reportes')}
              />
            )}
            <ReportsGenerator
              role={role}
              onError={(errorMsg) => handleSectionError('reportes', errorMsg)}
            />
          </div>
        );
      case 'alertas':
        return (
          <div className="space-y-6">
            {sectionErrors.alertas && (
              <SectionErrorPlaceholder
                section="alertas"
                message={sectionErrors.alertas}
                onDismiss={() => clearSectionError('alertas')}
              />
            )}
            <AlertsManager
              role={role}
              onError={(errorMsg) => handleSectionError('alertas', errorMsg)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Back Button if not in menu */}
              {currentView !== 'menu' && (
                <button
                  onClick={() => setCurrentView('menu')}
                  className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <ArrowLeft size={24} />
                </button>
              )}

              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Target size={24} className="text-blue-600" />
              </div>

              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Objetivos y Rendimiento
                </h1>
                <p className="text-gray-600 mt-1">
                  {esEntrenador
                    ? 'Gestiona tus objetivos personales de facturación, adherencia de clientes y retención.'
                    : 'Controla los objetivos comerciales del centro, monitorea la ocupación media y gestiona la tasa de bajas.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
