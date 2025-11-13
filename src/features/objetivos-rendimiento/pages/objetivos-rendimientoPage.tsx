import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  ObjectivesManager,
  PerformanceDashboard,
  MetricsChart,
  GoalTracker,
  ReportsGenerator,
  AlertsManager,
  ComparisonTool,
  KPIConfigurator,
  QuickAccessMenu,
  GlobalFilters,
  AIActionPlanModal,
  TabConfigModal,
  TabHelpModal,
  ScenarioSimulator,
  ApprovalManager,
  AccessibilitySettings,
  InAppTraining,
  PredefinedObjectivesLibrary,
  ERPDashboardIntegration,
  Report360,
  SuccessPatternsView,
} from '../components';
import { Target, BarChart3, TrendingUp, FileText, AlertTriangle, GitCompare, Settings, CheckCircle2, AlertCircle, Calendar, MapPin, User, ArrowRight, SlidersHorizontal, HelpCircle, Calculator, CheckSquare, Accessibility, BookOpen, Library, BarChart, Sparkles } from 'lucide-react';
import { getObjectives } from '../api/objectives';
import { getCriticalAlerts } from '../api/alerts';
import { getAccessibilityConfig, applyAccessibilityConfig } from '../api/accessibility';
import { Objective, GlobalFilters as GlobalFiltersType, Alert, TabConfig, TabId, TabProgress } from '../types';

/**
 * Página principal de Objetivos y Rendimiento
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Enfocados en facturación personal, adherencia de clientes y retención
 * - Gimnasios: Enfocados en objetivos comerciales globales, ocupación y tasa de bajas
 */
