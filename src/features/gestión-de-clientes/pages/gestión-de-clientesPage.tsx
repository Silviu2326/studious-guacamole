import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import {
  ClientsManager,
  RetentionAlerts,
  ChurnAnalyticsComponent,
  ClientSegmentation,
} from '../components';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Bell,
  UserCog,
} from 'lucide-react';
import { getChurnAnalytics } from '../api/analytics';

type TabId = 'clients' | 'alerts' | 'analytics' | 'segmentation';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

/**
 * Página principal de Gestión de Clientes
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Lista personal de clientes, planes individuales, check-ins y adherencia
 * - Gimnasios: Socios activos del centro, estado de cuotas, gestión masiva
 */
export default function GestiónDeClientesPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';
  
  const [tabActiva, setTabActiva] = useState<TabId>('clients');
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getChurnAnalytics(role, user?.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    }
  };

  // Tabs adaptadas según el rol
  const tabItems: TabItem[] = useMemo(() => {
    if (esEntrenador) {
      return [
        { id: 'clients', label: 'Mis Clientes', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];
    } else {
      return [
        { id: 'clients', label: 'Gestión de Socios', icon: Users },
        { id: 'alerts', label: 'Alertas Retención', icon: Bell },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'segmentation', label: 'Segmentación', icon: UserCog },
      ];
    }
  }, [esEntrenador]);

  // Métricas adaptadas según el rol
  const metricas = useMemo(() => {
    if (!analytics) return [];

    if (esEntrenador) {
      return [
        {
          id: 'active',
          title: 'Clientes Activos',
          value: analytics.activeClients.toString(),
          subtitle: `${analytics.totalClients} total`,
          icon: <Users className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'risk',
          title: 'En Riesgo',
          value: analytics.riskClients.toString(),
          subtitle: 'Requieren atención',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'warning' as const,
        },
        {
          id: 'retention',
          title: 'Tasa Retención',
          value: `${analytics.retentionRate.toFixed(1)}%`,
          subtitle: 'Promedio',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'success' as const,
        },
      ];
    } else {
      return [
        {
          id: 'active',
          title: 'Socios Activos',
          value: analytics.activeClients.toString(),
          subtitle: `${analytics.totalClients} total`,
          icon: <Users className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'risk',
          title: 'En Riesgo',
          value: analytics.riskClients.toString(),
          subtitle: `${((analytics.riskClients / analytics.totalClients) * 100).toFixed(1)}% del total`,
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'warning' as const,
        },
        {
          id: 'churn',
          title: 'Tasa Churn',
          value: `${analytics.churnRate.toFixed(1)}%`,
          subtitle: 'Último mes',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'error' as const,
        },
        {
          id: 'retention',
          title: 'Tasa Retención',
          value: `${analytics.retentionRate.toFixed(1)}%`,
          subtitle: 'Promedio',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'success' as const,
        },
      ];
    }
  }, [analytics, esEntrenador]);

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'clients':
        return <ClientsManager role={role} onClientSelected={setSelectedClientId} />;
      case 'alerts':
        return esEntrenador ? null : <RetentionAlerts />;
      case 'analytics':
        return <ChurnAnalyticsComponent />;
      case 'segmentation':
        return esEntrenador ? null : <ClientSegmentation />;
      default:
        return <ClientsManager role={role} onClientSelected={setSelectedClientId} />;
    }
  };

  // Si hay un cliente seleccionado, ocultar header, métricas y tabs principales
  const showDashboardElements = !selectedClientId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header - Solo se muestra si NO hay cliente seleccionado */}
      {showDashboardElements && (
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {esEntrenador ? 'Gestión de Clientes' : 'Gestión de Socios'}
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador
                      ? 'Sistema completo de gestión de clientes con seguimiento de estado, retención y perfil 360º'
                      : 'Sistema integral de gestión de socios con estado de cuotas, retención y análisis de churn'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Métricas - Solo se muestran si NO hay cliente seleccionado */}
        {showDashboardElements && analytics && (
          <div className="mb-6">
            <MetricCards 
              data={metricas} 
              columns={esEntrenador ? 3 : 4} 
            />
          </div>
        )}

        {/* Tabs - Solo se muestran si NO hay cliente seleccionado */}
        {showDashboardElements && (
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones gestión de clientes"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabItems.map(({ id, label, icon: Icon }) => {
                  const activo = tabActiva === id;
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setTabActiva(id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        activo
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      ].join(' ')}
                    >
                      <Icon
                        size={18}
                        className={activo ? 'opacity-100' : 'opacity-70'}
                      />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Contenido de la pestaña activa */}
        <div className={showDashboardElements ? 'mt-6' : ''}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

