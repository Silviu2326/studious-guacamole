import React, { useState, useEffect } from 'react';
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
} from '../components';
import {
  getMetrics,
  getAlerts,
  getTasks,
  getFinancialSummary,
  getClientStatus,
} from '../api';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

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
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [clientStatus, setClientStatus] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, [role, user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, alertsData, tasksData, financialData, clientStatusData] = await Promise.all([
        getMetrics(role, user?.id),
        getAlerts(role, user?.id),
        getTasks(role, user?.id),
        getFinancialSummary(role, user?.id),
        getClientStatus(role, user?.id),
      ]);

      setMetrics(metricsData);
      setAlerts(alertsData);
      setTasks(tasksData);
      setFinancialSummary(financialData);
      setClientStatus(clientStatusData);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleTaskUpdate = () => {
    loadDashboardData();
  };

  // Datos para gráfico de métricas (adaptado por rol)
  const getChartData = () => {
    if (role === 'entrenador') {
      return [
        { label: 'Lun', value: 8, trend: 5 },
        { label: 'Mar', value: 12, trend: 12 },
        { label: 'Mié', value: 10, trend: -8 },
        { label: 'Jue', value: 15, trend: 25 },
        { label: 'Vie', value: 14, trend: -3 },
        { label: 'Sáb', value: 6, trend: -15 },
        { label: 'Dom', value: 4, trend: -10 },
      ];
    } else {
      return [
        { label: 'Lun', value: 145, trend: 8 },
        { label: 'Mar', value: 168, trend: 12 },
        { label: 'Mié', value: 152, trend: -5 },
        { label: 'Jue', value: 180, trend: 15 },
        { label: 'Vie', value: 175, trend: 10 },
        { label: 'Sáb', value: 120, trend: -12 },
        { label: 'Dom', value: 95, trend: -18 },
      ];
    }
  };

  // Datos de actividad reciente (simulados)
  const getRecentActivities = () => {
    if (role === 'entrenador') {
      return [
        {
          id: '1',
          type: 'client' as const,
          title: 'Nuevo check-in de Juan Pérez',
          description: 'Completó su sesión de hoy',
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: '2',
          type: 'payment' as const,
          title: 'Pago recibido',
          description: '€120.00 de María García',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          type: 'session' as const,
          title: 'Sesión programada',
          description: 'Nueva sesión con Pedro López mañana a las 10:00',
          timestamp: new Date(Date.now() - 7200000),
        },
      ];
    } else {
      return [
        {
          id: '1',
          type: 'client' as const,
          title: 'Nueva membresía activada',
          description: 'Ana Martínez se unió al centro',
          timestamp: new Date(Date.now() - 1200000),
        },
        {
          id: '2',
          type: 'payment' as const,
          title: 'Pago procesado',
          description: '€450.00 de membresía anual',
          timestamp: new Date(Date.now() - 5400000),
        },
        {
          id: '3',
          type: 'system' as const,
          title: 'Clase llena',
          description: 'Clase de Yoga 19:00 al 100% de capacidad',
          timestamp: new Date(Date.now() - 10800000),
        },
      ];
    }
  };

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
        <div className="space-y-6">

      {/* Métricas principales */}
      <DashboardOverview metrics={metrics} role={role} loading={loading} />

      {/* Accesos rápidos */}
      <QuickActions role={role} />

      {/* Grid principal: Alertas, Tareas, Finanzas y Estado de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <AlertsPanel alerts={alerts} loading={loading} />
          <TasksWidget 
            tasks={tasks} 
            loading={loading} 
            onTaskUpdate={handleTaskUpdate}
          />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <FinancialSummary 
            data={financialSummary} 
            role={role} 
            loading={loading} 
          />
          <ClientStatus 
            data={clientStatus} 
            role={role} 
            loading={loading} 
          />
        </div>
      </div>

      {/* Gráficos y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart
          title={role === 'entrenador' ? 'Sesiones de la Semana' : 'Ocupación Semanal'}
          data={getChartData()}
          loading={loading}
        />
        <RecentActivity
          activities={getRecentActivities()}
          loading={loading}
        />
      </div>
        </div>
      </div>
    </div>
  );
}