export default function ObjetivosRendimientoPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';

  // Initialize tab from URL or localStorage
  const [tabActiva, setTabActiva] = useState<string>(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab) return urlTab;
    const saved = localStorage.getItem('objetivos-rendimiento-active-tab');
    return saved || 'dashboard';
  });
  
  // State for help modal
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpModalTabId, setHelpModalTabId] = useState<TabId>('dashboard');
  const [periodoActivo, setPeriodoActivo] = useState<'semana' | 'mes' | 'trimestre'>(() => {
    // User Story 2: Leer periodo de URL si está presente
    const urlPeriodo = searchParams.get('periodo');
    if (urlPeriodo && ['semana', 'mes', 'trimestre'].includes(urlPeriodo)) {
      return urlPeriodo as 'semana' | 'mes' | 'trimestre';
    }
    
    const saved = localStorage.getItem('objetivos-rendimiento-periodo');
    return (saved as 'semana' | 'mes' | 'trimestre') || 'mes';
  });
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  
  // Global filters state with localStorage persistence
  // User Story 2: Leer filtros de URL si están presentes, sino usar localStorage
  const [globalFilters, setGlobalFilters] = useState<GlobalFiltersType>(() => {
    // Primero intentar leer de URL
    const urlSede = searchParams.get('sede');
    const urlPeriodo = searchParams.get('periodo');
    
    if (urlSede || urlPeriodo) {
      const filters: GlobalFiltersType = {};
      if (urlSede) filters.sede = urlSede;
      // El periodo se maneja por separado, pero lo guardamos en filters si es necesario
      return filters;
    }
    
    // Si no hay en URL, leer de localStorage
    const saved = localStorage.getItem('objetivos-rendimiento-global-filters');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Quick access menu states
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTabConfigOpen, setIsTabConfigOpen] = useState(false);
  const [isAccessibilitySettingsOpen, setIsAccessibilitySettingsOpen] = useState(false);
  // User Story 1: Formación in-app y librería de objetivos
  const [isInAppTrainingOpen, setIsInAppTrainingOpen] = useState(false);
  const [isPredefinedObjectivesOpen, setIsPredefinedObjectivesOpen] = useState(false);
  // User Story 2: Integración con dashboards ERP y reportes 360º
  const [isERPDashboardOpen, setIsERPDashboardOpen] = useState(false);
  const [isReport360Open, setIsReport360Open] = useState(false);
  const objectivesManagerRef = useRef<{ openCreateModal: () => void } | null>(null);
  const reportsGeneratorRef = useRef<{ exportReport: () => void } | null>(null);
  
  // Tab configuration state with localStorage persistence
  const [tabConfigs, setTabConfigs] = useState<TabConfig[]>(() => {
    const saved = localStorage.getItem('objetivos-rendimiento-tab-configs');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default configuration with tooltips and videos
    const defaultTabs: TabConfig[] = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        visible: true, 
        order: 0,
        tooltip: 'Vista general de objetivos y métricas clave',
      },
      { 
        id: 'objetivos', 
        label: 'Objetivos', 
        visible: true, 
        order: 1,
        tooltip: 'Crea y gestiona tus objetivos',
      },
      { 
        id: 'metricas', 
        label: 'Métricas', 
        visible: true, 
        order: 2,
        tooltip: 'Visualiza métricas en gráficos interactivos',
      },
      { 
        id: 'seguimiento', 
        label: 'Seguimiento', 
        visible: true, 
        order: 3,
        tooltip: 'Sigue el progreso de tus objetivos',
      },
      { 
        id: 'reportes', 
        label: 'Reportes', 
        visible: true, 
        order: 4,
        tooltip: 'Genera reportes personalizados',
      },
      { 
        id: 'alertas', 
        label: 'Alertas', 
        visible: true, 
        order: 5,
        tooltip: 'Gestiona alertas y notificaciones',
      },
      { 
        id: 'comparacion', 
        label: 'Comparación', 
        visible: true, 
        order: 6,
        tooltip: 'Compara rendimiento entre períodos',
      },
      { 
        id: 'simulacion', 
        label: 'Simulación', 
        visible: true, 
        order: 7,
        tooltip: 'Simula escenarios hipotéticos y visualiza el impacto proyectado',
      },
      { 
        id: 'configuracion', 
        label: 'KPIs', 
        visible: true, 
        order: 8,
        tooltip: 'Configura tus KPIs',
      },
      { 
        id: 'aprobaciones', 
        label: 'Aprobaciones', 
        visible: true, 
        order: 9,
        tooltip: 'Gestiona solicitudes de aprobación para objetivos críticos y cambios significativos',
      },
      { 
        id: 'patrones-exito', 
        label: 'Patrones de Éxito', 
        visible: true, 
        order: 10,
        tooltip: 'Identifica patrones de éxito y replica estrategias efectivas con IA',
      },
    ];
    return defaultTabs;
  });
  
  // Persist global filters to localStorage
  useEffect(() => {
    localStorage.setItem('objetivos-rendimiento-global-filters', JSON.stringify(globalFilters));
  }, [globalFilters]);

  // Sync tab with URL and localStorage when tab changes
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab !== tabActiva) {
      // Update URL with new tab (adds to history)
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', tabActiva);
      navigate(`?${newSearchParams.toString()}`, { replace: false });
    }
    localStorage.setItem('objetivos-rendimiento-active-tab', tabActiva);
  }, [tabActiva]); // Only depend on tabActiva to avoid loops

  // Handle browser back/forward navigation
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== tabActiva) {
      setTabActiva(urlTab);
    }
  }, [searchParams]);

  // User Story 2: Sincronizar filtros con URL params cuando cambian
  useEffect(() => {
    const urlSede = searchParams.get('sede');
    const urlPeriodo = searchParams.get('periodo');
    
    // Actualizar filtros si hay cambios en la URL
    if (urlSede !== globalFilters.sede) {
      setGlobalFilters(prev => ({
        ...prev,
        sede: urlSede || undefined,
      }));
    }
    
    // Actualizar periodo si hay cambios en la URL
    if (urlPeriodo && ['semana', 'mes', 'trimestre'].includes(urlPeriodo)) {
      const periodo = urlPeriodo as 'semana' | 'mes' | 'trimestre';
      if (periodo !== periodoActivo) {
        setPeriodoActivo(periodo);
      }
    }
  }, [searchParams]);

  // Persist periodo to localStorage
  useEffect(() => {
    localStorage.setItem('objetivos-rendimiento-periodo', periodoActivo);
  }, [periodoActivo]);

  // Persist tab configurations to localStorage
  useEffect(() => {
    localStorage.setItem('objetivos-rendimiento-tab-configs', JSON.stringify(tabConfigs));
  }, [tabConfigs]);

  // Cargar objetivos para el resumen del header
  const loadObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const data = await getObjectives({}, role);
      setObjectives(data);
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      setLoadingObjectives(false);
    }
  };

  // Cargar alertas críticas
  const loadCriticalAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const alerts = await getCriticalAlerts(role);
      setCriticalAlerts(alerts);
    } catch (error) {
      console.error('Error loading critical alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    loadObjectives();
    loadCriticalAlerts();
  }, [role, globalFilters]);

  // Load accessibility config on mount
  useEffect(() => {
    if (user?.id) {
      getAccessibilityConfig(user.id).then(config => {
        applyAccessibilityConfig(config);
      }).catch(error => {
        console.error('Error loading accessibility config:', error);
      });
    }
  }, [user?.id]);

  // Calcular resumen de objetivos
  const resumenObjetivos = useMemo(() => {
    const total = objectives.length;
    const cumplidos = objectives.filter(obj => obj.status === 'achieved').length;
    const desviacionesCriticas = objectives.filter(obj => obj.status === 'at_risk' || obj.status === 'failed').length;
    const progresoGlobal = total > 0
      ? objectives.reduce((acc, obj) => acc + obj.progress, 0) / total
      : 0;

    return {
      total,
      cumplidos,
      desviacionesCriticas,
      progresoGlobal: Math.round(progresoGlobal),
    };
  }, [objectives]);

  // Tab definitions with icons
  const tabDefinitions = useMemo(() => {
    return {
      dashboard: { label: 'Dashboard', icon: BarChart3 },
      objetivos: { label: 'Objetivos', icon: Target },
      metricas: { label: 'Métricas', icon: TrendingUp },
      seguimiento: { label: 'Seguimiento', icon: Target },
      reportes: { label: 'Reportes', icon: FileText },
      alertas: { label: 'Alertas', icon: AlertTriangle },
      comparacion: { label: 'Comparación', icon: GitCompare },
      simulacion: { label: 'Simulación', icon: Calculator },
      configuracion: { label: 'KPIs', icon: Settings },
      aprobaciones: { label: 'Aprobaciones', icon: CheckSquare },
      'patrones-exito': { label: 'Patrones de Éxito', icon: Sparkles },
    };
  }, []);

  // Calculate progress metrics for each tab
  const tabProgress = useMemo<TabProgress[]>(() => {
    const progress: TabProgress[] = [];

    // Dashboard: Overall progress
    progress.push({
      tabId: 'dashboard',
      value: resumenObjetivos.progresoGlobal,
      label: `${resumenObjetivos.progresoGlobal}%`,
      type: 'percentage',
    });

    // Objetivos: % objectives completed
    const objetivosCompleted = resumenObjetivos.total > 0
      ? Math.round((resumenObjetivos.cumplidos / resumenObjetivos.total) * 100)
      : 0;
    progress.push({
      tabId: 'objetivos',
      value: objetivosCompleted,
      label: `${objetivosCompleted}%`,
      type: 'percentage',
    });

    // Métricas: Number of metrics tracked (simplified - could be enhanced)
    const metricsCount = objectives.length;
    progress.push({
      tabId: 'metricas',
      value: metricsCount,
      label: `${metricsCount}`,
      type: 'count',
    });

    // Seguimiento: % objectives on track
    const onTrackObjectives = objectives.filter(obj => {
      if (obj.status === 'achieved') return true;
      if (obj.status === 'failed' || obj.status === 'at_risk') return false;
      return obj.progress >= 50; // Consider on track if progress >= 50%
    }).length;
    const seguimientoProgress = objectives.length > 0
      ? Math.round((onTrackObjectives / objectives.length) * 100)
      : 0;
    progress.push({
      tabId: 'seguimiento',
      value: seguimientoProgress,
      label: `${seguimientoProgress}%`,
      type: 'percentage',
    });

    // Reportes: Number of reports (simplified - could be enhanced)
    progress.push({
      tabId: 'reportes',
      value: 0,
      label: '0',
      type: 'count',
    });

    // Alertas: Unread alerts count
    const unreadAlerts = criticalAlerts.filter(alert => !alert.read).length;
    progress.push({
      tabId: 'alertas',
      value: unreadAlerts,
      label: unreadAlerts > 0 ? `${unreadAlerts}` : '',
      type: 'count',
    });

    // Comparación: Has comparison data (simplified)
    progress.push({
      tabId: 'comparacion',
      value: objectives.length > 0 ? 1 : 0,
      label: '',
      type: 'status',
    });

    // KPIs: Number of KPIs configured (simplified)
    progress.push({
      tabId: 'configuracion',
      value: 0,
      label: '',
      type: 'count',
    });

    return progress;
  }, [objectives, resumenObjetivos, criticalAlerts]);

  // Get progress for a specific tab
  const getTabProgress = (tabId: TabId): TabProgress | undefined => {
    return tabProgress.find(p => p.tabId === tabId);
  };

  // Get visible and sorted tabs
  const tabs = useMemo(() => {
    return tabConfigs
      .filter(config => config.visible)
      .sort((a, b) => a.order - b.order)
      .map(config => ({
        id: config.id,
        label: config.label,
        icon: tabDefinitions[config.id]?.icon || BarChart3,
      }));
  }, [tabConfigs, tabDefinitions]);

  // Handle tab configuration save
  const handleTabConfigSave = (newConfigs: TabConfig[]) => {
    setTabConfigs(newConfigs);
    // If the active tab was hidden, switch to the first visible tab
    const activeTabConfig = newConfigs.find(c => c.id === tabActiva);
    if (!activeTabConfig || !activeTabConfig.visible) {
      const firstVisible = newConfigs.find(c => c.visible);
      if (firstVisible) {
        setTabActiva(firstVisible.id);
      }
    }
  };

  // Obtener etiqueta del rol
  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'entrenador': 'Entrenador',
      'gimnasio': 'Manager',
      'creador': 'Creador',
    };
    return roleLabels[role] || role;
  };

  // Quick access menu handlers
  const handleCreateObjective = () => {
    // Switch to objetivos tab and trigger create
    setTabActiva('objetivos');
    // The ObjectivesManager will handle opening the modal
    setTimeout(() => {
      objectivesManagerRef.current?.openCreateModal();
    }, 100);
  };

  const handleGenerateAIPlan = () => {
    setIsAIModalOpen(true);
  };

  const handleExportReport = () => {
    // Switch to reportes tab and trigger export
    setTabActiva('reportes');
    setTimeout(() => {
      reportsGeneratorRef.current?.exportReport();
    }, 100);
  };

  const handleUpdateData = async () => {
    setIsUpdating(true);
    try {
      await loadObjectives();
      // Trigger refresh in all components if needed
      window.dispatchEvent(new CustomEvent('refresh-data'));
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateAIPlanSubmit = async (prompt: string, focus: string) => {
    // Simulate AI plan generation
    console.log('Generating AI plan with:', { prompt, focus, globalFilters });
    // In a real implementation, this would call an API
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Plan de acción generado con éxito. Revisa la sección de Objetivos para ver el plan.');
  };

  // Handler para navegar a alertas desde el header
  const handleNavigateToAlerts = (objectiveId?: string) => {
    setTabActiva('alertas');
    // Si hay un objectiveId, podríamos pasar un parámetro para filtrar
    if (objectiveId) {
      // En una implementación más completa, podríamos usar un estado o contexto
      // para pasar el filtro al componente AlertsManager
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('filter-alert-by-objective', { detail: { objectiveId } }));
      }, 100);
    }
  };

  // Handler para abrir modal de ayuda
  const handleOpenHelp = (tabId: TabId) => {
    setHelpModalTabId(tabId);
    setHelpModalOpen(true);
  };

  const renderContent = () => {
    switch (tabActiva) {
      case 'dashboard':
        return <PerformanceDashboard role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'objetivos':
        return <ObjectivesManager role={role} globalFilters={globalFilters} periodo={periodoActivo} ref={objectivesManagerRef} />;
      case 'metricas':
        return <MetricsChart role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'seguimiento':
        return <GoalTracker role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'reportes':
        return <ReportsGenerator role={role} globalFilters={globalFilters} periodo={periodoActivo} ref={reportsGeneratorRef} />;
      case 'alertas':
        return <AlertsManager role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'comparacion':
        return <ComparisonTool role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'simulacion':
        return <ScenarioSimulator role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'configuracion':
        return <KPIConfigurator role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
      case 'aprobaciones':
        return <ApprovalManager role={role} onApprovalChange={() => loadObjectives()} />;
      default:
        return <PerformanceDashboard role={role} globalFilters={globalFilters} periodo={periodoActivo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header según guía de estilos */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            {/* Primera fila: Título y contexto */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
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
                      ? 'Establece y monitorea tus objetivos de facturación personal, adherencia de clientes y retención. Visualiza tu rendimiento en tiempo real y toma decisiones basadas en datos.'
                      : 'Gestiona los objetivos comerciales del centro, monitorea la ocupación media y controla la tasa de bajas. Dashboard ejecutivo para tomar decisiones estratégicas.'}
                  </p>
                </div>
              </div>
              
              {/* Quick Access Menu and Global Filters */}
              <div className="flex items-center gap-3">
                <GlobalFilters
                  filters={globalFilters}
                  onFiltersChange={setGlobalFilters}
                />
                {/* User Story 1: Botones de formación in-app y librería de objetivos */}
                <button
                  onClick={() => setIsInAppTrainingOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Formación in-app (tutoriales y casos de uso)"
                  aria-label="Abrir formación in-app"
                >
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setIsPredefinedObjectivesOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Librería de objetivos predefinidos"
                  aria-label="Abrir librería de objetivos"
                >
                  <Library className="w-5 h-5 text-gray-600" />
                </button>
                {/* User Story 2: Botones de integración ERP y reportes 360º */}
                <button
                  onClick={() => setIsERPDashboardOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Integración con dashboards ERP"
                  aria-label="Abrir integración ERP"
                >
                  <BarChart className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setIsReport360Open(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Reporte 360º"
                  aria-label="Abrir reporte 360º"
                >
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setIsAccessibilitySettingsOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Configuración de accesibilidad"
                  aria-label="Abrir configuración de accesibilidad"
                >
                  <Accessibility className="w-5 h-5 text-gray-600" />
                </button>
                <QuickAccessMenu
                  onCreateObjective={handleCreateObjective}
                  onGenerateAIPlan={handleGenerateAIPlan}
                  onExportReport={handleExportReport}
                  onUpdateData={handleUpdateData}
                  isUpdating={isUpdating}
                />
              </div>
            </div>

            {/* Segunda fila: Contexto (Rol, Sede, Periodo) */}
            <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-200/60">
              {/* Rol */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200/50">
                <User size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {getRoleLabel(user?.role || '')}
                </span>
              </div>

              {/* Sede */}
              {user?.sede && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200/50">
                  <MapPin size={16} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    {user.sede}
                  </span>
                </div>
              )}

              {/* Periodo Activo */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200/50">
                <Calendar size={16} className="text-green-600" />
                <select
                  value={periodoActivo}
                  onChange={(e) => setPeriodoActivo(e.target.value as 'semana' | 'mes' | 'trimestre')}
                  className="text-sm font-medium text-green-900 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="semana">Semana</option>
                  <option value="mes">Mes</option>
                  <option value="trimestre">Trimestre</option>
                </select>
              </div>
            </div>

            {/* Alertas Críticas en el Header */}
            {!loadingAlerts && criticalAlerts.length > 0 && (
              <div className="mb-4 pb-4 border-b border-red-200/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-600" />
                    <h3 className="text-sm font-semibold text-red-900">Alertas Críticas Requieren Atención</h3>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {criticalAlerts.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNavigateToAlerts()}
                    className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                  >
                    Gestionar todas
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {criticalAlerts.slice(0, 3).map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => handleNavigateToAlerts(alert.objectiveId)}
                      className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200/50 hover:bg-red-100 hover:border-red-300 transition-all text-left group"
                    >
                      <div className="p-1.5 bg-red-100 rounded-lg mt-0.5">
                        <AlertTriangle size={16} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-red-900 mb-1 truncate">
                          {alert.title}
                        </p>
                        <p className="text-xs text-red-700 line-clamp-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-red-600 font-medium group-hover:text-red-700">
                            Gestionar
                          </span>
                          <ArrowRight size={12} className="text-red-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {criticalAlerts.length > 3 && (
                  <button
                    onClick={() => handleNavigateToAlerts()}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    Ver {criticalAlerts.length - 3} alertas más
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Tercera fila: Resumen rápido */}
            {!loadingObjectives && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Objetivos Cumplidos */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200/50">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-medium">Objetivos Cumplidos</p>
                    <p className="text-2xl font-bold text-green-900">
                      {resumenObjetivos.cumplidos}
                      {resumenObjetivos.total > 0 && (
                        <span className="text-sm font-normal text-green-700 ml-1">
                          / {resumenObjetivos.total}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Desviaciones Críticas */}
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200/50">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-red-700 font-medium">Desviaciones Críticas</p>
                    <p className="text-2xl font-bold text-red-900">
                      {resumenObjetivos.desviacionesCriticas}
                    </p>
                    {resumenObjetivos.desviacionesCriticas > 0 && (
                      <p className="text-xs text-red-600 mt-0.5">Requieren atención</p>
                    )}
                  </div>
                </div>

                {/* Progreso Global */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200/50">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-700 font-medium">Progreso Global</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-blue-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            resumenObjetivos.progresoGlobal >= 75
                              ? 'bg-green-500'
                              : resumenObjetivos.progresoGlobal >= 50
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${resumenObjetivos.progresoGlobal}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-blue-900 min-w-[3rem] text-right">
                        {resumenObjetivos.progresoGlobal}%
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {resumenObjetivos.progresoGlobal >= 75
                        ? 'On-track'
                        : resumenObjetivos.progresoGlobal >= 50
                        ? 'En progreso'
                        : 'Requiere atención'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loadingObjectives && (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Cargando resumen...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs según guía */}
        <Card className="p-0 bg-white shadow-sm mb-6">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 flex-1 overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tabActiva === tab.id;
                  const progress = getTabProgress(tab.id as TabId);
                  const showBadge = progress && (
                    (progress.type === 'count' && progress.value > 0) ||
                    (progress.type === 'percentage' && progress.value > 0) ||
                    (progress.type === 'status' && progress.value > 0)
                  );

                  const tabConfig = tabConfigs.find(tc => tc.id === tab.id);
                  const hasHelp = tabConfig?.tooltip || tabConfig?.videoUrl;

                  return (
                    <div key={tab.id} className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setTabActiva(tab.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all relative ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                        <span>{tab.label}</span>
                        {showBadge && progress && (
                          <span
                            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              progress.type === 'count' && progress.tabId === 'alertas'
                                ? 'bg-red-100 text-red-700'
                                : progress.type === 'percentage' && progress.value >= 75
                                ? 'bg-green-100 text-green-700'
                                : progress.type === 'percentage' && progress.value >= 50
                                ? 'bg-blue-100 text-blue-700'
                                : progress.type === 'percentage'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {progress.label}
                          </span>
                        )}
                      </button>
                      {hasHelp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenHelp(tab.id as TabId);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          title="Ver ayuda y tutorial"
                          aria-label={`Ayuda para ${tab.label}`}
                        >
                          <HelpCircle size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setIsTabConfigOpen(true)}
                className="ml-3 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                title="Personalizar tabs"
              >
                <SlidersHorizontal size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        </Card>

        {/* Contenido según tab activa */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
      
      {/* AI Action Plan Modal */}
      <AIActionPlanModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleGenerateAIPlanSubmit}
      />

      {/* Tab Configuration Modal */}
      <TabConfigModal
        isOpen={isTabConfigOpen}
        onClose={() => setIsTabConfigOpen(false)}
        tabs={tabConfigs}
        onSave={handleTabConfigSave}
      />

      {/* Tab Help Modal */}
      {helpModalOpen && (
        <TabHelpModal
          isOpen={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
          tabId={helpModalTabId}
          tabLabel={tabDefinitions[helpModalTabId]?.label || helpModalTabId}
          tooltip={tabConfigs.find(tc => tc.id === helpModalTabId)?.tooltip}
          videoUrl={tabConfigs.find(tc => tc.id === helpModalTabId)?.videoUrl}
        />
      )}

      {/* Accessibility Settings Modal */}
      <AccessibilitySettings
        isOpen={isAccessibilitySettingsOpen}
        onClose={() => setIsAccessibilitySettingsOpen(false)}
      />

      {/* User Story 1: Formación In-App Modal */}
      <InAppTraining
        isOpen={isInAppTrainingOpen}
        onClose={() => setIsInAppTrainingOpen(false)}
      />

      {/* User Story 1: Librería de Objetivos Predefinidos Modal */}
      <PredefinedObjectivesLibrary
        isOpen={isPredefinedObjectivesOpen}
        onClose={() => setIsPredefinedObjectivesOpen(false)}
        onObjectiveCreated={(objective) => {
          // Recargar objetivos cuando se crea uno desde la librería
          loadObjectives();
          setIsPredefinedObjectivesOpen(false);
        }}
      />

      {/* User Story 2: Integración con Dashboards ERP Modal */}
      <ERPDashboardIntegration
        isOpen={isERPDashboardOpen}
        onClose={() => setIsERPDashboardOpen(false)}
      />

      {/* User Story 2: Reporte 360º Modal */}
      <Report360
        isOpen={isReport360Open}
        onClose={() => setIsReport360Open(false)}
      />
    </div>
  );
}

