import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/componentsreutilizables';
import {
  DashboardOverview,
  QuickActions,
  AlertsPanel,
  MetricsChart,
  TasksWidget,
  FinancialSummary,
  ClientStatus,
  RecentActivity,
  type QuickAction,
} from '../components';
import {
  getMetrics,
  getAlerts,
  getTasks,
  getFinancialSummary,
  getClientStatus,
  updateTask,
  Task,
} from '../api';
import {
  RefreshCw,
  LayoutDashboard,
  AlertCircle,
  Users,
  Calendar,
  DollarSign,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
  UserPlus,
  Package,
  Store,
} from 'lucide-react';

/**
 * Página principal de Resumen General
 * 
 * Panel principal de control y métricas del sistema que se adapta automáticamente
 * según el tipo de usuario (entrenador personal vs gimnasio), mostrando información
 * relevante y personalizada para cada rol.
 */
export default function ResumenGeneralPage() {
  const { user } = useAuth();
  const role = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [clientStatus, setClientStatus] = useState<any>(null);
  
  // Estados de error parcial por widget
  const [errors, setErrors] = useState<{
    metrics?: string;
    alerts?: string;
    tasks?: string;
    financial?: string;
    clientStatus?: string;
  }>({});

  useEffect(() => {
    loadDashboardData();
  }, [role, user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrors({});
      
      // Cargar cada API de forma independiente para manejar errores parciales
      let metricsSuccess = false;
      let financialSuccess = false;
      
      const loadMetrics = getMetrics(role, user?.id)
        .then(data => {
          setMetrics(data);
          metricsSuccess = true;
          setErrors((prev: typeof errors) => {
            const next = { ...prev };
            delete next.metrics;
            return next;
          });
          return data;
        })
        .catch(err => {
          console.error('Error cargando métricas:', err);
          metricsSuccess = false;
          setErrors((prev: typeof errors) => ({ ...prev, metrics: 'No se pudieron cargar las métricas' }));
          return null;
        });

      const loadAlerts = getAlerts(role, user?.id)
        .then(data => {
          setAlerts(data);
          setErrors(prev => {
            const next = { ...prev };
            delete next.alerts;
            return next;
          });
          return data;
        })
        .catch(err => {
          console.error('Error cargando alertas:', err);
          setErrors((prev: typeof errors) => ({ ...prev, alerts: 'No se pudieron cargar las alertas' }));
          return [];
        });

      const loadTasks = getTasks(role, user?.id)
        .then(data => {
          setTasks(data);
          setErrors(prev => {
            const next = { ...prev };
            delete next.tasks;
            return next;
          });
          return data;
        })
        .catch(err => {
          console.error('Error cargando tareas:', err);
          setErrors((prev: typeof errors) => ({ ...prev, tasks: 'No se pudieron cargar las tareas' }));
          return [];
        });

      const loadFinancial = getFinancialSummary(role, user?.id)
        .then(data => {
          setFinancialSummary(data);
          financialSuccess = true;
          setErrors(prev => {
            const next = { ...prev };
            delete next.financial;
            return next;
          });
          return data;
        })
        .catch(err => {
          console.error('Error cargando resumen financiero:', err);
          financialSuccess = false;
          setErrors((prev: typeof errors) => ({ ...prev, financial: 'No se pudo cargar el resumen financiero' }));
          return null;
        });

      const loadClientStatus = getClientStatus(role, user?.id)
        .then(data => {
          setClientStatus(data);
          setErrors(prev => {
            const next = { ...prev };
            delete next.clientStatus;
            return next;
          });
          return data;
        })
        .catch(err => {
          console.error('Error cargando estado de clientes:', err);
          setErrors((prev: typeof errors) => ({ ...prev, clientStatus: 'No se pudo cargar el estado de clientes' }));
          return null;
        });

      // Esperar a que todas las llamadas terminen (exitosas o fallidas)
      await Promise.allSettled([loadMetrics, loadAlerts, loadTasks, loadFinancial, loadClientStatus]);

      // Verificar si todas las APIs críticas fallaron
      if (!metricsSuccess && !financialSuccess) {
        setError('No se pudieron cargar los datos principales del dashboard. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error inesperado cargando datos del dashboard:', error);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  const handleTaskUpdate = async (taskActualizada: Task) => {
    // Guardar el estado anterior para poder revertir si hay error
    const taskAnterior = tasks.find((t: Task) => t.id === taskActualizada.id);
    
    // Actualización optimista: actualizar el estado local inmediatamente
    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task: Task) =>
        task.id === taskActualizada.id ? taskActualizada : task
      )
    );

    try {
      // Llamar a la API para persistir el cambio
      await updateTask(taskActualizada);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      // Revertir el cambio optimista en caso de error
      if (taskAnterior) {
        setTasks((prevTasks: Task[]) =>
          prevTasks.map((task: Task) =>
            task.id === taskActualizada.id ? taskAnterior : task
          )
        );
      } else {
        // Si no encontramos la tarea anterior, recargar los datos
        loadDashboardData();
      }
      // Opcional: mostrar un mensaje de error al usuario
      setError('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
    }
  };

  // Obtener datos semanales para el gráfico
  const getWeeklyData = () => {
    if (metrics?.weeklyTrends && metrics.weeklyTrends.length > 0) {
      return metrics.weeklyTrends;
    }
    // Fallback a datos por defecto si no hay datos semanales
    if (role === 'entrenador') {
      return [
        { day: 'Lun', sessions: 8, occupancy: 67 },
        { day: 'Mar', sessions: 12, occupancy: 80 },
        { day: 'Mié', sessions: 10, occupancy: 75 },
        { day: 'Jue', sessions: 15, occupancy: 88 },
        { day: 'Vie', sessions: 14, occupancy: 85 },
        { day: 'Sáb', sessions: 6, occupancy: 50 },
        { day: 'Dom', sessions: 4, occupancy: 33 },
      ];
    } else {
      return [
        { day: 'Lun', sessions: 145, occupancy: 65 },
        { day: 'Mar', sessions: 168, occupancy: 75 },
        { day: 'Mié', sessions: 152, occupancy: 68 },
        { day: 'Jue', sessions: 180, occupancy: 80 },
        { day: 'Vie', sessions: 175, occupancy: 78 },
        { day: 'Sáb', sessions: 120, occupancy: 54 },
        { day: 'Dom', sessions: 95, occupancy: 42 },
      ];
    }
  };

  // Configurar acciones rápidas según el rol
  const quickActions = useMemo<QuickAction[]>(() => {
    if (role === 'entrenador') {
      return [
        {
          id: 'clientes',
          label: 'Ver Clientes',
          description: 'Gestiona y visualiza todos tus clientes',
          icon: <Users className="w-5 h-5" />,
          path: '/gestión-de-clientes',
        },
        {
          id: 'agenda-hoy',
          label: 'Ver Agenda de Hoy',
          description: 'Consulta tus sesiones programadas para hoy',
          icon: <Calendar className="w-5 h-5" />,
          path: '/agenda',
        },
        {
          id: 'crear-planificacion',
          label: 'Crear Planificación',
          description: 'Diseña nuevos planes de entrenamiento',
          icon: <Dumbbell className="w-5 h-5" />,
          path: '/editor-de-entreno',
        },
        {
          id: 'tienda-servicios',
          label: 'Tienda de Servicios',
          description: 'Gestiona y vende tus servicios',
          icon: <Store className="w-5 h-5" />,
          path: '/tienda-online-checkout-online',
        },
        {
          id: 'facturacion',
          label: 'Facturación',
          description: 'Gestiona facturas y cobros',
          icon: <DollarSign className="w-5 h-5" />,
          path: '/facturacin-cobros',
        },
        {
          id: 'dietas',
          label: 'Editor de Dieta',
          description: 'Crea y gestiona planes nutricionales',
          icon: <UtensilsCrossed className="w-5 h-5" />,
          path: '/editor-de-dieta-meal-planner',
        },
        {
          id: 'leads',
          label: 'Leads',
          description: 'Gestiona tus leads y oportunidades',
          icon: <UserPlus className="w-5 h-5" />,
          path: '/leads',
        },
      ];
    } else {
      return [
        {
          id: 'clientes',
          label: 'Ver Clientes',
          description: 'Gestiona socios y miembros del centro',
          icon: <Users className="w-5 h-5" />,
          path: '/gestión-de-clientes',
        },
        {
          id: 'agenda-hoy',
          label: 'Ver Agenda de Hoy',
          description: 'Consulta clases y reservas de hoy',
          icon: <Calendar className="w-5 h-5" />,
          path: '/agenda',
        },
        {
          id: 'crear-planificacion',
          label: 'Crear Planificación',
          description: 'Diseña programas de entrenamiento',
          icon: <Dumbbell className="w-5 h-5" />,
          path: '/editor-de-entreno',
        },
        {
          id: 'tienda-servicios',
          label: 'Tienda de Servicios',
          description: 'Gestiona servicios y tarifas',
          icon: <Store className="w-5 h-5" />,
          path: '/settings/services',
        },
        {
          id: 'facturacion',
          label: 'Facturación & Cobros',
          description: 'Gestiona facturación y pagos',
          icon: <DollarSign className="w-5 h-5" />,
          path: '/facturacin-cobros',
        },
        {
          id: 'panel-financiero',
          label: 'Panel Financiero',
          description: 'Vista general de finanzas',
          icon: <BarChart3 className="w-5 h-5" />,
          path: '/panel-financiero-overview',
        },
        {
          id: 'productos',
          label: 'Catálogo Productos',
          description: 'Gestiona productos y stock',
          icon: <Package className="w-5 h-5" />,
          path: '/catalogo-productos',
        },
        {
          id: 'leads',
          label: 'Pipeline Comercial',
          description: 'Gestiona ventas y oportunidades',
          icon: <UserPlus className="w-5 h-5" />,
          path: '/leads',
        },
      ];
    }
  }, [role]);

  /**
   * Datos de actividad reciente (simulados)
   * 
   * TODO: Reemplazar esta función por una llamada real a la API del backend.
   * La función debería ser async y llamar a un endpoint como:
   * - getRecentActivities(role, userId) desde '../api'
   * 
   * El backend debería retornar actividades con el modelo:
   * - id: string
   * - type: 'client' | 'payment' | 'workout' | 'booking'
   * - description: string
   * - createdAt: Date
   */
  const getRecentActivities = () => {
    if (role === 'entrenador') {
      return [
        {
          id: '1',
          type: 'client' as const,
          description: 'Juan Pérez completó su sesión de entrenamiento de hoy',
          createdAt: new Date(Date.now() - 1800000), // 30 minutos atrás
        },
        {
          id: '2',
          type: 'payment' as const,
          description: 'Pago recibido de €120.00 de María García',
          createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
        },
        {
          id: '3',
          type: 'workout' as const,
          description: 'Nueva sesión programada con Pedro López para mañana a las 10:00',
          createdAt: new Date(Date.now() - 7200000), // 2 horas atrás
        },
        {
          id: '4',
          type: 'booking' as const,
          description: 'Reserva confirmada para clase de fuerza el viernes a las 18:00',
          createdAt: new Date(Date.now() - 14400000), // 4 horas atrás
        },
        {
          id: '5',
          type: 'client' as const,
          description: 'Nuevo cliente registrado: Carlos Ruiz',
          createdAt: new Date(Date.now() - 21600000), // 6 horas atrás
        },
      ];
    } else {
      return [
        {
          id: '1',
          type: 'client' as const,
          description: 'Ana Martínez se unió al centro con membresía anual',
          createdAt: new Date(Date.now() - 1200000), // 20 minutos atrás
        },
        {
          id: '2',
          type: 'payment' as const,
          description: 'Pago procesado de €450.00 por membresía anual de Luis Fernández',
          createdAt: new Date(Date.now() - 5400000), // 1.5 horas atrás
        },
        {
          id: '3',
          type: 'booking' as const,
          description: 'Clase de Yoga 19:00 al 100% de capacidad - 25 reservas confirmadas',
          createdAt: new Date(Date.now() - 10800000), // 3 horas atrás
        },
        {
          id: '4',
          type: 'workout' as const,
          description: 'Plan de entrenamiento personalizado creado para 5 nuevos miembros',
          createdAt: new Date(Date.now() - 18000000), // 5 horas atrás
        },
        {
          id: '5',
          type: 'payment' as const,
          description: 'Pago mensual de €89.00 recibido de 12 miembros',
          createdAt: new Date(Date.now() - 25200000), // 7 horas atrás
        },
      ];
    }
  };

  // Componente de skeleton para el dashboard completo
  const DashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Skeleton para DashboardOverview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Skeleton para QuickActions */}
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      
      {/* Skeleton para grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
      
      {/* Skeleton para gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  // Componente de error global (solo se muestra si fallan APIs críticas)
  const ErrorDisplay = () => (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            Error al cargar datos del dashboard
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
          </p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header principal */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <LayoutDashboard size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Resumen General
                  </h1>
                  <p className="text-gray-600">
                    {role === 'entrenador' 
                      ? 'Vista general de tu negocio y métricas clave' 
                      : 'Panel de control y métricas del centro'}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleRefresh}
                disabled={refreshing || loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {loading && !metrics && !financialSummary ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Mensaje de error global (solo si fallan APIs críticas) */}
            {error && <ErrorDisplay />}
            
            {/* 1. DashboardOverview - Arriba del todo */}
            <DashboardOverview 
              metrics={metrics} 
              role={role} 
              loading={loading && !metrics}
              error={errors.metrics}
              onRetry={() => {
                setErrors((prev: typeof errors) => {
                  const next = { ...prev };
                  delete next.metrics;
                  return next;
                });
                getMetrics(role, user?.id)
                  .then(data => setMetrics(data))
                  .catch(err => {
                    console.error('Error cargando métricas:', err);
                    setErrors((prev: typeof errors) => ({ ...prev, metrics: 'No se pudieron cargar las métricas' }));
                  });
              }}
            />

            {/* 2. Zona principal: ClientStatus, FinancialSummary y MetricsChart */}
            {(clientStatus || financialSummary) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ClientStatus - Prioridad para entrenador */}
                {(role === 'entrenador' && (clientStatus || errors.clientStatus)) && (
                  <div className="md:col-span-1">
                    <ClientStatus 
                      data={clientStatus} 
                      role={role} 
                      loading={loading && !clientStatus && !errors.clientStatus}
                      error={errors.clientStatus}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.clientStatus;
                          return next;
                        });
                        getClientStatus(role, user?.id)
                          .then(data => setClientStatus(data))
                          .catch(err => {
                            console.error('Error cargando estado de clientes:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, clientStatus: 'No se pudo cargar el estado de clientes' }));
                          });
                      }}
                    />
                  </div>
                )}
                
                {/* FinancialSummary */}
                {(financialSummary || errors.financial) && (
                  <div className={role === 'entrenador' && (clientStatus || errors.clientStatus) ? 'md:col-span-1 lg:col-span-1' : 'md:col-span-2 lg:col-span-2'}>
                    <FinancialSummary 
                      data={financialSummary} 
                      role={role} 
                      loading={loading && !financialSummary && !errors.financial}
                      error={errors.financial}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.financial;
                          return next;
                        });
                        getFinancialSummary(role, user?.id)
                          .then(data => setFinancialSummary(data))
                          .catch(err => {
                            console.error('Error cargando resumen financiero:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, financial: 'No se pudo cargar el resumen financiero' }));
                          });
                      }}
                    />
                  </div>
                )}
                
                {/* ClientStatus - Para gimnasio va después de FinancialSummary */}
                {(role === 'gimnasio' && (clientStatus || errors.clientStatus)) && (
                  <div className="md:col-span-1 lg:col-span-1">
                    <ClientStatus 
                      data={clientStatus} 
                      role={role} 
                      loading={loading && !clientStatus && !errors.clientStatus}
                      error={errors.clientStatus}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.clientStatus;
                          return next;
                        });
                        getClientStatus(role, user?.id)
                          .then(data => setClientStatus(data))
                          .catch(err => {
                            console.error('Error cargando estado de clientes:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, clientStatus: 'No se pudo cargar el estado de clientes' }));
                          });
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* MetricsChart - Ocupa ancho completo */}
            <div className="w-full">
              <MetricsChart
                title={role === 'entrenador' ? 'Tendencias Semanales' : 'Tendencias Semanales'}
                weeklyData={getWeeklyData()}
                defaultMetric={role === 'entrenador' ? 'sessions' : 'occupancy'}
                loading={loading && !metrics}
                chartType="bar"
              />
            </div>

            {/* 3. Columna lateral o fila inferior: TasksWidget, AlertsPanel, QuickActions y RecentActivity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna izquierda - Tareas y Alertas (prioridad para entrenador) */}
              <div className="lg:col-span-4 space-y-6">
                {role === 'entrenador' ? (
                  <>
                    <TasksWidget 
                      tasks={tasks || []} 
                      loading={loading && tasks.length === 0 && !errors.tasks}
                      error={errors.tasks}
                      onUpdateTask={handleTaskUpdate}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.tasks;
                          return next;
                        });
                        getTasks(role, user?.id)
                          .then(data => setTasks(data))
                          .catch(err => {
                            console.error('Error cargando tareas:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, tasks: 'No se pudieron cargar las tareas' }));
                          });
                      }}
                    />
                    <AlertsPanel 
                      alerts={alerts || []} 
                      loading={loading && alerts.length === 0 && !errors.alerts}
                      error={errors.alerts}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.alerts;
                          return next;
                        });
                        getAlerts(role, user?.id)
                          .then(data => setAlerts(data))
                          .catch(err => {
                            console.error('Error cargando alertas:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, alerts: 'No se pudieron cargar las alertas' }));
                          });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <AlertsPanel 
                      alerts={alerts || []} 
                      loading={loading && alerts.length === 0 && !errors.alerts}
                      error={errors.alerts}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.alerts;
                          return next;
                        });
                        getAlerts(role, user?.id)
                          .then(data => setAlerts(data))
                          .catch(err => {
                            console.error('Error cargando alertas:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, alerts: 'No se pudieron cargar las alertas' }));
                          });
                      }}
                    />
                    <TasksWidget 
                      tasks={tasks || []} 
                      loading={loading && tasks.length === 0 && !errors.tasks}
                      error={errors.tasks}
                      onUpdateTask={handleTaskUpdate}
                      onRetry={() => {
                        setErrors((prev: typeof errors) => {
                          const next = { ...prev };
                          delete next.tasks;
                          return next;
                        });
                        getTasks(role, user?.id)
                          .then(data => setTasks(data))
                          .catch(err => {
                            console.error('Error cargando tareas:', err);
                            setErrors((prev: typeof errors) => ({ ...prev, tasks: 'No se pudieron cargar las tareas' }));
                          });
                      }}
                    />
                  </>
                )}
              </div>

              {/* Columna derecha - QuickActions y RecentActivity */}
              <div className="lg:col-span-8 space-y-6">
                <QuickActions actions={quickActions} />
                <RecentActivity
                  activities={getRecentActivities()}
                  loading={loading && !metrics}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

