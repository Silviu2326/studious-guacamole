import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import {
  TasksManager,
  PriorityQueue,
  NotificationCenter,
  TaskHistory,
  AlertRules,
  DailySummary,
} from '../components';
import {
  CheckSquare,
  Bell,
  History,
  Settings,
  ListChecks,
  Calendar,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { UserRole, DashboardTabConfig, Alert, Notification, AlertFilters } from '../types';
import { getAlerts, getNotifications } from '../api';

/**
 * Página principal de Tareas y Alertas
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Tareas personales (clientes sin check-in, leads sin seguimiento, pagos pendientes)
 * - Gimnasios: Tareas del centro (facturas vencidas, equipos rotos, aforo superado, mantenimiento)
 */
export default function TareasAlertasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role: UserRole = esEntrenador ? 'entrenador' : 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('hoy');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Configuración de tabs con roles permitidos
  const allTabsConfig: DashboardTabConfig[] = useMemo(() => [
    {
      id: 'hoy',
      label: 'Hoy',
      icon: Calendar,
      allowedRoles: ['entrenador', 'gimnasio'],
    },
    {
      id: 'centro-notificaciones',
      label: 'Centro de notificaciones',
      icon: Bell,
      allowedRoles: ['entrenador', 'gimnasio'],
    },
    {
      id: 'tareas',
      label: 'Tareas',
      icon: CheckSquare,
      allowedRoles: ['entrenador', 'gimnasio'],
    },
    {
      id: 'prioridades',
      label: 'Prioridades',
      icon: ListChecks,
      allowedRoles: ['entrenador', 'gimnasio'],
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: History,
      allowedRoles: ['entrenador', 'gimnasio'],
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      allowedRoles: ['gimnasio'], // Solo gimnasio puede ver configuración
    },
  ], []);

  // Filtrar tabs visibles según el rol actual
  const tabs = useMemo(() => {
    return allTabsConfig.filter(tab => tab.allowedRoles.includes(role));
  }, [allTabsConfig, role]);

  // Separar tabs para móvil: principales (2-3) y resto en "Más"
  const mobileMainTabs = useMemo(() => {
    // En móvil, mostrar: Hoy, Centro de notificaciones, Prioridades
    const mainTabIds = ['hoy', 'centro-notificaciones', 'prioridades'];
    return tabs.filter(tab => mainTabIds.includes(tab.id));
  }, [tabs]);

  const mobileMoreTabs = useMemo(() => {
    const mainTabIds = ['hoy', 'centro-notificaciones', 'prioridades'];
    return tabs.filter(tab => !mainTabIds.includes(tab.id));
  }, [tabs]);

  // Asegurar que la tab activa sea válida para el rol actual
  useEffect(() => {
    const tabActivaExiste = tabs.some(tab => tab.id === tabActiva);
    if (!tabActivaExiste && tabs.length > 0) {
      setTabActiva(tabs[0].id);
    }
  }, [tabs, tabActiva]);

  // Cargar alertas y notificaciones cuando se active el tab del centro de notificaciones
  useEffect(() => {
    if (tabActiva === 'centro-notificaciones') {
      loadNotificationCenterData();
    }
  }, [tabActiva, role, user?.id]);

  const loadNotificationCenterData = async () => {
    try {
      const filters: AlertFilters = { role };
      const [alertsData, notificationsData] = await Promise.all([
        getAlerts(filters),
        getNotifications(),
      ]);
      setAlerts(alertsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error cargando datos del centro de notificaciones:', error);
    }
  };

  const handleNavigateToTab = (tabId: string) => {
    setTabActiva(tabId);
  };

  const renderContent = () => {
    switch (tabActiva) {
      case 'hoy':
        return <DailySummary role={role} onNavigateToTab={handleNavigateToTab} />;
      case 'centro-notificaciones':
        return (
          <NotificationCenter 
            role={role} 
            alerts={alerts}
            notifications={notifications}
          />
        );
      case 'tareas':
        return <TasksManager role={role} />;
      case 'prioridades':
        return <PriorityQueue role={role} />;
        // NOTA: Para compartir la misma fuente de datos entre TasksManager y PriorityQueue:
        // 1. Obtener las tareas una vez en el nivel de página usando getTasks() con los filtros apropiados
        // 2. Pasar las tareas filtradas a ambos componentes vía props:
        //    - TasksManager: <TasksManager role={role} tasks={tasks} onTasksChange={handleTasksChange} />
        //    - PriorityQueue: <PriorityQueue role={role} tasks={tasks} filters={filters} onTaskUpdate={handleTaskUpdate} />
        // 3. Cuando una tarea se actualiza en un componente, el callback notifica al otro para sincronizar
        // Ejemplo de implementación:
        // const [tasks, setTasks] = useState<Task[]>([]);
        // const [filters, setFilters] = useState<TaskFilters>({ role, ... });
        // useEffect(() => { loadTasks(); }, [filters, role]);
        // const loadTasks = async () => { const data = await getTasks(filters); setTasks(data); };
        // const handleTasksChange = (newTasks: Task[]) => { setTasks(newTasks); };
        // const handleTaskUpdate = () => { loadTasks(); };
      case 'historial':
        return <TaskHistory role={role} />;
      case 'configuracion':
        return <AlertRules role={role} />;
      default:
        return <DailySummary role={role} onNavigateToTab={handleNavigateToTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <CheckSquare size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {esEntrenador ? 'Tareas y Alertas' : 'Tareas y Alertas del Centro'}
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona tus tareas personales y recibe alertas sobre clientes, leads y pagos pendientes'
                    : 'Gestiona tareas del centro, alertas operativas y asigna tareas al staff'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            {/* Desktop: mostrar todos los tabs */}
            <div
              role="tablist"
              aria-label="Secciones"
              className="hidden md:flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tabActiva === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
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

            {/* Mobile: mostrar solo tabs principales + "Más" */}
            <div className="md:hidden relative">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {mobileMainTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setTabActiva(tab.id);
                        setShowMoreMenu(false);
                      }}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={isActive}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
                
                {/* Tab "Más" con menú desplegable */}
                {mobileMoreTabs.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                        mobileMoreTabs.some(tab => tabActiva === tab.id)
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={mobileMoreTabs.some(tab => tabActiva === tab.id)}
                    >
                      <MoreHorizontal size={18} />
                      <span className="hidden sm:inline">Más</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${showMoreMenu ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {/* Menú desplegable */}
                    {showMoreMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMoreMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-2">
                          {mobileMoreTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = tabActiva === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setTabActiva(tab.id);
                                  setShowMoreMenu(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all min-h-[44px] ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-900'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                                role="menuitem"
                              >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Contenido de la sección activa */}
        <div className="mt-6 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

